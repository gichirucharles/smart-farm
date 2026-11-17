"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Search, SlidersHorizontal, Users, UserRoundCheck, UserRoundX } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StudentProfileDialog } from "@/components/dashboard/students/student-profile-dialog"
import { StudentRegistrationDialog } from "@/components/dashboard/students/student-registration-dialog"

type Student = {
  id: string; student_id: string; first_name: string; last_name: string; grade_level: string; stream: string; className: string
  admission_status: string; gender: string | null; photo_url: string | null; admission_date: string | null; is_active: boolean
}
type SchoolClass = { id: string; name: string; gradeLevel: string; stream: string }
type Roster = { students: Student[]; classes: SchoolClass[]; total: number; capabilities: { canManage: boolean; canViewHealth: boolean; canViewCounseling: boolean } }

async function fetchRoster(url: string): Promise<Roster> {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || "Unable to load student roster")
  return data
}

const statuses = ["all", "enrolled", "applied", "accepted", "transferred", "graduated", "withdrawn"]
const gradeLabel: Record<string, string> = { playgroup: "Play Group", nursery: "Nursery", kg1: "KG 1", kg2: "KG 2", ...Object.fromEntries(Array.from({ length: 9 }, (_, index) => [`grade${index + 1}`, `Grade ${index + 1}`])) }

export function StudentManagement({ title = "Student records", description = "School-wide student profiles, admission information, family contacts and support records." }: { title?: string; description?: string }) {
  const { data, error, isLoading, mutate } = useSWR("/api/students", fetchRoster, { revalidateOnFocus: false })
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [grade, setGrade] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [registerOpen, setRegisterOpen] = useState(false)

  const students = data?.students ?? []
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return students.filter((student) => {
      const matchesText = !normalized || [student.first_name, student.last_name, student.student_id, student.className].some((value) => value?.toLowerCase().includes(normalized))
      return matchesText && (status === "all" || student.admission_status === status) && (grade === "all" || student.grade_level === grade)
    })
  }, [students, query, status, grade])
  const activeCount = students.filter((student) => student.admission_status === "enrolled").length
  const pendingCount = students.filter((student) => ["applied", "accepted"].includes(student.admission_status)).length

  return <section aria-label={title} className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="grid gap-2"><div className="flex items-center gap-2 text-sm font-medium text-primary"><Users className="size-4" /> SCHOOL REGISTRY</div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1><p className="max-w-2xl text-sm text-muted-foreground">{description}</p></div>
      {data?.capabilities.canManage && <Button onClick={() => setRegisterOpen(true)}>Register student</Button>}
    </header>

    <section aria-label="Student roster summary" className="grid gap-3 sm:grid-cols-3">
      <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-sm text-muted-foreground">Total students</p><p className="mt-1 text-2xl font-semibold">{isLoading ? "—" : data?.total ?? 0}</p></div><Users className="size-5 text-muted-foreground" /></CardContent></Card>
      <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-sm text-muted-foreground">Currently enrolled</p><p className="mt-1 text-2xl font-semibold">{isLoading ? "—" : activeCount}</p></div><UserRoundCheck className="size-5 text-muted-foreground" /></CardContent></Card>
      <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-sm text-muted-foreground">Admission in progress</p><p className="mt-1 text-2xl font-semibold">{isLoading ? "—" : pendingCount}</p></div><UserRoundX className="size-5 text-muted-foreground" /></CardContent></Card>
    </section>

    <section className="grid gap-4 rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" aria-label="Search students" placeholder="Search name, admission number or class" /></div>
        <div className="flex flex-wrap items-center gap-2"><SlidersHorizontal className="size-4 text-muted-foreground" /><label className="sr-only" htmlFor="roster-grade">Filter by class</label><select id="roster-grade" value={grade} onChange={(event) => setGrade(event.target.value)} className="h-9 min-w-32 rounded-md border bg-background px-3 text-sm"><option value="all">All grades</option>{Array.from(new Set(students.map((student) => student.grade_level))).sort().map((value) => <option key={value} value={value}>{gradeLabel[value] ?? value}</option>)}</select><label className="sr-only" htmlFor="roster-status">Filter by admission status</label><select id="roster-status" value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 min-w-36 rounded-md border bg-background px-3 text-sm">{statuses.map((value) => <option key={value} value={value}>{value === "all" ? "All statuses" : value.charAt(0).toUpperCase() + value.slice(1)}</option>)}</select></div>
      </div>

      {error ? <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 p-5 text-sm text-destructive">{error.message}</div> : isLoading ? <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">Loading school roster…</div> : filtered.length === 0 ? <div className="rounded-lg border border-dashed p-10 text-center"><p className="font-medium">{students.length ? "No students match these filters" : "No student records yet"}</p><p className="mt-1 text-sm text-muted-foreground">{students.length ? "Try a different search or clear your filters." : "Registered students will appear here."}</p></div> : <>
        <div className="hidden overflow-x-auto md:block"><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Admission no.</TableHead><TableHead>Class</TableHead><TableHead>Admission date</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader><TableBody>{filtered.map((student) => <TableRow key={student.id}><TableCell><div className="flex items-center gap-3"><Avatar className="size-9"><AvatarFallback>{student.first_name[0]}{student.last_name[0]}</AvatarFallback></Avatar><div><p className="font-medium">{student.first_name} {student.last_name}</p><p className="text-xs capitalize text-muted-foreground">{student.gender ?? "Gender not recorded"}</p></div></div></TableCell><TableCell className="font-mono text-xs">{student.student_id}</TableCell><TableCell>{student.className || `${gradeLabel[student.grade_level] ?? student.grade_level} ${student.stream}`}</TableCell><TableCell>{student.admission_date || "—"}</TableCell><TableCell><Badge variant={student.admission_status === "enrolled" ? "default" : "secondary"}>{student.admission_status}</Badge></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student.id)}>View profile</Button></TableCell></TableRow>)}</TableBody></Table></div>
        <div className="grid gap-3 md:hidden">{filtered.map((student) => <button key={student.id} type="button" onClick={() => setSelectedStudent(student.id)} className="grid gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="flex items-center gap-3"><Avatar className="size-10"><AvatarFallback>{student.first_name[0]}{student.last_name[0]}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate font-medium">{student.first_name} {student.last_name}</p><p className="font-mono text-xs text-muted-foreground">{student.student_id}</p></div><Badge variant={student.admission_status === "enrolled" ? "default" : "secondary"}>{student.admission_status}</Badge></div><div className="flex justify-between gap-3 text-sm text-muted-foreground"><span>{student.className || `${gradeLabel[student.grade_level] ?? student.grade_level} ${student.stream}`}</span><span>{student.admission_date || "No admission date"}</span></div></button>)}</div>
        <p className="text-xs text-muted-foreground">Showing {filtered.length} of {students.length} students</p>
      </>}
    </section>

    <StudentRegistrationDialog open={registerOpen} onOpenChange={setRegisterOpen} classes={data?.classes ?? []} />
    <StudentProfileDialog studentId={selectedStudent} classes={data?.classes ?? []} onOpenChange={(open) => { if (!open) setSelectedStudent(null) }} />
  </section>
}
