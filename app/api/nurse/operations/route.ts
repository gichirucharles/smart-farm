import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

const NURSE = new Set(["school_nurse", "nurse"])
const STAFF_INBOX = new Set(["head_teacher", "director", "accountant", "school_counselor", "class_teacher", "school_nurse", "nurse"])
const schema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("inventory"), itemName: z.string().trim().min(1).max(160), category: z.string().trim().max(120).default("Medical supplies"), unit: z.string().trim().max(40).default("units"), quantity: z.number().min(0).max(1000000), reorderLevel: z.number().min(0).max(1000000), unitCost: z.number().min(0).nullable().optional(), expiryDate: z.string().date().nullable().optional(), supplier: z.string().trim().max(160).optional() }).strict(),
  z.object({ kind: z.literal("movement"), itemId: z.string().uuid(), movementType: z.enum(["restock", "dispense"]), quantity: z.number().positive().max(1000000), reference: z.string().trim().max(160).optional() }).strict(),
  z.object({ kind: z.literal("campaign"), title: z.string().trim().min(1).max(160), screeningType: z.string().trim().min(1).max(120), targetGroup: z.string().trim().max(160).default("All students"), startsAt: z.string().date(), endsAt: z.string().date().nullable().optional(), notes: z.string().trim().max(2000).optional() }).strict(),
  z.object({ kind: z.literal("screening"), campaignId: z.string().uuid(), studentId: z.string().uuid(), result: z.string().trim().min(1).max(2000), followUpRequired: z.boolean().default(false) }).strict(),
  z.object({ kind: z.literal("referral"), studentId: z.string().uuid(), destination: z.string().trim().min(1).max(200), reason: z.string().trim().min(1).max(2000), followUpDate: z.string().date().nullable().optional() }).strict(),
  z.object({ kind: z.literal("incident"), category: z.string().trim().min(1).max(120), description: z.string().trim().min(1).max(3000), actionTaken: z.string().trim().max(2000).optional(), requiresFollowUp: z.boolean().default(false) }).strict(),
  z.object({ kind: z.literal("consent"), studentId: z.string().uuid(), guardianEmail: z.string().email().max(254), purpose: z.string().trim().min(1).max(160), details: z.string().trim().max(2000).optional() }).strict(),
  z.object({ kind: z.literal("workflow"), recipientRole: z.enum(["parent", "class_teacher", "head_teacher", "director", "accountant", "school_counselor", "school_nurse"]), studentId: z.string().uuid().nullable().optional(), recipientEmail: z.string().email().max(254).nullable().optional(), category: z.enum(["parent_update", "leadership_review", "finance_request", "counseling_referral", "teacher_support", "clinic_follow_up"]), title: z.string().trim().min(1).max(160), summary: z.string().trim().min(1).max(1200) }).strict(),
  z.object({ kind: z.literal("consent_response"), id: z.string().uuid(), status: z.enum(["granted", "declined"]), responseNote: z.string().trim().max(1000).optional() }).strict(),
  z.object({ kind: z.literal("task_status"), id: z.string().uuid(), status: z.enum(["acknowledged", "completed"]) }).strict(),
])
const out = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store, max-age=0" } })

