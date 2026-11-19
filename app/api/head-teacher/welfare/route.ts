import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

const LEADERSHIP = new Set(["head_teacher", "director"])
const RECORD_TYPES = ["incident", "committee_outcome", "suspension", "expulsion", "safeguarding", "commendation"] as const
const createRecordSchema = z.object({
  recordType: z.enum(RECORD_TYPES),
  studentIds: z.array(z.string().uuid()).min(1).max(20),
  eventDate: z.string().date(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(5000),
  actionTaken: z.string().trim().max(3000).optional().default(""),
  reason: z.string().trim().max(3000).optional().default(""),
  outcome: z.string().trim().max(3000).optional().default(""),
}).strict()

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (!LEADERSHIP.has(actor.role)) return response({ error: "Access denied" }, 403)

  try {
    const admin = getSupabaseAdmin()
    const [studentsResult, incidentsResult, welfareResult] = await Promise.all([
      admin.from("students").select("id, student_id, first_name, last_name, grade_level, stream").eq("school_id", actor.schoolId).eq("is_active", true).order("last_name").limit(1000),
      admin.from("student_discipline_records").select("id, student_id, incident_date, category, description, action_taken, created_at").eq("school_id", actor.schoolId).order("incident_date", { ascending: false }).limit(500),
      admin.from("student_welfare_records").select("id, student_id, record_type, event_date, title, description, action_taken, reason, outcome, created_at").eq("school_id", actor.schoolId).order("event_date", { ascending: false }).limit(500),
    ])
    if (studentsResult.error || incidentsResult.error || welfareResult.error) return response({ error: "Unable to load welfare records" }, 500)

    const students = studentsResult.data ?? []
    const studentNames = new Map(students.map((student) => [student.id, `${student.first_name} ${student.last_name}`]))
    const incidents = (incidentsResult.data ?? []).map((record) => ({
      id: record.id,
      recordType: "incident" as const,
      studentId: record.student_id,
      studentName: studentNames.get(record.student_id) ?? "Student record unavailable",
      eventDate: record.incident_date,
      title: record.category,
      description: record.description,
      actionTaken: record.action_taken ?? "",
      reason: "",
      outcome: "",
      createdAt: record.created_at,
    }))
    const welfare = (welfareResult.data ?? []).map((record) => ({
      id: record.id,
      recordType: record.record_type as (typeof RECORD_TYPES)[number],
      studentId: record.student_id,
      studentName: studentNames.get(record.student_id) ?? "Student record unavailable",
      eventDate: record.event_date,
      title: record.title,
      description: record.description,
      actionTaken: record.action_taken ?? "",
      reason: record.reason ?? "",
      outcome: record.outcome ?? "",
      createdAt: record.created_at,
    }))

    return response({
      students: students.map((student) => ({
        id: student.id,
        admissionNumber: student.student_id,
        name: `${student.first_name} ${student.last_name}`,
        className: `${student.grade_level} ${student.stream}`,
      })),
      records: [...incidents, ...welfare].sort((a, b) => b.eventDate.localeCompare(a.eventDate)),
    })
  } catch {
    return response({ error: "Unable to load welfare records" }, 500)
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId || !LEADERSHIP.has(actor.role)) return response({ error: "Only school leadership can manage welfare records" }, 403)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return response({ error: "Invalid request body" }, 400)
  }
  const parsed = createRecordSchema.safeParse(body)
  if (!parsed.success) return response({ error: "Check the record details and try again" }, 400)
  const input = parsed.data
  if ((input.recordType === "suspension" || input.recordType === "expulsion") && !input.reason.trim()) {
    return response({ error: "A reason is required for suspensions and expulsions" }, 400)
  }
  if (input.recordType === "incident" && !input.actionTaken.trim()) {
    return response({ error: "Record the action taken for this incident" }, 400)
  }

  try {
    const admin = getSupabaseAdmin()
    const { data: students, error: studentsError } = await admin
      .from("students")
      .select("id")
      .eq("school_id", actor.schoolId)
      .eq("is_active", true)
      .in("id", [...new Set(input.studentIds)])
    const uniqueStudentIds = [...new Set(input.studentIds)]
    if (studentsError || students?.length !== uniqueStudentIds.length) {
      return response({ error: "Select active students from your school" }, 400)
    }

    if (input.recordType === "incident") {
      const { error } = await admin.from("student_discipline_records").insert(uniqueStudentIds.map((studentId) => ({
        school_id: actor.schoolId,
        student_id: studentId,
        incident_date: input.eventDate,
        category: input.title,
        description: input.description,
        action_taken: input.actionTaken || null,
        recorded_by: actor.id,
      })))
      if (error) return response({ error: "Unable to save the incident report" }, 500)
    } else {
      const { error } = await admin.from("student_welfare_records").insert(uniqueStudentIds.map((studentId) => ({
        school_id: actor.schoolId,
        student_id: studentId,
        record_type: input.recordType,
        event_date: input.eventDate,
        title: input.title,
        description: input.description,
        action_taken: input.actionTaken || null,
        reason: input.reason || null,
        outcome: input.outcome || null,
        created_by: actor.id,
      })))
      if (error) return response({ error: "Unable to save this welfare record" }, 500)
    }
    return response({ saved: uniqueStudentIds.length }, 201)
  } catch {
    return response({ error: "Unable to save this welfare record" }, 500)
  }
}
