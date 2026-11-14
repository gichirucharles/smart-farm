"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  KENYAN_COUNTIES,
  type KenyanCounty,
  type NewSchoolDraft,
  type SchoolDocumentKey,
  type SchoolRegistrationDetails,
} from "@/components/dashboard/director/school-directory-data"

interface AddSchoolDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (school: NewSchoolDraft) => void
}

interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: "text" | "email" | "tel" | "number" | "date"
  placeholder?: string
  autoComplete?: string
  helperText?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
}

interface SelectFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
  placeholder?: string
  required?: boolean
}

interface FormSectionProps {
  title: string
  description: string
  children: ReactNode
}

const SCHOOL_LEVELS = ["Pre-primary", "Primary", "Junior Secondary", "Senior Secondary", "TVET", "Combined"]
const OWNERSHIP_TYPES = ["Public", "Private", "Faith-based / sponsored", "International"]
const GENDER_TYPES = ["Boys", "Girls", "Mixed"]
const BOARDING_OPTIONS = ["Day", "Boarding", "Mixed"]
const CURRICULA = ["CBC", "8-4-4", "IGCSE", "IB", "Other"]
const REGISTRATION_STATUSES = ["Active", "Pending verification", "Suspended"]
const MAX_FILE_SIZE = 10 * 1024 * 1024

const createEmptyDraft = (): NewSchoolDraft => ({
  name: "",
  location: "",
  county: "Nairobi City",
  headTeacher: "",
  contactEmail: "",
  contactPhone: "",
  registrationDetails: {
    schoolLevel: "",
    ownership: "",
    genderType: "",
    boardingStatus: "",
    curriculum: "",
    curriculumOther: "",
    nemisCode: "",
    knecCenterCode: "",
    ministryRegistrationNumber: "",
    registrationExpiryDate: "",
    kraPin: "",
    businessRegistrationNumber: "",
    sponsorOwnerName: "",
    subCounty: "",
    ward: "",
    physicalAddress: "",
    nearestLandmark: "",
    gpsCoordinates: "",
    postalAddress: "",
    headTeacherPhone: "",
    headTeacherEmail: "",
    tscNumber: "",
    boardChairName: "",
    boardChairPhone: "",
    boardChairEmail: "",
    yearEstablished: "",
    streamsPerClass: "",
    studentsCount: "",
    teachersCount: "",
    academicYear: "",
    schoolMotto: "",
    assignedDirector: "",
    schoolAdminEmail: "",
    schoolAdminPhone: "",
    licenseStatus: "Pending verification",
    systemStatus: "Pending verification",
    documents: {
      registrationCertificate: null,
      operatingLicense: null,
      kraCertificate: null,
      logo: null,
    },
  },
})

function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <FieldSet className="border-b border-border pb-6 last:border-b-0 last:pb-0">
      <FieldLegend>{title}</FieldLegend>
      <FieldDescription>{description}</FieldDescription>
      <FieldGroup className="grid gap-4 sm:grid-cols-2">{children}</FieldGroup>
    </FieldSet>
  )
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  helperText,
  required = false,
  min,
  max,
  step,
}: TextFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}{required ? " *" : ""}</FieldLabel>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        min={min}
        max={max}
        step={step}
      />
      {helperText && <FieldDescription>{helperText}</FieldDescription>}
    </Field>
  )
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
}: SelectFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}{required ? " *" : ""}</FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-required={required}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

function FileField({
  id,
  label,
  file,
  onChange,
  accept,
  helperText,
}: {
  id: string
  label: string
  file: File | null
  onChange: (file: File | null) => void
  accept: string
  helperText: string
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type="file"
        accept={accept}
        aria-describedby={`${id}-help`}
        onChange={(event) => onChange(event.currentTarget.files?.[0] ?? null)}
      />
      <FieldDescription id={`${id}-help`}>
        {file ? `${file.name} · ${(file.size / (1024 * 1024)).toFixed(2)} MB` : helperText}
      </FieldDescription>
    </Field>
  )
}

function textOptions(values: string[]) {
  return values.map((value) => ({ label: value, value }))
}

