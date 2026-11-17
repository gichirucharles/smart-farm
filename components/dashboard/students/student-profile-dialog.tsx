"use client"

import { useState, type FormEvent } from "react"
import useSWR, { mutate } from "swr"
import { FileText, HeartPulse, LoaderCircle, Pencil, Plus, ShieldCheck, UserRound } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { supabaseBrowser } from "@/lib/supabase-browser"

type SchoolClass = { id: string; name: string; gradeLevel: string; stream: string }
type Profile = {
  student: Record<string, any>
  guardians: Record<string, any>[]
  healthProfile: Record<string, any> | null
  enrichmentProfile: Record<string, any> | null
  transfers: Record<string, any>[]
  documents: Record<string, any>[]
  disciplineRecords: Record<string, any>[]
  healthRecords: Record<string, any>[]
  counselingSessions?: Record<string, any>[]
  access: { canManage: boolean; canViewHealth: boolean; canEditHealth: boolean; canViewCounseling: boolean }
}

const fetcher = async (url: string): Promise<Profile> => {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || "Unable to load student profile")
  return body
}

const gradeChoices = ["playgroup", "nursery", "kg1", "kg2", "grade1", "grade2", "grade3", "grade4", "grade5", "grade6", "grade7", "grade8", "grade9"]
const gradeLabel: Record<string, string> = { playgroup: "Play Group", nursery: "Nursery", kg1: "KG 1", kg2: "KG 2", ...Object.fromEntries(Array.from({ length: 9 }, (_, index) => [`grade${index + 1}`, `Grade ${index + 1}`])) }

function DisplayField({ label, value }: { label: string; value: unknown }) {
  const display = typeof value === "string" && value.length ? value : "Not recorded"
  return <div className="grid min-w-0 gap-1"><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt><dd className="break-words text-sm">{String(display)}</dd></div>
}

function FormField({ label, name, defaultValue = "", type = "text", required = false, maxLength }: { label: string; name: string; defaultValue?: string | null; type?: string; required?: boolean; maxLength?: number }) {
  return <div className="grid gap-2"><Label htmlFor={`profile-${name}`}>{label}</Label><Input id={`profile-${name}`} name={name} type={type} defaultValue={defaultValue ?? ""} required={required} maxLength={maxLength} /></div>
}

