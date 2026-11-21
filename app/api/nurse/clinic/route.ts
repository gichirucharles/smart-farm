import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

const NURSE_ROLES = new Set(["school_nurse", "nurse"])
const inputSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("visit"), studentId: z.string().uuid(), symptoms: z.string().trim().min(1).max(2000), diagnosis: z.string().trim().max(2000).optional(), treatment: z.string().trim().max(2000).optional(), medication: z.string().trim().max(1000).optional(), temperature: z.number().min(25).max(45).nullable().optional(), notes: z.string().trim().max(3000).optional(), status: z.enum(["under_observation", "discharged"]).default("under_observation") }).strict(),
  z.object({ kind: z.literal("checkup"), studentId: z.string().uuid(), scheduledAt: z.string().datetime(), checkupType: z.string().trim().min(1).max(120), notes: z.string().trim().max(3000).optional() }).strict(),
  z.object({ kind: z.literal("medication"), studentId: z.string().uuid(), medicationName: z.string().trim().min(1).max(160), dosage: z.string().trim().min(1).max(120), frequency: z.string().trim().min(1).max(120), startDate: z.string().date().optional(), endDate: z.string().date().nullable().optional(), administrationNotes: z.string().trim().max(2000).optional() }).strict(),
  z.object({ kind: z.literal("administration"), medicationId: z.string().uuid(), dosage: z.string().trim().min(1).max(120), notes: z.string().trim().max(1000).optional() }).strict(),
])

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

async function nurseActor() {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return { actor: null, result: response({ error: "Authentication required" }, 401) }
  if (!NURSE_ROLES.has(actor.role)) return { actor: null, result: response({ error: "School nurse access required" }, 403) }
  return { actor, result: null }
}

export async function GET() {
  const { actor, result } = await nurseActor()
  if (result) return result
  if (!actor) return response({ error: "Authentication required" }, 401)
  const admin = getSupabaseAdmin()
  const schoolId = actor.schoolId as string
  const [studentsResult, visitsResult, checkupsResult, medicationsResult, administrationsResult] = await Promise.all([
    admin.from("students").select("id, student_id, first_name, last_name, grade_level, stream").eq("school_id", schoolId).eq("is_active", true).order("last_name").order("first_name").limit(2000),
    admin.from("health_records").select("id, student_id, visit_date, time_in, time_out, symptoms, diagnosis, treatment, medication, follow_up_required, follow_up_date, status, temperature, notes").eq("school_id", schoolId).order("time_in", { ascending: false }).limit(1000),
    admin.from("clinic_checkups").select("id, student_id, scheduled_at, checkup_type, status, notes, outcome").eq("school_id", schoolId).order("scheduled_at", { ascending: true }).limit(1000),
    admin.from("clinic_medications").select("id, student_id, medication_name, dosage, frequency, start_date, end_date, status, administration_notes, created_at").eq("school_id", schoolId).order("created_at", { ascending: false }).limit(1000),
    admin.from("clinic_medication_administrations").select("id, medication_id, student_id, administered_at, dosage, notes").eq("school_id", schoolId).order("administered_at", { ascending: false }).limit(1000),
  ])
  const results = [studentsResult, visitsResult, checkupsResult, medicationsResult, administrationsResult]
  if (results.some((item) => item.error)) return response({ error: "Unable to load clinic records" }, 500)

  const students = studentsResult.data ?? []
  const names = new Map(students.map((student) => [student.id, {
    studentName: `${student.first_name} ${student.last_name}`.trim(),
    admissionNumber: student.student_id,
    className: `${student.grade_level} ${student.stream ?? ""}`.trim(),
  }]))
  const attachStudent = <T extends { student_id: string }>(item: T) => ({ ...item, ...(names.get(item.student_id) ?? { studentName: "Former student", admissionNumber: "", className: "" }) })
  return response({
    students: students.map((student) => ({ id: student.id, admissionNumber: student.student_id, name: `${student.first_name} ${student.last_name}`.trim(), className: `${student.grade_level} ${student.stream ?? ""}`.trim() })),
    visits: (visitsResult.data ?? []).map(attachStudent),
    checkups: (checkupsResult.data ?? []).map(attachStudent),
    medications: (medicationsResult.data ?? []).map(attachStudent),
    administrations: administrationsResult.data ?? [],
  })
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const { actor, result } = await nurseActor()
  if (result || !actor) return result
  let raw: unknown
  try { raw = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const parsed = inputSchema.safeParse(raw)
  if (!parsed.success) return response({ error: "Check the submitted clinic details and try again" }, 400)

  const admin = getSupabaseAdmin()
  const schoolId = actor.schoolId as string
  const input = parsed.data
  if (input.kind === "administration") {
    const { data: medication, error } = await admin.from("clinic_medications").select("id, student_id, dosage, status").eq("id", input.medicationId).eq("school_id", schoolId).maybeSingle()
    if (error || !medication || medication.status !== "active") return response({ error: "Active medication record not found" }, 404)
    const { error: insertError } = await admin.from("clinic_medication_administrations").insert({ school_id: schoolId, medication_id: medication.id, student_id: medication.student_id, dosage: input.dosage, notes: input.notes || null, administered_by: actor.id })
    if (insertError) return response({ error: "Unable to record the medication dose" }, 400)
    return response({ success: true }, 201)
  }

  const { data: student, error: studentError } = await admin.from("students").select("id").eq("id", input.studentId).eq("school_id", schoolId).eq("is_active", true).maybeSingle()
  if (studentError || !student) return response({ error: "Select an active student in your school" }, 400)

  if (input.kind === "visit") {
    const { error } = await admin.from("health_records").insert({ school_id: schoolId, student_id: input.studentId, visit_date: new Date().toISOString().slice(0, 10), time_in: new Date().toISOString(), symptoms: input.symptoms, diagnosis: input.diagnosis || null, treatment: input.treatment || null, medication: input.medication || null, temperature: input.temperature ?? null, notes: input.notes || null, status: input.status, follow_up_required: false, recorded_by: actor.id })
    if (error) return response({ error: "Unable to save the sick-bay visit" }, 400)
  } else if (input.kind === "checkup") {
    const { error } = await admin.from("clinic_checkups").insert({ school_id: schoolId, student_id: input.studentId, scheduled_at: input.scheduledAt, checkup_type: input.checkupType, notes: input.notes || null, created_by: actor.id })
    if (error) return response({ error: "Unable to schedule the checkup" }, 400)
  } else {
    const { error } = await admin.from("clinic_medications").insert({ school_id: schoolId, student_id: input.studentId, medication_name: input.medicationName, dosage: input.dosage, frequency: input.frequency, start_date: input.startDate || new Date().toISOString().slice(0, 10), end_date: input.endDate || null, administration_notes: input.administrationNotes || null, created_by: actor.id })
    if (error) return response({ error: "Unable to save the medication plan" }, 400)
  }
  return response({ success: true }, 201)
}

const updateSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("administration"), medicationId: z.string().uuid(), dosage: z.string().trim().min(1).max(120), notes: z.string().trim().max(1000).optional() }).strict(),
  z.object({ kind: z.literal("discharge"), id: z.string().uuid() }).strict(),
  z.object({ kind: z.literal("checkup_status"), id: z.string().uuid(), status: z.enum(["completed", "no_show", "cancelled"]), outcome: z.string().trim().max(3000).optional() }).strict(),
  z.object({ kind: z.literal("medication_status"), id: z.string().uuid(), status: z.enum(["completed", "discontinued"]) }).strict(),
])

