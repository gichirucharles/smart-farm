"use client"

import { useMemo, useState } from "react"
import { Download, Eye, Filter, MapPin, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddSchoolDialog } from "@/components/dashboard/director/add-school-dialog"
import {
  INITIAL_SCHOOLS,
  KENYAN_COUNTIES,
  type KenyanCounty,
  type NewSchoolDraft,
  type School,
} from "@/components/dashboard/director/school-directory-data"
import { downloadCsv } from "@/lib/download-csv"

function InfoSection({
  title,
  items,
}: {
  title: string
  items: Array<[string, string | number | null | undefined]>
}) {
  return (
    <section className="rounded-lg border p-4">
      <h3 className="font-medium">{title}</h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="break-words text-sm">{value === null || value === undefined || value === "" ? "Not recorded" : value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function SchoolDetailsContent({ school }: { school: School }) {
  const details = school.registrationDetails
  const createdAt = school.createdAt
    ? new Date(school.createdAt).toLocaleString("en-KE")
    : undefined

  return (
    <div className="grid max-h-[65vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
      <InfoSection
        title="School identity"
        items={[
          ["Name", school.name],
          ["Type / level", details?.schoolLevel],
          ["Ownership", details?.ownership],
          ["Gender", details?.genderType],
          ["Boarding", details?.boardingStatus],
          ["Curriculum", details?.curriculum === "Other" ? details.curriculumOther : details?.curriculum],
        ]}
      />
      <InfoSection
        title="Government and regulatory"
        items={[
          ["NEMIS code", details?.nemisCode],
          ["KNEC center code", details?.knecCenterCode],
          ["Ministry registration", details?.ministryRegistrationNumber],
          ["License status", details?.licenseStatus],
          ["License expiry", details?.registrationExpiryDate],
          ["KRA PIN", details?.kraPin],
          ["Business registration", details?.businessRegistrationNumber],
          ["Sponsor / owner", details?.sponsorOwnerName],
        ]}
      />
      <InfoSection
        title="Location"
        items={[
          ["Town / city", school.location],
          ["County", school.county],
          ["Sub-county", details?.subCounty],
          ["Ward", details?.ward],
          ["Physical address", details?.physicalAddress],
          ["Nearest landmark", details?.nearestLandmark],
          ["GPS coordinates", details?.gpsCoordinates],
          ["Postal address", details?.postalAddress],
        ]}
      />
      <InfoSection
        title="School and leadership contacts"
        items={[
          ["School email", school.contactEmail],
          ["School phone", school.contactPhone],
          ["Head teacher / principal", school.headTeacher],
          ["Head teacher phone", details?.headTeacherPhone],
          ["Head teacher email", details?.headTeacherEmail],
          ["TSC number", details?.tscNumber],
          ["BOM chair / proprietor", details?.boardChairName],
          ["BOM chair phone", details?.boardChairPhone],
          ["BOM chair email", details?.boardChairEmail],
        ]}
      />
      <InfoSection
        title="Operational details"
        items={[
          ["Year established", details?.yearEstablished || school.establishedYear],
          ["Streams per class", details?.streamsPerClass],
          ["Students", school.studentsCount],
          ["Teachers", school.teachersCount],
          ["Academic year", details?.academicYear],
          ["School motto", details?.schoolMotto],
        ]}
      />
      <InfoSection
        title="Director and school access"
        items={[
          ["Assigned director / owner", details?.assignedDirector],
          ["First school-admin email", details?.schoolAdminEmail],
          ["First school-admin phone", details?.schoolAdminPhone],
          ["School status", details?.systemStatus ?? school.status],
          ["Created by", school.createdBy],
          ["Created date", createdAt],
        ]}
      />
      <InfoSection
        title="Documents and logo"
        items={[
          ["Registration certificate", details?.documents.registrationCertificate?.name],
          ["Operating license", details?.documents.operatingLicense?.name],
          ["KRA certificate", details?.documents.kraCertificate?.name],
          ["School logo", details?.documents.logo?.name],
        ]}
      />
    </div>
  )
}

export function SchoolManagement() {
  const [schools, setSchools] = useState(INITIAL_SCHOOLS)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCounty, setSelectedCounty] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [statusMessage, setStatusMessage] = useState("")

  const filteredSchools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return schools.filter((school) => {
      const matchesSearch =
        !query ||
        [school.name, school.location, school.county, school.headTeacher]
          .some((value) => value.toLowerCase().includes(query))
      const matchesCounty = selectedCounty === "all" || school.county === selectedCounty

      return matchesSearch && matchesCounty
    })
  }, [schools, searchQuery, selectedCounty])

  const handleAddSchool = (draft: NewSchoolDraft) => {
    const details = draft.registrationDetails
    const toCount = (value: string) => {
      const count = Number(value)
      return Number.isSafeInteger(count) && count >= 0 ? count : 0
    }
    const yearEstablished = Number(details.yearEstablished)
    const status: School["status"] =
      details.systemStatus === "Active"
        ? "active"
        : details.systemStatus === "Suspended"
          ? "suspended"
          : "under review"
    const school: School = {
      ...draft,
      id: `school-${Date.now()}`,
      logo: "/placeholder.svg?height=40&width=40",
      studentsCount: toCount(details.studentsCount),
      teachersCount: toCount(details.teachersCount),
      performanceIndex: 0,
      status,
      website: "",
      establishedYear: Number.isInteger(yearEstablished) && yearEstablished > 0 ? yearEstablished : new Date().getFullYear(),
      createdAt: new Date().toISOString(),
      createdBy: "Current director",
    }

    setSchools((current) => [school, ...current])
    setIsAddDialogOpen(false)
    setStatusMessage(`${school.name} was added to this session's directory.`)
  }

  const handleExport = () => {
    const rows = [
      ["School", "Level", "Ownership", "Town or city", "County", "NEMIS code", "Ministry registration", "Head teacher", "Students", "Teachers", "Performance", "Status", "Email", "Phone"],
      ...filteredSchools.map((school) => [
        school.name,
        school.registrationDetails?.schoolLevel ?? "",
        school.registrationDetails?.ownership ?? "",
        school.location,
        school.county,
        school.registrationDetails?.nemisCode ?? "",
        school.registrationDetails?.ministryRegistrationNumber ?? "",
        school.headTeacher,
        school.studentsCount,
        school.teachersCount,
        `${school.performanceIndex}%`,
        school.registrationDetails?.systemStatus ?? school.status,
        school.contactEmail,
        school.contactPhone,
      ]),
    ]

    downloadCsv("kenya-school-directory.csv", rows)
    setStatusMessage(`CSV downloaded for ${filteredSchools.length} ${filteredSchools.length === 1 ? "school" : "schools"}.`)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCounty("all")
    setStatusMessage("School filters cleared.")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <CardTitle>School Management</CardTitle>
              <CardDescription>Browse sample Kenyan schools and add entries for this session; changes do not sync because no database is connected.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={() => setIsAddDialogOpen(true)}>
                Add New School
              </Button>
              <Button type="button" variant="outline" onClick={handleExport}>
                <Download data-icon="inline-start" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col items-stretch gap-3 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search schools"
                placeholder="Search by school, town, county, or head teacher"
                className="pl-9"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <Select value={selectedCounty} onValueChange={(value) => setSelectedCounty(value as KenyanCounty | "all")}>
              <SelectTrigger className="w-full xl:w-56" aria-label="Filter by Kenyan county">
                <SelectValue placeholder="Filter by county" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All counties</SelectItem>
                  {KENYAN_COUNTIES.map((county) => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" size="icon" onClick={resetFilters} aria-label="Clear school filters" title="Clear filters">
              <Filter aria-hidden="true" />
            </Button>
          </div>

          <div className="max-w-full overflow-x-auto rounded-md border">
            <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow>
                  <TableHead>School name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Teachers</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage src={school.logo || "/placeholder.svg"} alt="" />
                          <AvatarFallback>{school.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{school.name}</div>
                          <div className="text-xs text-muted-foreground">{school.headTeacher}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1">
                        <MapPin aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                        <span>{school.location}, {school.county}</span>
                      </div>
                    </TableCell>
                    <TableCell>{school.studentsCount.toLocaleString("en-KE")}</TableCell>
                    <TableCell>{school.teachersCount.toLocaleString("en-KE")}</TableCell>
                    <TableCell>
                      <Badge variant={school.performanceIndex >= 85 ? "default" : "outline"}>
                        {school.performanceIndex}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={school.status === "active" ? "default" : school.status === "suspended" ? "destructive" : "secondary"}>
                        {school.registrationDetails?.systemStatus ?? (school.status === "active" ? "Active" : school.status === "suspended" ? "Suspended" : "Under review")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedSchool(school)}>
                        <Eye data-icon="inline-start" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSchools.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No schools match these filters. Try another county or search term.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {statusMessage && (
            <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
              {statusMessage}
            </p>
          )}
        </CardContent>
      </Card>

      <AddSchoolDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddSchool} />

      <Dialog open={Boolean(selectedSchool)} onOpenChange={(open) => !open && setSelectedSchool(null)}>
        <DialogContent className="max-h-[90dvh] sm:max-w-4xl">
          {selectedSchool && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSchool.name}</DialogTitle>
                <DialogDescription>{selectedSchool.location}, {selectedSchool.county}</DialogDescription>
              </DialogHeader>
              <SchoolDetailsContent school={selectedSchool} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
