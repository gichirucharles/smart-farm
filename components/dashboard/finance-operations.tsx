"use client"

/* eslint-disable react/jsx-key -- DataTable wraps each generated cell value in its own keyed TableCell. */

import useSWR from "swr"
import Link from "next/link"
import { useState } from "react"
import { AccountantAccessPreview } from "@/components/dashboard/accountant-access-preview"
import { AlertCircle, ArrowDownLeft, ArrowUpRight, Banknote, BriefcaseBusiness, ClipboardList, FileText, LoaderCircle, RefreshCw, Wallet } from "lucide-react"
import { formatKSH } from "@/lib/currency"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type FinanceOperationsData = {
  accounts: Record<string, any>[]; budgets: Record<string, any>[]; transactions: Record<string, any>[]; grants: Record<string, any>[]
  requisitions: Record<string, any>[]; suppliers: Record<string, any>[]; purchaseOrders: Record<string, any>[]; supplierInvoices: Record<string, any>[]
  pettyCash: Record<string, any>[]; payroll: Record<string, any>[]
  summary: { income: number; expenditure: number; balance: number; budget: number; grants: number; payroll: number; pendingApprovals: number; unpaidInvoices: number; pettyCashBalance: number; accountBalances: Record<string, number> }
}

const fetchOperations = async (url: string): Promise<FinanceOperationsData> => {
  const response = await fetch(url, { cache: "no-store" })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || "Unable to load finance operations")
  return body
}
const money = (value: unknown) => formatKSH(Number(value ?? 0))
const date = (value: unknown) => value ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—"
const statusVariant = (status: string) => status === "approved" || status === "paid" || status === "received" ? "secondary" as const : status === "rejected" || status === "overdue" || status === "cancelled" ? "destructive" as const : "outline" as const
type EntryField = { name: string; label: string; number?: boolean; date?: boolean; optional?: boolean; defaultValue?: string; relation?: "account" | "supplier" | "requisition" | "purchaseOrder"; options?: readonly (readonly [string, string])[] }
type EntryType = { value: string; label: string; fields: readonly EntryField[] }
const entryTypes: EntryType[] = [
  { value: "account", label: "School account", fields: [{ name: "name", label: "Account name" }, { name: "accountType", label: "Account type", options: [["bank", "Bank"], ["cash", "Cash"], ["mobile_money", "Mobile money"], ["other", "Other"]] }, { name: "institution", label: "Bank / institution", optional: true }, { name: "accountReference", label: "Account reference", optional: true }, { name: "openingBalance", label: "Opening balance (KSh)", number: true }] },
  { value: "budget", label: "Budget line", fields: [{ name: "fiscalYear", label: "Fiscal year" }, { name: "period", label: "Period", defaultValue: "Annual" }, { name: "category", label: "Category" }, { name: "allocatedAmount", label: "Allocated amount (KSh)", number: true }, { name: "notes", label: "Notes", optional: true }] },
  { value: "transaction", label: "Income / expenditure", fields: [{ name: "transactionType", label: "Type", options: [["income", "Income"], ["expenditure", "Expenditure"]] }, { name: "category", label: "Category" }, { name: "amount", label: "Amount (KSh)", number: true }, { name: "transactionDate", label: "Date", date: true }, { name: "description", label: "Description" }, { name: "accountId", label: "Account", relation: "account", optional: true }, { name: "reference", label: "Reference", optional: true }] },
  { value: "grant", label: "Capitation grant", fields: [{ name: "grantType", label: "Grant", options: [["FDSE", "FDSE"], ["FDDSE", "FDDSE"]] }, { name: "amount", label: "Amount received (KSh)", number: true }, { name: "receivedOn", label: "Date received", date: true }, { name: "reference", label: "Reference", optional: true }, { name: "notes", label: "Notes", optional: true }] },
  { value: "requisition", label: "Requisition", fields: [{ name: "requisitionNumber", label: "Requisition number" }, { name: "requestedBy", label: "Requested by" }, { name: "department", label: "Department", optional: true }, { name: "category", label: "Category" }, { name: "amount", label: "Amount (KSh)", number: true }, { name: "purpose", label: "Purpose" }] },
  { value: "supplier", label: "Supplier", fields: [{ name: "name", label: "Supplier name" }, { name: "contactPerson", label: "Contact person", optional: true }, { name: "email", label: "Email", optional: true }, { name: "phone", label: "Phone", optional: true }, { name: "taxPin", label: "KRA PIN", optional: true }] },
  { value: "purchaseOrder", label: "Purchase order", fields: [{ name: "orderNumber", label: "Order number" }, { name: "amount", label: "Amount (KSh)", number: true }, { name: "orderedOn", label: "Order date", date: true }, { name: "expectedOn", label: "Expected date", date: true, optional: true }, { name: "supplierId", label: "Supplier", relation: "supplier", optional: true }, { name: "requisitionId", label: "Requisition", relation: "requisition", optional: true }, { name: "notes", label: "Notes", optional: true }] },
  { value: "supplierInvoice", label: "Supplier invoice", fields: [{ name: "invoiceNumber", label: "Invoice number" }, { name: "amount", label: "Amount (KSh)", number: true }, { name: "invoiceDate", label: "Invoice date", date: true }, { name: "dueDate", label: "Due date", date: true, optional: true }, { name: "supplierId", label: "Supplier", relation: "supplier", optional: true }, { name: "purchaseOrderId", label: "Purchase order", relation: "purchaseOrder", optional: true }] },
  { value: "pettyCash", label: "Petty cash voucher", fields: [{ name: "transactionType", label: "Entry type", options: [["issue", "Cash issued"], ["replenishment", "Replenishment"]] }, { name: "amount", label: "Amount (KSh)", number: true }, { name: "transactionDate", label: "Date", date: true }, { name: "payee", label: "Payee" }, { name: "category", label: "Category" }, { name: "description", label: "Description" }, { name: "voucherNumber", label: "Voucher number", optional: true }, { name: "receivedBy", label: "Received by", optional: true }] },
  { value: "payroll", label: "Payroll summary", fields: [{ name: "payPeriod", label: "Pay period" }, { name: "staffCount", label: "Staff count", number: true }, { name: "grossPay", label: "Gross pay (KSh)", number: true }, { name: "deductions", label: "Deductions (KSh)", number: true }, { name: "netPay", label: "Net pay (KSh)", number: true }, { name: "paymentDate", label: "Payment date", date: true, optional: true }, { name: "status", label: "Status", options: [["draft", "Draft"], ["approved", "Approved"], ["paid", "Paid"]] }, { name: "notes", label: "Notes", optional: true }] },
]

