"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
} from "@/components/dashboard/director/school-directory-data"

interface AddSchoolDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (school: NewSchoolDraft) => void
}

const createEmptyDraft = (): NewSchoolDraft => ({
  name: "",
  location: "",
  county: "Nairobi City",
  headTeacher: "",
  contactEmail: "",
  contactPhone: "",
})

export function AddSchoolDialog({ open, onOpenChange, onAdd }: AddSchoolDialogProps) {
  const [draft, setDraft] = useState<NewSchoolDraft>(createEmptyDraft)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setDraft(createEmptyDraft())
    onOpenChange(nextOpen)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAdd(draft)
    setDraft(createEmptyDraft())
  }

  const updateDraft = <K extends keyof NewSchoolDraft>(key: K, value: NewSchoolDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add a school</DialogTitle>
          <DialogDescription>
            Add a Kenyan school to this session&apos;s directory. A database is not connected, so this entry will not sync across users.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="new-school-name">School name</FieldLabel>
              <Input
                id="new-school-name"
                autoComplete="organization"
                value={draft.name}
                onChange={(event) => updateDraft("name", event.target.value)}
                required
              />
            </Field>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="new-school-location">Town or city</FieldLabel>
                <Input
                  id="new-school-location"
                  value={draft.location}
                  onChange={(event) => updateDraft("location", event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="new-school-county">County</FieldLabel>
                <Select
                  value={draft.county}
                  onValueChange={(value) => updateDraft("county", value as KenyanCounty)}
                >
                  <SelectTrigger id="new-school-county">
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {KENYAN_COUNTIES.map((county) => (
                        <SelectItem key={county} value={county}>
                          {county}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <Field>
              <FieldLabel htmlFor="new-school-head">Head teacher</FieldLabel>
              <Input
                id="new-school-head"
                autoComplete="name"
                value={draft.headTeacher}
                onChange={(event) => updateDraft("headTeacher", event.target.value)}
                required
              />
            </Field>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="new-school-email">Contact email</FieldLabel>
                <Input
                  id="new-school-email"
                  type="email"
                  autoComplete="email"
                  value={draft.contactEmail}
                  onChange={(event) => updateDraft("contactEmail", event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="new-school-phone">Contact phone</FieldLabel>
                <Input
                  id="new-school-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+254 7xx xxx xxx"
                  value={draft.contactPhone}
                  onChange={(event) => updateDraft("contactPhone", event.target.value)}
                />
              </Field>
            </FieldGroup>
          </FieldGroup>
          <DialogFooter className="mt-6">
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
