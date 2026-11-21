import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

const ENTRY_CATEGORIES = ["remark", "incident", "referral", "parent_message", "meeting_request", "announcement", "duty", "leave_request", "report_comment"] as const
const entrySchema = z.object({
  kind: z.literal("entry"),
  classId: z.string().uuid(),
  studentId: z.string().uuid().optional().nullable(),
  category: z.enum(ENTRY_CATEGORIES),
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().min(1).max(4000),
  visibleToParent: z.boolean().default(false),
}).strict()
const attendanceSchema = z.object({
  kind: z.literal("attendance"),
  date: z.string().date(),
  records: z.array(z.object({ studentId: z.string().uuid(), classId: z.string().uuid(), status: z.enum(["present", "absent", "late", "excused"]), remarks: z.string().trim().max(500).optional().default("") }).strict()).min(1).max(200),
}).strict()

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

export async function GET(request: Request) {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (actor.role !== "class_teacher") return response({ error: "Class teacher access required" }, 403)

  try {
    const admin = getSupabaseAdmin()
    const date = new URL(request.url).searchParams.get("date")
    const selectedDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().slice(0, 10)
    const { data: classes, error: classError } = await admin.from("classes")
      .select("id, name, grade_level, stream, academic_year")
      .eq("school_id", actor.schoolId).eq("class_teacher_id", actor.id).eq("is_active", true)
      .order("name")
    if (classError) return response({ error: "Unable to load your class assignment" }, 500)

    const assignedClasses = classes ?? []
    if (!assignedClasses.length) return response({ date: selectedDate, classes: [], students: [], entries: [], timetable: [] })
    const classIds = assignedClasses.map((item) => item.id)
    const classKeys = new Set(assignedClasses.map((item) => `${item.grade_level}:${item.stream ?? ""}`))
    const { data: allStudents, error: studentError } = await admin.from("students")
      .select("id, student_id, first_name, last_name, grade_level, stream, photo_url, gender, admission_status")
      .eq("school_id", actor.schoolId).eq("is_active", true).order("last_name").order("first_name").limit(1000)
    if (studentError) return response({ error: "Unable to load your class roster" }, 500)
    const classesByKey = new Map(assignedClasses.map((item) => [`${item.grade_level}:${item.stream ?? ""}`, item]))
    const students = (allStudents ?? []).filter((student) => classKeys.has(`${student.grade_level}:${student.stream ?? ""}`)).map((student) => ({
      id: student.id,
      admissionNumber: student.student_id,
      name: `${student.first_name} ${student.last_name}`.trim(),
      gradeLevel: student.grade_level,
      stream: student.stream,
      classId: classesByKey.get(`${student.grade_level}:${student.stream ?? ""}`)?.id ?? "",
      className: classesByKey.get(`${student.grade_level}:${student.stream ?? ""}`)?.name ?? `${student.grade_level} ${student.stream ?? ""}`,
      photoUrl: student.photo_url,
      gender: student.gender,
    }))
    const studentIds = students.map((student) => student.id)
    const [attendanceResult, guardiansResult, flagsResult, timetableResult, entriesResult, assessmentsResult, invoicesResult, subjectsResult] = await Promise.all([
      admin.from("attendance").select("id, student_id, class_id, date, status, remarks").in("class_id", classIds).eq("date", selectedDate).limit(1000),
      studentIds.length ? admin.from("student_guardians").select("id, student_id, name, relationship, phone, email, emergency_contact, authorized_pickup").eq("school_id", actor.schoolId).in("student_id", studentIds).limit(2000) : Promise.resolve({ data: [], error: null }),
      studentIds.length ? admin.from("student_teacher_health_flags").select("id, student_id, summary, updated_at").eq("school_id", actor.schoolId).eq("visible_to_class_teacher", true).in("student_id", studentIds).limit(500) : Promise.resolve({ data: [], error: null }),
      admin.from("class_timetable_entries").select("id, class_id, subject_id, teacher_id, day_of_week, starts_at, ends_at, room").eq("school_id", actor.schoolId).in("class_id", classIds).order("day_of_week").order("starts_at").limit(1000),
      admin.from("class_teacher_entries").select("id, class_id, student_id, category, title, body, status, visible_to_parent, created_at").eq("school_id", actor.schoolId).in("class_id", classIds).order("created_at", { ascending: false }).limit(500),
      admin.from("assessments").select("id, class_id, subject_id, name, type, total_marks, date, term, academic_year").eq("school_id", actor.schoolId).in("class_id", classIds).order("date", { ascending: false }).limit(500),
      studentIds.length ? admin.from("finance_invoices").select("id, student_id, due_date, status").eq("school_id", actor.schoolId).in("student_id", studentIds).limit(2000) : Promise.resolve({ data: [], error: null }),
      admin.from("subjects").select("id, name, code").eq("school_id", actor.schoolId),
    ])
    if ([attendanceResult, guardiansResult, flagsResult, timetableResult, entriesResult, assessmentsResult, invoicesResult, subjectsResult].some((result) => result.error)) {
      return response({ error: "Unable to load class records" }, 500)
    }
    const assessmentIds = (assessmentsResult.data ?? []).map((item) => item.id)
    const [resultsResult, itemsResult, paymentsResult] = await Promise.all([
      assessmentIds.length && studentIds.length
        ? admin.from("assessment_results").select("assessment_id, student_id, marks_obtained, grade, remarks").in("assessment_id", assessmentIds).in("student_id", studentIds).limit(10000)
        : Promise.resolve({ data: [], error: null }),
      (invoicesResult.data ?? []).length
        ? admin.from("finance_invoice_items").select("invoice_id, amount").in("invoice_id", (invoicesResult.data ?? []).map((invoice) => invoice.id)).limit(5000)
        : Promise.resolve({ data: [], error: null }),
      (invoicesResult.data ?? []).length
        ? admin.from("finance_payments").select("invoice_id, amount").eq("school_id", actor.schoolId).in("invoice_id", (invoicesResult.data ?? []).map((invoice) => invoice.id)).limit(5000)
        : Promise.resolve({ data: [], error: null }),
    ])
    if (resultsResult.error || itemsResult.error || paymentsResult.error) return response({ error: "Unable to load class progress" }, 500)

    const guardiansByStudent = new Map<string, typeof guardiansResult.data>()
    for (const guardian of guardiansResult.data ?? []) guardiansByStudent.set(guardian.student_id, [...(guardiansByStudent.get(guardian.student_id) ?? []), guardian])
    const flagsByStudent = new Map<string, typeof flagsResult.data>()
    for (const flag of flagsResult.data ?? []) flagsByStudent.set(flag.student_id, [...(flagsByStudent.get(flag.student_id) ?? []), flag])
    const subjectNames = new Map((subjectsResult.data ?? []).map((subject) => [subject.id, subject.name]))
    const assessmentById = new Map((assessmentsResult.data ?? []).map((assessment) => [assessment.id, assessment]))
    const marksByStudent = new Map<string, { earned: number; possible: number; subjects: Record<string, { earned: number; possible: number }>; marks: number[] }>()
    for (const result of resultsResult.data ?? []) {
      const assessment = assessmentById.get(result.assessment_id)
      if (!assessment) continue
      const current = marksByStudent.get(result.student_id) ?? { earned: 0, possible: 0, subjects: {}, marks: [] }
      current.earned += result.marks_obtained ?? 0
      current.possible += assessment.total_marks ?? 0
      const subject = subjectNames.get(assessment.subject_id) ?? "Other"
      const subjectEntry = current.subjects[subject] ?? { earned: 0, possible: 0 }
      subjectEntry.earned += result.marks_obtained ?? 0
      subjectEntry.possible += assessment.total_marks ?? 0
      current.subjects[subject] = subjectEntry
      current.marks.push(result.marks_obtained ?? 0)
      marksByStudent.set(result.student_id, current)
    }
    const invoiceIds = new Set((invoicesResult.data ?? []).map((invoice) => invoice.id))
    const billed = new Map<string, number>()
    for (const item of itemsResult.data ?? []) {
      if (!invoiceIds.has(item.invoice_id)) continue
      const studentId = (invoicesResult.data ?? []).find((invoice) => invoice.id === item.invoice_id)?.student_id
      if (studentId) billed.set(studentId, (billed.get(studentId) ?? 0) + Number(item.amount ?? 0))
    }
    const paid = new Map<string, number>()
    for (const payment of paymentsResult.data ?? []) {
      const studentId = (invoicesResult.data ?? []).find((invoice) => invoice.id === payment.invoice_id)?.student_id
      if (studentId) paid.set(studentId, (paid.get(studentId) ?? 0) + Number(payment.amount ?? 0))
    }
    const scores = students.map((student) => ({ id: student.id, score: marksByStudent.get(student.id)?.possible ? marksByStudent.get(student.id)!.earned / marksByStudent.get(student.id)!.possible : -1 }))
      .filter((item) => item.score >= 0).sort((a, b) => b.score - a.score)
    const ranks = new Map<string, number>()
    scores.forEach((item, index) => { if (!ranks.has(item.id)) ranks.set(item.id, index + 1) })
    const attendanceByStudent = new Map((attendanceResult.data ?? []).map((record) => [record.student_id, record]))
    const studentsWithDetails = students.map((student) => {
      const performance = marksByStudent.get(student.id)
      const due = Math.max(0, (billed.get(student.id) ?? 0) - (paid.get(student.id) ?? 0))
      return {
        ...student,
        guardians: guardiansByStudent.get(student.id) ?? [],
        healthFlags: flagsByStudent.get(student.id) ?? [],
        attendance: attendanceByStudent.get(student.id) ?? null,
        marks: performance ? {
          average: performance.possible ? Math.round(performance.earned / performance.possible * 100) : null,
          rank: ranks.get(student.id) ?? null,
          assessments: performance.marks.length,
          subjects: Object.entries(performance.subjects).map(([subject, value]) => ({ subject, score: value.possible ? Math.round(value.earned / value.possible * 100) : null })),
        } : { average: null, rank: null, assessments: 0, subjects: [] },
        feeBalance: due,
      }
    })
    return response({
      date: selectedDate,
      classes: assignedClasses.map((item) => ({ id: item.id, name: item.name, gradeLevel: item.grade_level, stream: item.stream, academicYear: item.academic_year })),
      students: studentsWithDetails,
      entries: entriesResult.data ?? [],
      timetable: (timetableResult.data ?? []).map((item) => ({ ...item, subject: subjectNames.get(item.subject_id) ?? "Unassigned subject" })),
      assessments: (assessmentsResult.data ?? []).map((item) => ({ ...item, subject: subjectNames.get(item.subject_id) ?? "Unassigned subject" })),
    })
  } catch {
    return response({ error: "Unable to load your class dashboard" }, 500)
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId || actor.role !== "class_teacher") return response({ error: "Class teacher access required" }, 403)
  let body: unknown
  try { body = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const parsed = z.union([entrySchema, attendanceSchema]).safeParse(body)
  if (!parsed.success) return response({ error: "Check the submitted details and try again" }, 400)

  try {
    const admin = getSupabaseAdmin()
    const { data: classes, error: classesError } = await admin.from("classes").select("id, grade_level, stream")
      .eq("school_id", actor.schoolId).eq("class_teacher_id", actor.id).eq("is_active", true)
    if (classesError) return response({ error: "Unable to verify your class assignment" }, 500)
    const assignedClasses = classes ?? []
    const assignedIds = new Set(assignedClasses.map((item) => item.id))
    if (parsed.data.kind === "attendance") {
      const input = parsed.data
      if (input.records.some((item) => !assignedIds.has(item.classId))) return response({ error: "Attendance can only be recorded for your assigned classes" }, 403)
      const uniqueIds = [...new Set(input.records.map((item) => item.studentId))]
      const { data: students, error: studentError } = await admin.from("students").select("id, grade_level, stream")
        .eq("school_id", actor.schoolId).eq("is_active", true).in("id", uniqueIds)
      if (studentError || students?.length !== uniqueIds.length) return response({ error: "Select active students in your assigned classes" }, 400)
      const classesById = new Map(assignedClasses.map((item) => [item.id, item]))
      const studentsById = new Map((students ?? []).map((item) => [item.id, item]))
      if (input.records.some((item) => {
        const schoolClass = classesById.get(item.classId)
        const student = studentsById.get(item.studentId)
        return !schoolClass || !student || schoolClass.grade_level !== student.grade_level || (schoolClass.stream ?? "") !== (student.stream ?? "")
      })) return response({ error: "Each student must belong to the selected class" }, 400)
      for (const record of input.records) {
        const existing = await admin.from("attendance").select("id").eq("student_id", record.studentId).eq("class_id", record.classId).eq("date", input.date).maybeSingle()
        if (existing.error) return response({ error: "Unable to check the current attendance register" }, 500)
        const values = { status: record.status, remarks: record.remarks || null, recorded_by: actor.id }
        const result = existing.data
          ? await admin.from("attendance").update(values).eq("id", existing.data.id)
          : await admin.from("attendance").insert({ ...values, student_id: record.studentId, class_id: record.classId, date: input.date })
        if (result.error) return response({ error: "Unable to save the full attendance register" }, 500)
      }
      return response({ saved: input.records.length })
    }

    const input = parsed.data
    if (!assignedIds.has(input.classId)) return response({ error: "You can only add records to your assigned classes" }, 403)
    if (["remark", "incident", "referral", "parent_message", "meeting_request", "report_comment"].includes(input.category) && !input.studentId) {
      return response({ error: "Select a student for this record" }, 400)
    }
    if (input.studentId) {
      const schoolClass = assignedClasses.find((item) => item.id === input.classId)
      const { data: student, error } = await admin.from("students").select("id, grade_level, stream").eq("id", input.studentId).eq("school_id", actor.schoolId).eq("is_active", true).maybeSingle()
      if (error || !student || !schoolClass || student.grade_level !== schoolClass.grade_level || (student.stream ?? "") !== (schoolClass.stream ?? "")) {
        return response({ error: "Select a student from your assigned class" }, 400)
      }
    }
    const { data: saved, error } = await admin.from("class_teacher_entries").insert({
      school_id: actor.schoolId, class_id: input.classId, student_id: input.studentId || null,
      category: input.category, title: input.title, body: input.body,
      visible_to_parent: input.visibleToParent, created_by: actor.id,
    }).select("id").single()
    if (error || !saved) return response({ error: "Unable to save this class record" }, 500)
    return response({ id: saved.id }, 201)
  } catch {
    return response({ error: "Unable to save your class record" }, 500)
  }
}
