import { NextResponse } from "next/server"
import { getSessionActor } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

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

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (!FINANCE_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)

  const db = getSupabaseAdmin()
  const results = await Promise.all(TABLES.map(([, table, columns]) =>
    db.from(table).select(columns).eq("school_id", actor.schoolId).order("created_at", { ascending: false }).limit(500),
  ))
  const failed = results.find((result) => result.error)
  if (failed) return response({ error: "Unable to load school finance operations" }, 500)

  const records = Object.fromEntries(TABLES.map(([key], index) => [key, results[index].data ?? []])) as Record<string, Record<string, unknown>[]>
  const txns = records.transactions
  const accountTotals = new Map<string, number>()
  for (const account of records.accounts) accountTotals.set(String(account.id), Number(account.opening_balance ?? 0))
  for (const txn of txns) {
    const accountId = txn.account_id ? String(txn.account_id) : null
    if (!accountId || !accountTotals.has(accountId)) continue
    const sign = txn.transaction_type === "income" ? 1 : -1
    accountTotals.set(accountId, (accountTotals.get(accountId) ?? 0) + sign * Number(txn.amount ?? 0))
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
