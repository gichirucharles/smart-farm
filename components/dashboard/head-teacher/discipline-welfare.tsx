"use client"

import { useMemo, useState, type FormEvent } from "react"
import useSWR from "swr"
import { AlertTriangle, Award, FileText, HeartHandshake, Plus, ShieldCheck, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type RecordType = "incident" | "committee_outcome" | "suspension" | "expulsion" | "safeguarding" | "commendation"
type WelfareRecord = {
  id: string
  recordType: RecordType
  studentId: string
  studentName: string
  eventDate: string
  title: string
  description: string
  actionTaken: string
  reason: string
  outcome: string
  createdAt: string
}
type WelfareData = {
  students: { id: string; admissionNumber: string; name: string; className: string }[]
  records: WelfareRecord[]
}

const recordOptions: { value: RecordType; label: string }[] = [
  { value: "incident", label: "Incident report" },
  { value: "committee_outcome", label: "Disciplinary committee outcome" },
  { value: "suspension", label: "Suspension" },
  { value: "expulsion", label: "Expulsion" },
  { value: "safeguarding", label: "Safeguarding / child protection" },
  { value: "commendation", label: "Commendation / award" },
]

const labelFor: Record<RecordType, string> = {
  incident: "Incident",
  committee_outcome: "Committee outcome",
  suspension: "Suspension",
  expulsion: "Expulsion",
  safeguarding: "Safeguarding",
  commendation: "Commendation",
}

async function fetchWelfare(url: string): Promise<WelfareData> {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" })
  const result = await response.json()
  if (response.status === 401 || response.status === 403) {
    throw new Error("Sign in with a head teacher or director account to view this school register.")
  }
  if (!response.ok) throw new Error(result.error ?? "Unable to load welfare records")
  return result
}

function MetricCard({ title, value, icon: Icon, detail }: { title: string; value: string; icon: typeof Users; detail: string }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="grid gap-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{detail}</p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon aria-hidden="true" className="size-4" /></span>
      </CardContent>
    </Card>
  )
}

