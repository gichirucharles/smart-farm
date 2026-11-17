"use client"

import { useState, type FormEvent } from "react"
import { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type SchoolClass = { id: string; name: string; gradeLevel: string; stream: string }

const gradeLabels: Record<string, string> = {
  playgroup: "Play Group", nursery: "Nursery", kg1: "KG 1", kg2: "KG 2",
  grade1: "Grade 1", grade2: "Grade 2", grade3: "Grade 3", grade4: "Grade 4", grade5: "Grade 5",
  grade6: "Grade 6", grade7: "Grade 7", grade8: "Grade 8", grade9: "Grade 9",
}

function Field({ label, name, type = "text", required = false, maxLength }: { label: string; name: string; type?: string; required?: boolean; maxLength?: number }) {
  return <div className="grid gap-2"><Label htmlFor={`student-${name}`}>{label}{required ? " *" : ""}</Label><Input id={`student-${name}`} name={name} type={type} required={required} maxLength={maxLength} /></div>
}

export function StudentRegistrationDialog({ open, onOpenChange, classes }: { open: boolean; onOpenChange: (open: boolean) => void; classes: SchoolClass[] }) {
  const [selectedClass, setSelectedClass] = useState("")
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const classEntry = classes.find((item) => item.id === selectedClass)
    if (!classEntry) {
      setSubmitError("Select an active class and stream")
      return
    }
    setSubmitError("")
    const value = (key: string) => String(form.get(key) ?? "").trim()
    const guardianName = value("guardianName")
    const payload = {
      studentId: value("studentId"), nemisId: value("nemisId") || null, firstName: value("firstName"), lastName: value("lastName"),
      dateOfBirth: value("dateOfBirth") || null, gender: value("gender") || null, gradeLevel: classEntry.gradeLevel, stream: classEntry.stream,
      admissionDate: value("admissionDate") || null, birthCertificateNumber: value("birthCertificateNumber") || null, nationality: value("nationality") || null,
      religion: value("religion") || null, homeLanguage: value("homeLanguage") || null, previousSchool: value("previousSchool") || null,
      admissionStatus: value("admissionStatus") || "enrolled", address: value("address") || null,
      guardians: guardianName ? [{ name: guardianName, relationship: value("relationship"), phone: value("guardianPhone") || null, email: value("guardianEmail") || null, occupation: value("occupation") || null, residenceAddress: value("guardianAddress") || null, emergencyContact: form.get("emergencyContact") === "on", authorizedPickup: form.get("authorizedPickup") === "on" }] : [],
      healthProfile: { medicalConditions: value("medicalConditions") || null, allergies: value("allergies") || null, bloodGroup: value("bloodGroup") || null, specialNeeds: null, supportPlan: null },
      enrichmentProfile: { boardingStatus: value("boardingStatus") || "day", dormitory: null, bedNumber: null, transportRoute: value("transportRoute") || null, transportStage: null, clubs: [], sports: [], houseAssignment: null },
    }

    setSaving(true)
    try {
      const response = await fetch("/api/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to register student")
      await mutate("/api/students")
      setSelectedClass("")
      onOpenChange(false)
      event.currentTarget.reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to register student")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Register a student</DialogTitle>
          <DialogDescription>Add the learner, class placement and primary guardian to the school&apos;s records.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-6">
          <section className="grid gap-4">
            <h3 className="text-sm font-semibold">Student details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" name="firstName" required maxLength={80} />
              <Field label="Last name" name="lastName" required maxLength={80} />
              <Field label="Admission number" name="studentId" required maxLength={40} />
              <Field label="NEMIS number" name="nemisId" maxLength={60} />
              <div className="grid gap-2"><Label htmlFor="student-class">Class and stream *</Label><Select value={selectedClass} onValueChange={setSelectedClass}><SelectTrigger id="student-class"><SelectValue placeholder="Select a class" /></SelectTrigger><SelectContent>{classes.map((schoolClass) => <SelectItem key={schoolClass.id} value={schoolClass.id}>{schoolClass.name || `${gradeLabels[schoolClass.gradeLevel] ?? schoolClass.gradeLevel} ${schoolClass.stream}`}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid gap-2"><Label htmlFor="student-gender">Gender</Label><select id="student-gender" name="gender" className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="">Select</option><option value="female">Female</option><option value="male">Male</option></select></div>
              <Field label="Date of birth" name="dateOfBirth" type="date" />
              <Field label="Admission date" name="admissionDate" type="date" />
              <div className="grid gap-2"><Label htmlFor="student-admissionStatus">Admission status</Label><select id="student-admissionStatus" name="admissionStatus" defaultValue="enrolled" className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="applied">Applied</option><option value="accepted">Accepted</option><option value="enrolled">Enrolled</option></select></div>
              <Field label="Birth certificate number" name="birthCertificateNumber" maxLength={80} />
              <Field label="Nationality" name="nationality" maxLength={80} />
              <Field label="Religion" name="religion" maxLength={80} />
              <Field label="Home language" name="homeLanguage" maxLength={80} />
              <Field label="Previous school" name="previousSchool" maxLength={160} />
              <div className="grid gap-2"><Label htmlFor="student-boardingStatus">Boarding status</Label><select id="student-boardingStatus" name="boardingStatus" defaultValue="day" className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="day">Day student</option><option value="boarding">Boarding</option></select></div>
              <Field label="Transport route" name="transportRoute" maxLength={120} />
              <div className="grid gap-2 sm:col-span-2"><Label htmlFor="student-address">Home address</Label><Textarea id="student-address" name="address" maxLength={300} rows={2} /></div>
            </div>
          </section>
          <section className="grid gap-4 border-t pt-5">
            <div><h3 className="text-sm font-semibold">Family and care</h3><p className="mt-1 text-sm text-muted-foreground">Guardian and health details are optional and can be updated later.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Guardian name" name="guardianName" maxLength={120} />
              <Field label="Relationship" name="relationship" maxLength={60} />
              <Field label="Guardian phone" name="guardianPhone" maxLength={40} />
              <Field label="Guardian email" name="guardianEmail" type="email" maxLength={254} />
              <Field label="Occupation" name="occupation" maxLength={100} />
              <Field label="Guardian residence" name="guardianAddress" maxLength={300} />
              <Field label="Medical conditions" name="medicalConditions" maxLength={4000} />
              <Field label="Allergies" name="allergies" maxLength={2000} />
              <Field label="Blood group" name="bloodGroup" maxLength={12} />
              <div className="flex flex-wrap items-center gap-5 sm:col-span-2"><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="emergencyContact" className="size-4 accent-primary" /> Emergency contact</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="authorizedPickup" className="size-4 accent-primary" /> Authorized for pickup</label></div>
            </div>
          </section>
          {submitError && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{submitError}</p>}
          <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={saving || classes.length === 0}>{saving ? "Saving…" : "Register student"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