export async function PATCH(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const { actor, result } = await nurseActor()
  if (result || !actor) return result
  let raw: unknown
  try { raw = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const parsed = updateSchema.safeParse(raw)
  if (!parsed.success) return response({ error: "Invalid clinic update" }, 400)
  const admin = getSupabaseAdmin()
  const schoolId = actor.schoolId as string
  const input = parsed.data
  if (input.kind === "administration") {
    const { data: medication, error: medicationError } = await admin.from("clinic_medications").select("id, student_id, status").eq("id", input.medicationId).eq("school_id", schoolId).maybeSingle()
    if (medicationError || !medication || medication.status !== "active") return response({ error: "Active medication record not found" }, 404)
    const { error } = await admin.from("clinic_medication_administrations").insert({ school_id: schoolId, medication_id: medication.id, student_id: medication.student_id, dosage: input.dosage, notes: input.notes || null, administered_by: actor.id })
    if (error) return response({ error: "Unable to record the medication dose" }, 400)
    return response({ success: true }, 201)
  }
  let error
  if (input.kind === "discharge") {
    ({ error } = await admin.from("health_records").update({ status: "discharged", time_out: new Date().toISOString() }).eq("id", input.id).eq("school_id", schoolId))
  } else if (input.kind === "checkup_status") {
    ({ error } = await admin.from("clinic_checkups").update({ status: input.status, outcome: input.outcome || null, updated_at: new Date().toISOString() }).eq("id", input.id).eq("school_id", schoolId))
  } else {
    ({ error } = await admin.from("clinic_medications").update({ status: input.status, updated_at: new Date().toISOString() }).eq("id", input.id).eq("school_id", schoolId))
  }
  if (error) return response({ error: "Unable to update this clinic record" }, 400)
  return response({ success: true })
}