function RecordForm({ studentId, kind, onCancel, onSaved }: { studentId: string; kind: "transfer" | "discipline" | "health_visit" | "counseling_session"; onCancel: () => void; onSaved: () => Promise<void> }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const field = (label: string, name: string, options: { type?: string; required?: boolean; multiline?: boolean } = {}) => <div className="grid gap-2"><Label htmlFor={`record-${name}`}>{label}</Label>{options.multiline ? <Textarea id={`record-${name}`} name={name} required={options.required} rows={3} /> : <Input id={`record-${name}`} name={name} type={options.type ?? "text"} required={options.required} />}</div>

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")
    const form = new FormData(event.currentTarget)
    const value = (name: string) => String(form.get(name) ?? "").trim()
    const body = kind === "transfer" ? { kind, direction: value("direction"), fromSchool: value("fromSchool") || null, toSchool: value("toSchool") || null, transferDate: value("recordDate"), notes: value("notes") || null }
      : kind === "discipline" ? { kind, incidentDate: value("recordDate"), category: value("category"), description: value("description"), actionTaken: value("actionTaken") || null }
        : kind === "health_visit" ? { kind, visitDate: value("recordDate"), symptoms: value("symptoms") || null, diagnosis: value("diagnosis") || null, treatment: value("treatment") || null, medication: value("medication") || null, followUpRequired: form.get("followUpRequired") === "on", followUpDate: value("followUpDate") || null }
          : { kind, sessionDate: value("recordDate"), sessionType: value("sessionType") || null, reason: value("reason") || null, notes: value("notes") || null, followUpRequired: form.get("followUpRequired") === "on", followUpDate: value("followUpDate") || null }
    try {
      const response = await fetch(`/api/students/${studentId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to save record")
      setError("")
      await onSaved()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save record")
    } finally {
      setSaving(false)
    }
  }

  return <form onSubmit={submit} className="grid gap-4 rounded-lg border bg-muted/20 p-4">
    <div className="grid gap-4 sm:grid-cols-2">{field(kind === "transfer" ? "Transfer date" : kind === "discipline" ? "Incident date" : kind === "health_visit" ? "Visit date" : "Session date", "recordDate", { type: "date", required: true })}
      {kind === "transfer" && <div className="grid gap-2"><Label htmlFor="record-direction">Direction</Label><select id="record-direction" name="direction" className="h-9 rounded-md border bg-background px-3 text-sm"><option value="inbound">Inbound</option><option value="outbound">Outbound</option></select></div>}
      {kind === "transfer" && <>{field("From school", "fromSchool")}{field("To school", "toSchool")}</>}
      {kind === "discipline" && field("Category", "category", { required: true })}
      {kind === "counseling_session" && field("Session type", "sessionType")}
      {kind === "counseling_session" && field("Reason", "reason", { multiline: true })}
      {kind === "health_visit" && <>{field("Symptoms", "symptoms", { multiline: true })}{field("Diagnosis", "diagnosis")}{field("Treatment", "treatment", { multiline: true })}{field("Medication", "medication")}</>}
      {kind === "discipline" && <>{field("Description", "description", { required: true, multiline: true })}{field("Action taken", "actionTaken", { multiline: true })}</>}
      {kind === "transfer" && field("Notes", "notes", { multiline: true })}
      {kind === "counseling_session" && field("Private session notes", "notes", { multiline: true })}
      {(kind === "health_visit" || kind === "counseling_session") && <><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="followUpRequired" className="size-4 accent-primary" /> Follow-up required</label>{field("Follow-up date", "followUpDate", { type: "date" })}</>}
    </div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="flex justify-end gap-2"><Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button><Button size="sm" type="submit" disabled={saving}>{saving ? "Saving…" : "Save record"}</Button></div>
  </form>
}

export function StudentProfileDialog({ studentId, classes, onOpenChange }: { studentId: string | null; classes: SchoolClass[]; onOpenChange: (open: boolean) => void }) {
  const { data, error, isLoading, mutate: refreshProfile } = useSWR(studentId ? `/api/students/${studentId}` : null, fetcher)
  const [editing, setEditing] = useState(false)
  const [adding, setAdding] = useState<"guardian" | "transfer" | "discipline" | "health_visit" | "counseling_session" | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadType, setUploadType] = useState("other")
  const [uploadName, setUploadName] = useState("")
  const [saveError, setSaveError] = useState("")

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!studentId) return
    const form = new FormData(event.currentTarget)
    const selectedClass = classes.find((item) => item.id === String(form.get("classId") ?? ""))
    if (!selectedClass) { setSaveError("Select an active class and stream"); return }
    const value = (name: string) => String(form.get(name) ?? "").trim()
    setSaveError("")
    try {
      const response = await fetch(`/api/students/${studentId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ student: {
        firstName: value("firstName"), lastName: value("lastName"), studentId: value("studentId"), nemisId: value("nemisId") || null,
        gradeLevel: selectedClass.gradeLevel, stream: selectedClass.stream, dateOfBirth: value("dateOfBirth") || null, admissionDate: value("admissionDate") || null,
        gender: value("gender") || null, birthCertificateNumber: value("birthCertificateNumber") || null, nationality: value("nationality") || null,
        religion: value("religion") || null, homeLanguage: value("homeLanguage") || null, previousSchool: value("previousSchool") || null,
        admissionStatus: value("admissionStatus"), address: value("address") || null,
      } }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to update student")
      setSaveError("")
      setEditing(false)
      await Promise.all([refreshProfile(), mutate("/api/students")])
    } catch (cause) { setSaveError(cause instanceof Error ? cause.message : "Unable to update student") }
  }

  async function saveGuardian(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!studentId) return
    const form = new FormData(event.currentTarget)
    const value = (name: string) => String(form.get(name) ?? "").trim()
    try {
      const response = await fetch(`/api/students/${studentId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guardian: {
        name: value("name"), relationship: value("relationship"), phone: value("phone") || null, email: value("email") || null,
        occupation: value("occupation") || null, residenceAddress: value("residenceAddress") || null, emergencyContact: form.get("emergencyContact") === "on", authorizedPickup: form.get("authorizedPickup") === "on",
      } }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to save guardian")
      setAdding(null)
      await refreshProfile()
    } catch (cause) { setSaveError(cause instanceof Error ? cause.message : "Unable to save guardian") }
  }

  async function saveHealth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!studentId) return
    const form = new FormData(event.currentTarget)
    const value = (name: string) => String(form.get(name) ?? "").trim()
    const immunisationRecords = value("immunisationRecords").split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
      const [vaccine, administeredOn, notes] = line.split("|").map((part) => part.trim())
      return { vaccine, date: administeredOn || null, notes: notes || null }
    })
    const response = await fetch(`/api/students/${studentId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ healthProfile: { medicalConditions: value("medicalConditions") || null, allergies: value("allergies") || null, bloodGroup: value("bloodGroup") || null, specialNeeds: value("specialNeeds") || null, supportPlan: value("supportPlan") || null, immunisationRecords } }) })
    const result = await response.json()
    if (!response.ok) { setSaveError(result.error || "Unable to update health profile"); return }
    setSaveError("")
    await refreshProfile()
  }

  async function saveEnrichment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!studentId) return
    const form = new FormData(event.currentTarget)
    const value = (name: string) => String(form.get(name) ?? "").trim()
    const response = await fetch(`/api/students/${studentId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enrichmentProfile: {
      boardingStatus: value("boardingStatus"), dormitory: value("dormitory") || null, bedNumber: value("bedNumber") || null,
      transportRoute: value("transportRoute") || null, transportStage: value("transportStage") || null,
      clubs: value("clubs").split(",").map((item) => item.trim()).filter(Boolean), sports: value("sports").split(",").map((item) => item.trim()).filter(Boolean), houseAssignment: value("houseAssignment") || null,
    } }) })
    const result = await response.json()
    if (!response.ok) { setSaveError(result.error || "Unable to update school life details"); return }
    setSaveError("")
    await refreshProfile()
  }

  async function uploadDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const file = (form.elements.namedItem("file") as HTMLInputElement).files?.[0]
    if (!studentId || !file) return
    setUploading(true)
    setSaveError("")
    try {
      const prepareResponse = await fetch(`/api/students/${studentId}/documents`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "prepare", fileName: file.name, contentType: file.type, fileSize: file.size, documentType: uploadType }) })
      const prepared = await prepareResponse.json()
      if (!prepareResponse.ok) throw new Error(prepared.error || "Unable to prepare document upload")
      const { error: uploadError } = await supabaseBrowser.storage.from("student-documents").uploadToSignedUrl(prepared.storagePath, prepared.token, file, { contentType: file.type })
      if (uploadError) throw new Error("Secure file upload failed. Please retry.")
      const completeResponse = await fetch(`/api/students/${studentId}/documents`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "complete", storagePath: prepared.storagePath, documentType: uploadType, fileName: file.name, contentType: file.type, fileSize: file.size }) })
      const completed = await completeResponse.json()
      if (!completeResponse.ok) throw new Error(completed.error || "Unable to save document record")
      setSaveError("")
      form.reset()
      await refreshProfile()
    } catch (cause) { setSaveError(cause instanceof Error ? cause.message : "Unable to upload document") }
    finally { setUploading(false) }
  }

  const recordKind = adding && adding !== "guardian" ? adding : null
  const profile = data
  const student = profile?.student
  const initials = `${student?.first_name?.[0] ?? ""}${student?.last_name?.[0] ?? ""}`
  const activeClassId = classes.find((item) => item.gradeLevel === student?.grade_level && item.stream === student?.stream)?.id ?? ""

  return <Dialog open={Boolean(studentId)} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[94vh] w-[calc(100%-1rem)] overflow-hidden p-0 sm:max-w-4xl">
      {isLoading && <div className="flex min-h-80 items-center justify-center gap-3 text-sm text-muted-foreground"><LoaderCircle className="size-5 animate-spin" />Loading secure student profile…</div>}
      {error && <div className="p-8"><DialogHeader><DialogTitle>Profile unavailable</DialogTitle><DialogDescription>{error.message}</DialogDescription></DialogHeader></div>}
      {profile && student && <div className="flex max-h-[94vh] flex-col">
        <DialogHeader className="border-b bg-muted/20 p-5 pr-12 sm:p-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 border"><AvatarImage src={student.photo_url ?? undefined} alt={`${student.first_name} ${student.last_name}`} /><AvatarFallback>{initials || <UserRound />}</AvatarFallback></Avatar>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><DialogTitle className="text-xl">{student.first_name} {student.last_name}</DialogTitle><Badge variant={student.admission_status === "enrolled" ? "default" : "secondary"}>{student.admission_status}</Badge></div><DialogDescription className="mt-1">{student.student_id} · {student.className}</DialogDescription></div>
            {profile.access.canManage && <Button type="button" size="sm" variant="outline" onClick={() => setEditing(!editing)}><Pencil data-icon="inline-start" />{editing ? "Close edit" : "Edit profile"}</Button>}
          </div>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {saveError && <p role="alert" className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{saveError}</p>}
          <Tabs defaultValue="overview" className="grid gap-5">
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b bg-transparent p-0">
              <TabsTrigger className="shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent" value="overview">Overview</TabsTrigger>
              <TabsTrigger className="shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent" value="family">Family</TabsTrigger>
              {profile.access.canViewHealth && <TabsTrigger className="shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent" value="health">Health</TabsTrigger>}
              <TabsTrigger className="shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent" value="school-life">School life</TabsTrigger>
              {profile.access.canManage && <TabsTrigger className="shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent" value="records">Records & documents</TabsTrigger>}
              {profile.access.canViewCounseling && <TabsTrigger className="shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent" value="counseling">Counselling</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              {editing && profile.access.canManage ? <form onSubmit={updateProfile} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2"><FormField label="First name" name="firstName" defaultValue={student.first_name} required /><FormField label="Last name" name="lastName" defaultValue={student.last_name} required /><FormField label="Admission number" name="studentId" defaultValue={student.student_id} required /><FormField label="NEMIS number" name="nemisId" defaultValue={student.nemis_id} />
                  <div className="grid gap-2"><Label htmlFor="profile-classId">Class and stream</Label><select id="profile-classId" name="classId" defaultValue={activeClassId} className="h-9 rounded-md border bg-background px-3 text-sm">{classes.map((schoolClass) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.name || `${gradeLabel[schoolClass.gradeLevel] ?? schoolClass.gradeLevel} ${schoolClass.stream}`}</option>)}</select></div>
                  <div className="grid gap-2"><Label htmlFor="profile-gender">Gender</Label><select id="profile-gender" name="gender" defaultValue={student.gender ?? ""} className="h-9 rounded-md border bg-background px-3 text-sm"><option value="">Not recorded</option><option value="female">Female</option><option value="male">Male</option></select></div>
                  <FormField label="Date of birth" name="dateOfBirth" type="date" defaultValue={student.date_of_birth} /><FormField label="Admission date" name="admissionDate" type="date" defaultValue={student.admission_date} />
                  <div className="grid gap-2"><Label htmlFor="profile-admissionStatus">Admission status</Label><select id="profile-admissionStatus" name="admissionStatus" defaultValue={student.admission_status} className="h-9 rounded-md border bg-background px-3 text-sm">{["applied", "accepted", "enrolled", "transferred", "graduated", "withdrawn"].map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
                  <FormField label="Birth certificate number" name="birthCertificateNumber" defaultValue={student.birth_certificate_number} /><FormField label="Nationality" name="nationality" defaultValue={student.nationality} /><FormField label="Religion" name="religion" defaultValue={student.religion} /><FormField label="Home language" name="homeLanguage" defaultValue={student.home_language} /><FormField label="Previous school" name="previousSchool" defaultValue={student.previous_school} />
                  <div className="grid gap-2 sm:col-span-2"><Label htmlFor="profile-address">Home address</Label><Textarea id="profile-address" name="address" defaultValue={student.address ?? ""} rows={2} /></div>
                </div><div className="flex justify-end"><Button type="submit">Save profile</Button></div>
              </form> : <>
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><UserRound className="size-4 text-primary" /> Personal and admission details</div>
                <dl className="grid gap-x-6 gap-y-5 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-3"><DisplayField label="Admission number" value={student.student_id} /><DisplayField label="NEMIS number" value={student.nemis_id} /><DisplayField label="Gender" value={student.gender} /><DisplayField label="Date of birth" value={student.date_of_birth} /><DisplayField label="Class" value={student.className} /><DisplayField label="Admission date" value={student.admission_date} /><DisplayField label="Birth certificate number" value={student.birth_certificate_number} /><DisplayField label="Nationality" value={student.nationality} /><DisplayField label="Religion" value={student.religion} /><DisplayField label="Home language" value={student.home_language} /><DisplayField label="Previous school" value={student.previous_school} /><DisplayField label="Home address" value={student.address} /></dl>
              </>}
            </TabsContent>

            <TabsContent value="family" className="mt-0 grid gap-4">
              <div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold">Parents and guardians</h3><p className="text-sm text-muted-foreground">Emergency and authorized pickup contacts</p></div>{profile.access.canManage && <Button size="sm" variant="outline" onClick={() => setAdding(adding === "guardian" ? null : "guardian")}><Plus data-icon="inline-start" />Add guardian</Button>}</div>
              {adding === "guardian" && <form onSubmit={saveGuardian} className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2"><FormField label="Name" name="name" required /><FormField label="Relationship" name="relationship" required /><FormField label="Phone" name="phone" /><FormField label="Email" name="email" type="email" /><FormField label="Occupation" name="occupation" /><FormField label="Residence address" name="residenceAddress" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="emergencyContact" className="size-4 accent-primary" /> Emergency contact</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="authorizedPickup" className="size-4 accent-primary" /> Authorized pickup</label><div className="sm:col-span-2"><Button size="sm" type="submit">Save guardian</Button></div></form>}
              {profile.guardians.length ? profile.guardians.map((guardian) => <article key={guardian.id} className="rounded-xl border p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><h4 className="font-medium">{guardian.name}</h4><p className="text-sm text-muted-foreground">{guardian.relationship}</p></div><div className="flex flex-wrap gap-2">{guardian.emergency_contact && <Badge variant="secondary">Emergency contact</Badge>}{guardian.authorized_pickup && <Badge variant="outline">Pickup authorized</Badge>}</div></div><dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><DisplayField label="Phone" value={guardian.phone} /><DisplayField label="Email" value={guardian.email} /><DisplayField label="Occupation" value={guardian.occupation} /><DisplayField label="Residence" value={guardian.residence_address} /></dl></article>) : <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No guardian contacts have been added.</p>}
            </TabsContent>

            {profile.access.canViewHealth && <TabsContent value="health" className="mt-0 grid gap-5">
              <div className="flex items-center gap-2 text-sm font-semibold"><HeartPulse className="size-4 text-primary" /> Health and wellbeing <Badge variant="outline"><ShieldCheck className="mr-1 size-3" />Restricted</Badge></div>
              {profile.access.canEditHealth ? <form onSubmit={saveHealth} className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2"><FormField label="Medical conditions" name="medicalConditions" defaultValue={profile.healthProfile?.medical_conditions} /><FormField label="Allergies" name="allergies" defaultValue={profile.healthProfile?.allergies} /><FormField label="Blood group" name="bloodGroup" defaultValue={profile.healthProfile?.blood_group} /><FormField label="Special needs" name="specialNeeds" defaultValue={profile.healthProfile?.special_needs} /><div className="grid gap-2 sm:col-span-2"><Label htmlFor="profile-supportPlan">Support plan</Label><Textarea id="profile-supportPlan" name="supportPlan" rows={3} defaultValue={profile.healthProfile?.support_plan ?? ""} /></div><div className="grid gap-2 sm:col-span-2"><Label htmlFor="profile-immunisationRecords">Immunisation records</Label><Textarea id="profile-immunisationRecords" name="immunisationRecords" rows={3} placeholder="Vaccine | date | notes (one per line)" defaultValue={Array.isArray(profile.healthProfile?.immunisation_records) ? profile.healthProfile.immunisation_records.map((record: Record<string, unknown>) => `${String(record.vaccine ?? record.name ?? "")} | ${String(record.date ?? "")} | ${String(record.notes ?? "")}`).filter((line: string) => line.trim() !== "||").join("\n") : ""} /><p className="text-xs text-muted-foreground">Enter one record per line: vaccine, date, and optional notes separated by vertical bars.</p></div><div><Button size="sm" type="submit">Save health profile</Button></div></form> : <dl className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2"><DisplayField label="Medical conditions" value={profile.healthProfile?.medical_conditions} /><DisplayField label="Allergies" value={profile.healthProfile?.allergies} /><DisplayField label="Blood group" value={profile.healthProfile?.blood_group} /><DisplayField label="Special needs" value={profile.healthProfile?.special_needs} /><DisplayField label="Support plan" value={profile.healthProfile?.support_plan} /></dl>}
              <section className="grid gap-3"><h3 className="font-semibold">Immunisation history</h3>{Array.isArray(profile.healthProfile?.immunisation_records) && profile.healthProfile.immunisation_records.length ? <ul className="grid gap-2 sm:grid-cols-2">{profile.healthProfile.immunisation_records.map((record: Record<string, unknown>, index: number) => <li key={`${String(record.vaccine ?? record.name ?? "vaccine")}-${index}`} className="rounded-lg border p-3"><p className="font-medium">{String(record.vaccine ?? record.name ?? "Vaccine")}</p><p className="mt-1 text-sm text-muted-foreground">{String(record.date ?? "Date not recorded")}{record.notes ? ` · ${String(record.notes)}` : ""}</p></li>)}</ul> : <p className="text-sm text-muted-foreground">No immunisation records are on file.</p>}</section>
              <section className="grid gap-3"><div className="flex items-center justify-between"><h3 className="font-semibold">Clinic visits</h3>{profile.access.canEditHealth && <Button size="sm" variant="outline" onClick={() => setAdding(adding === "health_visit" ? null : "health_visit")}><Plus data-icon="inline-start" />Record visit</Button>}</div>{adding === "health_visit" && recordKind && <RecordForm studentId={studentId ?? ""} kind={recordKind} onCancel={() => setAdding(null)} onSaved={async () => { setAdding(null); await refreshProfile() }} />}{profile.healthRecords.length ? profile.healthRecords.map((record) => <article key={record.id} className="rounded-lg border p-4"><div className="flex justify-between gap-3"><h4 className="font-medium">{record.visit_date}</h4>{record.follow_up_required && <Badge variant="secondary">Follow-up {record.follow_up_date ? `· ${record.follow_up_date}` : "required"}</Badge>}</div><p className="mt-2 text-sm">{record.diagnosis || record.symptoms || "Visit recorded"}</p><p className="mt-1 text-sm text-muted-foreground">{record.treatment || record.medication || "No treatment details"}</p></article>) : <p className="text-sm text-muted-foreground">No clinic visits are on file.</p>}</section>
            </TabsContent>}

            <TabsContent value="school-life" className="mt-0 grid gap-5">
              {profile.access.canManage ? <form onSubmit={saveEnrichment} className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2"><div className="grid gap-2"><Label htmlFor="profile-boardingStatus">Boarding status</Label><select id="profile-boardingStatus" name="boardingStatus" defaultValue={profile.enrichmentProfile?.boarding_status ?? "day"} className="h-9 rounded-md border bg-background px-3 text-sm"><option value="day">Day student</option><option value="boarding">Boarding</option></select></div><FormField label="Dormitory" name="dormitory" defaultValue={profile.enrichmentProfile?.dormitory} /><FormField label="Bed number" name="bedNumber" defaultValue={profile.enrichmentProfile?.bed_number} /><FormField label="Transport route" name="transportRoute" defaultValue={profile.enrichmentProfile?.transport_route} /><FormField label="Transport stage" name="transportStage" defaultValue={profile.enrichmentProfile?.transport_stage} /><FormField label="House assignment" name="houseAssignment" defaultValue={profile.enrichmentProfile?.house_assignment} /><FormField label="Clubs (comma-separated)" name="clubs" defaultValue={Array.isArray(profile.enrichmentProfile?.clubs) ? profile.enrichmentProfile.clubs.join(", ") : ""} /><FormField label="Sports (comma-separated)" name="sports" defaultValue={Array.isArray(profile.enrichmentProfile?.sports) ? profile.enrichmentProfile.sports.join(", ") : ""} /><div><Button size="sm" type="submit">Save school life</Button></div></form> : <dl className="grid gap-x-6 gap-y-5 rounded-xl border p-4 sm:grid-cols-2"><DisplayField label="Boarding status" value={profile.enrichmentProfile?.boarding_status} /><DisplayField label="Dormitory" value={profile.enrichmentProfile?.dormitory} /><DisplayField label="Bed number" value={profile.enrichmentProfile?.bed_number} /><DisplayField label="Transport route" value={profile.enrichmentProfile?.transport_route} /><DisplayField label="Transport stage" value={profile.enrichmentProfile?.transport_stage} /><DisplayField label="House assignment" value={profile.enrichmentProfile?.house_assignment} /><DisplayField label="Clubs" value={profile.enrichmentProfile?.clubs?.join(", ")} /><DisplayField label="Sports" value={profile.enrichmentProfile?.sports?.join(", ")} /></dl>}
            </TabsContent>

            {profile.access.canManage && <TabsContent value="records" className="mt-0 grid gap-6">
              <section className="grid gap-3"><div className="flex items-center justify-between gap-2"><div><h3 className="font-semibold">Transfers</h3><p className="text-sm text-muted-foreground">Previous school movements</p></div><Button size="sm" variant="outline" onClick={() => setAdding(adding === "transfer" ? null : "transfer")}><Plus data-icon="inline-start" />Add transfer</Button></div>{adding === "transfer" && recordKind && <RecordForm studentId={studentId ?? ""} kind={recordKind} onCancel={() => setAdding(null)} onSaved={async () => { setAdding(null); await refreshProfile() }} />}{profile.transfers.length ? profile.transfers.map((record) => <article key={record.id} className="rounded-lg border p-4"><p className="font-medium">{record.direction === "inbound" ? "Admitted from" : "Transferred to"} {record.direction === "inbound" ? record.from_school : record.to_school}</p><p className="mt-1 text-sm text-muted-foreground">{record.transfer_date}{record.notes ? ` · ${record.notes}` : ""}</p></article>) : <p className="text-sm text-muted-foreground">No transfer history recorded.</p>}</section>
              <Separator />
              <section className="grid gap-3"><div className="flex items-center justify-between gap-2"><div><h3 className="font-semibold">Discipline</h3><p className="text-sm text-muted-foreground">Restricted school leadership records</p></div><Button size="sm" variant="outline" onClick={() => setAdding(adding === "discipline" ? null : "discipline")}><Plus data-icon="inline-start" />Add record</Button></div>{adding === "discipline" && recordKind && <RecordForm studentId={studentId ?? ""} kind={recordKind} onCancel={() => setAdding(null)} onSaved={async () => { setAdding(null); await refreshProfile() }} />}{profile.disciplineRecords.length ? profile.disciplineRecords.map((record) => <article key={record.id} className="rounded-lg border p-4"><div className="flex justify-between gap-2"><h4 className="font-medium">{record.category}</h4><span className="text-sm text-muted-foreground">{record.incident_date}</span></div><p className="mt-2 text-sm">{record.description}</p>{record.action_taken && <p className="mt-1 text-sm text-muted-foreground">Action: {record.action_taken}</p>}</article>) : <p className="text-sm text-muted-foreground">No discipline records on file.</p>}</section>
              <Separator />
              <section className="grid gap-3"><div><h3 className="font-semibold">Documents</h3><p className="text-sm text-muted-foreground">Private school documents are available through expiring links.</p></div><form onSubmit={uploadDocument} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-end"><div className="grid flex-1 gap-2"><Label htmlFor="profile-file">Choose a document (PDF, JPEG, PNG, WebP; up to 10 MB)</Label><Input id="profile-file" name="file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" required /></div><div className="grid gap-2 sm:w-44"><Label htmlFor="profile-documentType">Document type</Label><select id="profile-documentType" value={uploadType} onChange={(event) => setUploadType(event.target.value)} className="h-9 rounded-md border bg-background px-3 text-sm">{[["birth_certificate", "Birth certificate"], ["report_form", "Report form"], ["transfer_letter", "Transfer letter"], ["medical_record", "Medical record"], ["profile_photo", "Profile photo"], ["other", "Other"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><Button type="submit" disabled={uploading}>{uploading ? "Uploading…" : "Upload"}</Button></form>{profile.documents.length ? <ul className="grid gap-2">{profile.documents.map((document) => <li key={document.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"><div className="flex min-w-0 items-center gap-3"><FileText className="size-4 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-sm font-medium">{document.file_name}</p><p className="text-xs text-muted-foreground">{document.document_type.replaceAll("_", " ")} · {Math.max(1, Math.ceil(document.file_size / 1024))} KB</p></div></div>{document.signedUrl && <a className="text-sm font-medium text-primary underline-offset-4 hover:underline" href={document.signedUrl} target="_blank" rel="noreferrer">Open</a>}</li>)}</ul> : <p className="text-sm text-muted-foreground">No documents have been uploaded.</p>}</section>
            </TabsContent>}

            {profile.access.canViewCounseling && <TabsContent value="counseling" className="mt-0 grid gap-4"><div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold">Counselling sessions</h3><p className="text-sm text-muted-foreground">Private records visible only to the assigned counsellor</p></div><Button size="sm" variant="outline" onClick={() => setAdding(adding === "counseling_session" ? null : "counseling_session")}><Plus data-icon="inline-start" />Add session</Button></div>{adding === "counseling_session" && recordKind && <RecordForm studentId={studentId ?? ""} kind={recordKind} onCancel={() => setAdding(null)} onSaved={async () => { setAdding(null); await refreshProfile() }} />}{profile.counselingSessions?.length ? profile.counselingSessions.map((session) => <article key={session.id} className="rounded-xl border p-4"><div className="flex justify-between gap-2"><h4 className="font-medium">{session.session_type || "Counselling session"}</h4><span className="text-sm text-muted-foreground">{session.session_date}</span></div><p className="mt-2 text-sm">{session.reason || "No reason provided"}</p>{session.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{session.notes}</p>}{session.follow_up_required && <Badge className="mt-3" variant="secondary">Follow-up {session.follow_up_date || "required"}</Badge>}</article>) : <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No counselling notes are available for your account.</p>}</TabsContent>}
          </Tabs>
        </div>
      </div>}
    </DialogContent>
  </Dialog>
}
