"use client"

import { FormEvent, useState } from "react"
import useSWR from "swr"
import { Activity, CalendarDays, ClipboardPlus, HeartPulse, LoaderCircle, Pill, Plus, RefreshCw, Search, Stethoscope } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Student = { id: string; admissionNumber: string; name: string; className: string }
type Visit = { id: string; student_id: string; studentName: string; className: string; time_in: string; time_out: string | null; symptoms: string | null; treatment: string | null; temperature: number | null; status: "under_observation" | "discharged"; notes: string | null }
type Checkup = { id: string; student_id: string; studentName: string; className: string; scheduled_at: string; checkup_type: string; status: string; outcome: string | null }
type Medication = { id: string; student_id: string; studentName: string; className: string; medication_name: string; dosage: string; frequency: string; start_date: string; end_date: string | null; status: string }
type ClinicData = { students: Student[]; visits: Visit[]; checkups: Checkup[]; medications: Medication[]; administrations: { id: string; medication_id: string; administered_at: string; dosage: string }[] }

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || "Unable to load clinic data")
  return body as ClinicData
}

const localDate = (date: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(date))

export function NurseClinicDashboard() {
  const { data, error, isLoading, mutate } = useSWR<ClinicData>("/api/nurse/clinic", fetcher)
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [visitStudent, setVisitStudent] = useState("")
  const [visitSymptoms, setVisitSymptoms] = useState("")
  const [visitTreatment, setVisitTreatment] = useState("")
  const [visitTemp, setVisitTemp] = useState("")
  const [checkupStudent, setCheckupStudent] = useState("")
  const [checkupType, setCheckupType] = useState("")
  const [checkupAt, setCheckupAt] = useState("")
  const [medStudent, setMedStudent] = useState("")
  const [medName, setMedName] = useState("")
  const [medDosage, setMedDosage] = useState("")
  const [medFrequency, setMedFrequency] = useState("")

  const submit = async (event: FormEvent<HTMLFormElement>, body: Record<string, unknown>) => {
    event.preventDefault()
    const form = event.currentTarget
    setSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/nurse/clinic", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to save record")
      setMessage("Record saved successfully.")
      await mutate()
      form.reset()
      setVisitStudent("")
      setVisitSymptoms("")
      setVisitTreatment("")
      setVisitTemp("")
      setCheckupStudent("")
      setCheckupType("")
      setCheckupAt("")
      setMedStudent("")
      setMedName("")
      setMedDosage("")
      setMedFrequency("")
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Unable to save record")
    } finally {
      setSaving(false)
    }
  }

  const update = async (body: Record<string, unknown>) => {
    setSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/nurse/clinic", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to update record")
      await mutate()
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Unable to update record")
    } finally {
      setSaving(false)
    }
  }

  const students = data?.students ?? []
  const visits = data?.visits ?? []
  const checkups = data?.checkups ?? []
  const medications = data?.medications ?? []
  const currentVisits = visits.filter((visit) => visit.status === "under_observation")
  const today = new Date().toISOString().slice(0, 10)
  const todayVisits = visits.filter((visit) => visit.time_in.slice(0, 10) === today)
  const upcomingCheckups = checkups.filter((item) => item.status === "scheduled")
  const activeMedications = medications.filter((item) => item.status === "active")
  const matches = (name: string) => name.toLowerCase().includes(search.trim().toLowerCase())
  const studentOptions = (value: string, onChange: (value: string) => void) => (
    <select aria-label="Student" required value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
      <option value="">Choose a student</option>
      {students.map((student) => <option key={student.id} value={student.id}>{student.name} — {student.className} ({student.admissionNumber})</option>)}
    </select>
  )

  if (isLoading) return <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" /> Loading clinic records…</div>
  if (error) return <Card><CardContent className="flex flex-col items-start gap-3 p-6"><p role="alert" className="text-sm text-destructive">{error.message}</p><Button variant="outline" onClick={() => mutate()}><RefreshCw data-icon="inline-start" /> Retry</Button></CardContent></Card>

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Clinic summary">
        {[
          { label: "Visits today", value: todayVisits.length, icon: Activity },
          { label: "Under observation", value: currentVisits.length, icon: HeartPulse },
          { label: "Upcoming checkups", value: upcomingCheckups.length, icon: CalendarDays },
          { label: "Active medication plans", value: activeMedications.length, icon: Pill },
        ].map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="flex items-center gap-4 p-5"><span className="rounded-lg bg-primary/10 p-3 text-primary"><Icon className="size-5" /></span><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-semibold tabular-nums">{value}</p></div></CardContent></Card>)}
      </section>

      {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}

      <Tabs defaultValue="visits">
        <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="visits">Sick-bay visits</TabsTrigger>
          <TabsTrigger value="checkups">Checkups</TabsTrigger>
          <TabsTrigger value="medication">Medication</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="visits" className="mt-4 flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Stethoscope className="size-5" /> Record a visit</CardTitle><CardDescription>Clinical notes are restricted to authorized school health staff.</CardDescription></CardHeader>
            <CardContent><form onSubmit={(event) => submit(event, { kind: "visit", studentId: visitStudent, symptoms: visitSymptoms, treatment: visitTreatment, temperature: visitTemp ? Number(visitTemp) : null, status: "under_observation" })} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {studentOptions(visitStudent, setVisitStudent)}
              <Input aria-label="Symptoms or complaint" placeholder="Symptoms / complaint" required maxLength={2000} value={visitSymptoms} onChange={(event) => setVisitSymptoms(event.target.value)} />
              <Input aria-label="Treatment" placeholder="Treatment given" maxLength={2000} value={visitTreatment} onChange={(event) => setVisitTreatment(event.target.value)} />
              <Input aria-label="Temperature in Celsius" type="number" min="25" max="45" step="0.1" placeholder="Temperature °C" value={visitTemp} onChange={(event) => setVisitTemp(event.target.value)} />
              <Button type="submit" disabled={saving || students.length === 0}><Plus data-icon="inline-start" /> Save visit</Button>
            </form></CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Visit register</CardTitle><CardDescription>Recent school clinic visits</CardDescription></div><div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search visits" className="pl-9" placeholder="Search students or symptoms" value={search} onChange={(event) => setSearch(event.target.value)} /></div></CardHeader>
            <CardContent><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead><tr className="border-b text-muted-foreground"><th className="p-3 font-medium">Student</th><th className="p-3 font-medium">Complaint</th><th className="p-3 font-medium">Time in</th><th className="p-3 font-medium">Treatment</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Action</th></tr></thead><tbody>
              {visits.filter((visit) => matches(`${visit.studentName} ${visit.symptoms ?? ""}`)).map((visit) => <tr key={visit.id} className="border-b last:border-0"><td className="p-3"><span className="font-medium">{visit.studentName}</span><span className="block text-xs text-muted-foreground">{visit.className}</span></td><td className="p-3">{visit.symptoms || "—"}{visit.temperature != null && <span className="block text-xs text-muted-foreground">{visit.temperature}°C</span>}</td><td className="p-3">{localDate(visit.time_in)}</td><td className="p-3">{visit.treatment || "—"}</td><td className="p-3"><Badge variant={visit.status === "under_observation" ? "secondary" : "outline"}>{visit.status === "under_observation" ? "Under observation" : "Discharged"}</Badge></td><td className="p-3">{visit.status === "under_observation" && <Button size="sm" variant="outline" disabled={saving} onClick={() => update({ kind: "discharge", id: visit.id })}>Discharge</Button>}</td></tr>)}
              {visits.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No clinic visits recorded yet.</td></tr>}
            </tbody></table></div></CardContent>
          </Card>
          <Card><CardHeader><CardTitle>Currently under observation</CardTitle><CardDescription>Students who have not been discharged from the clinic</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">{currentVisits.map((visit) => <div key={visit.id} className="flex items-center justify-between gap-3 rounded-lg border p-4"><div><p className="font-medium">{visit.studentName}</p><p className="text-sm text-muted-foreground">{visit.symptoms} · {visit.className}</p></div><Button size="sm" disabled={saving} onClick={() => update({ kind: "discharge", id: visit.id })}>Discharge</Button></div>)}{currentVisits.length === 0 && <p className="text-sm text-muted-foreground">No students are currently under observation.</p>}</CardContent></Card>
        </TabsContent>

        <TabsContent value="checkups" className="mt-4 flex flex-col gap-4">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><ClipboardPlus className="size-5" /> Schedule a checkup</CardTitle><CardDescription>Appointments are stored against the student&apos;s school record.</CardDescription></CardHeader><CardContent><form onSubmit={(event) => submit(event, { kind: "checkup", studentId: checkupStudent, checkupType, scheduledAt: new Date(checkupAt).toISOString() })} className="grid gap-3 md:grid-cols-4">{studentOptions(checkupStudent, setCheckupStudent)}<Input aria-label="Checkup type" placeholder="Routine, vision, dental…" required maxLength={120} value={checkupType} onChange={(event) => setCheckupType(event.target.value)} /><Input aria-label="Appointment date and time" type="datetime-local" required value={checkupAt} onChange={(event) => setCheckupAt(event.target.value)} /><Button type="submit" disabled={saving || students.length === 0}>Schedule checkup</Button></form></CardContent></Card>
          <Card><CardHeader><CardTitle>Appointments</CardTitle><CardDescription>{upcomingCheckups.length} scheduled</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">{checkups.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"><div><p className="font-medium">{item.studentName} <span className="font-normal text-muted-foreground">· {item.className}</span></p><p className="text-sm text-muted-foreground">{item.checkup_type} · {localDate(item.scheduled_at)}</p></div><div className="flex items-center gap-2"><Badge variant={item.status === "scheduled" ? "secondary" : "outline"}>{item.status.replaceAll("_", " ")}</Badge>{item.status === "scheduled" && <Button size="sm" variant="outline" disabled={saving} onClick={() => update({ kind: "checkup_status", id: item.id, status: "completed" })}>Complete</Button>}</div></div>)}{checkups.length === 0 && <p className="text-sm text-muted-foreground">No checkups scheduled.</p>}</CardContent></Card>
        </TabsContent>

        <TabsContent value="medication" className="mt-4 flex flex-col gap-4">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Pill className="size-5" /> Add medication plan</CardTitle><CardDescription>Record a student-specific prescription or administration plan.</CardDescription></CardHeader><CardContent><form onSubmit={(event) => submit(event, { kind: "medication", studentId: medStudent, medicationName: medName, dosage: medDosage, frequency: medFrequency })} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">{studentOptions(medStudent, setMedStudent)}<Input aria-label="Medication" placeholder="Medication name" required maxLength={160} value={medName} onChange={(event) => setMedName(event.target.value)} /><Input aria-label="Dosage" placeholder="Dosage" required maxLength={120} value={medDosage} onChange={(event) => setMedDosage(event.target.value)} /><Input aria-label="Frequency" placeholder="Frequency" required maxLength={120} value={medFrequency} onChange={(event) => setMedFrequency(event.target.value)} /><Button type="submit" disabled={saving || students.length === 0}>Add plan</Button></form></CardContent></Card>
          <Card><CardHeader><CardTitle>Medication register</CardTitle><CardDescription>Active plans and dose administration log</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead><tr className="border-b text-muted-foreground"><th className="p-3 font-medium">Student</th><th className="p-3 font-medium">Medication</th><th className="p-3 font-medium">Dosage</th><th className="p-3 font-medium">Frequency</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Action</th></tr></thead><tbody>{medications.map((med) => <tr key={med.id} className="border-b last:border-0"><td className="p-3">{med.studentName}<span className="block text-xs text-muted-foreground">{med.className}</span></td><td className="p-3">{med.medication_name}</td><td className="p-3">{med.dosage}</td><td className="p-3">{med.frequency}</td><td className="p-3"><Badge variant={med.status === "active" ? "secondary" : "outline"}>{med.status}</Badge></td><td className="p-3">{med.status === "active" && <div className="flex gap-2"><Button size="sm" variant="outline" disabled={saving} onClick={() => update({ kind: "administration", medicationId: med.id, dosage: med.dosage })}>Log dose</Button><Button size="sm" variant="ghost" disabled={saving} onClick={() => update({ kind: "medication_status", id: med.id, status: "completed" })}>Complete</Button></div>}</td></tr>)}{medications.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No medication plans yet.</td></tr>}</tbody></table></div></CardContent></Card>
          <Card><CardHeader><CardTitle>Recent dose log</CardTitle></CardHeader><CardContent className="flex flex-col gap-2">{(data?.administrations ?? []).slice(0, 12).map((dose) => { const med = medications.find((item) => item.id === dose.medication_id); return <div key={dose.id} className="flex justify-between border-b py-2 text-sm last:border-0"><span>{med?.studentName ?? "Student"} · {med?.medication_name ?? "Medication"} ({dose.dosage})</span><span className="text-muted-foreground">{localDate(dose.administered_at)}</span></div> })}{(data?.administrations ?? []).length === 0 && <p className="text-sm text-muted-foreground">No doses have been logged.</p>}</CardContent></Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4 flex flex-col gap-4">
          <section className="grid gap-4 sm:grid-cols-3"><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total recorded visits</p><p className="mt-1 text-3xl font-semibold">{visits.length}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Follow-ups due</p><p className="mt-1 text-3xl font-semibold">{visits.filter((visit) => visit.status === "under_observation").length + checkups.filter((item) => item.status === "scheduled" && item.scheduled_at.slice(0, 10) <= today).length}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Checkups completed</p><p className="mt-1 text-3xl font-semibold">{checkups.filter((item) => item.status === "completed").length}</p></CardContent></Card></section>
          <Card><CardHeader><CardTitle>Visit activity</CardTitle><CardDescription>Recent real clinic records for this school. No sample report rows are shown.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">{visits.slice(0, 25).map((visit) => <div key={visit.id} className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 last:border-0"><div><p className="font-medium">{visit.studentName} · {visit.symptoms}</p><p className="text-sm text-muted-foreground">{visit.className} · {localDate(visit.time_in)}</p></div><Badge variant={visit.status === "under_observation" ? "secondary" : "outline"}>{visit.status === "under_observation" ? "Open" : "Discharged"}</Badge></div>)}{visits.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Reports will appear as clinic records are created.</p>}</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
