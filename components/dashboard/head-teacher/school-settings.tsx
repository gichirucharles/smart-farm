"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import useSWR from "swr"
import { AlertCircle, Download, FileText, Plus, Save, Trash2, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { supabaseBrowser } from "@/lib/supabase-browser"
import {
  DEFAULT_EDITABLE_SCHOOL_SETTINGS,
  DEFAULT_SCHOOL_PROFILE,
  MAX_POLICY_DOCUMENT_BYTES,
  POLICY_DOCUMENT_BUCKET,
  POLICY_DOCUMENT_MIME_TYPES,
  type EditableSchoolSettings,
  type SchoolProfile,
  type SchoolSettings,
} from "@/lib/school-settings"

interface SettingsResponse {
  profile: SchoolProfile
  settings: SchoolSettings
  updatedAt: string | null
}

interface PolicyDocument {
  id: string
  file_name: string
  content_type: string
  file_size: number
  created_at: string
  signedUrl: string | null
}

const fetcher = async (url: string) => {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error ?? "Unable to load school settings")
  return result
}

function TextField({ id, label, value, onChange, type = "text", required = false }: {
  id: string
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </Field>
  )
}

function TextAreaField({ id, label, value, onChange, rows = 3 }: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea id={id} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </Field>
  )
}

function formatFileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function SchoolSettings() {
  const { data, error, isLoading, mutate } = useSWR<SettingsResponse>("/api/school-settings", fetcher)
  const { data: documentData, mutate: mutateDocuments } = useSWR<{ documents: PolicyDocument[] }>(
    "/api/school-settings/documents",
    fetcher,
  )
  const [profile, setProfile] = useState<SchoolProfile>(DEFAULT_SCHOOL_PROFILE)
  const [settings, setSettings] = useState<SchoolSettings>({
    ...DEFAULT_EDITABLE_SCHOOL_SETTINGS,
    feeStructure: [],
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [formError, setFormError] = useState("")

  useEffect(() => {
    if (!data) return
    setProfile(data.profile)
    setSettings(data.settings)
  }, [data])

  const updateProfile = <Key extends keyof SchoolProfile>(key: Key, value: SchoolProfile[Key]) => {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setFormError("")
    setStatusMessage("")
    const { feeStructure: _feeStructure, ...editableSettings } = settings

    try {
      const response = await fetch("/api/school-settings", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, settings: editableSettings as EditableSchoolSettings }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Unable to save school settings")
      setProfile(result.profile)
      setSettings(result.settings)
      await mutate(result, false)
      setStatusMessage("Settings saved. Changes are now available to your school dashboards.")
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save school settings")
    } finally {
      setIsSaving(false)
    }
  }

  const uploadPolicyDocument = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setFormError("")
    setStatusMessage("")

    if (file.size > MAX_POLICY_DOCUMENT_BYTES) {
      setFormError("Choose a document smaller than 12 MB.")
      return
    }
    if (!POLICY_DOCUMENT_MIME_TYPES.includes(file.type as (typeof POLICY_DOCUMENT_MIME_TYPES)[number])) {
      setFormError("Upload a PDF, Word document, or plain text file.")
      return
    }

    setIsUploading(true)
    try {
      const prepareResponse = await fetch("/api/school-settings/documents", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "prepare", fileName: file.name, contentType: file.type, fileSize: file.size }),
      })
      const prepared = await prepareResponse.json()
      if (!prepareResponse.ok) throw new Error(prepared.error ?? "Unable to prepare the upload")

      const { error: uploadError } = await supabaseBrowser.storage
        .from(POLICY_DOCUMENT_BUCKET)
        .uploadToSignedUrl(prepared.objectPath, prepared.token, file, { contentType: file.type, upsert: false })
      if (uploadError) throw uploadError

      const completeResponse = await fetch("/api/school-settings/documents", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          objectPath: prepared.objectPath,
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      })
      const completed = await completeResponse.json()
      if (!completeResponse.ok) throw new Error(completed.error ?? "Unable to save the document")
      await mutateDocuments()
      setStatusMessage("Policy document uploaded securely.")
    } catch (uploadError) {
      setFormError(uploadError instanceof Error ? uploadError.message : "Unable to upload policy document")
    } finally {
      setIsUploading(false)
    }
  }

  const removeDocument = async (documentId: string) => {
    setFormError("")
    setStatusMessage("")
    try {
      const response = await fetch(`/api/school-settings/documents/${documentId}`, {
        method: "DELETE",
        credentials: "same-origin",
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Unable to remove document")
      await mutateDocuments()
      setStatusMessage("Policy document removed.")
    } catch (removeError) {
      setFormError(removeError instanceof Error ? removeError.message : "Unable to remove document")
    }
  }

  const updateTerm = (index: number, key: "name" | "startDate" | "endDate", value: string) => {
    setSettings((current) => ({
      ...current,
      terms: current.terms.map((term, termIndex) => termIndex === index ? { ...term, [key]: value } : term),
    }))
  }

  const updateHoliday = (index: number, key: "name" | "date" | "description", value: string) => {
    setSettings((current) => ({
      ...current,
      holidays: current.holidays.map((holiday, holidayIndex) => holidayIndex === index ? { ...holiday, [key]: value } : holiday),
    }))
  }

  const updateClass = (index: number, key: "grade" | "streams" | "subjects", value: string) => {
    setSettings((current) => ({
      ...current,
      classStructure: current.classStructure.map((item, classIndex) => classIndex === index
        ? { ...item, [key]: key === "grade" ? value : value.split(",").map((entry) => entry.trim()).filter(Boolean) }
        : item),
    }))
  }

  const updatePolicy = (key: keyof SchoolSettings["policies"], value: string) => {
    setSettings((current) => ({ ...current, policies: { ...current.policies, [key]: value } }))
  }

  if (isLoading) {
    return <div role="status" className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading secure school settings…</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertDescription>{error.message}. Sign in with your school account and try again.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">Head teacher workspace</Badge>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">School settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage the shared school profile and academic setup used across staff and family dashboards.</p>
          </div>
        </div>
        {data?.updatedAt && <p className="text-xs text-muted-foreground">Last saved {new Date(data.updatedAt).toLocaleString()}</p>}
      </div>

      {formError && <Alert variant="destructive"><AlertCircle /><AlertDescription>{formError}</AlertDescription></Alert>}
      {statusMessage && <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm" role="status" aria-live="polite">{statusMessage}</p>}

      <Tabs defaultValue="profile" className="flex flex-col gap-6">
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg border bg-background p-1">
          <TabsTrigger value="profile">School profile</TabsTrigger>
          <TabsTrigger value="academic">Academic year</TabsTrigger>
          <TabsTrigger value="classes">Classes &amp; subjects</TabsTrigger>
          <TabsTrigger value="timetable">Timetable &amp; grading</TabsTrigger>
          <TabsTrigger value="policies">Policies &amp; facilities</TabsTrigger>
          <TabsTrigger value="documents">Policy documents</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={saveSettings} className="flex flex-col gap-6">
            <Card>
              <CardHeader><CardTitle>School identity</CardTitle><CardDescription>These details are shared with staff and family dashboards.</CardDescription></CardHeader>
              <CardContent>
                <FieldGroup className="grid gap-4 sm:grid-cols-2">
                  <TextField id="school-name" label="School name" value={profile.schoolName} onChange={(value) => updateProfile("schoolName", value)} required />
                  <TextField id="school-type" label="School type" value={profile.schoolType} onChange={(value) => updateProfile("schoolType", value)} />
                  <TextField id="government-id" label="Government ID / NEMIS code" value={profile.governmentId} onChange={(value) => updateProfile("governmentId", value)} />
                  <TextField id="registration-number" label="Registration number" value={profile.registrationNumber} onChange={(value) => updateProfile("registrationNumber", value)} />
                  <TextField id="school-motto" label="School motto" value={profile.motto} onChange={(value) => updateProfile("motto", value)} />
                  <TextField id="school-logo" label="School logo URL" value={profile.logoUrl} onChange={(value) => updateProfile("logoUrl", value)} />
                  <TextAreaField id="school-description" label="School description" value={profile.description} onChange={(value) => updateProfile("description", value)} />
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Contact and location</CardTitle><CardDescription>Update the address and contact details shown in school communications.</CardDescription></CardHeader>
              <CardContent>
                <FieldGroup className="grid gap-4 sm:grid-cols-2">
                  <TextField id="school-address" label="Street address" value={profile.address} onChange={(value) => updateProfile("address", value)} />
                  <TextField id="school-city" label="Town or city" value={profile.city} onChange={(value) => updateProfile("city", value)} />
                  <TextField id="school-county" label="County" value={profile.county} onChange={(value) => updateProfile("county", value)} />
                  <TextField id="school-postal-code" label="Postal code" value={profile.postalCode} onChange={(value) => updateProfile("postalCode", value)} />
                  <TextField id="school-phone" label="School phone" type="tel" value={profile.phone} onChange={(value) => updateProfile("phone", value)} />
                  <TextField id="school-email" label="School email" type="email" value={profile.email} onChange={(value) => updateProfile("email", value)} />
                  <TextField id="school-website" label="Website" value={profile.website} onChange={(value) => updateProfile("website", value)} />
                  <TextField id="established-year" label="Established year" type="number" value={profile.establishedYear} onChange={(value) => updateProfile("establishedYear", value === "" ? "" : Number(value))} />
                  <TextField id="student-capacity" label="Student capacity" type="number" value={profile.studentCapacity} onChange={(value) => updateProfile("studentCapacity", value === "" ? "" : Number(value))} />
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Leadership and staff</CardTitle><CardDescription>Contact information captured during school registration.</CardDescription></CardHeader>
              <CardContent className="flex flex-col gap-6">
                <FieldSet><FieldLegend>Director</FieldLegend><FieldGroup className="grid gap-4 sm:grid-cols-3">
                  <TextField id="director-name" label="Name" value={profile.directorName} onChange={(value) => updateProfile("directorName", value)} />
                  <TextField id="director-email" label="Email" type="email" value={profile.directorEmail} onChange={(value) => updateProfile("directorEmail", value)} />
                  <TextField id="director-phone" label="Phone" type="tel" value={profile.directorPhone} onChange={(value) => updateProfile("directorPhone", value)} />
                </FieldGroup></FieldSet>
                <FieldSet><FieldLegend>Head teacher</FieldLegend><FieldGroup className="grid gap-4 sm:grid-cols-3">
                  <TextField id="head-teacher-name" label="Name" value={profile.headTeacherName} onChange={(value) => updateProfile("headTeacherName", value)} />
                  <TextField id="head-teacher-email" label="Email" type="email" value={profile.headTeacherEmail} onChange={(value) => updateProfile("headTeacherEmail", value)} />
                  <TextField id="head-teacher-phone" label="Phone" type="tel" value={profile.headTeacherPhone} onChange={(value) => updateProfile("headTeacherPhone", value)} />
                </FieldGroup></FieldSet>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-medium">Additional staff</h3><p className="text-xs text-muted-foreground">Name, position, email, and phone for registered staff.</p></div>
                    <Button type="button" variant="outline" size="sm" onClick={() => updateProfile("staff", [...profile.staff, { id: `staff-${Date.now()}`, name: "", position: "", email: "", phone: "" }])}><Plus data-icon="inline-start" />Add staff</Button>
                  </div>
                  {profile.staff.map((staff, index) => <div key={staff.id} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_1.2fr_1fr_auto]">
                    <Input aria-label={`Staff ${index + 1} name`} placeholder="Name" value={staff.name} onChange={(event) => updateProfile("staff", profile.staff.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} />
                    <Input aria-label={`Staff ${index + 1} position`} placeholder="Position" value={staff.position} onChange={(event) => updateProfile("staff", profile.staff.map((item, itemIndex) => itemIndex === index ? { ...item, position: event.target.value } : item))} />
                    <Input aria-label={`Staff ${index + 1} email`} type="email" placeholder="Email" value={staff.email} onChange={(event) => updateProfile("staff", profile.staff.map((item, itemIndex) => itemIndex === index ? { ...item, email: event.target.value } : item))} />
                    <Input aria-label={`Staff ${index + 1} phone`} type="tel" placeholder="Phone" value={staff.phone} onChange={(event) => updateProfile("staff", profile.staff.map((item, itemIndex) => itemIndex === index ? { ...item, phone: event.target.value } : item))} />
                    <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${staff.name || `staff member ${index + 1}`}`} onClick={() => updateProfile("staff", profile.staff.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /></Button>
                  </div>)}
                </div>
              </CardContent>
            </Card>
            <SaveButton isSaving={isSaving} />
          </form>
        </TabsContent>

        <TabsContent value="academic">
          <form onSubmit={saveSettings} className="flex flex-col gap-6">
            <Card>
              <CardHeader><CardTitle>Academic year and terms</CardTitle><CardDescription>Term dates are shared with calendar views across the school.</CardDescription></CardHeader>
              <CardContent className="flex flex-col gap-5">
                <FieldGroup className="max-w-sm"><TextField id="academic-year" label="Academic year" value={settings.academicYear} onChange={(value) => setSettings((current) => ({ ...current, academicYear: value }))} /></FieldGroup>
                <div className="grid gap-4 lg:grid-cols-3">
                  {settings.terms.map((term, index) => <FieldSet key={term.id} className="rounded-lg border p-4"><FieldLegend>{term.name || `Term ${index + 1}`}</FieldLegend><FieldGroup className="gap-3">
                    <TextField id={`term-${index}-name`} label="Term name" value={term.name} onChange={(value) => updateTerm(index, "name", value)} />
                    <TextField id={`term-${index}-start`} label="Start date" type="date" value={term.startDate} onChange={(value) => updateTerm(index, "startDate", value)} />
                    <TextField id={`term-${index}-end`} label="End date" type="date" value={term.endDate} onChange={(value) => updateTerm(index, "endDate", value)} />
                  </FieldGroup></FieldSet>)}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between"><div><h3 className="text-sm font-medium">School holidays</h3><p className="text-xs text-muted-foreground">These appear on the shared school calendar.</p></div>
                    <Button type="button" variant="outline" size="sm" onClick={() => setSettings((current) => ({ ...current, holidays: [...current.holidays, { id: `holiday-${Date.now()}`, name: "", date: "", description: "" }] }))}><Plus data-icon="inline-start" />Add holiday</Button>
                  </div>
                  {settings.holidays.map((holiday, index) => <div key={holiday.id} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_1.5fr_auto]">
                    <Input aria-label={`Holiday ${index + 1} name`} placeholder="Holiday name" value={holiday.name} onChange={(event) => updateHoliday(index, "name", event.target.value)} />
                    <Input aria-label={`Holiday ${index + 1} date`} type="date" value={holiday.date} onChange={(event) => updateHoliday(index, "date", event.target.value)} />
                    <Input aria-label={`Holiday ${index + 1} description`} placeholder="Description" value={holiday.description} onChange={(event) => updateHoliday(index, "description", event.target.value)} />
                    <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${holiday.name || `holiday ${index + 1}`}`} onClick={() => setSettings((current) => ({ ...current, holidays: current.holidays.filter((_, itemIndex) => itemIndex !== index) }))}><Trash2 /></Button>
                  </div>)}
                  {settings.holidays.length === 0 && <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No holidays added yet.</p>}
                </div>
              </CardContent>
            </Card>
            <SaveButton isSaving={isSaving} />
          </form>
        </TabsContent>

        <TabsContent value="classes">
          <form onSubmit={saveSettings} className="flex flex-col gap-6">
            <Card>
              <CardHeader><CardTitle>Class and grade structure</CardTitle><CardDescription>Set grades, streams, and the subjects offered at each level.</CardDescription></CardHeader>
              <CardContent className="flex flex-col gap-4">
                {settings.classStructure.map((item, index) => <div key={item.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_1fr_1.5fr_auto]">
                  <Field><FieldLabel htmlFor={`grade-${index}`}>Grade or level</FieldLabel><Input id={`grade-${index}`} value={item.grade} onChange={(event) => updateClass(index, "grade", event.target.value)} /></Field>
                  <Field><FieldLabel htmlFor={`streams-${index}`}>Streams</FieldLabel><Input id={`streams-${index}`} value={item.streams.join(", ")} onChange={(event) => updateClass(index, "streams", event.target.value)} /><FieldDescription>Separate names with commas.</FieldDescription></Field>
                  <Field><FieldLabel htmlFor={`subjects-${index}`}>Subjects</FieldLabel><Input id={`subjects-${index}`} value={item.subjects.join(", ")} onChange={(event) => updateClass(index, "subjects", event.target.value)} /><FieldDescription>Separate subjects with commas.</FieldDescription></Field>
                  <Button type="button" variant="ghost" size="icon" className="self-end" aria-label={`Remove ${item.grade || `grade ${index + 1}`}`} onClick={() => setSettings((current) => ({ ...current, classStructure: current.classStructure.filter((_, itemIndex) => itemIndex !== index) }))}><Trash2 /></Button>
                </div>)}
                {settings.classStructure.length === 0 && <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No grade structure added yet.</p>}
                <Button type="button" variant="outline" className="w-fit" onClick={() => setSettings((current) => ({ ...current, classStructure: [...current.classStructure, { id: `grade-${Date.now()}`, grade: "", streams: [], subjects: [] }] }))}><Plus data-icon="inline-start" />Add grade</Button>
              </CardContent>
            </Card>
            <SaveButton isSaving={isSaving} />
          </form>
        </TabsContent>

        <TabsContent value="timetable">
          <form onSubmit={saveSettings} className="flex flex-col gap-6">
            <Card>
              <CardHeader><CardTitle>Timetable defaults</CardTitle><CardDescription>Shared operational timings for lesson and attendance dashboards.</CardDescription></CardHeader>
              <CardContent><FieldGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <TextField id="school-start" label="School start" type="time" value={settings.timetable.schoolStart} onChange={(value) => setSettings((current) => ({ ...current, timetable: { ...current.timetable, schoolStart: value } }))} />
                <TextField id="school-end" label="School end" type="time" value={settings.timetable.schoolEnd} onChange={(value) => setSettings((current) => ({ ...current, timetable: { ...current.timetable, schoolEnd: value } }))} />
                <TextField id="lessons-per-day" label="Lessons per day" type="number" value={settings.timetable.lessonsPerDay} onChange={(value) => setSettings((current) => ({ ...current, timetable: { ...current.timetable, lessonsPerDay: Number(value) } }))} />
                <TextField id="lesson-duration" label="Lesson duration (minutes)" type="number" value={settings.timetable.lessonDurationMinutes} onChange={(value) => setSettings((current) => ({ ...current, timetable: { ...current.timetable, lessonDurationMinutes: Number(value) } }))} />
                <TextField id="short-break" label="Short break (minutes)" type="number" value={settings.timetable.shortBreakMinutes} onChange={(value) => setSettings((current) => ({ ...current, timetable: { ...current.timetable, shortBreakMinutes: Number(value) } }))} />
                <TextField id="lunch-duration" label="Lunch break (minutes)" type="number" value={settings.timetable.lunchMinutes} onChange={(value) => setSettings((current) => ({ ...current, timetable: { ...current.timetable, lunchMinutes: Number(value) } }))} />
              </FieldGroup></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Assessment and grading</CardTitle><CardDescription>Set the pass mark and performance bands available to academic dashboards.</CardDescription></CardHeader>
              <CardContent className="flex flex-col gap-5">
                <FieldGroup className="max-w-xs"><TextField id="pass-mark" label="Pass mark (%)" type="number" value={settings.assessment.passMark} onChange={(value) => setSettings((current) => ({ ...current, assessment: { ...current.assessment, passMark: Number(value) } }))} /></FieldGroup>
                {settings.assessment.gradingBands.map((band, index) => <div key={`${band.label}-${index}`} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1.5fr_1fr_1fr]">
                  <Field><FieldLabel htmlFor={`band-name-${index}`}>Performance band</FieldLabel><Input id={`band-name-${index}`} value={band.label} onChange={(event) => setSettings((current) => ({ ...current, assessment: { ...current.assessment, gradingBands: current.assessment.gradingBands.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) } }))} /></Field>
                  <Field><FieldLabel htmlFor={`band-min-${index}`}>Minimum (%)</FieldLabel><Input id={`band-min-${index}`} type="number" min={0} max={100} value={band.min} onChange={(event) => setSettings((current) => ({ ...current, assessment: { ...current.assessment, gradingBands: current.assessment.gradingBands.map((item, itemIndex) => itemIndex === index ? { ...item, min: Number(event.target.value) } : item) } }))} /></Field>
                  <Field><FieldLabel htmlFor={`band-max-${index}`}>Maximum (%)</FieldLabel><Input id={`band-max-${index}`} type="number" min={0} max={100} value={band.max} onChange={(event) => setSettings((current) => ({ ...current, assessment: { ...current.assessment, gradingBands: current.assessment.gradingBands.map((item, itemIndex) => itemIndex === index ? { ...item, max: Number(event.target.value) } : item) } }))} /></Field>
                </div>)}
                <Button type="button" variant="outline" className="w-fit" onClick={() => setSettings((current) => ({ ...current, assessment: { ...current.assessment, gradingBands: [...current.assessment.gradingBands, { label: "", min: 0, max: 0 }] } }))}><Plus data-icon="inline-start" />Add grading band</Button>
              </CardContent>
            </Card>
            <SaveButton isSaving={isSaving} />
          </form>
        </TabsContent>

        <TabsContent value="policies">
          <form onSubmit={saveSettings} className="flex flex-col gap-6">
            <Card>
              <CardHeader><CardTitle>School policies</CardTitle><CardDescription>Keep policy summaries in one place for staff reference.</CardDescription></CardHeader>
              <CardContent><FieldGroup className="gap-5">
                <TextAreaField id="attendance-policy" label="Attendance policy" value={settings.policies.attendance} onChange={(value) => updatePolicy("attendance", value)} />
                <TextAreaField id="uniform-policy" label="Uniform policy" value={settings.policies.uniform} onChange={(value) => updatePolicy("uniform", value)} />
                <TextAreaField id="discipline-policy" label="Discipline policy" value={settings.policies.discipline} onChange={(value) => updatePolicy("discipline", value)} />
                <TextAreaField id="admissions-policy" label="Admissions policy" value={settings.policies.admissions} onChange={(value) => updatePolicy("admissions", value)} />
              </FieldGroup></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Facilities</CardTitle><CardDescription>Shared facilities overview for school dashboards.</CardDescription></CardHeader>
              <CardContent className="flex flex-col gap-5">
                <FieldGroup className="max-w-xs"><TextField id="classroom-count" label="Number of classrooms" type="number" value={settings.facilities.classrooms} onChange={(value) => setSettings((current) => ({ ...current, facilities: { ...current.facilities, classrooms: Number(value) } }))} /></FieldGroup>
                <FieldSet><FieldLegend>Available facilities</FieldLegend><FieldGroup className="grid gap-3 sm:grid-cols-2">
                  {([
                    ["scienceLab", "Science laboratory"],
                    ["computerLab", "Computer laboratory"],
                    ["languageLab", "Language laboratory"],
                    ["library", "Library"],
                    ["sportsGround", "Sports ground"],
                  ] as const).map(([key, label]) => <Field key={key} orientation="horizontal" className="items-center justify-between rounded-lg border px-3 py-2"><FieldLabel htmlFor={`facility-${key}`}>{label}</FieldLabel><Switch id={`facility-${key}`} checked={settings.facilities[key]} onCheckedChange={(checked) => setSettings((current) => ({ ...current, facilities: { ...current.facilities, [key]: checked } }))} /></Field>)}
                </FieldGroup></FieldSet>
              </CardContent>
            </Card>
            <SaveButton isSaving={isSaving} />
          </form>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader><CardTitle>Policy documents</CardTitle><CardDescription>Private school storage. Supported formats: PDF, Word, and plain text; maximum 12 MB per file.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-3 rounded-lg border border-dashed p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3"><div className="rounded-lg bg-muted p-2"><Upload /></div><div><p className="text-sm font-medium">Add a school policy document</p><p className="text-xs text-muted-foreground">Uploads are private and scoped to this school.</p></div></div>
                <Button type="button" variant="outline" disabled={isUploading} asChild><label className="cursor-pointer">{isUploading ? "Uploading…" : "Choose document"}<Input className="sr-only" type="file" accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={uploadPolicyDocument} /></label></Button>
              </div>
              <div className="flex flex-col divide-y rounded-lg border">
                {(documentData?.documents ?? []).map((document) => <div key={document.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3"><FileText className="shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-sm font-medium">{document.file_name}</p><p className="text-xs text-muted-foreground">{formatFileSize(document.file_size)} · {new Date(document.created_at).toLocaleDateString()}</p></div></div>
                  <div className="flex items-center gap-2">
                    {document.signedUrl && <Button asChild variant="outline" size="sm"><a href={document.signedUrl} target="_blank" rel="noreferrer"><Download data-icon="inline-start" />Download</a></Button>}
                    <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${document.file_name}`} onClick={() => removeDocument(document.id)}><Trash2 /></Button>
                  </div>
                </div>)}
                {documentData?.documents?.length === 0 && <p className="p-4 text-sm text-muted-foreground">No policy documents uploaded yet.</p>}
                {!documentData && <p className="p-4 text-sm text-muted-foreground">Loading documents…</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader><CardTitle>Fee structure</CardTitle><CardDescription>Fee amounts are managed by the school director and are read-only in this workspace.</CardDescription></CardHeader>
            <CardContent>
              {settings.feeStructure.length ? <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-left text-sm"><thead><tr className="border-b text-muted-foreground"><th className="px-3 py-2 font-medium">Fee item</th><th className="px-3 py-2 font-medium">Amount</th><th className="px-3 py-2 font-medium">Currency</th><th className="px-3 py-2 font-medium">Frequency</th></tr></thead><tbody>{settings.feeStructure.map((fee, index) => <tr key={`${fee.name}-${index}`} className="border-b last:border-0"><td className="px-3 py-3">{fee.name}</td><td className="px-3 py-3">{fee.amount.toLocaleString()}</td><td className="px-3 py-3">{fee.currency}</td><td className="px-3 py-3">{fee.frequency}</td></tr>)}</tbody></table></div> : <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Fee structure has not been added by the school director.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SaveButton({ isSaving }: { isSaving: boolean }) {
  return <div className="flex justify-end"><Button type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save changes"}<Save data-icon="inline-start" /></Button></div>
}
