"use client"

import { useMemo, useState, type FormEvent } from "react"
import useSWR from "swr"
import { Building2, Download, Plus, Search, ShieldCheck, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { downloadCsv } from "@/lib/download-csv"

interface SchoolRecord {
  id: string
  name: string
  school_type: string
  government_id: string
  registration_number: string | null
  address: string
  city: string
  county: string
  phone: string
  email: string
  website: string | null
  established_year: number | null
  student_capacity: number | null
  motto: string | null
  is_active: boolean | null
  created_at: string | null
  subscription_status: string
}

interface SchoolDraft {
  name: string
  schoolType: string
  governmentId: string
  registrationNumber: string
  address: string
  city: string
  county: string
  postalCode: string
  phone: string
  email: string
  website: string
  establishedYear: string
  studentCapacity: string
  motto: string
  description: string
}

const initialDraft: SchoolDraft = {
  name: "",
  schoolType: "",
  governmentId: "",
  registrationNumber: "",
  address: "",
  city: "",
  county: "",
  postalCode: "",
  phone: "",
  email: "",
  website: "",
  establishedYear: "",
  studentCapacity: "",
  motto: "",
  description: "",
}

const schoolTypes = [
  { value: "public_primary", label: "Public primary" },
  { value: "private_primary", label: "Private primary" },
  { value: "public_secondary", label: "Public secondary" },
  { value: "private_secondary", label: "Private secondary" },
  { value: "mixed", label: "Mixed / combined" },
  { value: "special_needs", label: "Special needs" },
  { value: "technical_vocational", label: "Technical & vocational" },
]

const EMPTY_SCHOOLS: SchoolRecord[] = []

const fetcher = async (url: string) => {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error ?? "Unable to load schools")
  return result as { schools: SchoolRecord[] }
}

function schoolTypeLabel(value: string) {
  return schoolTypes.find((type) => type.value === value)?.label ?? value.replaceAll("_", " ")
}

function SchoolField({
  id,
  label,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder,
  min,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  type?: string
  placeholder?: string
  min?: string
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}{required ? " *" : ""}</FieldLabel>
      <Input id={id} type={type} min={min} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />
    </Field>
  )
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Building2 }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{value.toLocaleString("en-KE")}</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  )
}

