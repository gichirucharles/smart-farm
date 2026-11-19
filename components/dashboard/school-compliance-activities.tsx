"use client"

import { useMemo, useState, type FormEvent } from "react"
import useSWR from "swr"
import { FileSpreadsheet, Printer, Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ModuleKey = "compliance" | "activities"
type RecordRow = { id: string; category: string; record_type: string; name: string; location: string | null; status: string; due_date: string | null; details: Record<string, string | number | boolean>; updated_at: string }
type Payload = { records: RecordRow[] }

const moduleOptions: Record<ModuleKey, { label: string; description: string; types: string[] }> = {
  compliance: {
    label: "Compliance & reporting",
    description: "Government returns, inspections, safety, governance and school plans.",
    types: ["Government return · Enrolment", "Government return · Staffing", "Government return · Capitation", "Inspection report", "Safety & health compliance", "Board minutes", "Board resolution", "Strategic plan", "School development plan"],
  },
  activities: {
    label: "Co-curricular & events",
    description: "Clubs, sports, trips, events, student leadership and competition results.",
    types: ["Club / society", "Sports team", "Fixture", "Trip", "School event", "Prefect / student council", "Award / competition result"],
  },
}

const fetcher = async (url: string): Promise<Payload> => {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error ?? "Could not load school records")
  return body
}

