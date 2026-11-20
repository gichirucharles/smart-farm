import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"
import { canAccessModule } from "@/lib/governance-access"

const GRADE_LEVELS = ["playgroup", "nursery", "kg1", "kg2", "grade1", "grade2", "grade3", "grade4", "grade5", "grade6", "grade7", "grade8", "grade9"] as const
const ADMISSION_STATUSES = ["applied", "accepted", "enrolled", "transferred", "graduated", "withdrawn"] as const
const STAFF_ROLES = new Set(["head_teacher", "director", "deputy_head_teacher", "class_teacher", "school_nurse", "nurse", "school_counselor", "counselor", "parent"])
const MANAGER_ROLES = new Set(["head_teacher", "director"])
const STUDENT_FIELDS = "id, school_id, student_id, nemis_id, first_name, last_name, date_of_birth, gender, grade_level, stream, admission_date, address, photo_url, is_active, created_at, updated_at, birth_certificate_number, nationality, religion, home_language, admission_status, previous_school"

const optionalText = (limit: number) => z.string().trim().max(limit).nullable().optional()
const createStudentSchema = z.object({
  studentId: z.string().trim().min(1).max(40),
  nemisId: optionalText(60),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  dateOfBirth: z.string().date().nullable().optional(),
  gender: z.enum(["male", "female"]).nullable().optional(),
  gradeLevel: z.enum(GRADE_LEVELS),
  stream: z.string().trim().min(1).max(40),
  admissionDate: z.string().date().nullable().optional(),
  birthCertificateNumber: optionalText(80),
  nationality: optionalText(80),
  religion: optionalText(80),
  homeLanguage: optionalText(80),
  previousSchool: optionalText(160),
  admissionStatus: z.enum(ADMISSION_STATUSES).default("enrolled"),
  address: optionalText(300),
  guardians: z.array(z.object({
    name: z.string().trim().min(1).max(120),
    relationship: z.string().trim().min(1).max(60),
    phone: optionalText(40),
    email: z.string().trim().email().max(254).nullable().optional().or(z.literal("")),
    occupation: optionalText(100),
    residenceAddress: optionalText(300),
    emergencyContact: z.boolean().default(false),
    authorizedPickup: z.boolean().default(false),
  }).strict()).max(10).default([]),
  healthProfile: z.object({ medicalConditions: optionalText(4000), allergies: optionalText(2000), bloodGroup: optionalText(12), specialNeeds: optionalText(2000), supportPlan: optionalText(4000) }).strict().optional(),
  enrichmentProfile: z.object({ boardingStatus: z.enum(["day", "boarding"]).default("day"), transportRoute: optionalText(120) }).strict().optional(),
}).strict()

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (!STAFF_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)
  if (actor.role !== "parent" && !await canAccessModule(actor.role, "students", "view")) return response({ error: "Access denied" }, 403)

  const admin = getSupabaseAdmin()
  const parentLinks = actor.role === "parent"
    ? await admin.from("student_guardians").select("student_id").eq("school_id", actor.schoolId).eq("email", actor.email)
    : { data: [], error: null }
  if (parentLinks.error) return response({ error: "Unable to load student records" }, 500)
  const linkedStudentIds = [...new Set((parentLinks.data ?? []).map((link) => link.student_id))]
  const [{ data: classes, error: classesError }, studentsResult] = await Promise.all([
    actor.role === "parent"
      ? Promise.resolve({ data: [], error: null })
      : admin.from("classes").select("id, name, grade_level, stream, class_teacher_id").eq("school_id", actor.schoolId).eq("is_active", true),
    actor.role === "parent" && linkedStudentIds.length === 0
      ? Promise.resolve({ data: [], error: null })
      : (() => {
          let query = admin.from("students").select(STUDENT_FIELDS).eq("school_id", actor.schoolId)
          if (actor.role === "parent") query = query.in("id", linkedStudentIds)
          return query.order("last_name").order("first_name").limit(1000)
        })(),
  ])
  if (classesError || studentsResult.error) return response({ error: "Unable to load student records" }, 500)

  const schoolClasses = classes ?? []
  const permittedClasses = actor.role === "class_teacher"
    ? schoolClasses.filter((schoolClass) => schoolClass.class_teacher_id === actor.id)
    : schoolClasses
  const allowedClassKeys = new Set(permittedClasses.map((schoolClass) => `${schoolClass.grade_level}:${schoolClass.stream}`))
  const classLookup = new Map(permittedClasses.map((schoolClass) => [`${schoolClass.grade_level}:${schoolClass.stream}`, schoolClass.name]))
  const visibleStudents = (studentsResult.data ?? []).filter((student) =>
    actor.role !== "class_teacher" || allowedClassKeys.has(`${student.grade_level}:${student.stream}`),
  )

  return response({
    students: visibleStudents.map((student) => ({ ...student, className: classLookup.get(`${student.grade_level}:${student.stream}`) ?? `${student.grade_level} ${student.stream}` })),
    classes: permittedClasses.map(({ id, name, grade_level, stream }) => ({ id, name, gradeLevel: grade_level, stream })),
    total: visibleStudents.length,
    capabilities: {
      canManage: MANAGER_ROLES.has(actor.role),
      canViewHealth: new Set(["head_teacher", "school_nurse", "nurse", "parent"]).has(actor.role),
      canViewCounseling: new Set(["school_counselor", "counselor"]).has(actor.role),
    },
  })
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId || !MANAGER_ROLES.has(actor.role)) return response({ error: "Only school leadership can register students" }, 403)
  if (!await canAccessModule(actor.role, "students", "edit")) return response({ error: "Edit access denied" }, 403)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return response({ error: "Invalid request body" }, 400)
  }
  const parsed = createStudentSchema.safeParse(body)
  if (!parsed.success) return response({ error: "Check the student details and try again" }, 400)

  const input = parsed.data
  const admin = getSupabaseAdmin()
  const { data: schoolClass, error: classError } = await admin
    .from("classes")
    .select("id")
    .eq("school_id", actor.schoolId)
    .eq("grade_level", input.gradeLevel)
    .eq("stream", input.stream)
    .eq("is_active", true)
    .maybeSingle()
  if (classError || !schoolClass) return response({ error: "Choose an active class and stream in this school" }, 400)

  const studentInsert = await admin.from("students").insert({
    school_id: actor.schoolId,
    student_id: input.studentId,
    nemis_id: input.nemisId || null,
    first_name: input.firstName,
    last_name: input.lastName,
    date_of_birth: input.dateOfBirth || null,
    gender: input.gender || null,
    grade_level: input.gradeLevel,
    stream: input.stream,
    admission_date: input.admissionDate || null,
    birth_certificate_number: input.birthCertificateNumber || null,
    nationality: input.nationality || null,
    religion: input.religion || null,
    home_language: input.homeLanguage || null,
    previous_school: input.previousSchool || null,
    admission_status: input.admissionStatus,
    address: input.address || null,
    is_active: input.admissionStatus === "enrolled",
  }).select("id").single()

  if (studentInsert.error || !studentInsert.data) return response({ error: "Unable to register this student. Check the admission number is unique." }, 400)

  const studentId = studentInsert.data.id
  if (input.guardians.length) {
    const { error } = await admin.from("student_guardians").insert(input.guardians.map((guardian) => ({
      student_id: studentId,
      school_id: actor.schoolId,
      name: guardian.name,
      relationship: guardian.relationship,
      phone: guardian.phone || null,
      email: guardian.email || null,
      occupation: guardian.occupation || null,
      residence_address: guardian.residenceAddress || null,
      emergency_contact: guardian.emergencyContact,
      authorized_pickup: guardian.authorizedPickup,
    })))
    if (error) {
      await admin.from("students").delete().eq("id", studentId).eq("school_id", actor.schoolId)
      return response({ error: "Unable to save guardian details; no student record was created" }, 500)
    }
  }

  if (input.healthProfile) {
    const { error } = await admin.from("student_health_profiles").upsert({
      student_id: studentId, school_id: actor.schoolId, medical_conditions: input.healthProfile.medicalConditions || null,
      allergies: input.healthProfile.allergies || null, blood_group: input.healthProfile.bloodGroup || null, updated_by: actor.id,
    }, { onConflict: "student_id" })
    if (error) {
      await admin.from("students").delete().eq("id", studentId).eq("school_id", actor.schoolId)
      return response({ error: "Unable to save the health profile; no student record was created" }, 500)
    }
  }

  if (input.enrichmentProfile) {
    const { error } = await admin.from("student_enrichment_profiles").upsert({
      student_id: studentId, school_id: actor.schoolId, boarding_status: input.enrichmentProfile.boardingStatus,
      transport_route: input.enrichmentProfile.transportRoute || null,
    }, { onConflict: "student_id" })
    if (error) {
      await admin.from("students").delete().eq("id", studentId).eq("school_id", actor.schoolId)
      return response({ error: "Unable to save student services; no student record was created" }, 500)
    }
  }

  return response({ id: studentId }, 201)
}
