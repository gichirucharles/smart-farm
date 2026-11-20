import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

const STAFF_ROLES = ["head_teacher", "deputy_head_teacher", "class_teacher", "subject_teacher", "accountant", "librarian", "school_nurse", "school_counselor"] as const
const MODULES = ["students", "staff", "attendance", "academics", "finance", "library", "health", "communications", "operations", "school_settings"] as const
const DEFAULT_PREFERENCES = { email: true, in_app: true, approval_updates: true, escalations: true, weekly_digest: false }
const response = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
const audit = async (schoolId: string | null, actorId: string, action: string, entityType: string, summary: string, entityId?: string) => {
  await getSupabaseAdmin().from("governance_audit_log").insert({ school_id: schoolId, actor_id: actorId, action, entity_type: entityType, summary, entity_id: entityId ?? null })
}

async function canManageSchool(actor: NonNullable<Awaited<ReturnType<typeof getSessionActor>>>, schoolId: string) {
  if (actor.schoolId === schoolId) return true
  if (actor.role !== "director") return false
  const { data, error } = await getSupabaseAdmin()
    .from("user_school_assignments")
    .select("id")
    .eq("user_id", actor.id)
    .eq("school_id", schoolId)
    .eq("assigned_role", "director")
    .maybeSingle()
  return !error && Boolean(data)
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor) return response({ error: "Authentication required" }, 401)
  if (!["director", "head_teacher", "deputy_head_teacher"].includes(actor.role)) return response({ error: "Access denied" }, 403)
  const admin = getSupabaseAdmin()
  const { data: assigned, error: assignmentError } = await admin
    .from("user_school_assignments")
    .select("school_id")
    .eq("user_id", actor.id)
  if (assignmentError) return response({ error: "Unable to load assigned schools" }, 500)
  const assignedIds = [...new Set([actor.schoolId, ...(assigned ?? []).map((item) => item.school_id)].filter((id): id is string => Boolean(id)))]
  const { data: schoolsRaw, error: schoolError } = assignedIds.length
    ? await admin.from("schools").select("id, name, county").in("id", assignedIds).order("name").limit(100)
    : { data: [], error: null }
  if (schoolError) return response({ error: "Unable to load school governance data" }, 500)
  const schools = schoolsRaw ?? []
  const schoolIds = schools.map((school) => school.id)
  const [userResult, prefResult, permissionsResult, approvalsResult, auditResult, assignmentsResult, metrics] = await Promise.all([
    admin.from("users").select("id, email, first_name, last_name, phone, role, school_id, tsc_number, photo_url").eq("id", actor.id).maybeSingle(),
    admin.from("governance_notification_preferences").select("preferences").eq("user_id", actor.id).maybeSingle(),
    admin.from("role_module_permissions").select("role, module_key, access_level, updated_at").order("role"),
    schoolIds.length ? admin.from("governance_approval_requests").select("id, school_id, request_type, subject, details, amount, status, requested_at, reviewed_at, review_note").in("school_id", schoolIds).order("requested_at", { ascending: false }).limit(100) : Promise.resolve({ data: [], error: null }),
    schoolIds.length ? admin.from("governance_audit_log").select("id, school_id, actor_id, action, entity_type, summary, created_at").in("school_id", schoolIds).order("created_at", { ascending: false }).limit(100) : Promise.resolve({ data: [], error: null }),
    admin.from("user_school_assignments").select("id, school_id, assigned_role, user_id").in("school_id", schoolIds.length ? schoolIds : ["00000000-0000-0000-0000-000000000000"]),
    Promise.all(schools.map(async (school) => {
      const [{ count: enrolment }, { data: payments }, { data: classes }, { data: assessments }] = await Promise.all([
        admin.from("students").select("id", { count: "exact", head: true }).eq("school_id", school.id).eq("is_active", true),
        admin.from("finance_payments").select("amount").eq("school_id", school.id),
        admin.from("classes").select("id").eq("school_id", school.id),
        admin.from("assessments").select("id, total_marks").eq("school_id", school.id),
      ])
      const classIds = (classes ?? []).map((item) => item.id)
      const assessmentIds = (assessments ?? []).map((item) => item.id)
      const [{ data: attendance }, { data: results }] = await Promise.all([
        classIds.length
          ? admin.from("attendance").select("status").in("class_id", classIds).gte("date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)).limit(10000)
          : Promise.resolve({ data: [] }),
        assessmentIds.length
          ? admin.from("assessment_results").select("assessment_id, marks_obtained").in("assessment_id", assessmentIds).limit(20000)
          : Promise.resolve({ data: [] }),
      ])
      const attendanceRate = attendance?.length
        ? Math.round((attendance.filter((item) => ["present", "late"].includes(item.status.toLowerCase())).length / attendance.length) * 100)
        : null
      const totalMarksByAssessment = new Map((assessments ?? []).map((item) => [item.id, Number(item.total_marks)]))
      const validScores = (results ?? []).flatMap((result) => {
        const totalMarks = totalMarksByAssessment.get(result.assessment_id)
        const marks = Number(result.marks_obtained)
        return totalMarks && totalMarks > 0 && Number.isFinite(marks) && marks >= 0 && marks <= totalMarks ? [marks / totalMarks * 100] : []
      })
      const meanScore = validScores.length ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length) : null
      return { id: school.id, name: school.name, county: school.county, enrolment: enrolment ?? 0, feesCollected: (payments ?? []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0), attendanceRate, meanScore }
    })),
  ])
  if (userResult.error || prefResult.error || permissionsResult.error || approvalsResult.error || auditResult.error || assignmentsResult.error) return response({ error: "Unable to load governance controls" }, 500)
  const requests = approvalsResult.data ?? []
  return response({
    role: actor.role,
    profile: userResult.data,
    preferences: { ...DEFAULT_PREFERENCES, ...(prefResult.data?.preferences ?? {}) },
    permissions: permissionsResult.data ?? [],
    approvals: requests,
    audit: auditResult.data ?? [],
    assignments: assignmentsResult.data ?? [],
    schools: metrics,
    summary: { pendingApprovals: requests.filter((item) => item.status === "pending").length, escalations: (auditResult.data ?? []).filter((item) => item.action === "escalated").length },
    modules: MODULES,
    staffRoles: STAFF_ROLES,
  })
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor || !["director", "head_teacher", "deputy_head_teacher"].includes(actor.role)) return response({ error: "Access denied" }, 403)
  let raw: unknown
  try { raw = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const escalationSchema = z.object({ action: z.literal("escalate"), schoolId: z.string().uuid(), subject: z.string().trim().min(2).max(160), details: z.string().trim().min(1).max(3000) }).strict()
  const escalation = escalationSchema.safeParse(raw)
  if (escalation.success) {
    const { data: school } = await getSupabaseAdmin().from("schools").select("id").eq("id", escalation.data.schoolId).maybeSingle()
    if (!school || !await canManageSchool(actor, escalation.data.schoolId)) return response({ error: "You cannot escalate issues for this school" }, 403)
    await audit(school.id, actor.id, "escalated", "escalation", `${escalation.data.subject}: ${escalation.data.details}`)
    return response({ success: true }, 201)
  }
  const requestSchema = z.object({ action: z.literal("request_approval"), schoolId: z.string().uuid(), requestType: z.enum(["large_expenditure", "staff_hiring", "staff_dismissal", "fee_change"]), subject: z.string().trim().min(2).max(160), details: z.string().trim().max(3000).default(""), amount: z.number().finite().nonnegative().nullable().optional() }).strict()
  const parsed = requestSchema.safeParse(raw)
  if (!parsed.success) return response({ error: "Check the approval request details" }, 400)
  const admin = getSupabaseAdmin()
  const { data: school } = await admin.from("schools").select("id").eq("id", parsed.data.schoolId).maybeSingle()
  if (!school || !await canManageSchool(actor, parsed.data.schoolId)) return response({ error: "You cannot submit requests for this school" }, 403)
  const { data, error } = await admin.from("governance_approval_requests").insert({ school_id: parsed.data.schoolId, request_type: parsed.data.requestType, subject: parsed.data.subject, details: parsed.data.details, amount: parsed.data.amount ?? null, requested_by: actor.id }).select("id").single()
  if (error || !data) return response({ error: "Unable to submit approval request" }, 500)
  await audit(parsed.data.schoolId, actor.id, "created", "approval_request", `Submitted ${parsed.data.requestType.replaceAll("_", " ")}: ${parsed.data.subject}`, data.id)
  return response({ id: data.id }, 201)
}

