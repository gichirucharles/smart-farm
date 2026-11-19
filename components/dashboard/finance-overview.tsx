"use client"

import { useMemo, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import useSWR from "swr"
import { formatKSH } from "@/lib/currency"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, ArrowDownLeft, BadgeCheck, CircleDollarSign, FileText, LoaderCircle, Plus, RefreshCw, Search, Wallet } from "lucide-react"

type FinanceData = {
  classes: { id: string; name: string }[]
  students: { id: string; student_id: string; first_name: string; last_name: string; className: string; studentCategory: string }[]
  schedules: { id: string; class_id: string; term: string; academic_year: string; student_category: string; name: string; amount: number; due_date: string | null; is_active: boolean }[]
  invoices: { id: string; invoice_number: string; student_id: string; studentName: string; admissionNumber: string; className: string; term: string; academic_year: string; issued_on: string; due_date: string | null; status: string; total: number; paid: number; balance: number; isOverdue: boolean; payments: { id: string; amount: number; payment_method: string; reference: string | null; receipt_number: string; paid_at: string }[] }[]
  payments: { id: string; invoice_id: string; amount: number; payment_method: string; reference: string | null; receipt_number: string; paid_at: string }[]
  adjustments: { id: string; invoice_id: string; adjustment_type: string; amount: number; reason: string; status: string; created_at: string }[]
  summary: { invoiced: number; collected: number; outstanding: number; overdue: number; invoiceCount: number }
}
const fetcher = async (url: string): Promise<FinanceData> => {
  const response = await fetch(url, { cache: "no-store" })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || "Unable to load finance records")
  return data
}