export function FinanceOperations({ lockedPreview = false }: { lockedPreview?: boolean }) {
  const { data, error, isLoading, mutate } = useSWR<FinanceOperationsData>("/api/finance/operations", fetchOperations)
  if (isLoading) return <div className="flex min-h-40 items-center justify-center text-muted-foreground"><LoaderCircle className="mr-2 size-4 animate-spin" />Loading school accounts and finance operations…</div>
  if (error && lockedPreview && error.message === "Authentication required") return <AccountantAccessPreview mode="operations" />
  if (error) return <Alert variant="destructive"><AlertCircle className="size-4" /><AlertDescription className="flex flex-wrap items-center justify-between gap-3"><span>{error.message}</span><div className="flex flex-wrap gap-2">{error.message === "Authentication required" && <Button asChild variant="outline" size="sm"><Link href="/login/accountant">Sign in as accountant</Link></Button>}<Button variant="outline" size="sm" onClick={() => void mutate()}><RefreshCw data-icon="inline-start" />Retry</Button></div></AlertDescription></Alert>
  if (!data) return null

  const actualByCategory = new Map<string, number>()
  data.transactions.filter((item) => item.transaction_type === "expenditure").forEach((item) => actualByCategory.set(item.category, (actualByCategory.get(item.category) ?? 0) + Number(item.amount)))
  const supplierName = (id: string | null) => data.suppliers.find((item) => item.id === id)?.name ?? "Supplier not linked"

  return <section id="finance-operations" className="flex scroll-mt-6 flex-col gap-5" aria-labelledby="finance-operations-title">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 id="finance-operations-title" className="text-xl font-semibold tracking-tight">School finance operations</h2><p className="mt-1 text-sm text-muted-foreground">Accounts, public grants, budget control, procurement, petty cash, and payroll summaries.</p></div><div className="flex gap-2"><NewFinanceEntry refresh={() => void mutate()} accounts={data.accounts} suppliers={data.suppliers} requisitions={data.requisitions} purchaseOrders={data.purchaseOrders} /><Button variant="outline" size="sm" onClick={() => void mutate()}><RefreshCw data-icon="inline-start" />Refresh</Button></div></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric title="Income recorded" value={money(data.summary.income)} note="All recorded income" icon={<ArrowDownLeft />} />
      <Metric title="Expenditure recorded" value={money(data.summary.expenditure)} note="All recorded expenditure" icon={<ArrowUpRight />} />
      <Metric title="Budget allocated" value={money(data.summary.budget)} note={`${data.budgets.length} budget lines`} icon={<BriefcaseBusiness />} />
      <Metric title="Awaiting approval" value={String(data.summary.pendingApprovals)} note={`Supplier invoices due: ${money(data.summary.unpaidInvoices)}`} icon={<ClipboardList />} />
    </div>
    <Tabs defaultValue="accounts">
      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 md:grid-cols-5 xl:grid-cols-9">
        <TabsTrigger value="accounts">Accounts</TabsTrigger><TabsTrigger value="budgets">Budgets</TabsTrigger><TabsTrigger value="grants">Grants</TabsTrigger><TabsTrigger value="approvals">Requisitions</TabsTrigger><TabsTrigger value="procurement">Procurement</TabsTrigger><TabsTrigger value="petty-cash">Petty cash</TabsTrigger><TabsTrigger value="payroll">Payroll</TabsTrigger><TabsTrigger value="income">Income &amp; expense</TabsTrigger><TabsTrigger value="summary">Summary</TabsTrigger>
      </TabsList>
      <TabsContent value="accounts" className="pt-4"><Card><CardHeader><CardTitle>School accounts</CardTitle><CardDescription>Current balances are calculated from the opening balance and recorded transactions.</CardDescription></CardHeader><CardContent><DataTable headers={["Account", "Type", "Institution", "Reference", "Balance"]} rows={data.accounts.map((account) => [<span className="font-medium">{account.name}</span>, <Badge variant="outline" className="capitalize">{String(account.account_type).replaceAll("_", " ")}</Badge>, account.institution || "—", account.account_reference || "—", <span className="font-medium">{money(data.summary.accountBalances[String(account.id)])}</span>])} empty="No school accounts have been added yet." /></CardContent></Card></TabsContent>
      <TabsContent value="budgets" className="pt-4"><Card><CardHeader><CardTitle>Budgets vs actuals</CardTitle><CardDescription>Actuals use recorded expenditure transactions matched to each budget category.</CardDescription></CardHeader><CardContent><DataTable headers={["Fiscal year", "Period", "Category", "Allocated", "Actual", "Remaining", "Used"]} rows={data.budgets.map((budget) => { const allocated = Number(budget.allocated_amount); const actual = actualByCategory.get(budget.category) ?? 0; const percent = allocated ? Math.min(100, Math.round(actual / allocated * 100)) : 0; return [budget.fiscal_year, budget.period, <span className="font-medium">{budget.category}</span>, money(allocated), money(actual), money(Math.max(0, allocated - actual)), <div className="flex min-w-24 items-center gap-2"><Progress value={percent} aria-label={`${percent}% of budget used`} className="h-2" /><span className="text-xs tabular-nums">{percent}%</span></div>] })} empty="No budgets are recorded for this school." /></CardContent></Card></TabsContent>
      <TabsContent value="grants" className="pt-4"><div className="grid gap-4 md:grid-cols-2"><GrantCard title="FDSE received" records={data.grants.filter((grant) => grant.grant_type === "FDSE")} /><GrantCard title="FDDSE received" records={data.grants.filter((grant) => grant.grant_type === "FDDSE")} /></div><Card className="mt-4"><CardHeader><CardTitle>Capitation grant history</CardTitle><CardDescription>Public-school grant amounts, receipt dates, and references.</CardDescription></CardHeader><CardContent><DataTable headers={["Grant", "Amount", "Received", "Reference", "Notes"]} rows={data.grants.map((grant) => [<Badge variant="secondary">{grant.grant_type}</Badge>, money(grant.amount), date(grant.received_on), grant.reference || "—", grant.notes || "—"])} empty="No FDSE or FDDSE receipts have been recorded." /></CardContent></Card></TabsContent>
      <TabsContent value="approvals" className="pt-4"><Card><CardHeader><CardTitle>Requisitions &amp; approvals</CardTitle><CardDescription>Requests awaiting review and decisions already recorded.</CardDescription></CardHeader><CardContent><DataTable headers={["Request", "Requested by", "Department", "Purpose", "Amount", "Date", "Status", "Review"]} rows={data.requisitions.map((request) => [<span className="font-medium">{request.requisition_number}</span>, request.requested_by, request.department || "—", request.purpose, money(request.amount), date(request.requested_on), <Badge variant={statusVariant(request.status)} className="capitalize">{request.status}</Badge>, request.status === "pending" ? <ReviewRequest id={String(request.id)} refresh={() => void mutate()} /> : request.review_note || "—"]) } empty="No requisitions have been submitted." /></CardContent></Card></TabsContent>
      <TabsContent value="procurement" className="flex flex-col gap-4 pt-4"><Card><CardHeader><CardTitle>Suppliers &amp; purchase orders</CardTitle><CardDescription>Registered vendors and procurement order status.</CardDescription></CardHeader><CardContent><DataTable headers={["Supplier", "Contact", "Phone", "Email"]} rows={data.suppliers.map((supplier) => [<span className="font-medium">{supplier.name}</span>, supplier.contact_person || "—", supplier.phone || "—", supplier.email || "—"])} empty="No suppliers are recorded." /><div className="mt-6"><h3 className="mb-3 font-medium">Purchase orders</h3><DataTable headers={["Order", "Supplier", "Amount", "Ordered", "Expected", "Status"]} rows={data.purchaseOrders.map((order) => [<span className="font-medium">{order.order_number}</span>, supplierName(order.supplier_id), money(order.amount), date(order.ordered_on), date(order.expected_on), <Badge variant={statusVariant(order.status)} className="capitalize">{String(order.status).replaceAll("_", " ")}</Badge>])} empty="No purchase orders are recorded." /></div><div className="mt-6"><h3 className="mb-3 font-medium">Supplier invoices</h3><DataTable headers={["Invoice", "Supplier", "Amount", "Paid", "Due date", "Status"]} rows={data.supplierInvoices.map((invoice) => [<span className="font-medium">{invoice.invoice_number}</span>, supplierName(invoice.supplier_id), money(invoice.amount), money(invoice.paid_amount), date(invoice.due_date), <Badge variant={statusVariant(invoice.status)} className="capitalize">{invoice.status}</Badge>])} empty="No supplier invoices are recorded." /></div></CardContent></Card></TabsContent>
      <TabsContent value="petty-cash" className="pt-4"><Card><CardHeader><CardTitle>Petty cash</CardTitle><CardDescription>Voucher activity and current ledger balance.</CardDescription></CardHeader><CardContent><div className="mb-4 rounded-lg border p-4"><p className="text-sm text-muted-foreground">Calculated petty cash balance</p><p className="mt-1 text-2xl font-semibold tabular-nums">{money(data.summary.pettyCashBalance)}</p></div><DataTable headers={["Date", "Voucher", "Payee", "Category", "Description", "Type", "Amount"]} rows={data.pettyCash.map((item) => [date(item.transaction_date), item.voucher_number || "—", item.payee, item.category, item.description, <Badge variant="outline" className="capitalize">{item.transaction_type}</Badge>, money(item.amount)])} empty="No petty cash vouchers are recorded." /></CardContent></Card></TabsContent>
      <TabsContent value="payroll" className="pt-4"><Card><CardHeader><CardTitle>Payroll summary</CardTitle><CardDescription>Period totals only; individual staff salary details are not shown here.</CardDescription></CardHeader><CardContent><DataTable headers={["Pay period", "Staff", "Gross pay", "Deductions", "Net pay", "Payment date", "Status"]} rows={data.payroll.map((item) => [<span className="font-medium">{item.pay_period}</span>, item.staff_count, money(item.gross_pay), money(item.deductions), money(item.net_pay), date(item.payment_date), <Badge variant={statusVariant(item.status)} className="capitalize">{item.status}</Badge>])} empty="No payroll summaries are recorded." /></CardContent></Card></TabsContent>
      <TabsContent value="income" className="pt-4"><Card><CardHeader><CardTitle>Income &amp; expenditure ledger</CardTitle><CardDescription>Recorded transactions across school accounts.</CardDescription></CardHeader><CardContent><DataTable headers={["Date", "Type", "Category", "Description", "Account", "Reference", "Amount"]} rows={data.transactions.map((item) => [date(item.transaction_date), <Badge variant={item.transaction_type === "income" ? "secondary" : "outline"} className="capitalize">{item.transaction_type}</Badge>, item.category, item.description, data.accounts.find((account) => account.id === item.account_id)?.name ?? "Unassigned", item.reference || "—", money(item.amount)])} empty="No income or expenditure transactions have been recorded." /></CardContent></Card></TabsContent>
      <TabsContent value="summary" className="pt-4"><Card><CardHeader><CardTitle>School financial position</CardTitle><CardDescription>Live totals based on the records currently entered for this school.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><SummaryItem label="Income" value={money(data.summary.income)} icon={<ArrowDownLeft />} /><SummaryItem label="Expenditure" value={money(data.summary.expenditure)} icon={<ArrowUpRight />} /><SummaryItem label="Net operating balance" value={money(data.summary.balance)} icon={<Banknote />} /><SummaryItem label="Capitation grants received" value={money(data.summary.grants)} icon={<FileText />} /><SummaryItem label="Payroll net total" value={money(data.summary.payroll)} icon={<BriefcaseBusiness />} /><SummaryItem label="Petty cash balance" value={money(data.summary.pettyCashBalance)} icon={<Wallet />} /></CardContent></Card></TabsContent>
    </Tabs>
    <p className="text-xs leading-relaxed text-muted-foreground">Figures reflect recorded entries only. Accounts, budgets, grant receipts, procurement, vouchers, and payroll summaries must be entered and reconciled against the school&apos;s source documents.</p>
  </section>
}

