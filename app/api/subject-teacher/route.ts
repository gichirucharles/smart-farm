import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

const marksSchema = z.object({
  classId: z.string().uuid(),
  subjectId: z.string().uuid(),
  assessmentName: z.string().trim().min(1).max(120),
  assessmentType: z.enum(["CAT", "assignment", "exam", "CBC rubric"]),
  totalMarks: z.number().int().positive().max(1000),
  date: z.string().date(),
  academicYear: z.string().trim().min(1).max(20),
  term: z.string().trim().min(1).max(30),
  marks: z.array(z.object({
    studentId: z.string().uuid(),
    score: z.number().int().min(0).max(1000).nullable(),
    remarks: z.string().trim().max(1000).optional().default(""),
  }).strict()).min(1).max(300),
}).strict()

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

function canTeach(role: string) {
  return ["subject_teacher", "class_teacher", "teacher"].includes(role.trim().toLowerCase().replace(/[ -]+/g, "_"))
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor?.schoolId || !canTeach(actor.role)) return response({ error: "Unable to load your teaching workspace" }, 403)

  try {
    const admin = getSupabaseAdmin()
    const [scheduleResult, subjectsResult] = await Promise.all([
      admin.from("class_timetable_entries")
        .select("id, class_id, subject_id, day_of_week, starts_at, ends_at, room")
        .eq("school_id", actor.schoolId).eq("teacher_id", actor.id)
        .order("day_of_week").order("starts_at").limit(1000),
      admin.from("subjects").select("id, name, code").eq("school_id", actor.schoolId).eq("is_active", true),
    ])
    if (scheduleResult.error || subjectsResult.error) return response({ error: "Unable to load your teaching workspace" }, 500)

    const timetable = scheduleResult.data ?? []
    const classIds = [...new Set(timetable.map((item) => item.class_id))]
    const subjectIds = [...new Set(timetable.map((item) => item.subject_id))]
    const [classesResult, assignedSubjectsResult] = await Promise.all([
      classIds.length
        ? admin.from("classes").select("id, name, grade_level, stream, academic_year").eq("school_id", actor.schoolId).eq("is_active", true).in("id", classIds).order("name")
        : Promise.resolve({ data: [], error: null }),
      subjectIds.length
        ? admin.from("subjects").select("id, name, code").eq("school_id", actor.schoolId).in("id", subjectIds)
        : Promise.resolve({ data: [], error: null }),
    ])
    if (classesResult.error || assignedSubjectsResult.error) return response({ error: "Unable to load your teaching assignments" }, 500)

    const classes = classesResult.data ?? []
    const subjects = assignedSubjectsResult.data ?? []
    const activeClassIds = classes.map((item) => item.id)
    const classById = new Map(classes.map((item) => [item.id, item]))
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const teachingPairs = new Set(timetable.filter((item) => classById.has(item.class_id) && subjectById.has(item.subject_id)).map((item) => `${item.class_id}:${item.subject_id}`))

    const [studentsResult, assessmentsResult] = activeClassIds.length
      ? await Promise.all([
          admin.from("students").select("id, student_id, first_name, last_name, grade_level, stream")
            .eq("school_id", actor.schoolId).eq("is_active", true).order("last_name").order("first_name").limit(3000),
          admin.from("assessments").select("id, class_id, subject_id, name, type, total_marks, date, academic_year, term")
            .eq("school_id", actor.schoolId).in("class_id", activeClassIds).in("subject_id", subjectIds).order("date", { ascending: false }).limit(500),
        ])
      : [
          { data: [], error: null },
          { data: [], error: null },
        ]
    if (studentsResult.error || assessmentsResult.error) return response({ error: "Unable to load your class records" }, 500)

    const students = (studentsResult.data ?? []).filter((student) => classes.some((item) =>
      item.grade_level === student.grade_level && (item.stream ?? "") === (student.stream ?? ""),
    )).map((student) => {
      const schoolClass = classes.find((item) => item.grade_level === student.grade_level && (item.stream ?? "") === (student.stream ?? ""))
      return { id: student.id, admissionNumber: student.student_id, name: `${student.first_name} ${student.last_name}`.trim(), classId: schoolClass?.id ?? "" }
    })
    const assessmentIds = (assessmentsResult.data ?? []).map((item) => item.id)
    const resultsResult = assessmentIds.length
      ? await admin.from("assessment_results").select("assessment_id, student_id, marks_obtained, grade, remarks").in("assessment_id", assessmentIds).limit(20000)
      : { data: [], error: null }
    if (resultsResult.error) return response({ error: "Unable to load assessment results" }, 500)

    const resultsByAssessment = new Map<string, typeof resultsResult.data>()
    for (const result of resultsResult.data ?? []) {
      resultsByAssessment.set(result.assessment_id, [...(resultsByAssessment.get(result.assessment_id) ?? []), result])
    }
    const assessments = (assessmentsResult.data ?? []).filter((item) => teachingPairs.has(`${item.class_id}:${item.subject_id}`)).map((item) => ({
      ...item,
      results: resultsByAssessment.get(item.id) ?? [],
      className: classById.get(item.class_id)?.name ?? "Class",
      subjectName: subjectById.get(item.subject_id)?.name ?? "Subject",
    }))
    const assignments = [...teachingPairs].map((pair) => {
      const [classId, subjectId] = pair.split(":")
      const schoolClass = classById.get(classId)
      const subject = subjectById.get(subjectId)
      return {
        key: pair,
        classId,
        className: schoolClass?.name ?? "Class",
        gradeLevel: schoolClass?.grade_level ?? "",
        stream: schoolClass?.stream ?? null,
        academicYear: schoolClass?.academic_year ?? null,
        subjectId,
        subjectName: subject?.name ?? "Subject",
        studentCount: students.filter((student) => student.classId === classId).length,
      }
    })

    return response({
      teacher: { firstName: actor.firstName, lastName: actor.lastName },
      assignments,
      students,
      timetable: timetable.filter((item) => teachingPairs.has(`${item.class_id}:${item.subject_id}`)).map((item) => ({
        ...item,
        className: classById.get(item.class_id)?.name ?? "Class",
        subjectName: subjectById.get(item.subject_id)?.name ?? "Subject",
      })),
      assessments,
      subjects: subjectsResult.data ?? [],
    })
  } catch {
    return response({ error: "Unable to load your teaching workspace" }, 500)
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId || !canTeach(actor.role)) return response({ error: "Unable to save assessment marks" }, 403)

  let body: unknown
  try { body = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const parsed = marksSchema.safeParse(body)
  if (!parsed.success) return response({ error: "Check the assessment details and marks" }, 400)
  const input = parsed.data
  const uniqueStudentIds = [...new Set(input.marks.filter((entry) => entry.score !== null).map((entry) => entry.studentId))]
  if (uniqueStudentIds.length !== input.marks.filter((entry) => entry.score !== null).length) return response({ error: "A student can only be included once per assessment" }, 400)
  if (input.marks.some((entry) => entry.score !== null && entry.score > input.totalMarks)) return response({ error: "A mark cannot exceed the assessment maximum" }, 400)
  if (!uniqueStudentIds.length) return response({ error: "Enter at least one mark before submitting" }, 400)

  try {
    const admin = getSupabaseAdmin()
    const [assignmentResult, classResult, studentsResult] = await Promise.all([
      admin.from("class_timetable_entries").select("id").eq("school_id", actor.schoolId).eq("teacher_id", actor.id)
        .eq("class_id", input.classId).eq("subject_id", input.subjectId).limit(1),
      admin.from("classes").select("id, grade_level, stream").eq("school_id", actor.schoolId).eq("id", input.classId).eq("is_active", true).maybeSingle(),
      admin.from("students").select("id, grade_level, stream").eq("school_id", actor.schoolId).eq("is_active", true).in("id", uniqueStudentIds),
    ])
    if (assignmentResult.error || classResult.error || studentsResult.error) return response({ error: "Unable to verify the teaching assignment" }, 500)
    if (!assignmentResult.data?.length || !classResult.data) return response({ error: "This class and subject are not assigned to you" }, 403)
    if ((studentsResult.data ?? []).length !== uniqueStudentIds.length || (studentsResult.data ?? []).some((student) =>
      student.grade_level !== classResult.data?.grade_level || (student.stream ?? "") !== (classResult.data?.stream ?? ""),
    )) return response({ error: "Select students from your assigned class" }, 400)
    const { data: subject, error: subjectError } = await admin.from("subjects").select("id").eq("id", input.subjectId).eq("school_id", actor.schoolId).eq("is_active", true).maybeSingle()
    if (subjectError || !subject) return response({ error: "Unable to verify the subject" }, 400)

    const { data: assessment, error: assessmentError } = await admin.from("assessments").insert({
      school_id: actor.schoolId,
      class_id: input.classId,
      subject_id: input.subjectId,
      name: input.assessmentName,
      type: input.assessmentType,
      total_marks: input.totalMarks,
      date: input.date,
      academic_year: input.academicYear,
      term: input.term,
      created_by: actor.id,
    }).select("id").single()
    if (assessmentError || !assessment) return response({ error: "Unable to create the assessment" }, 500)

    const inserts = input.marks.filter((entry): entry is typeof entry & { score: number } => entry.score !== null).map((entry) => ({
      assessment_id: assessment.id,
      student_id: entry.studentId,
      marks_obtained: entry.score,
      grade: null,
      remarks: entry.remarks || null,
    }))
    const { error: resultsError } = await admin.from("assessment_results").insert(inserts)
    if (resultsError) {
      await admin.from("assessments").delete().eq("id", assessment.id).eq("school_id", actor.schoolId)
      return response({ error: "Unable to save the marks; no assessment was kept" }, 500)
    }
    return response({ assessmentId: assessment.id, saved: inserts.length }, 201)
  } catch {
    return response({ error: "Unable to save assessment marks" }, 500)
  }
}