export function FinanceOverview() {
  const { data, error, isLoading, mutate } = useSWR<FinanceData>("/api/finance", fetcher)
  const [activeTab, setActiveTab] = useState("overview")
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState(false)
  const [classId, setClassId] = useState("")
  const [studentCategory, setStudentCategory] = useState("day")
  const [adjustmentInvoice, setAdjustmentInvoice] = useState("")
  const filteredInvoices = useMemo(() => (data?.invoices ?? []).filter((invoice) => `${invoice.studentName} ${invoice.admissionNumber} ${invoice.invoice_number}`.toLowerCase().includes(search.toLowerCase())), [data?.invoices, search])
  const className = (id: string) => data?.classes.find((schoolClass) => schoolClass.id === id)?.name ?? "Class"

  async function submitForm(event: FormEvent<HTMLFormElement>, action: "create_schedule" | "adjustment") {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const payload = action === "create_schedule" ? { action, classId, term: form.get("term"), academicYear: form.get("academicYear"), studentCategory, name: form.get("name"), amount: Number(form.get("amount")), dueDate: form.get("dueDate") || null } : { action, invoiceId: adjustmentInvoice, adjustmentType: form.get("adjustmentType"), amount: Number(form.get("amount")), reason: form.get("reason") }
    setSaving(true)
    try {
      const response = await fetch("/api/finance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to save finance record")
      toast({ title: action === "create_schedule" ? "Fee schedule saved" : "Credit adjustment applied" })
      formElement.reset()
      await mutate()
    } catch (submitError) {
      toast({ title: "Unable to save finance record", description: submitError instanceof Error ? submitError.message : "Please try again.", variant: "destructive" })
    } finally { setSaving(false) }
  }

  if (isLoading) return <div className="flex min-h-48 items-center justify-center text-muted-foreground"><LoaderCircle className="mr-2 size-4 animate-spin" />Loading school finance…</div>
  if (error) return <Alert variant="destructive"><AlertCircle className="size-4" /><AlertDescription className="flex items-center justify-between gap-4">{error.message}<Button variant="outline" size="sm" onClick={() => void mutate()}><RefreshCw data-icon="inline-start" />Retry</Button></AlertDescription></Alert>
  if (!data) return null

  return <section className="flex flex-col gap-5">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric title="Collected" value={data.summary.collected} icon={<ArrowDownLeft />} note={`${data.payments.length} recorded payments`} /><Metric title="Outstanding" value={data.summary.outstanding} icon={<Wallet />} note={`${data.summary.overdue} overdue invoices`} alert={data.summary.overdue > 0} /><Metric title="Invoiced" value={data.summary.invoiced} icon={<FileText />} note={`${data.summary.invoiceCount} issued invoices`} /><Card><CardHeader className="pb-2"><CardDescription>Collection rate</CardDescription><CardTitle className="text-2xl">{data.summary.invoiced ? `${Math.round(data.summary.collected / data.summary.invoiced * 100)}%` : "—"}</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Based on recorded invoices and payments</p></CardContent></Card></div>
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-5"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="invoices">Invoices & arrears</TabsTrigger><TabsTrigger value="payments">Payments & receipts</TabsTrigger><TabsTrigger value="fees">Fee schedules</TabsTrigger><TabsTrigger value="support">Bursaries & waivers</TabsTrigger></TabsList>
      <TabsContent value="overview" className="flex flex-col gap-4 pt-4"><Card><CardHeader><CardTitle>Collection pulse</CardTitle><CardDescription>Live totals from this school&apos;s issued invoices and receipt ledger.</CardDescription></CardHeader><CardContent className="grid gap-6 md:grid-cols-[1fr_1.3fr]"><div className="flex flex-col gap-3 rounded-lg border p-4"><p className="text-sm font-medium">Outstanding balance</p><p className="text-3xl font-semibold">{formatKSH(data.summary.outstanding)}</p><p className="text-sm text-muted-foreground">Across {data.invoices.filter((invoice) => invoice.balance > 0).length} unpaid invoices</p><Button variant="outline" className="mt-1 w-fit" onClick={() => setActiveTab("invoices")}>Review arrears</Button></div><div className="flex flex-col gap-3"><div className="flex items-center justify-between"><h3 className="font-medium">Recent receipts</h3><Button variant="ghost" size="sm" onClick={() => setActiveTab("payments")}>View all</Button></div>{data.payments.slice(0, 4).map((payment) => { const invoice = data.invoices.find((entry) => entry.id === payment.invoice_id); return <div key={payment.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0"><div className="min-w-0"><p className="truncate text-sm font-medium">{invoice?.studentName ?? "Student"}</p><p className="text-xs text-muted-foreground">{payment.receipt_number} · {payment.payment_method}{payment.reference ? ` · ${payment.reference}` : ""}</p></div><p className="shrink-0 text-sm font-semibold">{formatKSH(Number(payment.amount))}</p></div> })}{!data.payments.length && <p className="text-sm text-muted-foreground">No payments recorded yet.</p>}</div></CardContent></Card><Card><CardHeader><CardTitle>Students with overdue balances</CardTitle><CardDescription>Review overdue invoices and follow up with guardians.</CardDescription></CardHeader><CardContent><InvoiceTable invoices={data.invoices.filter((invoice) => invoice.isOverdue).slice(0, 6)} /></CardContent></Card></TabsContent>
      <TabsContent value="invoices" className="pt-4"><Card><CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Invoices & arrears</CardTitle><CardDescription>Search by learner, admission number, or invoice number.</CardDescription></div><div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input className="pl-9" aria-label="Search invoices" placeholder="Search invoices" value={search} onChange={(event) => setSearch(event.target.value)} /></div></div></CardHeader><CardContent><InvoiceTable invoices={filteredInvoices} /></CardContent></Card></TabsContent>
      <TabsContent value="payments" className="pt-4"><Card><CardHeader><CardTitle>Payments & receipts</CardTitle><CardDescription>Recorded payment channels, transaction references, and receipt numbers.</CardDescription></CardHeader><CardContent><PaymentTable data={data} /></CardContent></Card></TabsContent>
      <TabsContent value="fees" className="flex flex-col gap-4 pt-4"><Card><CardHeader><CardTitle>Create fee schedule</CardTitle><CardDescription>Define charges by class, term, year, and day or boarding category.</CardDescription></CardHeader><CardContent><form className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" onSubmit={(event) => void submitForm(event, "create_schedule")}><div className="flex flex-col gap-2"><Label htmlFor="schedule-class">Class</Label><Select value={classId} onValueChange={setClassId} required><SelectTrigger id="schedule-class"><SelectValue placeholder="Choose class" /></SelectTrigger><SelectContent>{data.classes.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div><Field label="Fee name" name="name" placeholder="Tuition" required /><Field label="Academic year" name="academicYear" placeholder="2026" required /><Field label="Term" name="term" placeholder="Term 1" required /><div className="flex flex-col gap-2"><Label htmlFor="fee-category">Student category</Label><Select value={studentCategory} onValueChange={setStudentCategory}><SelectTrigger id="fee-category"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="day">Day</SelectItem><SelectItem value="boarding">Boarding</SelectItem></SelectContent></Select></div><Field label="Amount (KSh)" name="amount" type="number" min="0.01" step="0.01" required /><Field label="Due date" name="dueDate" type="date" /><div className="flex items-end"><Button type="submit" disabled={saving || !classId}>{saving ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : <Plus data-icon="inline-start" />}Save fee schedule</Button></div></form></CardContent></Card><Card><CardHeader><CardTitle>Active fee schedules</CardTitle><CardDescription>{data.schedules.length} schedules recorded.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Fee item</TableHead><TableHead>Class</TableHead><TableHead>Term / year</TableHead><TableHead>Category</TableHead><TableHead>Due date</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader><TableBody>{data.schedules.map((schedule) => <TableRow key={schedule.id}><TableCell className="font-medium">{schedule.name}</TableCell><TableCell>{className(schedule.class_id)}</TableCell><TableCell>{schedule.term} · {schedule.academic_year}</TableCell><TableCell><Badge variant="outline" className="capitalize">{schedule.student_category}</Badge></TableCell><TableCell>{schedule.due_date || "—"}</TableCell><TableCell className="text-right">{formatKSH(Number(schedule.amount))}</TableCell></TableRow>)}{!data.schedules.length && <EmptyRow columns={6} text="No fee schedules yet." />}</TableBody></Table></div></CardContent></Card></TabsContent>
      <TabsContent value="support" className="flex flex-col gap-4 pt-4"><Card><CardHeader><CardTitle>Apply bursary, scholarship, discount, or waiver</CardTitle><CardDescription>Credits are recorded against an issued invoice and capped at its remaining balance.</CardDescription></CardHeader><CardContent><form className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" onSubmit={(event) => void submitForm(event, "adjustment")}><div className="flex flex-col gap-2 sm:col-span-2"><Label htmlFor="adjustment-invoice">Invoice</Label><Select value={adjustmentInvoice} onValueChange={setAdjustmentInvoice} required><SelectTrigger id="adjustment-invoice"><SelectValue placeholder="Choose an invoice with a balance" /></SelectTrigger><SelectContent>{data.invoices.filter((invoice) => invoice.balance > 0).map((invoice) => <SelectItem key={invoice.id} value={invoice.id}>{invoice.invoice_number} · {invoice.studentName} · {formatKSH(invoice.balance)} due</SelectItem>)}</SelectContent></Select></div><div className="flex flex-col gap-2"><Label htmlFor="adjustment-type">Credit type</Label><Select name="adjustmentType" defaultValue="bursary"><SelectTrigger id="adjustment-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="bursary">Bursary</SelectItem><SelectItem value="scholarship">Scholarship</SelectItem><SelectItem value="discount">Discount</SelectItem><SelectItem value="waiver">Waiver</SelectItem></SelectContent></Select></div><Field label="Amount (KSh)" name="amount" type="number" min="0.01" step="0.01" required /><div className="flex flex-col gap-2 sm:col-span-2"><Label htmlFor="adjustment-reason">Reason</Label><Input id="adjustment-reason" name="reason" maxLength={500} required placeholder="Document why this credit is being applied" /></div><div className="flex items-end"><Button type="submit" disabled={saving || !adjustmentInvoice}>{saving ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : <BadgeCheck data-icon="inline-start" />}Apply credit</Button></div></form></CardContent></Card><Card><CardHeader><CardTitle>Recent student credits</CardTitle><CardDescription>Approved adjustments on school invoices.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Invoice</TableHead><TableHead>Reason</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader><TableBody>{data.adjustments.map((item) => <TableRow key={item.id}><TableCell><Badge variant="secondary" className="capitalize">{item.adjustment_type}</Badge></TableCell><TableCell>{data.invoices.find((invoice) => invoice.id === item.invoice_id)?.invoice_number ?? "Invoice"}</TableCell><TableCell>{item.reason}</TableCell><TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell><TableCell className="text-right">{formatKSH(Number(item.amount))}</TableCell></TableRow>)}{!data.adjustments.length && <EmptyRow columns={5} text="No student credits recorded." />}</TableBody></Table></div></CardContent></Card></TabsContent>
    </Tabs>
  </section>
}

export function ParentFinance() {
  const { data, error, isLoading, mutate } = useSWR<FinanceData>("/api/finance", fetcher)
  if (isLoading) return <div className="flex min-h-32 items-center justify-center text-muted-foreground"><LoaderCircle className="mr-2 size-4 animate-spin" />Loading fee records…</div>
  if (error) return <Alert variant="destructive"><AlertCircle className="size-4" /><AlertDescription className="flex items-center justify-between gap-4">{error.message}<Button variant="outline" size="sm" onClick={() => void mutate()}>Retry</Button></AlertDescription></Alert>
  if (!data) return null
  const balance = data.invoices.reduce((sum, invoice) => sum + invoice.balance, 0)
  const paid = data.invoices.reduce((sum, invoice) => sum + invoice.paid, 0)
  return <div className="flex flex-col gap-4"><div className="grid gap-3 sm:grid-cols-3"><Metric title="Outstanding balance" value={balance} icon={<Wallet />} note="Across linked student accounts" alert={balance > 0} /><Metric title="Total paid" value={paid} icon={<ArrowDownLeft />} note="School-recorded payments" /><Metric title="Invoices" value={data.invoices.length} icon={<FileText />} note={`${data.invoices.filter((invoice) => invoice.isOverdue).length} overdue`} /></div><Card><CardHeader><CardTitle>Fee balances</CardTitle><CardDescription>Invoices for students linked to your guardian account.</CardDescription></CardHeader><CardContent><InvoiceTable invoices={data.invoices} /></CardContent></Card><Card><CardHeader><CardTitle>Payment receipts</CardTitle><CardDescription>School-recorded payment channels and references.</CardDescription></CardHeader><CardContent><PaymentTable data={data} /></CardContent></Card></div>
}

function Metric({ title, value, icon, note, alert = false }: { title: string; value: number; icon: ReactNode; note: string; alert?: boolean }) {
  return <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardDescription>{title}</CardDescription><span className={alert ? "text-destructive" : "text-muted-foreground"}>{icon}</span></CardHeader><CardContent><p className="text-2xl font-semibold">{formatKSH(value)}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></CardContent></Card>
}
function InvoiceTable({ invoices }: { invoices: FinanceData["invoices"] }) {
  return <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Student</TableHead><TableHead>Class</TableHead><TableHead>Due date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Invoiced</TableHead><TableHead className="text-right">Balance</TableHead></TableRow></TableHeader><TableBody>{invoices.map((invoice) => <TableRow key={invoice.id}><TableCell className="font-medium">{invoice.invoice_number}</TableCell><TableCell><div>{invoice.studentName}</div><div className="text-xs text-muted-foreground">{invoice.admissionNumber}</div></TableCell><TableCell>{invoice.className}</TableCell><TableCell>{invoice.due_date || "—"}</TableCell><TableCell><Badge variant={invoice.isOverdue ? "destructive" : invoice.balance > 0 ? "outline" : "secondary"}>{invoice.isOverdue ? "Overdue" : invoice.balance > 0 ? "Balance due" : "Paid"}</Badge></TableCell><TableCell className="text-right">{formatKSH(invoice.total)}</TableCell><TableCell className="text-right font-medium">{formatKSH(invoice.balance)}</TableCell></TableRow>)}{!invoices.length && <EmptyRow columns={7} text="No invoices match this view." />}</TableBody></Table></div>
}
function PaymentTable({ data }: { data: FinanceData }) {
  return <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Receipt</TableHead><TableHead>Student</TableHead><TableHead>Paid on</TableHead><TableHead>Channel</TableHead><TableHead>Reference</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader><TableBody>{data.payments.map((payment) => { const invoice = data.invoices.find((entry) => entry.id === payment.invoice_id); return <TableRow key={payment.id}><TableCell className="font-medium">{payment.receipt_number}</TableCell><TableCell>{invoice?.studentName ?? "Student"}</TableCell><TableCell>{new Date(payment.paid_at).toLocaleDateString()}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{payment.payment_method}</Badge></TableCell><TableCell>{payment.reference || "—"}</TableCell><TableCell className="text-right">{formatKSH(Number(payment.amount))}</TableCell></TableRow> })}{!data.payments.length && <EmptyRow columns={6} text="No payment receipts yet." />}</TableBody></Table></div>
}
function Field({ label, name, placeholder, type = "text", required = false, min, step }: { label: string; name: string; placeholder?: string; type?: string; required?: boolean; min?: string; step?: string }) {
  const id = `finance-${name}`
  return <div className="flex flex-col gap-2"><Label htmlFor={id}>{label}</Label><Input id={id} name={name} type={type} placeholder={placeholder} required={required} min={min} step={step} /></div>
}
function EmptyRow({ columns, text }: { columns: number; text: string }) {
  return <TableRow><TableCell colSpan={columns} className="h-24 text-center text-muted-foreground"><CircleDollarSign className="mx-auto mb-2 size-5" />{text}</TableCell></TableRow>
}
