import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

const schemeSchema = z.object({
  kind: z.literal("scheme"),
  classId: z.string().uuid(),
  subjectId: z.string().uuid(),
  academicYear: z.string().trim().min(1).max(20),
  term: z.string().trim().min(1).max(30),
  title: z.string().trim().min(1).max(160),
  unitTitle: z.string().trim().min(1).max(160),
  weekStart: z.number().int().min(1).max(60),
  weekEnd: z.number().int().min(1).max(60),
  learningOutcomes: z.string().max(4000).default(""),
  contentOutline: z.string().max(4000).default(""),
  resources: z.string().max(2000).default(""),
  status: z.enum(["draft", "submitted"]),
}).strict().refine((value) => value.weekEnd >= value.weekStart, { path: ["weekEnd"], message: "End week must not be before start week" })

const lessonSchema = z.object({
  kind: z.literal("lesson"),
  classId: z.string().uuid(),
  subjectId: z.string().uuid(),
  schemeId: z.string().uuid().nullable().optional(),
  academicYear: z.string().trim().min(1).max(20),
  term: z.string().trim().min(1).max(30),
  lessonDate: z.string().date(),
  weekNumber: z.number().int().min(1).max(60).nullable().optional(),
  lessonNumber: z.number().int().min(1).max(20).nullable().optional(),
  topic: z.string().trim().min(1).max(160),
  learningObjectives: z.string().max(4000).default(""),
  activities: z.string().max(4000).default(""),
  resources: z.string().max(2000).default(""),
  assessmentNotes: z.string().max(2000).default(""),
  status: z.enum(["draft", "submitted"]),
}).strict()

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