export function SchoolComplianceActivities({ initialModule = "compliance" }: { initialModule?: ModuleKey }) {
  const [moduleKey, setModuleKey] = useState<ModuleKey>(initialModule)
  const { data, error, isLoading, mutate } = useSWR<Payload>(`/api/school-operations?module=${moduleKey}`, fetcher)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [recordType, setRecordType] = useState(moduleOptions[initialModule].types[0])
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("active")
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")
  const current = moduleOptions[moduleKey]
  const records = useMemo(() => (data?.records ?? []).filter((row) => [row.name, row.record_type, row.location, row.details.notes].some((value) => String(value ?? "").toLowerCase().includes(query.toLowerCase()))), [data?.records, query])

  const selectModule = (value: string) => {
    const next = value as ModuleKey
    setModuleKey(next)
    setRecordType(moduleOptions[next].types[0])
  }

  const saveRecord = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setFormError("")
    try {
      const response = await fetch("/api/school-operations", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: moduleKey, recordType, name, location: location || null, dueDate: date || null, status, details: { notes } }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error ?? "Could not save this record")
      await mutate()
      setOpen(false)
      setName("")
      setLocation("")
      setDate("")
      setNotes("")
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Could not save this record")
    } finally {
      setSaving(false)
    }
  }

  const exportCsv = () => {
    const rows = [["Record type", "Name", "Location", "Date", "Status", "Notes"], ...records.map((row) => [row.record_type, row.name, row.location ?? "", row.due_date ?? "", row.status, String(row.details.notes ?? "")])]
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n")
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${moduleKey}-records.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Badge variant="outline" className="w-fit rounded-full px-3 py-1">School administration</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">{current.label}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{current.description} Records are saved to the school&apos;s private register.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus data-icon="inline-start" /> Add record</Button>
      </header>

      <Tabs value={moduleKey} onValueChange={selectModule}>
        <TabsList><TabsTrigger value="compliance">Compliance & reporting</TabsTrigger><TabsTrigger value="activities">Co-curricular & events</TabsTrigger></TabsList>
      </Tabs>

      {moduleKey === "compliance" ? <div className="grid gap-3 sm:grid-cols-3">
        <Summary title="Government returns" description="Enrolment, staffing and capitation" />
        <Summary title="Inspection & safety" description="Recommendations and health checks" />
        <Summary title="Governance & plans" description="Board records and school plans" />
      </div> : <div className="grid gap-3 sm:grid-cols-3">
        <Summary title="Clubs & sports" description="Societies, teams and fixtures" />
        <Summary title="Trips & events" description="Calendar-ready activities" />
        <Summary title="Student leadership" description="Prefects, council and awards" />
      </div>}

      {error && <p role="alert" className="rounded-md border border-destructive/40 p-3 text-sm text-destructive">{error.message}</p>}
      <Card>
        <CardHeader className="gap-4 border-b bg-muted/20 sm:flex-row sm:items-end sm:justify-between">
          <div><CardTitle>{current.label} register</CardTitle><CardDescription>{records.length} records in this school</CardDescription></div>
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-48 flex-1"><Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search records" className="pl-9" placeholder="Search records" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
            <Button variant="outline" onClick={exportCsv}><FileSpreadsheet data-icon="inline-start" /> Excel (CSV)</Button>
            <Button variant="outline" onClick={() => window.print()}><Printer data-icon="inline-start" /> Save as PDF</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? <p className="p-8 text-center text-sm text-muted-foreground">Loading records…</p> : records.length === 0 ? <div className="p-10 text-center"><p className="font-medium">No records yet</p><p className="mt-1 text-sm text-muted-foreground">Add the first record for this school area.</p></div> : <div className="overflow-x-auto"><Table>
            <TableHeader><TableRow><TableHead>Record</TableHead><TableHead>Name / reference</TableHead><TableHead>Location</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Notes</TableHead></TableRow></TableHeader>
            <TableBody>{records.map((row) => <TableRow key={row.id}><TableCell className="min-w-52 font-medium">{row.record_type}</TableCell><TableCell className="min-w-40">{row.name}</TableCell><TableCell>{row.location || "—"}</TableCell><TableCell className="whitespace-nowrap">{row.due_date || "—"}</TableCell><TableCell><Badge variant={row.status === "completed" ? "secondary" : row.status === "overdue" ? "destructive" : "outline"}>{row.status.replaceAll("_", " ")}</Badge></TableCell><TableCell className="min-w-48">{String(row.details.notes ?? "") || "—"}</TableCell></TableRow>)}</TableBody>
          </Table></div>}
        </CardContent>
      </Card>
      {moduleKey === "compliance" && <Card><CardHeader><CardTitle>Report exports</CardTitle><CardDescription>Export the filtered register for review or filing.</CardDescription></CardHeader><CardContent className="flex flex-col gap-2 text-sm text-muted-foreground"><p>Excel-compatible CSV and browser PDF printing are available from the register above.</p><p>Automatic scheduled email delivery is not enabled because no email integration was selected.</p></CardContent></Card>}

      <Dialog open={open} onOpenChange={setOpen}><DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>Add {moduleKey === "compliance" ? "compliance" : "co-curricular"} record</DialogTitle><DialogDescription>Enter a clear name and capture any due date, location, status and notes.</DialogDescription></DialogHeader>
        <form onSubmit={saveRecord} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Record type"><Select value={recordType} onValueChange={setRecordType}><SelectTrigger aria-label="Record type"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{current.types.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>
            <Field label="Name / reference"><Input required maxLength={180} value={name} onChange={(event) => setName(event.target.value)} placeholder="Title or reference" /></Field>
            <Field label="Location / venue"><Input maxLength={180} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Optional" /></Field>
            <Field label="Due date / event date"><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></Field>
            <Field label="Status"><Select value={status} onValueChange={setStatus}><SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="active">Active</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="in_progress">In progress</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="overdue">Overdue</SelectItem></SelectGroup></SelectContent></Select></Field>
            <Field label="Notes"><Input maxLength={500} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Summary, recommendation, result or participants" /></Field>
          </div>
          {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
          <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save record"}</Button></DialogFooter>
        </form>
      </DialogContent></Dialog>
    </main>
  )
}

function Summary({ title, description }: { title: string; description: string }) {
  return <Card><CardContent className="flex flex-col gap-1 p-4"><p className="font-medium">{title}</p><p className="text-sm text-muted-foreground">{description}</p></CardContent></Card>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex min-w-0 flex-col gap-2"><span className="text-sm font-medium leading-none">{label}</span>{children}</label>
}
