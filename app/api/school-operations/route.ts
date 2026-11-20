import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"
import { canAccessModule } from "@/lib/governance-access"

const MANAGEMENT_ROLES = new Set(["head_teacher", "director", "deputy_head_teacher"])
const CATEGORIES = ["assets", "library", "laboratories", "stores", "infrastructure", "maintenance", "safety", "land", "transport", "boarding", "meals", "compliance", "activities"] as const
const STATUSES = ["active", "open", "in_progress", "completed", "overdue", "inactive", "checked_out", "returned", "needs_restock"] as const
const detailsSchema = z.record(z.string().max(80), z.union([z.string().trim().max(500), z.number().finite(), z.boolean()])).refine((details) => Object.keys(details).length <= 30)
const createSchema = z.object({
  category: z.enum(CATEGORIES),
  recordType: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(180),
  location: z.string().trim().max(180).nullable().optional(),
  status: z.enum(STATUSES).default("active"),
  quantity: z.number().min(0).max(1_000_000_000).nullable().optional(),
  dueDate: z.string().date().nullable().optional(),
  details: detailsSchema.default({}),
}).strict()

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

type SessionActor = NonNullable<Awaited<ReturnType<typeof getSessionActor>>>
type AccessResult = { actor: SessionActor; error?: never } | { error: NextResponse; actor?: never }

async function authorizedActor(): Promise<AccessResult> {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return { error: response({ error: "Authentication required" }, 401) }
  if (!MANAGEMENT_ROLES.has(actor.role)) return { error: response({ error: "Access denied" }, 403) }
  return { actor }
}

export async function GET(request: Request) {
  const access = await authorizedActor()
  if ("error" in access) return access.error
  const actor = access.actor
  if (!await canAccessModule(actor.role, "operations", "view")) return response({ error: "Access denied" }, 403)

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("school_operations_records")
      .select("id, category, record_type, name, location, status, quantity, due_date, details, created_by, created_at, updated_at")
      .eq("school_id", actor.schoolId)
      .order("updated_at", { ascending: false })
      .limit(2000)

    if (error) return response({ error: "Unable to load school operations records" }, 500)

    const moduleFilter = new URL(request.url).searchParams.get("module")
    const records = (data ?? []).filter((record) => {
      const storedModule = typeof record.details?._module === "string" ? record.details._module : null
      if (moduleFilter === "compliance" || moduleFilter === "activities") return storedModule === moduleFilter
      return storedModule === null
    })
    const today = new Date()
    const dueLimit = new Date(today)
    dueLimit.setDate(today.getDate() + 30)
    const summary = {
      totalRecords: records.length,
      openMaintenance: records.filter((record) => record.category === "maintenance" && ["open", "in_progress", "overdue"].includes(record.status)).length,
      dueSoon: records.filter((record) => record.due_date && new Date(`${record.due_date}T00:00:00`) <= dueLimit && new Date(`${record.due_date}T00:00:00`) >= new Date(today.toDateString())).length,
      libraryTitles: records.filter((record) => record.category === "library").length,
      vehicles: records.filter((record) => record.category === "transport").length,
      boardingSpaces: records.filter((record) => record.category === "boarding").reduce((total, record) => total + Number(record.quantity ?? 0), 0),
    }
    return response({ records, summary })
  } catch {
    return response({ error: "Unable to load school operations records" }, 500)
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const access = await authorizedActor()
  if ("error" in access) return access.error
  const actor = access.actor
  if (!await canAccessModule(actor.role, "operations", "edit")) return response({ error: "Edit access denied" }, 403)

  let body: unknown
  try { body = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return response({ error: "Check the record details and try again" }, 400)

  const input = parsed.data
  const { data, error } = await getSupabaseAdmin()
    .from("school_operations_records")
    .insert({
      school_id: actor.schoolId,
      created_by: actor.id,
      category: input.category === "compliance" ? "safety" : input.category === "activities" ? "assets" : input.category,
      record_type: input.recordType,
      name: input.name,
      location: input.location || null,
      status: input.status,
      quantity: input.quantity ?? null,
      due_date: input.dueDate || null,
      details: input.category === "compliance" || input.category === "activities"
        ? { ...input.details, _module: input.category }
        : input.details,
    })
    .select("id")
    .single()

  if (error || !data) return response({ error: "Unable to save this school operations record" }, 500)
  return response({ id: data.id }, 201)
}

export async function PATCH(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const access = await authorizedActor()
  if ("error" in access) return access.error
  const actor = access.actor
  if (!await canAccessModule(actor.role, "operations", "edit")) return response({ error: "Edit access denied" }, 403)

  let body: unknown
  try { body = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const parsed = z.object({ id: z.string().uuid(), status: z.enum(STATUSES) }).strict().safeParse(body)
  if (!parsed.success) return response({ error: "Invalid status update" }, 400)

  const { data, error } = await getSupabaseAdmin()
    .from("school_operations_records")
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.id)
    .eq("school_id", actor.schoolId)
    .select("id")
    .maybeSingle()

  if (error || !data) return response({ error: "This record could not be updated" }, 404)
  return response({ id: data.id })
}