function canTeach(role: string) {
  return ["subject_teacher", "class_teacher", "teacher"].includes(role.trim().toLowerCase().replace(/[ -]+/g, "_"))
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor?.schoolId || !canTeach(actor.role)) return response({ error: "Unable to load your planning workspace" }, 403)

  try {
    const admin = getSupabaseAdmin()
    const [timetableResult, schemesResult, lessonsResult] = await Promise.all([
      admin.from("class_timetable_entries").select("class_id, subject_id")
        .eq("school_id", actor.schoolId).eq("teacher_id", actor.id).limit(1000),
      admin.from("teaching_schemes").select("*").eq("school_id", actor.schoolId).eq("teacher_id", actor.id)
        .order("created_at", { ascending: false }).limit(200),
      admin.from("lesson_plans").select("*").eq("school_id", actor.schoolId).eq("teacher_id", actor.id)
        .order("lesson_date", { ascending: false }).limit(300),
    ])
    if (timetableResult.error || schemesResult.error || lessonsResult.error) {
      return response({ error: "Unable to load your planning records" }, 500)
    }

    const classIds = [...new Set((timetableResult.data ?? []).map((item) => item.class_id))]
    const subjectIds = [...new Set((timetableResult.data ?? []).map((item) => item.subject_id))]
    const [classesResult, subjectsResult] = await Promise.all([
      classIds.length
        ? admin.from("classes").select("id, name, grade_level, stream, academic_year").eq("school_id", actor.schoolId).eq("is_active", true).in("id", classIds).order("name")
        : Promise.resolve({ data: [], error: null }),
      subjectIds.length
        ? admin.from("subjects").select("id, name, code").eq("school_id", actor.schoolId).eq("is_active", true).in("id", subjectIds).order("name")
        : Promise.resolve({ data: [], error: null }),
    ])
    if (classesResult.error || subjectsResult.error) return response({ error: "Unable to load your teaching assignments" }, 500)

    const classes = classesResult.data ?? []
    const subjects = subjectsResult.data ?? []
    const classById = new Map(classes.map((item) => [item.id, item]))
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const assignments = [...new Set((timetableResult.data ?? []).map((item) => `${item.class_id}:${item.subject_id}`))]
      .filter((pair) => classById.has(pair.split(":")[0]) && subjectById.has(pair.split(":")[1]))
      .map((key) => {
        const [classId, subjectId] = key.split(":")
        const schoolClass = classById.get(classId)
        const subject = subjectById.get(subjectId)
        return {
          key,
          classId,
          className: schoolClass?.name ?? "Class",
          gradeLevel: schoolClass?.grade_level ?? "",
          stream: schoolClass?.stream ?? null,
          academicYear: schoolClass?.academic_year ?? null,
          subjectId,
          subjectName: subject?.name ?? "Subject",
        }
      })

    const allowedPairs = new Set(assignments.map((item) => item.key))
    return response({
      teacher: { firstName: actor.firstName, lastName: actor.lastName },
      assignments,
      schemes: (schemesResult.data ?? []).filter((item) => allowedPairs.has(`${item.class_id}:${item.subject_id}`)),
      lessons: (lessonsResult.data ?? []).filter((item) => allowedPairs.has(`${item.class_id}:${item.subject_id}`)),
    })
  } catch {
    return response({ error: "Unable to load your planning workspace" }, 500)
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId || !canTeach(actor.role)) return response({ error: "Unable to save your planning record" }, 403)

  let body: unknown
  try { body = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const kind = typeof body === "object" && body !== null && "kind" in body ? body.kind : undefined
  const parsed = kind === "scheme" ? schemeSchema.safeParse(body) : kind === "lesson" ? lessonSchema.safeParse(body) : null
  if (!parsed || !parsed.success) return response({ error: "Check the planning details and try again" }, 400)

  try {
    const admin = getSupabaseAdmin()
    const input = parsed.data
    const [assignmentResult, classResult, subjectResult] = await Promise.all([
      admin.from("class_timetable_entries").select("class_id")
        .eq("school_id", actor.schoolId).eq("teacher_id", actor.id)
        .eq("class_id", input.classId).eq("subject_id", input.subjectId).limit(1),
      admin.from("classes").select("id").eq("school_id", actor.schoolId).eq("id", input.classId).eq("is_active", true).maybeSingle(),
      admin.from("subjects").select("id").eq("school_id", actor.schoolId).eq("id", input.subjectId).eq("is_active", true).maybeSingle(),
    ])
    if (assignmentResult.error || classResult.error || subjectResult.error) return response({ error: "Unable to verify this teaching assignment" }, 500)
    if (!assignmentResult.data?.length || !classResult.data || !subjectResult.data) return response({ error: "This class and subject are not assigned to you" }, 403)

    if (input.kind === "scheme") {
      const { data, error } = await admin.from("teaching_schemes").insert({
        school_id: actor.schoolId,
        teacher_id: actor.id,
        class_id: input.classId,
        subject_id: input.subjectId,
        academic_year: input.academicYear,
        term: input.term,
        title: input.title,
        unit_title: input.unitTitle,
        week_start: input.weekStart,
        week_end: input.weekEnd,
        learning_outcomes: input.learningOutcomes,
        content_outline: input.contentOutline,
        resources: input.resources,
        status: input.status,
      }).select("id").single()
      if (error || !data) return response({ error: "Unable to save the scheme of work" }, 500)
      return response({ id: data.id }, 201)
    }

    if (input.schemeId) {
      const { data: scheme, error } = await admin.from("teaching_schemes").select("id")
        .eq("id", input.schemeId).eq("school_id", actor.schoolId).eq("teacher_id", actor.id)
        .eq("class_id", input.classId).eq("subject_id", input.subjectId).maybeSingle()
      if (error || !scheme) return response({ error: "Select a scheme belonging to this class and subject" }, 400)
    }

    const { data, error } = await admin.from("lesson_plans").insert({
      school_id: actor.schoolId,
      teacher_id: actor.id,
      class_id: input.classId,
      subject_id: input.subjectId,
      scheme_id: input.schemeId || null,
      academic_year: input.academicYear,
      term: input.term,
      lesson_date: input.lessonDate,
      week_number: input.weekNumber ?? null,
      lesson_number: input.lessonNumber ?? null,
      topic: input.topic,
      learning_objectives: input.learningObjectives,
      activities: input.activities,
      resources: input.resources,
      assessment_notes: input.assessmentNotes,
      status: input.status,
    }).select("id").single()
    if (error || !data) return response({ error: "Unable to save the lesson plan" }, 500)
    return response({ id: data.id }, 201)
  } catch {
    return response({ error: "Unable to save your planning record" }, 500)
  }
}