export async function GET() {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return out({ error: "Authentication required" }, 401)
  const admin = getSupabaseAdmin()
  if (NURSE.has(actor.role)) {
    const schoolId = actor.schoolId
    const [inventory, campaigns, results, referrals, incidents, consents, tasks, records, studentsResult] = await Promise.all([
      admin.from("clinic_inventory").select("id,item_name,category,unit,quantity,reorder_level,unit_cost,expiry_date,supplier,updated_at").eq("school_id", schoolId).order("item_name"),
      admin.from("clinic_screening_campaigns").select("id,title,screening_type,target_group,starts_at,ends_at,status").eq("school_id", schoolId).order("starts_at", { ascending: false }).limit(100),
      admin.from("clinic_screening_results").select("id,campaign_id,student_id,result,follow_up_required,screened_at").eq("school_id", schoolId).order("screened_at", { ascending: false }).limit(500),
      admin.from("clinic_referrals").select("id,student_id,destination,reason,referred_at,status,follow_up_date,outcome,parent_notified_at").eq("school_id", schoolId).order("referred_at", { ascending: false }).limit(200),
      admin.from("clinic_staff_incidents").select("id,incident_date,category,description,action_taken,requires_follow_up,status").eq("school_id", schoolId).order("incident_date", { ascending: false }).limit(100),
      admin.from("clinic_guardian_consents").select("id,student_id,guardian_email,purpose,details,status,created_at,responded_at").eq("school_id", schoolId).order("created_at", { ascending: false }).limit(200),
      admin.from("clinic_workflow_tasks").select("id,recipient_role,recipient_email,student_id,category,title,summary,status,created_at").eq("school_id", schoolId).order("created_at", { ascending: false }).limit(200),
      admin.from("health_records").select("symptoms,visit_date").eq("school_id", schoolId).gte("visit_date", new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)).limit(1000),
      admin.from("students").select("id,first_name,last_name,grade_level,stream").eq("school_id", schoolId).eq("is_active", true).order("last_name").limit(2000),
    ])
    if ([inventory,campaigns,results,referrals,incidents,consents,tasks,records,studentsResult].some((r) => r.error)) return out({ error: "Unable to load clinic operations" }, 500)
    const students = studentsResult.data ?? []
    const studentMap = new Map<string, string>(students.map((s: { id: string; first_name: string; last_name: string; grade_level: string; stream: string | null }) => [s.id, `${s.first_name} ${s.last_name} · ${s.grade_level} ${s.stream ?? ""}`.trim()]))
    const trends = new Map<string, number>()
    for (const row of records.data ?? []) for (const term of String(row.symptoms ?? "").split(/[,;\n]/).map((s: string) => s.trim()).filter(Boolean)) trends.set(term, (trends.get(term) ?? 0) + 1)
    const counts = new Map((results.data ?? []).map(x => [x.campaign_id, ((results.data ?? []).filter(y => y.campaign_id === x.campaign_id).length)]))
    return out({ inventory: inventory.data ?? [], campaigns: (campaigns.data ?? []).map(x => ({ ...x, screenedCount: counts.get(x.id) ?? 0 })), results: (results.data ?? []).map(x => ({ ...x, studentName: studentMap.get(x.student_id) ?? "Student" })), referrals: (referrals.data ?? []).map(x => ({ ...x, studentName: studentMap.get(x.student_id) ?? "Student" })), incidents: incidents.data ?? [], consents: (consents.data ?? []).map(x => ({ ...x, studentName: studentMap.get(x.student_id) ?? "Student" })), tasks: tasks.data ?? [], outbreakTrends: [...trends].map(([symptom, count]) => ({ symptom, count })).sort((a,b) => b.count-a.count).slice(0,8), students: students ?? [] })
  }
  if (actor.role === "parent") {
    const { data: linked, error } = await admin.from("student_guardians").select("student_id").eq("school_id", actor.schoolId).ilike("email", actor.email)
    if (error) return out({ error: "Unable to load guardian records" }, 500)
    const ids = [...new Set((linked ?? []).map(x => x.student_id))]
    if (!ids.length) return out({ consents: [], referrals: [], tasks: [] })
    const [consents, referrals, tasks] = await Promise.all([
      admin.from("clinic_guardian_consents").select("id,student_id,purpose,details,status,created_at").eq("school_id", actor.schoolId).ilike("guardian_email", actor.email).order("created_at", { ascending: false }),
      admin.from("clinic_referrals").select("id,student_id,destination,referred_at,status,follow_up_date,parent_notified_at").eq("school_id", actor.schoolId).in("student_id", ids).not("parent_notified_at", "is", null).order("referred_at", { ascending: false }),
      admin.from("clinic_workflow_tasks").select("id,student_id,category,title,summary,status,created_at").eq("school_id", actor.schoolId).eq("recipient_role", "parent").ilike("recipient_email", actor.email).order("created_at", { ascending: false }),
    ])
    if (consents.error || referrals.error || tasks.error) return out({ error: "Unable to load guardian records" }, 500)
    return out({ consents: consents.data ?? [], referrals: referrals.data ?? [], tasks: tasks.data ?? [] })
  }
  if (!STAFF_INBOX.has(actor.role)) return out({ error: "Access denied" }, 403)
  const inboxRole = actor.role === "nurse" ? "school_nurse" : actor.role
  const { data, error } = await admin.from("clinic_workflow_tasks").select("id,student_id,category,title,summary,status,created_at").eq("school_id", actor.schoolId).eq("recipient_role", inboxRole).order("created_at", { ascending: false }).limit(200)
  if (error) return out({ error: "Unable to load clinic workflows" }, 500)
  return out({ tasks: data ?? [] })
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return out({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId) return out({ error: "Authentication required" }, 401)
  let raw: unknown
  try { raw = await request.json() } catch { return out({ error: "Invalid request body" }, 400) }
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return out({ error: "Check the submitted workflow details and try again" }, 400)
  const input = parsed.data
  const admin = getSupabaseAdmin()
  const schoolId = actor.schoolId
  if (input.kind === "consent_response") {
    if (actor.role !== "parent") return out({ error: "Parent access required" }, 403)
    const { data: link } = await admin.from("clinic_guardian_consents").select("id").eq("id", input.id).eq("school_id", schoolId).ilike("guardian_email", actor.email).eq("status", "pending").maybeSingle()
    if (!link) return out({ error: "Pending consent request not found" }, 404)
    const { error } = await admin.from("clinic_guardian_consents").update({ status: input.status, response_note: input.responseNote || null, responded_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", input.id).eq("school_id", schoolId)
    return error ? out({ error: "Unable to save consent response" }, 500) : out({ success: true })
  }
  if (input.kind === "task_status") {
    if (actor.role === "parent") {
      const { data: row } = await admin.from("clinic_workflow_tasks").select("id").eq("id", input.id).eq("school_id", schoolId).eq("recipient_role", "parent").ilike("recipient_email", actor.email).maybeSingle()
      if (!row) return out({ error: "Workflow not found" }, 404)
    } else if (!STAFF_INBOX.has(actor.role)) return out({ error: "Access denied" }, 403)
    const { error } = await admin.from("clinic_workflow_tasks").update({ status: input.status, updated_at: new Date().toISOString() }).eq("id", input.id).eq("school_id", schoolId).eq("recipient_role", actor.role === "nurse" ? "school_nurse" : actor.role)
    return error ? out({ error: "Unable to update workflow" }, 500) : out({ success: true })
  }
  if (!NURSE.has(actor.role)) return out({ error: "Only clinic staff can create clinic workflows" }, 403)
  const studentFor = async (id: string) => admin.from("students").select("id").eq("id", id).eq("school_id", schoolId).eq("is_active", true).maybeSingle()
  if (input.kind === "inventory") {
    const { error } = await admin.from("clinic_inventory").insert({ school_id: schoolId, item_name: input.itemName, category: input.category, unit: input.unit, quantity: input.quantity, reorder_level: input.reorderLevel, unit_cost: input.unitCost ?? null, expiry_date: input.expiryDate ?? null, supplier: input.supplier || null, updated_by: actor.id })
    if (error) return out({ error: "Unable to save inventory item" }, 400)
    if (input.quantity <= input.reorderLevel) await admin.from("clinic_workflow_tasks").insert({ school_id: schoolId, recipient_role: "accountant", category: "finance_request", title: `Low clinic stock: ${input.itemName}`, summary: `Current balance is ${input.quantity} ${input.unit}; reorder threshold is ${input.reorderLevel}. Review purchasing needs.`, created_by: actor.id })
    return out({ success: true }, 201)
  }
  if (input.kind === "movement") {
    const { data: item } = await admin.from("clinic_inventory").select("id,quantity,item_name,reorder_level,unit_cost").eq("id", input.itemId).eq("school_id", schoolId).maybeSingle()
    if (!item) return out({ error: "Inventory item not found" }, 404)
    const next = input.movementType === "restock" ? Number(item.quantity) + input.quantity : Number(item.quantity) - input.quantity
    if (next < 0) return out({ error: "Dispense quantity exceeds available stock" }, 400)
    const { error: updateError } = await admin.from("clinic_inventory").update({ quantity: next, updated_by: actor.id, updated_at: new Date().toISOString() }).eq("id", item.id).eq("school_id", schoolId)
    if (updateError) return out({ error: "Unable to update inventory quantity" }, 500)
    const { error } = await admin.from("clinic_inventory_movements").insert({ school_id: schoolId, item_id: item.id, movement_type: input.movementType, quantity: input.quantity, reference: input.reference || null, recorded_by: actor.id })
    if (error) return out({ error: "Quantity updated but movement log could not be saved" }, 500)
    if (input.movementType === "dispense" && Number(item.quantity) > Number(item.reorder_level) && next <= Number(item.reorder_level)) {
      await admin.from("clinic_workflow_tasks").insert({ school_id: schoolId, recipient_role: "accountant", category: "finance_request", title: `Low clinic stock: ${item.item_name}`, summary: `Current balance is ${next} units; reorder threshold is ${item.reorder_level}. Review purchasing needs.`, created_by: actor.id })
    }
    return out({ success: true })
  }
  if (input.kind === "campaign") {
    const { error } = await admin.from("clinic_screening_campaigns").insert({ school_id: schoolId, title: input.title, screening_type: input.screeningType, target_group: input.targetGroup, starts_at: input.startsAt, ends_at: input.endsAt || null, notes: input.notes || null, created_by: actor.id })
    return error ? out({ error: "Unable to schedule screening campaign" }, 400) : out({ success: true }, 201)
  }
  if (input.kind === "screening") {
    const [{ data: student }, { data: campaign }] = await Promise.all([studentFor(input.studentId), admin.from("clinic_screening_campaigns").select("id").eq("id", input.campaignId).eq("school_id", schoolId).maybeSingle()])
    if (!student || !campaign) return out({ error: "Choose a student and campaign from your school" }, 400)
    const { error } = await admin.from("clinic_screening_results").upsert({ school_id: schoolId, campaign_id: input.campaignId, student_id: input.studentId, result: input.result, follow_up_required: input.followUpRequired, recorded_by: actor.id }, { onConflict: "campaign_id,student_id" })
    return error ? out({ error: "Unable to save screening result" }, 400) : out({ success: true }, 201)
  }
  if (input.kind === "referral") {
    const { data: student } = await studentFor(input.studentId)
    if (!student) return out({ error: "Select an active student in your school" }, 400)
    const { data: referral, error } = await admin.from("clinic_referrals").insert({ school_id: schoolId, student_id: input.studentId, destination: input.destination, reason: input.reason, follow_up_date: input.followUpDate || null, created_by: actor.id }).select("id").single()
    if (error || !referral) return out({ error: "Unable to save hospital referral" }, 400)
    await admin.from("clinic_workflow_tasks").insert({ school_id: schoolId, student_id: input.studentId, recipient_role: "head_teacher", category: "leadership_review", title: "Hospital referral created", summary: "A student referral needs school-level follow-up. Review the clinic record with authorized staff.", created_by: actor.id })
    const { data: guardians } = await admin.from("student_guardians").select("email").eq("school_id", schoolId).eq("student_id", input.studentId).not("email", "is", null)
    const emails = [...new Set((guardians ?? []).map(g => g.email?.trim()).filter((email): email is string => Boolean(email)))]
    if (emails.length) {
      const { error: noticeError } = await admin.from("clinic_workflow_tasks").insert(emails.map(email => ({ school_id: schoolId, student_id: input.studentId, recipient_role: "parent", recipient_email: email, category: "parent_update", title: "Please contact the school clinic", summary: "The clinic has an update about your child. Please contact the school clinic to discuss next steps.", created_by: actor.id })))
      if (!noticeError) await admin.from("clinic_referrals").update({ parent_notified_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", referral.id).eq("school_id", schoolId)
    }
    return out({ success: true }, 201)
  }
  if (input.kind === "incident") {
    const { error } = await admin.from("clinic_staff_incidents").insert({ school_id: schoolId, reported_by: actor.id, category: input.category, description: input.description, action_taken: input.actionTaken || null, requires_follow_up: input.requiresFollowUp })
    if (error) return out({ error: "Unable to record staff incident" }, 400)
    if (input.requiresFollowUp) await admin.from("clinic_workflow_tasks").insert({ school_id: schoolId, recipient_role: "head_teacher", category: "leadership_review", title: "Clinic staff incident requires review", summary: "A clinic incident was recorded and requires follow-up. Review securely with clinic staff.", created_by: actor.id })
    return out({ success: true }, 201)
  }
  if (input.kind === "consent") {
    const { data: student } = await studentFor(input.studentId)
    const { data: guardian } = await admin.from("student_guardians").select("id").eq("school_id", schoolId).eq("student_id", input.studentId).ilike("email", input.guardianEmail).limit(1).maybeSingle()
    if (!student || !guardian) return out({ error: "Guardian email must match a guardian on the student record" }, 400)
    const { error } = await admin.from("clinic_guardian_consents").insert({ school_id: schoolId, student_id: input.studentId, guardian_email: input.guardianEmail, purpose: input.purpose, details: input.details || null, requested_by: actor.id })
    if (error) return out({ error: "Unable to request guardian consent" }, 400)
    await admin.from("clinic_workflow_tasks").insert({ school_id: schoolId, student_id: input.studentId, recipient_role: "parent", recipient_email: input.guardianEmail, category: "parent_update", title: "Clinic consent requested", summary: `Please review the clinic consent request: ${input.purpose}. Sign in to your parent dashboard to respond.`, created_by: actor.id })
    return out({ success: true }, 201)
  }
  if (input.kind === "workflow") {
    if (input.studentId) { const { data: student } = await studentFor(input.studentId); if (!student) return out({ error: "Select a student from your school" }, 400) }
    if (input.recipientRole === "parent") {
      if (!input.studentId || !input.recipientEmail) return out({ error: "Parent workflows require a student and linked guardian email" }, 400)
      const { data: guardian } = await admin.from("student_guardians").select("id").eq("school_id", schoolId).eq("student_id", input.studentId).ilike("email", input.recipientEmail).limit(1).maybeSingle()
      if (!guardian) return out({ error: "Email must match a guardian on the student record" }, 400)
    }
    const { error } = await admin.from("clinic_workflow_tasks").insert({ school_id: schoolId, recipient_role: input.recipientRole, recipient_email: input.recipientRole === "parent" ? input.recipientEmail : null, student_id: input.studentId || null, category: input.category, title: input.title, summary: input.summary, created_by: actor.id })
    return error ? out({ error: "Unable to create workflow" }, 400) : out({ success: true }, 201)
  }
  return out({ error: "Unsupported workflow" }, 400)
}