export function SchoolManagement() {
  const { data, error, isLoading, mutate } = useSWR("/api/system-admin/schools", fetcher)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draft, setDraft] = useState<SchoolDraft>(initialDraft)
  const [formError, setFormError] = useState("")
  const [pending, setPending] = useState(false)
  const schools = data?.schools ?? EMPTY_SCHOOLS

  const filteredSchools = useMemo(() => {
    const query = search.trim().toLowerCase()
    return schools.filter((school) => {
      const matchesSearch = !query || [school.name, school.government_id, school.city, school.county, school.email]
        .some((value) => value?.toLowerCase().includes(query))
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? school.is_active !== false : school.is_active === false)
      return matchesSearch && matchesStatus
    })
  }, [schools, search, statusFilter])

  const updateDraft = (key: keyof SchoolDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setFormError("")
  }

  const submitSchool = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setFormError("")
    try {
      const response = await fetch("/api/system-admin/schools", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Unable to create school")
      await mutate((current) => ({ schools: [result.school, ...(current?.schools ?? [])] }), { revalidate: false })
      setDraft(initialDraft)
      setDialogOpen(false)
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : "Unable to create school")
    } finally {
      setPending(false)
    }
  }

  const toggleStatus = async (school: SchoolRecord) => {
    const nextStatus = school.is_active === false
    try {
      const response = await fetch("/api/system-admin/schools", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: school.id, isActive: nextStatus }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Unable to update school status")
      await mutate((current) => ({
        schools: (current?.schools ?? []).map((item) => item.id === school.id ? { ...item, is_active: result.school.is_active } : item),
      }), { revalidate: false })
    } catch (statusError) {
      setFormError(statusError instanceof Error ? statusError.message : "Unable to update school status")
    }
  }

  const exportSchools = () => {
    const rows = [
      ["School", "Type", "Government ID", "Registration number", "City", "County", "Phone", "Email", "Status"],
      ...filteredSchools.map((school) => [school.name, schoolTypeLabel(school.school_type), school.government_id, school.registration_number ?? "", school.city, school.county, school.phone, school.email, school.is_active === false ? "Inactive" : "Active"]),
    ]
    downloadCsv("shuleverse-schools.csv", rows)
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Platform · Tenants & schools</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">School management</h2>
          <p className="mt-2 text-sm text-muted-foreground">Review school records, add a school, and manage platform access.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={exportSchools} disabled={!filteredSchools.length}>
            <Download data-icon="inline-start" /> Export CSV
          </Button>
          <Button type="button" onClick={() => { setFormError(""); setDialogOpen(true) }}>
            <Plus data-icon="inline-start" /> Add school
          </Button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="All schools" value={schools.length} icon={Building2} />
        <MetricCard label="Active" value={schools.filter((school) => school.is_active !== false).length} icon={ShieldCheck} />
        <MetricCard label="Inactive" value={schools.filter((school) => school.is_active === false).length} icon={Users} />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">School directory</CardTitle>
          <CardDescription>Search by school, government ID, town, county, or email.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input aria-label="Search schools" placeholder="Search schools" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44" aria-label="Filter schools by status"><SelectValue placeholder="All statuses" /></SelectTrigger>
              <SelectContent><SelectGroup>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectGroup></SelectContent>
            </Select>
          </div>

          {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error.message}</p>}
          {formError && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{formError}</p>}
          {isLoading ? (
            <div className="flex flex-col gap-3" aria-label="Loading schools"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
          ) : (
            <div className="max-w-full overflow-x-auto rounded-md border">
              <Table className="min-w-[760px]">
                <TableHeader><TableRow>
                  <TableHead>School</TableHead><TableHead>Type</TableHead><TableHead>Government ID</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Access</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell><div className="font-medium">{school.name}</div><div className="text-xs text-muted-foreground">{school.email}</div></TableCell>
                      <TableCell className="capitalize">{schoolTypeLabel(school.school_type)}</TableCell>
                      <TableCell className="font-mono text-xs">{school.government_id}</TableCell>
                      <TableCell>{school.city}, {school.county}</TableCell>
                      <TableCell><Badge variant={school.is_active === false ? "secondary" : "default"}>{school.is_active === false ? "Inactive" : "Active"}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button type="button" variant="outline" size="sm" onClick={() => void toggleStatus(school)}>
                          {school.is_active === false ? "Activate" : "Deactivate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSchools.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="h-28 text-center">
                      <p className="font-medium">{schools.length ? "No schools match these filters" : "No schools registered yet"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{schools.length ? "Try a different search or status." : "Add the first school to begin the directory."}</p>
                    </TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          <p className="text-xs text-muted-foreground" aria-live="polite">Showing {filteredSchools.length} of {schools.length} schools</p>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setDraft(initialDraft); setFormError("") } }}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add a school</DialogTitle>
            <DialogDescription>Enter the school&apos;s official identity, location, and contact details. Required fields are marked with an asterisk.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitSchool} className="flex flex-col gap-6">
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <SchoolField id="school-name" label="School name" value={draft.name} onChange={(value) => updateDraft("name", value)} required />
              <Field>
                <FieldLabel htmlFor="school-type">School type *</FieldLabel>
                <Select value={draft.schoolType} onValueChange={(value) => updateDraft("schoolType", value)}>
                  <SelectTrigger id="school-type"><SelectValue placeholder="Choose school type" /></SelectTrigger>
                  <SelectContent><SelectGroup>{schoolTypes.map((type) => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}</SelectGroup></SelectContent>
                </Select>
              </Field>
              <SchoolField id="school-government-id" label="Government ID" value={draft.governmentId} onChange={(value) => updateDraft("governmentId", value)} required />
              <SchoolField id="school-registration" label="Registration number" value={draft.registrationNumber} onChange={(value) => updateDraft("registrationNumber", value)} />
              <SchoolField id="school-address" label="Street / physical address" value={draft.address} onChange={(value) => updateDraft("address", value)} required />
              <SchoolField id="school-city" label="Town / city" value={draft.city} onChange={(value) => updateDraft("city", value)} required />
              <SchoolField id="school-county" label="County" value={draft.county} onChange={(value) => updateDraft("county", value)} required />
              <SchoolField id="school-postal" label="Postal code" value={draft.postalCode} onChange={(value) => updateDraft("postalCode", value)} />
              <SchoolField id="school-phone" label="Phone" type="tel" value={draft.phone} onChange={(value) => updateDraft("phone", value)} required />
              <SchoolField id="school-email" label="Email" type="email" value={draft.email} onChange={(value) => updateDraft("email", value)} required />
              <SchoolField id="school-website" label="Website" type="url" placeholder="https://example.org" value={draft.website} onChange={(value) => updateDraft("website", value)} />
              <SchoolField id="school-year" label="Established year" type="number" value={draft.establishedYear} onChange={(value) => updateDraft("establishedYear", value)} />
              <SchoolField id="school-capacity" label="Student capacity" type="number" min="0" value={draft.studentCapacity} onChange={(value) => updateDraft("studentCapacity", value)} />
              <SchoolField id="school-motto" label="Motto" value={draft.motto} onChange={(value) => updateDraft("motto", value)} />
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="school-description">Description</FieldLabel>
                <Textarea id="school-description" value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} rows={3} maxLength={5000} />
              </Field>
            </FieldGroup>
            {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={pending}>Cancel</Button>
              <Button type="submit" disabled={pending || !draft.schoolType}>{pending ? "Saving…" : "Save school"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