function NewFinanceEntry({ refresh, accounts, suppliers, requisitions, purchaseOrders }: { refresh: () => void; accounts: Record<string, any>[]; suppliers: Record<string, any>[]; requisitions: Record<string, any>[]; purchaseOrders: Record<string, any>[] }) {
  const [open, setOpen] = useState(false)
  const [entryType, setEntryType] = useState("transaction")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const selected = entryTypes.find((item) => item.value === entryType) ?? entryTypes[0]

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")
    const form = new FormData(event.currentTarget)
    const payload: Record<string, unknown> = { action: entryType }
    selected.fields.forEach((field) => {
      const value = String(form.get(field.name) ?? "").trim()
      if (value === "" && field.optional) return
      payload[field.name] = field.number ? Number(value) : value
    })
    try {
      const response = await fetch("/api/finance/operations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Could not save the record")
      setOpen(false)
      refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the record")
    } finally {
      setSaving(false)
    }
  }

  return <div className="relative">
    <Button size="sm" onClick={() => { setError(""); setOpen((value) => !value) }}>{open ? "Close" : "Add finance entry"}</Button>
    {open && <div className="absolute right-0 top-11 z-50 w-[min(92vw,38rem)] rounded-xl border bg-background p-4 shadow-xl sm:p-5" role="dialog" aria-labelledby="new-finance-entry-title" aria-modal="false">
      <div className="mb-4"><h3 id="new-finance-entry-title" className="font-semibold">Add finance record</h3><p className="text-sm text-muted-foreground">New entries are saved to this school&apos;s finance ledger.</p></div>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="grid gap-1.5 text-sm font-medium">Record type<select value={entryType} onChange={(event) => { setEntryType(event.target.value); setError("") }} className="h-10 rounded-md border bg-background px-3 font-normal" aria-label="Record type">{entryTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <div className="grid max-h-[55vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">{selected.fields.map((field) => {
          const related = field.relation === "account" ? accounts.map((item) => [String(item.id), String(item.name)] as const) : field.relation === "supplier" ? suppliers.map((item) => [String(item.id), String(item.name)] as const) : field.relation === "requisition" ? requisitions.map((item) => [String(item.id), String(item.requisition_number)] as const) : field.relation === "purchaseOrder" ? purchaseOrders.map((item) => [String(item.id), String(item.order_number)] as const) : []
          const choices = field.options ?? (field.relation ? related : undefined)
          return <label key={field.name} className="grid gap-1.5 text-sm font-medium">{field.label}{choices ? <select name={field.name} required={!field.optional} defaultValue="" className="h-10 rounded-md border bg-background px-3 font-normal"><option value="">{field.optional ? "Not linked" : "Select…"}</option>{choices.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select> : <input name={field.name} type={field.date ? "date" : field.number ? "number" : "text"} step={field.number ? "0.01" : undefined} min={field.number ? "0" : undefined} required={!field.optional} defaultValue={field.defaultValue ?? (field.date && !field.optional ? new Date().toISOString().slice(0, 10) : undefined)} className="h-10 rounded-md border bg-background px-3 font-normal" />}</label>
        })}</div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save entry"}</Button></div>
      </form>
    </div>}
  </div>
}

function ReviewRequest({ id, refresh }: { id: string; refresh: () => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  async function review(status: "approved" | "rejected") {
    setBusy(true)
    setError("")
    try {
      const response = await fetch("/api/finance/operations", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "review", id, status }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to review requisition")
      refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to review requisition")
    } finally {
      setBusy(false)
    }
  }
  return <div className="flex min-w-40 flex-wrap items-center gap-1"><Button size="sm" variant="outline" disabled={busy} onClick={() => void review("approved")}>Approve</Button><Button size="sm" variant="ghost" disabled={busy} onClick={() => void review("rejected")}>Reject</Button>{error && <span role="alert" className="basis-full text-xs text-destructive">{error}</span>}</div>
}

function Metric({ title, value, note, icon }: { title: string; value: string; note: string; icon: React.ReactNode }) {
  return <Card><CardHeader className="flex-row items-center justify-between gap-2 pb-2"><CardDescription>{title}</CardDescription><span className="text-muted-foreground">{icon}</span></CardHeader><CardContent><p className="text-2xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></CardContent></Card>
}
function GrantCard({ title, records }: { title: string; records: Record<string, any>[] }) {
  const amount = records.reduce((sum, record) => sum + Number(record.amount ?? 0), 0)
  return <Card><CardHeader><CardDescription>{title}</CardDescription><CardTitle className="text-2xl tabular-nums">{money(amount)}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{records.length} receipt{records.length === 1 ? "" : "s"} recorded</p>{records.slice(0, 2).map((grant) => <p key={grant.id} className="mt-2 flex justify-between gap-3 border-t pt-2 text-sm"><span>{date(grant.received_on)}</span><span className="font-medium">{money(grant.amount)}</span></p>)}</CardContent></Card>
}
function SummaryItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-3 rounded-lg border p-4"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold tabular-nums">{value}</p></div><span className="text-muted-foreground">{icon}</span></div>
}
function DataTable({ headers, rows, empty }: { headers: string[]; rows: React.ReactNode[][]; empty: string }) {
  return <div className="overflow-x-auto"><Table><TableHeader><TableRow>{headers.map((header) => <TableHead key={header}>{header}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map((row, rowIndex) => <TableRow key={rowIndex}>{row.map((cell, cellIndex) => <TableCell key={cellIndex} className="min-w-24">{cell}</TableCell>)}</TableRow>)}{rows.length === 0 && <TableRow><TableCell colSpan={headers.length} className="h-24 text-center text-muted-foreground">{empty}</TableCell></TableRow>}</TableBody></Table></div>
}