export function DisciplineWelfare() {
  const { data, error, isLoading, mutate } = useSWR<WelfareData>("/api/head-teacher/welfare", fetchWelfare)
  const [recordType, setRecordType] = useState<RecordType>("incident")
  const [studentIds, setStudentIds] = useState<string[]>([])
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 10))
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [reason, setReason] = useState("")
  const [actionTaken, setActionTaken] = useState("")
  const [outcome, setOutcome] = useState("")
  const [feedback, setFeedback] = useState("")
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<RecordType | "all">("all")

  const records = useMemo(() => {
    const sorted = [...(data?.records ?? [])].sort((a, b) => b.eventDate.localeCompare(a.eventDate))
    return filter === "all" ? sorted : sorted.filter((record) => record.recordType === filter)
  }, [data?.records, filter])
  const counts = useMemo(() => {
    const all = data?.records ?? []
    return {
      incidents: all.filter((item) => item.recordType === "incident").length,
      actions: all.filter((item) => ["suspension", "expulsion", "committee_outcome"].includes(item.recordType)).length,
      safeguarding: all.filter((item) => item.recordType === "safeguarding").length,
      commendations: all.filter((item) => item.recordType === "commendation").length,
    }
  }, [data?.records])

  async function submitRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback("")
    setSaving(true)
    try {
      const response = await fetch("/api/head-teacher/welfare", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordType, studentIds, eventDate, title, description, reason, actionTaken, outcome }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Unable to save this record")
      setFeedback(`Record saved for ${result.saved} student${result.saved === 1 ? "" : "s"}.`)
      setStudentIds([])
      setTitle("")
      setDescription("")
      setReason("")
      setActionTaken("")
      setOutcome("")
      await mutate()
    } catch (submitError) {
      setFeedback(submitError instanceof Error ? submitError.message : "Unable to save this record")
    } finally {
      setSaving(false)
    }
  }

  const showReason = recordType === "suspension" || recordType === "expulsion"

  return (
    <section className="flex flex-col gap-6" aria-labelledby="discipline-welfare-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 id="discipline-welfare-heading" className="text-2xl font-semibold tracking-tight">Discipline &amp; welfare</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Record student incidents, committee decisions, safeguarding actions, and positive recognition in one school-scoped register.</p>
        </div>
        <Badge variant="outline" className="w-fit">Leadership access</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Incident reports" value={isLoading || error ? "—" : String(counts.incidents)} icon={AlertTriangle} detail="Recorded at this school" />
        <MetricCard title="Formal actions" value={isLoading || error ? "—" : String(counts.actions)} icon={FileText} detail="Committee decisions & sanctions" />
        <MetricCard title="Safeguarding" value={isLoading || error ? "—" : String(counts.safeguarding)} icon={ShieldCheck} detail="Restricted child-protection records" />
        <MetricCard title="Commendations" value={isLoading || error ? "—" : String(counts.commendations)} icon={Award} detail="Positive recognition logged" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus aria-hidden="true" className="size-4" /> Add a welfare record</CardTitle>
          <CardDescription>Choose one or more students. Each student receives a separate, school-linked record.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitRecord} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium" htmlFor="welfare-record-type">
                Record type
                <select id="welfare-record-type" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={recordType} onChange={(event) => setRecordType(event.target.value as RecordType)}>
                  {recordOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium" htmlFor="welfare-date">
                Date
                <Input id="welfare-date" type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} required />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium" htmlFor="welfare-students">
              Students
              <select id="welfare-students" multiple size={Math.min(Math.max(data?.students.length ?? 3, 3), 6)} value={studentIds} onChange={(event) => setStudentIds(Array.from(event.currentTarget.selectedOptions, (option) => option.value))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required aria-describedby="welfare-student-help">
                {(data?.students ?? []).map((student) => <option key={student.id} value={student.id}>{student.name} · {student.admissionNumber} · {student.className}</option>)}
              </select>
              <span id="welfare-student-help" className="text-xs font-normal text-muted-foreground">Select one or more students. Use Ctrl/Command to select multiple names.</span>
            </label>
            <label className="grid gap-2 text-sm font-medium" htmlFor="welfare-title">
              {recordType === "incident" ? "Incident category" : "Title"}
              <Input id="welfare-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} placeholder={recordType === "incident" ? "e.g. Classroom disruption" : "Short, factual summary"} required />
            </label>
            <label className="grid gap-2 text-sm font-medium" htmlFor="welfare-description">
              Description
              <Textarea id="welfare-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={5000} rows={3} placeholder="Record objective, relevant details. Avoid unnecessary sensitive information." required />
            </label>
            {showReason && <label className="grid gap-2 text-sm font-medium" htmlFor="welfare-reason">Reason for {recordType}<Textarea id="welfare-reason" value={reason} onChange={(event) => setReason(event.target.value)} maxLength={3000} rows={2} required /></label>}
            {recordType === "incident" && <label className="grid gap-2 text-sm font-medium" htmlFor="welfare-action">Action taken<Textarea id="welfare-action" value={actionTaken} onChange={(event) => setActionTaken(event.target.value)} maxLength={3000} rows={2} required /></label>}
            {recordType === "committee_outcome" && <label className="grid gap-2 text-sm font-medium" htmlFor="welfare-outcome">Committee outcome<Textarea id="welfare-outcome" value={outcome} onChange={(event) => setOutcome(event.target.value)} maxLength={3000} rows={2} placeholder="Decision, agreed support, and review date" /></label>}
            {!showReason && recordType !== "incident" && <label className="grid gap-2 text-sm font-medium" htmlFor="welfare-action">Action taken / follow-up (optional)<Textarea id="welfare-action" value={actionTaken} onChange={(event) => setActionTaken(event.target.value)} maxLength={3000} rows={2} /></label>}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{feedback || (error ? error.message : "")}</p>
              <Button type="submit" disabled={saving || !data?.students.length || studentIds.length === 0}>{saving ? "Saving…" : "Save record"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><CardTitle>Welfare register</CardTitle><CardDescription>{isLoading ? "Loading records…" : `${records.length} record${records.length === 1 ? "" : "s"} shown`}</CardDescription></div>
          <label className="grid gap-1 text-xs font-medium text-muted-foreground" htmlFor="welfare-filter">Filter records
            <select id="welfare-filter" className="h-9 min-w-52 rounded-md border border-input bg-background px-3 text-sm text-foreground" value={filter} onChange={(event) => setFilter(event.target.value as RecordType | "all")}>
              <option value="all">All record types</option>
              {recordOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </CardHeader>
        <CardContent>
          {error ? <p className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error.message}</p> : records.length === 0 && !isLoading ? <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">No records in this view yet. New entries will appear here after they are saved.</p> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Student</TableHead><TableHead>Type</TableHead><TableHead>Summary</TableHead><TableHead>Action / outcome</TableHead></TableRow></TableHeader>
                <TableBody>
                  {records.map((record) => <TableRow key={`${record.recordType}-${record.id}`}>
                    <TableCell className="whitespace-nowrap">{new Date(`${record.eventDate}T12:00:00`).toLocaleDateString()}</TableCell>
                    <TableCell className="min-w-40 font-medium">{record.studentName}</TableCell>
                    <TableCell><Badge variant={record.recordType === "safeguarding" ? "destructive" : "secondary"}>{labelFor[record.recordType]}</Badge></TableCell>
                    <TableCell className="min-w-56"><p className="font-medium">{record.title}</p><p className="mt-1 max-w-md whitespace-pre-wrap text-xs text-muted-foreground">{record.description}{record.reason ? ` Reason: ${record.reason}` : ""}</p></TableCell>
                    <TableCell className="min-w-48 text-sm text-muted-foreground">{record.outcome || record.actionTaken || "—"}</TableCell>
                  </TableRow>)}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardContent className="flex items-start gap-3 p-4">
          <HeartHandshake aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="grid gap-1"><p className="text-sm font-medium">Counselling stays confidential</p><p className="text-sm text-muted-foreground">Counselling session details and notes are intentionally not included in this leadership register. They belong in counselor-only records; use an approved safeguarding referral when a child may be at risk.</p></div>
        </CardContent>
      </Card>
    </section>
  )
}