export async function PATCH(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor || !["director", "head_teacher", "deputy_head_teacher"].includes(actor.role)) return response({ error: "Access denied" }, 403)
  let raw: unknown
  try { raw = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const profileSchema = z.object({ action: z.literal("profile"), firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80), phone: z.string().trim().max(40), tscNumber: z.string().trim().max(40), photoUrl: z.string().trim().url().max(500).or(z.literal("")).nullable() }).strict()
  const preferencesSchema = z.object({ action: z.literal("preferences"), preferences: z.object({ email: z.boolean(), in_app: z.boolean(), approval_updates: z.boolean(), escalations: z.boolean(), weekly_digest: z.boolean() }).strict() }).strict()
  const permissionSchema = z.object({ action: z.literal("permission"), role: z.enum(STAFF_ROLES), module: z.enum(MODULES), access: z.enum(["none", "view", "edit"]) }).strict()
  const reviewSchema = z.object({ action: z.literal("review"), id: z.string().uuid(), status: z.enum(["approved", "rejected"]), note: z.string().trim().max(1000).default("") }).strict()
  const parsed = z.union([profileSchema, preferencesSchema, permissionSchema, reviewSchema]).safeParse(raw)
  if (!parsed.success) return response({ error: "Invalid governance update" }, 400)
  const admin = getSupabaseAdmin()
  if (parsed.data.action === "profile") {
    const { error } = await admin.from("users").update({ first_name: parsed.data.firstName, last_name: parsed.data.lastName, phone: parsed.data.phone || null, tsc_number: parsed.data.tscNumber || null, photo_url: parsed.data.photoUrl || null, updated_at: new Date().toISOString() }).eq("id", actor.id)
    if (error) return response({ error: "Unable to update your profile" }, 500)
    await audit(actor.schoolId, actor.id, "updated", "profile", "Updated account profile")
  } else if (parsed.data.action === "preferences") {
    const { error } = await admin.from("governance_notification_preferences").upsert({ user_id: actor.id, preferences: parsed.data.preferences, updated_at: new Date().toISOString() })
    if (error) return response({ error: "Unable to save notification preferences" }, 500)
  } else if (parsed.data.action === "permission") {
    if (actor.role !== "director") return response({ error: "Only the director can change role access" }, 403)
    const { error } = await admin.from("role_module_permissions").upsert({ role: parsed.data.role, module_key: parsed.data.module, access_level: parsed.data.access, updated_by: actor.id, updated_at: new Date().toISOString() }, { onConflict: "role,module_key" })
    if (error) return response({ error: "Unable to update permissions" }, 500)
    await audit(actor.schoolId, actor.id, "updated", "role_permission", `Set ${parsed.data.role} access to ${parsed.data.access} for ${parsed.data.module}`)
  } else {
    if (actor.role !== "director") return response({ error: "Only the director can review approval requests" }, 403)
    const { data: approval } = await admin.from("governance_approval_requests").select("id, school_id, status").eq("id", parsed.data.id).maybeSingle()
    if (!approval || approval.status !== "pending") return response({ error: "This request is no longer pending" }, 409)
    if (!await canManageSchool(actor, approval.school_id)) return response({ error: "You cannot review this request" }, 403)
    const { error } = await admin.from("governance_approval_requests").update({ status: parsed.data.status, review_note: parsed.data.note || null, reviewed_by: actor.id, reviewed_at: new Date().toISOString() }).eq("id", parsed.data.id).eq("status", "pending")
    if (error) return response({ error: "Unable to review approval request" }, 500)
    await audit(approval.school_id, actor.id, parsed.data.status, "approval_request", `${parsed.data.status === "approved" ? "Approved" : "Rejected"} an approval request`, approval.id)
  }
  return response({ success: true })
}

