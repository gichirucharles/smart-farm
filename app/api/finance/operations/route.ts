import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"
import { canAccessModule } from "@/lib/governance-access"

const FINANCE_ROLES = new Set(["head_teacher", "director", "accountant"])
const TABLES = [
  ["accounts", "school_finance_accounts", "id, name, account_type, institution, account_reference, opening_balance, is_active"],
  ["budgets", "school_finance_budgets", "id, fiscal_year, period, category, allocated_amount, notes"],
  ["transactions", "school_finance_transactions", "id, account_id, transaction_type, category, amount, transaction_date, description, reference"],
  ["grants", "school_capitation_grants", "id, grant_type, amount, received_on, reference, notes"],
  ["requisitions", "school_finance_requisitions", "id, requisition_number, requested_by, department, category, amount, purpose, status, requested_on, reviewed_at, review_note"],
  ["suppliers", "school_finance_suppliers", "id, name, contact_person, email, phone, tax_pin, is_active"],
  ["purchaseOrders", "school_finance_purchase_orders", "id, supplier_id, requisition_id, order_number, status, amount, ordered_on, expected_on, notes"],
  ["supplierInvoices", "school_finance_supplier_invoices", "id, supplier_id, purchase_order_id, invoice_number, amount, invoice_date, due_date, status, paid_amount"],
  ["pettyCash", "school_petty_cash_transactions", "id, transaction_type, amount, transaction_date, payee, category, description, voucher_number, received_by"],
  ["payroll", "school_payroll_summaries", "id, pay_period, staff_count, gross_pay, deductions, net_pay, payment_date, status, notes"],
] as const
const text = (max = 160) => z.string().trim().min(1).max(max)
const optionalText = (max = 160) => z.string().trim().max(max).nullable().optional()
const amount = z.number().positive().max(1000000000)
const optionalId = z.string().uuid().nullable().optional()
const recordSchemas = z.discriminatedUnion("action", [
  z.object({ action: z.literal("account"), name: text(120), accountType: z.enum(["bank", "cash", "mobile_money", "other"]), institution: optionalText(), accountReference: optionalText(80), openingBalance: z.number().min(0).max(1000000000) }).strict(),
  z.object({ action: z.literal("budget"), fiscalYear: text(20), period: text(40), category: text(120), allocatedAmount: z.number().min(0).max(1000000000), notes: optionalText(500) }).strict(),
  z.object({ action: z.literal("transaction"), transactionType: z.enum(["income", "expenditure"]), category: text(120), amount, transactionDate: z.string().date(), description: text(500), accountId: optionalId, reference: optionalText(120) }).strict(),
  z.object({ action: z.literal("grant"), grantType: z.enum(["FDSE", "FDDSE"]), amount, receivedOn: z.string().date(), reference: optionalText(120), notes: optionalText(500) }).strict(),
  z.object({ action: z.literal("requisition"), requisitionNumber: text(60), requestedBy: text(120), department: optionalText(120), category: text(120), amount, purpose: text(500) }).strict(),
  z.object({ action: z.literal("supplier"), name: text(160), contactPerson: optionalText(120), email: z.string().email().max(254).or(z.literal("")).nullable().optional(), phone: optionalText(40), taxPin: optionalText(40) }).strict(),
  z.object({ action: z.literal("purchaseOrder"), orderNumber: text(60), amount: z.number().min(0).max(1000000000), orderedOn: z.string().date(), expectedOn: z.string().date().nullable().optional(), supplierId: optionalId, requisitionId: optionalId, notes: optionalText(500) }).strict(),
  z.object({ action: z.literal("supplierInvoice"), invoiceNumber: text(60), amount, invoiceDate: z.string().date(), dueDate: z.string().date().nullable().optional(), supplierId: optionalId, purchaseOrderId: optionalId }).strict(),
  z.object({ action: z.literal("pettyCash"), transactionType: z.enum(["issue", "replenishment"]), amount, transactionDate: z.string().date(), payee: text(120), category: text(120), description: text(500), voucherNumber: optionalText(60), receivedBy: optionalText(120) }).strict(),
  z.object({ action: z.literal("payroll"), payPeriod: text(40), staffCount: z.number().int().min(0).max(10000), grossPay: z.number().min(0).max(1000000000), deductions: z.number().min(0).max(1000000000), netPay: z.number().min(0).max(1000000000), paymentDate: z.string().date().nullable().optional(), status: z.enum(["draft", "approved", "paid"]), notes: optionalText(500) }).strict(),
])

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (!FINANCE_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)
  if (!await canAccessModule(actor.role, "finance", "view")) return response({ error: "Access denied" }, 403)
  const db = getSupabaseAdmin()
  const results = await Promise.all(TABLES.map(([, table, columns]) => {
    const query = db.from(String(table)).select(String(columns)).eq("school_id", actor.schoolId).order("created_at", { ascending: false }).limit(500)
    return query as unknown as Promise<{ data: Record<string, unknown>[] | null; error: unknown }>
  }))
  const failed = results.find((result) => result.error)
  if (failed) return response({ error: "Unable to load school finance operations" }, 500)
  const records = Object.fromEntries(TABLES.map(([key], index) => [key, results[index].data ?? []])) as Record<string, Record<string, unknown>[]>
  const txns = records.transactions
  const accountTotals = new Map<string, number>()
  for (const account of records.accounts) accountTotals.set(String(account.id), Number(account.opening_balance ?? 0))
  for (const txn of txns) {
    const accountId = txn.account_id ? String(txn.account_id) : null
    if (!accountId || !accountTotals.has(accountId)) continue
    accountTotals.set(accountId, (accountTotals.get(accountId) ?? 0) + (txn.transaction_type === "income" ? 1 : -1) * Number(txn.amount ?? 0))
  }
  const income = txns.filter((txn) => txn.transaction_type === "income").reduce((sum, txn) => sum + Number(txn.amount ?? 0), 0)
  const expenditure = txns.filter((txn) => txn.transaction_type === "expenditure").reduce((sum, txn) => sum + Number(txn.amount ?? 0), 0)
  const budget = records.budgets.reduce((sum, item) => sum + Number(item.allocated_amount ?? 0), 0)
  const grants = records.grants.reduce((sum, item) => sum + Number(item.amount ?? 0), 0)
  const payroll = records.payroll.reduce((sum, item) => sum + Number(item.net_pay ?? 0), 0)
  const pendingApprovals = records.requisitions.filter((item) => item.status === "pending").length
  const unpaidInvoices = records.supplierInvoices.filter((item) => item.status !== "paid").reduce((sum, item) => sum + Math.max(0, Number(item.amount ?? 0) - Number(item.paid_amount ?? 0)), 0)
  const pettyCashBalance = records.pettyCash.reduce((sum, item) => sum + (item.transaction_type === "replenishment" ? 1 : -1) * Number(item.amount ?? 0), 0)
  return response({ ...records, summary: { income, expenditure, balance: income - expenditure, budget, grants, payroll, pendingApprovals, unpaidInvoices, pettyCashBalance, accountBalances: Object.fromEntries(accountTotals) } })
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (!FINANCE_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)
  if (!await canAccessModule(actor.role, "finance", "edit")) return response({ error: "Edit access denied" }, 403)
  let body: unknown
  try { body = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const parsed = recordSchemas.safeParse(body)
  if (!parsed.success) return response({ error: "Check the submitted finance details and try again" }, 400)
  const input = parsed.data
  const schoolId = actor.schoolId
  const db = getSupabaseAdmin()
  let table: string
  let row: Record<string, unknown>

  switch (input.action) {
    case "account": table = "school_finance_accounts"; row = { name: input.name, account_type: input.accountType, institution: input.institution || null, account_reference: input.accountReference || null, opening_balance: input.openingBalance }; break
    case "budget": table = "school_finance_budgets"; row = { fiscal_year: input.fiscalYear, period: input.period, category: input.category, allocated_amount: input.allocatedAmount, notes: input.notes || null }; break
    case "transaction": {
      if (input.accountId) {
        const { data: account } = await db.from("school_finance_accounts").select("id").eq("id", input.accountId).eq("school_id", schoolId).maybeSingle()
        if (!account) return response({ error: "Choose an account belonging to your school" }, 400)
      }
      table = "school_finance_transactions"; row = { transaction_type: input.transactionType, category: input.category, amount: input.amount, transaction_date: input.transactionDate, description: input.description, account_id: input.accountId || null, reference: input.reference || null }; break
    }
    case "grant": table = "school_capitation_grants"; row = { grant_type: input.grantType, amount: input.amount, received_on: input.receivedOn, reference: input.reference || null, notes: input.notes || null }; break
    case "requisition": table = "school_finance_requisitions"; row = { requisition_number: input.requisitionNumber, requested_by: input.requestedBy, department: input.department || null, category: input.category, amount: input.amount, purpose: input.purpose }; break
    case "supplier": table = "school_finance_suppliers"; row = { name: input.name, contact_person: input.contactPerson || null, email: input.email || null, phone: input.phone || null, tax_pin: input.taxPin || null }; break
    case "purchaseOrder": {
      if (input.supplierId) {
        const { data } = await db.from("school_finance_suppliers").select("id").eq("id", input.supplierId).eq("school_id", schoolId).maybeSingle()
        if (!data) return response({ error: "Choose a supplier belonging to your school" }, 400)
      }
      if (input.requisitionId) {
        const { data } = await db.from("school_finance_requisitions").select("id").eq("id", input.requisitionId).eq("school_id", schoolId).maybeSingle()
        if (!data) return response({ error: "Choose a requisition belonging to your school" }, 400)
      }
      table = "school_finance_purchase_orders"; row = { order_number: input.orderNumber, amount: input.amount, ordered_on: input.orderedOn, expected_on: input.expectedOn || null, supplier_id: input.supplierId || null, requisition_id: input.requisitionId || null, notes: input.notes || null }; break
    }
    case "supplierInvoice": {
      if (input.supplierId) {
        const { data } = await db.from("school_finance_suppliers").select("id").eq("id", input.supplierId).eq("school_id", schoolId).maybeSingle()
        if (!data) return response({ error: "Choose a supplier belonging to your school" }, 400)
      }
      if (input.purchaseOrderId) {
        const { data } = await db.from("school_finance_purchase_orders").select("id").eq("id", input.purchaseOrderId).eq("school_id", schoolId).maybeSingle()
        if (!data) return response({ error: "Choose a purchase order belonging to your school" }, 400)
      }
      table = "school_finance_supplier_invoices"; row = { invoice_number: input.invoiceNumber, amount: input.amount, invoice_date: input.invoiceDate, due_date: input.dueDate || null, supplier_id: input.supplierId || null, purchase_order_id: input.purchaseOrderId || null }; break
    }
    case "pettyCash": table = "school_petty_cash_transactions"; row = { transaction_type: input.transactionType, amount: input.amount, transaction_date: input.transactionDate, payee: input.payee, category: input.category, description: input.description, voucher_number: input.voucherNumber || null, received_by: input.receivedBy || null, issued_by: actor.id }; break
    case "payroll":
      if (Math.abs(input.grossPay - input.deductions - input.netPay) > 0.01) return response({ error: "Net pay must equal gross pay minus deductions" }, 400)
      table = "school_payroll_summaries"; row = { pay_period: input.payPeriod, staff_count: input.staffCount, gross_pay: input.grossPay, deductions: input.deductions, net_pay: input.netPay, payment_date: input.paymentDate || null, status: input.status, notes: input.notes || null }; break
  }
  const { data, error } = await db.from(table).insert({ ...row, school_id: schoolId, created_by: actor.id }).select("id").single()
  if (error || !data) return response({ error: "Unable to save this finance record. Check for duplicate reference numbers." }, 400)
  return response({ id: data.id }, 201)
}

export async function PATCH(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (!FINANCE_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)
  if (!await canAccessModule(actor.role, "finance", "edit")) return response({ error: "Edit access denied" }, 403)
  const schema = z.object({ action: z.literal("review"), id: z.string().uuid(), status: z.enum(["approved", "rejected"]), note: optionalText(500) }).strict()
  let body: unknown
  try { body = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return response({ error: "Invalid approval details" }, 400)
  const { id, status, note } = parsed.data
  const { data, error } = await getSupabaseAdmin().from("school_finance_requisitions").update({ status, reviewed_by: actor.id, reviewed_at: new Date().toISOString(), review_note: note || null }).eq("id", id).eq("school_id", actor.schoolId).eq("status", "pending").select("id").maybeSingle()
  if (error || !data) return response({ error: "This requisition could not be reviewed" }, 409)
  return response({ id: data.id })
}