export function AddSchoolDialog({ open, onOpenChange, onAdd }: AddSchoolDialogProps) {
  const [draft, setDraft] = useState<NewSchoolDraft>(createEmptyDraft)
  const [submitError, setSubmitError] = useState("")

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setDraft(createEmptyDraft())
      setSubmitError("")
    }
    onOpenChange(nextOpen)
  }

  const updateDraft = <K extends keyof Omit<NewSchoolDraft, "registrationDetails">>(
    key: K,
    value: NewSchoolDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setSubmitError("")
  }

  const updateDetail = <K extends keyof SchoolRegistrationDetails>(
    key: K,
    value: SchoolRegistrationDetails[K],
  ) => {
    setDraft((current) => ({
      ...current,
      registrationDetails: { ...current.registrationDetails, [key]: value },
    }))
    setSubmitError("")
  }

  const updateDocument = (key: SchoolDocumentKey, file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE) {
      setSubmitError(`${file.name} is larger than 10 MB. Choose a smaller file.`)
      return
    }

    updateDetail("documents", { ...draft.registrationDetails.documents, [key]: file })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const details = draft.registrationDetails
    const requiredSelections = [
      ["school level", details.schoolLevel],
      ["ownership category", details.ownership],
      ["gender type", details.genderType],
      ["boarding status", details.boardingStatus],
      ["curriculum", details.curriculum],
    ]
    const missingSelection = requiredSelections.find(([, value]) => !value)

    if (missingSelection) {
      setSubmitError(`Select a ${missingSelection[0]} to continue.`)
      return
    }
    if (details.ownership === "Private" && (!details.kraPin.trim() || !details.businessRegistrationNumber.trim())) {
      setSubmitError("Add the KRA PIN and business registration number for a private school.")
      return
    }
    if (details.ownership === "Faith-based / sponsored" && !details.sponsorOwnerName.trim()) {
      setSubmitError("Add the sponsor or owner name for a faith-based school.")
      return
    }
    if (details.ownership === "Public" && !details.tscNumber.trim()) {
      setSubmitError("Add the head teacher's TSC number for a public school.")
      return
    }

    onAdd(draft)
    setDraft(createEmptyDraft())
    setSubmitError("")
  }

  const isPrivate = draft.registrationDetails.ownership === "Private"
  const isSponsored = draft.registrationDetails.ownership === "Faith-based / sponsored"
  const isPublic = draft.registrationDetails.ownership === "Public"
  const isOtherCurriculum = draft.registrationDetails.curriculum === "Other"
  const currentYear = new Date().getFullYear()

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add a school</DialogTitle>
          <DialogDescription>
            Complete the school profile in the sections below. Required fields are marked with an asterisk.
          </DialogDescription>
          <p className="text-xs text-muted-foreground">
            This director directory is session-only. Selected files are not uploaded to a server or retained after the session.
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FieldGroup className="gap-7">
            <FormSection title="1. School identity" description="Define the school, its level, and the learning pathway.">
              <TextField
                id="new-school-name"
                label="School name"
                value={draft.name}
                onChange={(value) => updateDraft("name", value)}
                autoComplete="organization"
                required
              />
              <SelectField
                id="new-school-level"
                label="School type / level"
                value={draft.registrationDetails.schoolLevel}
                onChange={(value) => updateDetail("schoolLevel", value as SchoolRegistrationDetails["schoolLevel"])}
                options={textOptions(SCHOOL_LEVELS)}
                required
              />
              <SelectField
                id="new-school-ownership"
                label="Ownership / category"
                value={draft.registrationDetails.ownership}
                onChange={(value) => updateDetail("ownership", value as SchoolRegistrationDetails["ownership"])}
                options={textOptions(OWNERSHIP_TYPES)}
                required
              />
              <SelectField
                id="new-school-gender"
                label="Gender type"
                value={draft.registrationDetails.genderType}
                onChange={(value) => updateDetail("genderType", value as SchoolRegistrationDetails["genderType"])}
                options={textOptions(GENDER_TYPES)}
                required
              />
              <SelectField
                id="new-school-boarding"
                label="Boarding status"
                value={draft.registrationDetails.boardingStatus}
                onChange={(value) => updateDetail("boardingStatus", value as SchoolRegistrationDetails["boardingStatus"])}
                options={textOptions(BOARDING_OPTIONS)}
                required
              />
              <SelectField
                id="new-school-curriculum"
                label="Curriculum"
                value={draft.registrationDetails.curriculum}
                onChange={(value) => updateDetail("curriculum", value as SchoolRegistrationDetails["curriculum"])}
                options={textOptions(CURRICULA)}
                required
              />
              {isOtherCurriculum && (
                <TextField
                  id="new-school-curriculum-other"
                  label="Specify curriculum"
                  value={draft.registrationDetails.curriculumOther}
                  onChange={(value) => updateDetail("curriculumOther", value)}
                  required
                />
              )}
            </FormSection>

            <FormSection title="2. Government and regulatory identifiers" description="Record official education, licensing, and ownership references.">
              <TextField id="new-school-nemis" label="NEMIS institution code" value={draft.registrationDetails.nemisCode} onChange={(value) => updateDetail("nemisCode", value)} required />
              <TextField id="new-school-knec" label="KNEC center code" value={draft.registrationDetails.knecCenterCode} onChange={(value) => updateDetail("knecCenterCode", value)} helperText="For schools registered as examination centres." />
              <TextField id="new-school-registration" label="Ministry registration number" value={draft.registrationDetails.ministryRegistrationNumber} onChange={(value) => updateDetail("ministryRegistrationNumber", value)} required />
              <SelectField id="new-school-registration-status" label="Registration / license status" value={draft.registrationDetails.licenseStatus} onChange={(value) => updateDetail("licenseStatus", value as SchoolRegistrationDetails["licenseStatus"])} options={textOptions(REGISTRATION_STATUSES)} required />
              <TextField id="new-school-expiry" label="License / registration expiry" type="date" value={draft.registrationDetails.registrationExpiryDate} onChange={(value) => updateDetail("registrationExpiryDate", value)} />
              {isPrivate && (
                <>
                  <TextField id="new-school-kra" label="KRA PIN" value={draft.registrationDetails.kraPin} onChange={(value) => updateDetail("kraPin", value)} required />
                  <TextField id="new-school-business-registration" label="Business / company registration number" value={draft.registrationDetails.businessRegistrationNumber} onChange={(value) => updateDetail("businessRegistrationNumber", value)} required />
                </>
              )}
              {(isPrivate || isSponsored) && (
                <TextField id="new-school-sponsor" label="Sponsor or owner name" value={draft.registrationDetails.sponsorOwnerName} onChange={(value) => updateDetail("sponsorOwnerName", value)} required={isSponsored} />
              )}
            </FormSection>

            <FormSection title="3. Location" description="Capture the administrative area and a verifiable physical address.">
              <TextField id="new-school-town" label="Town or city" value={draft.location} onChange={(value) => updateDraft("location", value)} required />
              <SelectField
                id="new-school-county"
                label="County"
                value={draft.county}
                onChange={(value) => updateDraft("county", value as KenyanCounty)}
                options={textOptions([...KENYAN_COUNTIES])}
                required
              />
              <TextField id="new-school-subcounty" label="Sub-county" value={draft.registrationDetails.subCounty} onChange={(value) => updateDetail("subCounty", value)} required />
              <TextField id="new-school-ward" label="Ward" value={draft.registrationDetails.ward} onChange={(value) => updateDetail("ward", value)} required />
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="new-school-address">Physical address or village *</FieldLabel>
                <Textarea
                  id="new-school-address"
                  value={draft.registrationDetails.physicalAddress}
                  onChange={(event) => updateDetail("physicalAddress", event.target.value)}
                  required
                  rows={2}
                />
              </Field>
              <TextField id="new-school-landmark" label="Nearest landmark" value={draft.registrationDetails.nearestLandmark} onChange={(value) => updateDetail("nearestLandmark", value)} />
              <TextField id="new-school-gps" label="GPS coordinates" value={draft.registrationDetails.gpsCoordinates} onChange={(value) => updateDetail("gpsCoordinates", value)} placeholder="-1.2864, 36.8172" />
              <TextField id="new-school-postal" label="Postal address" value={draft.registrationDetails.postalAddress} onChange={(value) => updateDetail("postalAddress", value)} />
            </FormSection>

            <FormSection title="4. School and leadership contacts" description="Provide reachable school, head teacher, and board or proprietor contacts.">
              <TextField id="new-school-email" label="School email" type="email" value={draft.contactEmail} onChange={(value) => updateDraft("contactEmail", value)} autoComplete="email" required />
              <TextField id="new-school-phone" label="School phone" type="tel" value={draft.contactPhone} onChange={(value) => updateDraft("contactPhone", value)} autoComplete="tel" placeholder="+254 7xx xxx xxx" required />
              <TextField id="new-school-head" label="Head teacher / principal name" value={draft.headTeacher} onChange={(value) => updateDraft("headTeacher", value)} autoComplete="name" required />
              <TextField id="new-school-head-phone" label="Head teacher phone" type="tel" value={draft.registrationDetails.headTeacherPhone} onChange={(value) => updateDetail("headTeacherPhone", value)} required />
              <TextField id="new-school-head-email" label="Head teacher email" type="email" value={draft.registrationDetails.headTeacherEmail} onChange={(value) => updateDetail("headTeacherEmail", value)} required />
              <TextField id="new-school-tsc" label="Head teacher TSC number" value={draft.registrationDetails.tscNumber} onChange={(value) => updateDetail("tscNumber", value)} required={isPublic} helperText={isPublic ? "Required for public schools." : "If applicable."} />
              <TextField id="new-school-board-name" label="BOM chair / proprietor name" value={draft.registrationDetails.boardChairName} onChange={(value) => updateDetail("boardChairName", value)} required />
              <TextField id="new-school-board-phone" label="BOM chair / proprietor phone" type="tel" value={draft.registrationDetails.boardChairPhone} onChange={(value) => updateDetail("boardChairPhone", value)} required />
              <TextField id="new-school-board-email" label="BOM chair / proprietor email" type="email" value={draft.registrationDetails.boardChairEmail} onChange={(value) => updateDetail("boardChairEmail", value)} />
            </FormSection>

            <FormSection title="5. Operational details" description="Add the school's operating profile. Counts and academic calendar can be filled in later.">
              <TextField id="new-school-established" label="Year established" type="number" value={draft.registrationDetails.yearEstablished} onChange={(value) => updateDetail("yearEstablished", value)} min={1900} max={currentYear} step={1} />
              <TextField id="new-school-streams" label="Streams per class" type="number" value={draft.registrationDetails.streamsPerClass} onChange={(value) => updateDetail("streamsPerClass", value)} min={0} step={1} />
              <TextField id="new-school-students" label="Student count" type="number" value={draft.registrationDetails.studentsCount} onChange={(value) => updateDetail("studentsCount", value)} min={0} step={1} />
              <TextField id="new-school-teachers" label="Teacher count" type="number" value={draft.registrationDetails.teachersCount} onChange={(value) => updateDetail("teachersCount", value)} min={0} step={1} />
              <TextField id="new-school-academic-year" label="Academic year" value={draft.registrationDetails.academicYear} onChange={(value) => updateDetail("academicYear", value)} placeholder="2026" />
              <TextField id="new-school-motto" label="School motto" value={draft.registrationDetails.schoolMotto} onChange={(value) => updateDetail("schoolMotto", value)} />
              <div className="sm:col-span-2">
                <FileField id="new-school-logo" label="School logo" file={draft.registrationDetails.documents.logo} onChange={(file) => updateDocument("logo", file)} accept="image/png,image/jpeg,image/webp" helperText="Optional PNG, JPG, or WebP image, up to 10 MB." />
              </div>
            </FormSection>

            <FormSection title="6. Director, first login, and documents" description="Assign a manager, set up the first school-admin contact, and attach verification documents.">
              <TextField id="new-school-director" label="Assigned director / owner" value={draft.registrationDetails.assignedDirector} onChange={(value) => updateDetail("assignedDirector", value)} required />
              <SelectField id="new-school-system-status" label="School status" value={draft.registrationDetails.systemStatus} onChange={(value) => updateDetail("systemStatus", value as SchoolRegistrationDetails["systemStatus"])} options={textOptions(REGISTRATION_STATUSES)} required />
              <TextField id="new-school-admin-email" label="First school-admin email" type="email" value={draft.registrationDetails.schoolAdminEmail} onChange={(value) => updateDetail("schoolAdminEmail", value)} required />
              <TextField id="new-school-admin-phone" label="First school-admin phone" type="tel" value={draft.registrationDetails.schoolAdminPhone} onChange={(value) => updateDetail("schoolAdminPhone", value)} required />
              <div className="sm:col-span-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                Created date and creator are recorded automatically when the school is added.
              </div>
              <div className="sm:col-span-2 grid gap-4 md:grid-cols-3">
                <FileField id="new-school-certificate" label="Registration certificate" file={draft.registrationDetails.documents.registrationCertificate} onChange={(file) => updateDocument("registrationCertificate", file)} accept="application/pdf,image/*" helperText="Optional PDF or image, up to 10 MB." />
                <FileField id="new-school-license" label="Operating license" file={draft.registrationDetails.documents.operatingLicense} onChange={(file) => updateDocument("operatingLicense", file)} accept="application/pdf,image/*" helperText="Optional PDF or image, up to 10 MB." />
                <FileField id="new-school-kra-certificate" label="KRA certificate" file={draft.registrationDetails.documents.kraCertificate} onChange={(file) => updateDocument("kraCertificate", file)} accept="application/pdf,image/*" helperText="Optional PDF or image, up to 10 MB." />
              </div>
            </FormSection>
          </FieldGroup>

          {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add school</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