export async function PUT(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (actor?.role !== "director") return response({ error: "Only the director can import staff assignments" }, 403)
  let raw: unknown
  try { raw = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const input = z.object({ assignments: z.array(z.object({ email: z.string().email().max(254), schoolId: z.string().uuid(), role: z.enum(STAFF_ROLES) }).strict()).min(1).max(200) }).strict().safeParse(raw)
  if (!input.success) return response({ error: "Import must include valid email, schoolId, and role values" }, 400)
  const admin = getSupabaseAdmin()
  let imported = 0
  for (const item of input.data.assignments) {
    const [{ data: school }, { data: user }] = await Promise.all([
      admin.from("schools").select("id").eq("id", item.schoolId).maybeSingle(),
      admin.from("users").select("id").eq("email", item.email.toLowerCase()).maybeSingle(),
    ])
    if (!school || !user || !await canManageSchool(actor, item.schoolId)) continue
    const { error } = await admin.from("user_school_assignments").upsert({ user_id: user.id, school_id: school.id, assigned_role: item.role, created_by: actor.id }, { onConflict: "user_id,school_id,assigned_role" })
    if (!error) imported += 1
  }
  await audit(null, actor.id, "imported", "staff_assignments", `Imported ${imported} existing staff assignments`)
  return response({ imported, skipped: input.data.assignments.length - imported })
}
