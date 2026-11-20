import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"
import { canAccessModule } from "@/lib/governance-access"

const FINANCE_ROLES = new Set(["head_teacher", "director", "accountant"])
const scheduleSchema = z.object({
  action: z.literal("create_schedule"),
  classId: z.string().uuid(),
  term: z.string().trim().min(1).max(40),
  academicYear: z.string().trim().min(1).max(20),
  studentCategory: z.enum(["day", "boarding"]),
  name: z.string().trim().min(1).max(120),
  amount: z.number().positive().max(10000000),
  dueDate: z.string().date().nullable().optional(),
}).strict()
const adjustmentSchema = z.object({
  action: z.literal("adjustment"),
  invoiceId: z.string().uuid(),
  adjustmentType: z.enum(["bursary", "scholarship", "discount", "waiver"]),
  amount: z.number().positive().max(10000000),
  reason: z.string().trim().min(1).max(500),
}).strict()

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  const isParent = actor.role === "parent"
  if (!isParent && !FINANCE_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)
  if (!isParent && !await canAccessModule(actor.role, "finance", "view")) return response({ error: "Access denied" }, 403)

  const db = getSupabaseAdmin()
  const schoolId = actor.schoolId
  const parentLinks = isParent
    ? await db.from("student_guardians").select("student_id").eq("school_id", schoolId).eq("email", actor.email)
    : { data: [], error: null }
  if (parentLinks.error) return response({ error: "Unable to load student finance records" }, 500)
  const linkedStudentIds = [...new Set((parentLinks.data ?? []).map((link) => link.student_id))]
  const [classesResult, studentsResult, enrichmentResult, schedulesResult, invoicesResult, itemsResult, paymentsResult, adjustmentsResult, remindersResult] = await Promise.all([
    db.from("classes").select("id, name, grade_level, stream").eq("school_id", schoolId).eq("is_active", true).order("name"),
    db.from("students").select("id, student_id, first_name, last_name, grade_level, stream").eq("school_id", schoolId).eq("is_active", true).order("last_name").limit(2000),
    db.from("student_enrichment_profiles").select("student_id, boarding_status").eq("school_id", schoolId),
    db.from("finance_fee_schedules").select("id, class_id, term, academic_year, student_category, name, amount, due_date, is_active, created_at").eq("school_id", schoolId).order("created_at", { ascending: false }).limit(500),
    db.from("finance_invoices").select("id, student_id, class_id, invoice_number, term, academic_year, issued_on, due_date, status, created_at").eq("school_id", schoolId).order("created_at", { ascending: false }).limit(1000),
    db.from("finance_invoice_items").select("id, invoice_id, fee_schedule_id, description, amount").eq("school_id", schoolId).limit(5000),
    db.from("finance_payments").select("id, invoice_id, amount, payment_method, reference, receipt_number, paid_at").eq("school_id", schoolId).order("paid_at", { ascending: false }).limit(2000),
    db.from("finance_adjustments").select("id, invoice_id, adjustment_type, amount, reason, status, created_at").eq("school_id", schoolId).order("created_at", { ascending: false }).limit(1000),
    db.from("finance_reminders").select("id, invoice_id, channel, delivery_status, created_at").eq("school_id", schoolId).order("created_at", { ascending: false }).limit(1000),
  ])
  const results = [classesResult, studentsResult, enrichmentResult, schedulesResult, invoicesResult, itemsResult, paymentsResult, adjustmentsResult, remindersResult]
  if (results.some((result) => result.error)) return response({ error: "Unable to load school finance records" }, 500)

  const allClasses = classesResult.data ?? []
  const allStudents = studentsResult.data ?? []
  const visibleStudentIds = isParent ? new Set(linkedStudentIds) : null
  const students = visibleStudentIds ? allStudents.filter((student) => visibleStudentIds.has(student.id)) : allStudents
  const studentProfiles = new Map((enrichmentResult.data ?? []).filter((profile) => !visibleStudentIds || visibleStudentIds.has(profile.student_id)).map((profile) => [profile.student_id, profile.boarding_status]))
  const classes = visibleStudentIds ? allClasses.filter((schoolClass) => students.some((student) => student.grade_level === schoolClass.grade_level && student.stream === schoolClass.stream)) : allClasses
  const classNames = new Map(classes.map((schoolClass) => [schoolClass.id, schoolClass.name]))
  const studentLookup = new Map(students.map((student) => [student.id, student]))
  const visibleInvoices = (invoicesResult.data ?? []).filter((invoice) => !visibleStudentIds || visibleStudentIds.has(invoice.student_id))
  const visibleInvoiceIds = new Set(visibleInvoices.map((invoice) => invoice.id))
  const items = (itemsResult.data ?? []).filter((item) => visibleInvoiceIds.has(item.invoice_id))
  const payments = (paymentsResult.data ?? []).filter((payment) => visibleInvoiceIds.has(payment.invoice_id))
  const adjustments = (adjustmentsResult.data ?? []).filter((adjustment) => visibleInvoiceIds.has(adjustment.invoice_id))
  const invoices = visibleInvoices.map((invoice) => {
    const invoiceItems = items.filter((item) => item.invoice_id === invoice.id)
    const invoicePayments = payments.filter((payment) => payment.invoice_id === invoice.id)
    const invoiceAdjustments = adjustments.filter((adjustment) => adjustment.invoice_id === invoice.id && adjustment.status === "approved")
    const total = invoiceItems.reduce((sum, item) => sum + Number(item.amount), 0)
    const paid = invoicePayments.reduce((sum, payment) => sum + Number(payment.amount), 0)
    const credits = invoiceAdjustments.reduce((sum, adjustment) => sum + Number(adjustment.amount), 0)
    const student = studentLookup.get(invoice.student_id)
    return {
      ...invoice,
      total,
      paid,
      balance: Math.max(0, total - paid - credits),
      studentName: student ? `${student.first_name} ${student.last_name}` : "Student record unavailable",
      admissionNumber: student?.student_id ?? "—",
      className: classNames.get(invoice.class_id) ?? "Class unavailable",
      items: invoiceItems,
      payments: invoicePayments,
      adjustments: invoiceAdjustments,
      isOverdue: Boolean(invoice.due_date && invoice.due_date < new Date().toISOString().slice(0, 10) && total - paid - credits > 0),
    }
  })
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const totalPaid = invoices.reduce((sum, invoice) => sum + invoice.paid, 0)
  const outstanding = invoices.reduce((sum, invoice) => sum + invoice.balance, 0)

  return response({
    classes,
    students: students.map((student) => ({ ...student, className: classes.find((schoolClass) => schoolClass.grade_level === student.grade_level && schoolClass.stream === student.stream)?.name ?? `${student.grade_level} ${student.stream}`, studentCategory: studentProfiles.get(student.id) === "boarding" ? "boarding" : "day" })),
    schedules: isParent ? [] : schedulesResult.data ?? [],
    invoices,
    payments,
    adjustments,
    reminders: (remindersResult.data ?? []).filter((reminder) => visibleInvoiceIds.has(reminder.invoice_id)),
    summary: { invoiced: totalInvoiced, collected: totalPaid, outstanding, overdue: invoices.filter((invoice) => invoice.isOverdue).length, invoiceCount: invoices.length },
  })
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (!FINANCE_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)
  if (!await canAccessModule(actor.role, "finance", "edit")) return response({ error: "Edit access denied" }, 403)

  let body: unknown
  try { body = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const input = z.discriminatedUnion("action", [scheduleSchema, adjustmentSchema]).safeParse(body)
  if (!input.success) return response({ error: "Check the submitted finance details and try again" }, 400)
  const db = getSupabaseAdmin()

  if (input.data.action === "create_schedule") {
    const { data: schoolClass, error: classError } = await db.from("classes").select("id").eq("id", input.data.classId).eq("school_id", actor.schoolId).eq("is_active", true).maybeSingle()
    if (classError || !schoolClass) return response({ error: "Choose an active class in your school" }, 400)
    const { data, error } = await db.from("finance_fee_schedules").insert({
      school_id: actor.schoolId,
      class_id: input.data.classId,
      term: input.data.term,
      academic_year: input.data.academicYear,
      student_category: input.data.studentCategory,
      name: input.data.name,
      amount: input.data.amount,
      due_date: input.data.dueDate || null,
      created_by: actor.id,
    }).select("id").single()
    if (error || !data) return response({ error: "Unable to save the fee schedule" }, 500)
    return response({ id: data.id }, 201)
  }

  const { data, error } = await db.rpc("finance_record_adjustment", {
    p_school_id: actor.schoolId,
    p_invoice_id: input.data.invoiceId,
    p_adjustment_type: input.data.adjustmentType,
    p_amount: input.data.amount,
    p_reason: input.data.reason,
    p_created_by: actor.id,
  })
  if (error) return response({ error: error.message.includes("remaining invoice balance") ? "The adjustment exceeds the remaining invoice balance" : "Unable to apply this adjustment" }, 400)
  return response({ id: data }, 201)
}
