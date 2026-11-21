import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

const LEADERSHIP = new Set(["head_teacher", "director"])
const PROFILE_ROLES = new Set(["head_teacher", "director", "deputy_head_teacher", "class_teacher", "school_nurse", "nurse", "school_counselor", "counselor", "parent"])
const HEALTH_ROLES = new Set(["head_teacher", "school_nurse", "nurse", "parent"])
const HEALTH_EDIT_ROLES = new Set(["head_teacher", "school_nurse", "nurse"])
const COUNSELING_ROLES = new Set(["school_counselor", "counselor"])
const STUDENT_FIELDS = "id, school_id, student_id, nemis_id, first_name, last_name, date_of_birth, gender, grade_level, stream, admission_date, address, photo_url, is_active, created_at, updated_at, birth_certificate_number, nationality, religion, home_language, admission_status, previous_school"
const text = (max: number) => z.string().trim().max(max).nullable().optional()
const date = z.string().date().nullable().optional()
const healthSchema = z.object({
  medicalConditions: text(4000), allergies: text(2000), bloodGroup: text(12), specialNeeds: text(2000), supportPlan: text(4000),
  immunisationRecords: z.array(z.object({ vaccine: z.string().trim().min(1).max(120), date: date, notes: text(500) }).strict()).max(50).optional(),
}).strict()
const enrichmentSchema = z.object({
  boardingStatus: z.enum(["day", "boarding"]), dormitory: text(100), bedNumber: text(50), transportRoute: text(120), transportStage: text(120),
  clubs: z.array(z.string().trim().min(1).max(80)).max(20), sports: z.array(z.string().trim().min(1).max(80)).max(20), houseAssignment: text(80),
}).strict()
const studentSchema = z.object({
  studentId: z.string().trim().min(1).max(40).optional(), nemisId: text(60), firstName: z.string().trim().min(1).max(80).optional(), lastName: z.string().trim().min(1).max(80).optional(),
  dateOfBirth: date, gender: z.enum(["male", "female"]).nullable().optional(), gradeLevel: z.enum(["playgroup", "nursery", "kg1", "kg2", "grade1", "grade2", "grade3", "grade4", "grade5", "grade6", "grade7", "grade8", "grade9"]).optional(),
  stream: z.string().trim().min(1).max(40).optional(), admissionDate: date, birthCertificateNumber: text(80), nationality: text(80), religion: text(80), homeLanguage: text(80), previousSchool: text(160),
  admissionStatus: z.enum(["applied", "accepted", "enrolled", "transferred", "graduated", "withdrawn"]).optional(), address: text(300),
}).strict()
const guardianSchema = z.object({
  id: z.string().uuid().optional(), name: z.string().trim().min(1).max(120), relationship: z.string().trim().min(1).max(60), phone: text(40),
  email: z.string().trim().email().max(254).nullable().optional().or(z.literal("")), occupation: text(100), residenceAddress: text(300),
  emergencyContact: z.boolean(), authorizedPickup: z.boolean(),
}).strict()
const recordSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("transfer"), direction: z.enum(["inbound", "outbound"]), fromSchool: text(160), toSchool: text(160), transferDate: z.string().date(), notes: text(2000), documentId: z.string().uuid().nullable().optional() }).strict(),
  z.object({ kind: z.literal("discipline"), incidentDate: z.string().date(), category: z.string().trim().min(1).max(80), description: z.string().trim().min(1).max(3000), actionTaken: text(2000) }).strict(),
  z.object({ kind: z.literal("health_visit"), visitDate: z.string().date(), symptoms: text(2000), diagnosis: text(2000), treatment: text(2000), medication: text(1000), followUpRequired: z.boolean(), followUpDate: date }).strict(),
  z.object({ kind: z.literal("counseling_session"), sessionDate: z.string().date(), sessionType: text(80), reason: text(2000), notes: text(6000), followUpRequired: z.boolean(), followUpDate: date }).strict(),
])

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

async function getScopedStudent(studentId: string, schoolId: string) {
  return getSupabaseAdmin().from("students").select(STUDENT_FIELDS).eq("id", studentId).eq("school_id", schoolId).maybeSingle()
}

