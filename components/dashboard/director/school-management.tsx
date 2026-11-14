"use client"

import { useMemo, useState } from "react"
import { Download, Eye, Filter, MapPin, Mail, Phone, Search } from "lucide-react"
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
    const school: School = {
      ...draft,
      id: `school-${Date.now()}`,
      logo: "/placeholder.svg?height=40&width=40",
      studentsCount: 0,
      teachersCount: 0,
      performanceIndex: 0,
      status: "under review",
      website: "",
      establishedYear: new Date().getFullYear(),
    }

    setSchools((current) => [school, ...current])
    setIsAddDialogOpen(false)
    setStatusMessage(`${school.name} was added to this session's directory.`)
  }

  const handleExport = () => {
    const rows = [
      ["School", "Town or city", "County", "Head teacher", "Students", "Teachers", "Performance", "Status", "Email", "Phone"],
      ...filteredSchools.map((school) => [
        school.name,
        school.location,
        school.county,
        school.headTeacher,
        school.studentsCount,
        school.teachersCount,
        `${school.performanceIndex}%`,
        school.status,
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
                      <Badge variant={school.status === "active" ? "default" : "secondary"}>
                        {school.status === "active" ? "Active" : "Under review"}
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
        <DialogContent className="sm:max-w-lg">
          {selectedSchool && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSchool.name}</DialogTitle>
                <DialogDescription>{selectedSchool.location}, {selectedSchool.county}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <span className="text-sm font-medium">Head teacher</span>
                  <p className="text-sm text-muted-foreground">{selectedSchool.headTeacher}</p>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm font-medium">Established</span>
                  <p className="text-sm text-muted-foreground">{selectedSchool.establishedYear}</p>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm font-medium">Students and teachers</span>
                  <p className="text-sm text-muted-foreground">
                    {selectedSchool.studentsCount.toLocaleString("en-KE")} students · {selectedSchool.teachersCount.toLocaleString("en-KE")} teachers
                  </p>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm font-medium">Status</span>
                  <p className="text-sm capitalize text-muted-foreground">{selectedSchool.status}</p>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm font-medium">Contact</span>
                  {selectedSchool.contactEmail ? (
                    <a className="flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline" href={`mailto:${selectedSchool.contactEmail}`}>
                      <Mail aria-hidden="true" className="size-4" />
                      {selectedSchool.contactEmail}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">No email recorded</p>
                  )}
                  {selectedSchool.contactPhone ? (
                    <a className="flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline" href={`tel:${selectedSchool.contactPhone}`}>
                      <Phone aria-hidden="true" className="size-4" />
                      {selectedSchool.contactPhone}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">No phone recorded</p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
