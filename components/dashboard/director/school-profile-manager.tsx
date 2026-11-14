"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { KENYAN_COUNTIES, type KenyanCounty } from "@/components/dashboard/director/school-directory-data"

type SchoolDetails = {
  name: string
  registrationNumber: string
  town: string
  county: KenyanCounty
  contactEmail: string
  contactPhone: string
}

type FacilitySettings = {
  classrooms: number
  scienceLab: boolean
  computerLab: boolean
  languageLab: boolean
  library: boolean
  sportsGround: boolean
}

const INITIAL_SCHOOL: SchoolDetails = {
  name: "Sunshine Academy",
  registrationNumber: "KE-001-2015",
  town: "Nairobi",
  county: "Nairobi City",
  contactEmail: "office@sunshine.example",
  contactPhone: "+254 700 123 456",
}

const INITIAL_FACILITIES: FacilitySettings = {
  classrooms: 24,
  scienceLab: true,
  computerLab: true,
  languageLab: true,
  library: true,
  sportsGround: true,
}

const facilityLabels: Array<{ key: keyof Omit<FacilitySettings, "classrooms">; label: string }> = [
  { key: "scienceLab", label: "Science laboratory" },
  { key: "computerLab", label: "Computer laboratory" },
  { key: "languageLab", label: "Language laboratory" },
  { key: "library", label: "Library" },
  { key: "sportsGround", label: "Sports ground" },
]

export function SchoolProfileManager() {
  const [school, setSchool] = useState(INITIAL_SCHOOL)
  const [schoolDraft, setSchoolDraft] = useState(INITIAL_SCHOOL)
  const [facilities, setFacilities] = useState(INITIAL_FACILITIES)
  const [facilityDraft, setFacilityDraft] = useState(INITIAL_FACILITIES)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFacilitiesOpen, setIsFacilitiesOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")

  const updateSchool = <K extends keyof SchoolDetails>(key: K, value: SchoolDetails[K]) => {
    setSchoolDraft((current) => ({ ...current, [key]: value }))
  }

  const handleSaveDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSchool(schoolDraft)
    setIsDetailsOpen(false)
    setStatusMessage("School details updated for this session.")
  }

  const handleSaveFacilities = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFacilities(facilityDraft)
    setIsFacilitiesOpen(false)
    setStatusMessage("Facility details updated for this session.")
  }

  const enabledFacilities = facilityLabels
    .filter(({ key }) => facilities[key])
    .map(({ label }) => label)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
            <CardDescription>Basic school details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-1">
              <span className="text-sm font-medium">School name</span>
              <p className="text-muted-foreground">{school.name}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-sm font-medium">Registration number</span>
              <p className="text-muted-foreground">{school.registrationNumber}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-sm font-medium">Location</span>
              <p className="text-muted-foreground">{school.town}, {school.county}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-sm font-medium">Contact</span>
              <p className="text-muted-foreground">{school.contactEmail} · {school.contactPhone}</p>
            </div>
            <Button type="button" variant="outline" onClick={() => {
              setSchoolDraft(school)
              setIsDetailsOpen(true)
            }}>
              Edit School Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>School Facilities</CardTitle>
            <CardDescription>Infrastructure and resources</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-1">
              <span className="text-sm font-medium">Classrooms</span>
              <p className="text-muted-foreground">{facilities.classrooms}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-sm font-medium">Available facilities</span>
              <p className="text-muted-foreground">
                {enabledFacilities.length ? enabledFacilities.join(", ") : "No additional facilities recorded"}
              </p>
            </div>
            <Button type="button" variant="outline" onClick={() => {
              setFacilityDraft(facilities)
              setIsFacilitiesOpen(true)
            }}>
              Manage Facilities
            </Button>
          </CardContent>
        </Card>
      </div>

      {statusMessage && (
        <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
          {statusMessage} Data is not synced to a server.
        </p>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit school details</DialogTitle>
            <DialogDescription>Update the school profile for this session.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveDetails}>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="school-name">School name</FieldLabel>
                <Input id="school-name" value={schoolDraft.name} onChange={(event) => updateSchool("name", event.target.value)} required />
              </Field>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="registration-number">Registration number</FieldLabel>
                  <Input id="registration-number" value={schoolDraft.registrationNumber} onChange={(event) => updateSchool("registrationNumber", event.target.value)} required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="school-town">Town or city</FieldLabel>
                  <Input id="school-town" value={schoolDraft.town} onChange={(event) => updateSchool("town", event.target.value)} required />
                </Field>
              </FieldGroup>
              <Field>
                <FieldLabel htmlFor="school-county">County</FieldLabel>
                <Select value={schoolDraft.county} onValueChange={(value) => updateSchool("county", value as KenyanCounty)}>
                  <SelectTrigger id="school-county">
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {KENYAN_COUNTIES.map((county) => (
                        <SelectItem key={county} value={county}>{county}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="school-email">Contact email</FieldLabel>
                  <Input id="school-email" type="email" value={schoolDraft.contactEmail} onChange={(event) => updateSchool("contactEmail", event.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="school-phone">Contact phone</FieldLabel>
                  <Input id="school-phone" type="tel" value={schoolDraft.contactPhone} onChange={(event) => updateSchool("contactPhone", event.target.value)} />
                </Field>
              </FieldGroup>
            </FieldGroup>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDetailsOpen(false)}>Cancel</Button>
              <Button type="submit">Save details</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isFacilitiesOpen} onOpenChange={setIsFacilitiesOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage school facilities</DialogTitle>
            <DialogDescription>Update classroom and resource availability for this session.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveFacilities}>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="classroom-count">Number of classrooms</FieldLabel>
                <Input
                  id="classroom-count"
                  type="number"
                  min={0}
                  step={1}
                  value={facilityDraft.classrooms}
                  onChange={(event) => setFacilityDraft((current) => ({ ...current, classrooms: Number(event.target.value) }))}
                  required
                />
              </Field>
              <FieldSet className="gap-3">
                <FieldLegend variant="label">Additional facilities</FieldLegend>
                <FieldGroup className="gap-3">
                  {facilityLabels.map(({ key, label }) => (
                    <Field key={key} orientation="horizontal" className="items-center justify-between">
                      <FieldLabel htmlFor={`facility-${key}`}>{label}</FieldLabel>
                      <Switch
                        id={`facility-${key}`}
                        checked={facilityDraft[key]}
                        onCheckedChange={(checked) => setFacilityDraft((current) => ({ ...current, [key]: checked }))}
                      />
                    </Field>
                  ))}
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsFacilitiesOpen(false)}>Cancel</Button>
              <Button type="submit">Save facilities</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