export async function GET(_request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (!PROFILE_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)
  const { studentId } = await params
  const admin = getSupabaseAdmin()
  if (actor.role === "parent") {
    const { data: guardianLink } = await admin.from("student_guardians").select("id").eq("student_id", studentId).eq("school_id", actor.schoolId).eq("email", actor.email).maybeSingle()
    if (!guardianLink) return response({ error: "Student not found" }, 404)
  }
  const { data: student, error } = await getScopedStudent(studentId, actor.schoolId)
  if (error || !student) return response({ error: "Student not found" }, 404)

  if (actor.role === "class_teacher") {
    const { data: assignedClass } = await admin.from("classes").select("id").eq("school_id", actor.schoolId).eq("class_teacher_id", actor.id).eq("grade_level", student.grade_level).eq("stream", student.stream).eq("is_active", true).maybeSingle()
    if (!assignedClass) return response({ error: "Student not found" }, 404)
  }

  let guardiansQuery = admin.from("student_guardians").select("id, name, relationship, phone, email, occupation, residence_address, emergency_contact, authorized_pickup").eq("student_id", studentId).eq("school_id", actor.schoolId).order("created_at")
  if (actor.role === "parent") guardiansQuery = guardiansQuery.eq("email", actor.email)
  const [guardiansResult, healthResult, enrichmentResult, transferResult, documentsResult, disciplineResult, visitsResult, counselingResult] = await Promise.all([
    guardiansQuery,
    HEALTH_ROLES.has(actor.role) ? admin.from("student_health_profiles").select("medical_conditions, allergies, blood_group, special_needs, support_plan, immunisation_records, clinic_visits, updated_at").eq("student_id", studentId).eq("school_id", actor.schoolId).maybeSingle() : Promise.resolve({ data: null, error: null }),
    admin.from("student_enrichment_profiles").select("boarding_status, dormitory, bed_number, transport_route, transport_stage, clubs, sports, house_assignment").eq("student_id", studentId).eq("school_id", actor.schoolId).maybeSingle(),
    LEADERSHIP.has(actor.role) ? admin.from("student_transfers").select("id, direction, from_school, to_school, transfer_date, notes, document_id, created_at").eq("student_id", studentId).eq("school_id", actor.schoolId).order("transfer_date", { ascending: false }) : Promise.resolve({ data: [], error: null }),
    LEADERSHIP.has(actor.role) ? admin.from("student_documents").select("id, document_type, file_name, storage_path, content_type, file_size, created_at").eq("student_id", studentId).eq("school_id", actor.schoolId).order("created_at", { ascending: false }) : Promise.resolve({ data: [], error: null }),
    LEADERSHIP.has(actor.role) ? admin.from("student_discipline_records").select("id, incident_date, category, description, action_taken, created_at").eq("student_id", studentId).eq("school_id", actor.schoolId).order("incident_date", { ascending: false }) : Promise.resolve({ data: [], error: null }),
    HEALTH_ROLES.has(actor.role) ? admin.from("health_records").select("id, visit_date, symptoms, diagnosis, treatment, medication, follow_up_required, follow_up_date, created_at").eq("student_id", studentId).eq("school_id", actor.schoolId).order("visit_date", { ascending: false }) : Promise.resolve({ data: [], error: null }),
    COUNSELING_ROLES.has(actor.role) ? admin.from("counseling_sessions").select("id, session_date, session_type, reason, notes, follow_up_required, follow_up_date, created_at").eq("student_id", studentId).eq("school_id", actor.schoolId).eq("counselor_id", actor.id).order("session_date", { ascending: false }) : Promise.resolve({ data: [], error: null }),
  ])
  const results = [guardiansResult, healthResult, enrichmentResult, transferResult, documentsResult, disciplineResult, visitsResult, counselingResult]
  if (results.some((result) => result.error)) return response({ error: "Unable to load the student profile" }, 500)
  const { data: schoolClass } = await admin.from("classes").select("name").eq("school_id", actor.schoolId).eq("grade_level", student.grade_level).eq("stream", student.stream).eq("is_active", true).maybeSingle()
  const photoPath = student.photo_url
  let photoUrl = photoPath
  if (photoPath && !/^https:\/\//i.test(photoPath)) {
    const { data: signedPhoto } = await admin.storage.from("student-documents").createSignedUrl(photoPath, 600)
    photoUrl = signedPhoto?.signedUrl ?? null
  }
  const documents = await Promise.all((documentsResult.data ?? []).map(async (document) => {
    const { data: signedDocument } = await admin.storage.from("student-documents").createSignedUrl(document.storage_path, 600)
    return { ...document, signedUrl: signedDocument?.signedUrl ?? null }
  }))

  return response({
    student: { ...student, photo_url: photoUrl, className: schoolClass?.name ?? `${student.grade_level} ${student.stream}` },
    guardians: guardiansResult.data ?? [],
    healthProfile: healthResult.data ?? null,
    enrichmentProfile: enrichmentResult.data ?? null,
    transfers: transferResult.data ?? [],
    documents,
    disciplineRecords: disciplineResult.data ?? [],
    healthRecords: visitsResult.data ?? [],
    ...(COUNSELING_ROLES.has(actor.role) ? { counselingSessions: counselingResult.data ?? [] } : {}),
    access: { canManage: LEADERSHIP.has(actor.role), canViewHealth: HEALTH_ROLES.has(actor.role), canEditHealth: HEALTH_EDIT_ROLES.has(actor.role), canViewCounseling: COUNSELING_ROLES.has(actor.role) },
  })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (!PROFILE_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)
  const { studentId } = await params
  const admin = getSupabaseAdmin()
  const { data: student } = await getScopedStudent(studentId, actor.schoolId)
  if (!student) return response({ error: "Student not found" }, 404)

  let raw: unknown
  try { raw = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const payload = z.object({ student: studentSchema.optional(), guardian: guardianSchema.optional(), healthProfile: healthSchema.optional(), enrichmentProfile: enrichmentSchema.optional() }).strict().safeParse(raw)
  if (!payload.success) return response({ error: "Check the profile details and try again" }, 400)
  const { student: studentInput, guardian, healthProfile, enrichmentProfile } = payload.data

  if (studentInput || guardian || enrichmentProfile) {
    if (!LEADERSHIP.has(actor.role)) return response({ error: "Access denied" }, 403)
  }
  if (healthProfile && !HEALTH_EDIT_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)

  if (studentInput) {
    const columns: Record<string, unknown> = {
      studentId: "student_id", nemisId: "nemis_id", firstName: "first_name", lastName: "last_name", dateOfBirth: "date_of_birth", gender: "gender",
      gradeLevel: "grade_level", stream: "stream", admissionDate: "admission_date", birthCertificateNumber: "birth_certificate_number", nationality: "nationality",
      religion: "religion", homeLanguage: "home_language", previousSchool: "previous_school", admissionStatus: "admission_status", address: "address",
    }
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
    for (const [key, value] of Object.entries(studentInput)) update[columns[key] as string] = value
    if (studentInput.admissionStatus) update.is_active = studentInput.admissionStatus === "enrolled"
    if (studentInput.gradeLevel || studentInput.stream) {
      const grade = studentInput.gradeLevel ?? student.grade_level
      const stream = studentInput.stream ?? student.stream
      const { data: matchingClass } = await admin.from("classes").select("id").eq("school_id", actor.schoolId).eq("grade_level", grade).eq("stream", stream).eq("is_active", true).maybeSingle()
      if (!matchingClass) return response({ error: "Choose an active class and stream in this school" }, 400)
    }
    const { error } = await admin.from("students").update(update).eq("id", studentId).eq("school_id", actor.schoolId)
    if (error) return response({ error: "Unable to update the student record" }, 400)
  }

  if (guardian) {
    const values = { name: guardian.name, relationship: guardian.relationship, phone: guardian.phone || null, email: guardian.email || null, occupation: guardian.occupation || null, residence_address: guardian.residenceAddress || null, emergency_contact: guardian.emergencyContact, authorized_pickup: guardian.authorizedPickup, updated_at: new Date().toISOString() }
    const result = guardian.id
      ? await admin.from("student_guardians").update(values).eq("id", guardian.id).eq("student_id", studentId).eq("school_id", actor.schoolId).select("id").maybeSingle()
      : await admin.from("student_guardians").insert({ ...values, student_id: studentId, school_id: actor.schoolId }).select("id").single()
    if (result.error || !result.data) return response({ error: "Unable to save guardian details" }, 400)
  }

  if (healthProfile) {
    const { error } = await admin.from("student_health_profiles").upsert({
      student_id: studentId, school_id: actor.schoolId, medical_conditions: healthProfile.medicalConditions ?? null,
      allergies: healthProfile.allergies ?? null, blood_group: healthProfile.bloodGroup ?? null, special_needs: healthProfile.specialNeeds ?? null,
      support_plan: healthProfile.supportPlan ?? null, immunisation_records: healthProfile.immunisationRecords ?? [], updated_by: actor.id, updated_at: new Date().toISOString(),
    }, { onConflict: "student_id" })
    if (error) return response({ error: "Unable to update the health profile" }, 400)
  }

  if (enrichmentProfile) {
    const { error } = await admin.from("student_enrichment_profiles").upsert({
      student_id: studentId, school_id: actor.schoolId, boarding_status: enrichmentProfile.boardingStatus, dormitory: enrichmentProfile.dormitory || null,
      bed_number: enrichmentProfile.bedNumber || null, transport_route: enrichmentProfile.transportRoute || null, transport_stage: enrichmentProfile.transportStage || null,
      clubs: enrichmentProfile.clubs, sports: enrichmentProfile.sports, house_assignment: enrichmentProfile.houseAssignment || null, updated_at: new Date().toISOString(),
    }, { onConflict: "student_id" })
    if (error) return response({ error: "Unable to update the enrichment profile" }, 400)
  }

  return response({ success: true })
}

export async function POST(request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (!PROFILE_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)
  const { studentId } = await params
  const admin = getSupabaseAdmin()
  const { data: student } = await getScopedStudent(studentId, actor.schoolId)
  if (!student) return response({ error: "Student not found" }, 404)
  let raw: unknown
  try { raw = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const parsed = recordSchema.safeParse(raw)
  if (!parsed.success) return response({ error: "Check the record details and try again" }, 400)
  const value = parsed.data

  if (value.kind === "transfer") {
    if (!LEADERSHIP.has(actor.role)) return response({ error: "Access denied" }, 403)
    if (value.documentId) {
      const { data: document } = await admin.from("student_documents").select("id").eq("id", value.documentId).eq("student_id", studentId).eq("school_id", actor.schoolId).maybeSingle()
      if (!document) return response({ error: "The attached document was not found" }, 400)
    }
    const { error } = await admin.from("student_transfers").insert({ student_id: studentId, school_id: actor.schoolId, direction: value.direction, from_school: value.fromSchool || null, to_school: value.toSchool || null, transfer_date: value.transferDate, notes: value.notes || null, document_id: value.documentId || null, created_by: actor.id })
    if (error) return response({ error: "Unable to save the transfer record" }, 400)
  } else if (value.kind === "discipline") {
    if (!LEADERSHIP.has(actor.role)) return response({ error: "Access denied" }, 403)
    const { error } = await admin.from("student_discipline_records").insert({ student_id: studentId, school_id: actor.schoolId, incident_date: value.incidentDate, category: value.category, description: value.description, action_taken: value.actionTaken || null, recorded_by: actor.id })
    if (error) return response({ error: "Unable to save the discipline record" }, 400)
  } else if (value.kind === "health_visit") {
    if (!HEALTH_EDIT_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)
    const { error } = await admin.from("health_records").insert({ school_id: actor.schoolId, student_id: studentId, visit_date: value.visitDate, time_in: new Date().toISOString(), symptoms: value.symptoms || null, diagnosis: value.diagnosis || null, treatment: value.treatment || null, medication: value.medication || null, follow_up_required: value.followUpRequired, follow_up_date: value.followUpDate || null, recorded_by: actor.id })
    if (error) return response({ error: "Unable to save the health visit" }, 400)
  } else {
    if (!COUNSELING_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)
    const { error } = await admin.from("counseling_sessions").insert({ school_id: actor.schoolId, student_id: studentId, counselor_id: actor.id, session_date: value.sessionDate, session_type: value.sessionType || null, reason: value.reason || null, notes: value.notes || null, follow_up_required: value.followUpRequired, follow_up_date: value.followUpDate || null })
    if (error) return response({ error: "Unable to save the counselling session" }, 400)
  }
  return response({ success: true }, 201)
}
