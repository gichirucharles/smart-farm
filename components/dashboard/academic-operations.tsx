"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, CalendarDays, Check, ClipboardCheck, GraduationCap, Users } from "lucide-react"

type AcademicOperationsProps = { role?: "headteacher" | "teacher" }
type ReviewStatus = "Pending review" | "Approved" | "Needs revision"

const classSchedule = [
  { day: "Monday", time: "08:00–08:40", className: "Grade 6A", subject: "Mathematics", teacher: "Catherine Njoroge", room: "Room 12" },
  { day: "Monday", time: "08:40–09:20", className: "Grade 6B", subject: "Mathematics", teacher: "Catherine Njoroge", room: "Room 14" },
  { day: "Tuesday", time: "09:20–10:00", className: "Grade 5A", subject: "Science", teacher: "Peter Omondi", room: "Lab 1" },
  { day: "Wednesday", time: "10:20–11:00", className: "Grade 7A", subject: "English", teacher: "Sarah Njoroge", room: "Room 21" },
]

const teacherSchedule = [
  { day: "Monday", time: "08:00–08:40", className: "Grade 6A", subject: "Mathematics", teacher: "Catherine Njoroge", room: "Room 12" },
  { day: "Monday", time: "08:40–09:20", className: "Grade 6B", subject: "Mathematics", teacher: "Catherine Njoroge", room: "Room 14" },
  { day: "Tuesday", time: "11:00–11:40", className: "Grade 6A", subject: "Mathematics", teacher: "Catherine Njoroge", room: "Room 12" },
  { day: "Thursday", time: "13:20–14:00", className: "Grade 6B", subject: "Mathematics", teacher: "Catherine Njoroge", room: "Room 14" },
]

const allocations = [
  { subject: "Mathematics", className: "Grades 6A–6B", teacher: "Catherine Njoroge", periods: "8 / week" },
  { subject: "Science", className: "Grade 5A", teacher: "Peter Omondi", periods: "5 / week" },
  { subject: "English", className: "Grade 7A", teacher: "Sarah Njoroge", periods: "6 / week" },
]

const initialSubmissions = [
  { id: "plan-1", title: "Fractions and equivalent values", type: "Lesson plan", className: "Grade 6A · Mathematics", submitted: "Nov 16, 2026", status: "Pending review" as ReviewStatus },
  { id: "plan-2", title: "Materials and their properties", type: "Scheme of work", className: "Grade 5A · Science", submitted: "Nov 14, 2026", status: "Approved" as ReviewStatus },
  { id: "plan-3", title: "Reading comprehension", type: "Record of work", className: "Grade 7A · English", submitted: "Nov 13, 2026", status: "Needs revision" as ReviewStatus },
]

const syllabusCoverage = [
  { subject: "Mathematics", className: "Grade 6A", covered: 72, planned: "Unit 8 of 11" },
  { subject: "Science", className: "Grade 5A", covered: 64, planned: "Unit 7 of 10" },
  { subject: "English", className: "Grade 7A", covered: 81, planned: "Unit 9 of 11" },
  { subject: "Kiswahili", className: "Grade 6B", covered: 58, planned: "Unit 6 of 10" },
]

function StatusBadge({ status }: { status: string }) {
  const variant = status === "Approved" ? "default" : status === "Needs revision" ? "destructive" : "secondary"
  return <Badge variant={variant}>{status}</Badge>
}

function TimetableTable({ rows }: { rows: typeof classSchedule }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader><TableRow><TableHead>Day</TableHead><TableHead>Time</TableHead><TableHead>Class</TableHead><TableHead>Subject</TableHead><TableHead>Teacher</TableHead><TableHead>Room</TableHead></TableRow></TableHeader>
        <TableBody>{rows.map((row) => <TableRow key={`${row.day}-${row.time}-${row.className}`}><TableCell>{row.day}</TableCell><TableCell className="whitespace-nowrap">{row.time}</TableCell><TableCell className="font-medium">{row.className}</TableCell><TableCell>{row.subject}</TableCell><TableCell>{row.teacher}</TableCell><TableCell>{row.room}</TableCell></TableRow>)}</TableBody>
      </Table>
    </div>
  )
}

export function AcademicOperations({ role = "headteacher" }: AcademicOperationsProps) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const isHeadteacher = role === "headteacher"
  const schedule = isHeadteacher ? classSchedule : teacherSchedule
  const pendingCount = submissions.filter((item) => item.status === "Pending review").length

  const reviewSubmission = (id: string, status: ReviewStatus) => {
    setSubmissions((current) => current.map((item) => item.id === id ? { ...item, status } : item))
  }

  return (
    <section className="flex min-w-0 flex-col gap-6" aria-labelledby="academic-operations-heading">
      <header className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 id="academic-operations-heading" className="text-3xl font-bold tracking-tight">{isHeadteacher ? "Academic operations" : "Teaching & learning"}</h1>
          <Badge variant="outline">Illustrative data</Badge>
        </div>
        <p className="text-muted-foreground">{isHeadteacher ? "Coordinate timetables, teaching assignments, planning approvals, and syllabus progress." : "Review your teaching timetable, planning submissions, and curriculum coverage."}</p>
        <p className="text-xs text-muted-foreground">Sample records only. Changes made here are temporary and are not saved to the school database.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardDescription>{isHeadteacher ? "Classes scheduled" : "My lessons this week"}</CardDescription><CalendarDays aria-hidden="true" className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-semibold">{isHeadteacher ? "18" : "12"}</p><p className="text-xs text-muted-foreground">Across the current term</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardDescription>{isHeadteacher ? "Teaching staff" : "Assigned classes"}</CardDescription><Users aria-hidden="true" className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-semibold">{isHeadteacher ? "48" : "4"}</p><p className="text-xs text-muted-foreground">Current allocation</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardDescription>{isHeadteacher ? "Planning to review" : "Plans to submit"}</CardDescription><ClipboardCheck aria-hidden="true" className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-semibold">{isHeadteacher ? pendingCount : "3"}</p><p className="text-xs text-muted-foreground">Schemes, lesson plans, and work records</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardDescription>Average syllabus covered</CardDescription><GraduationCap aria-hidden="true" className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-semibold">69%</p><p className="text-xs text-muted-foreground">Across tracked classes</p></CardContent></Card>
      </div>

      <Tabs defaultValue="timetable" className="flex flex-col gap-4">
        <TabsList className="h-auto w-full justify-start overflow-x-auto">
          <TabsTrigger value="timetable">Timetables</TabsTrigger>
          {isHeadteacher && <TabsTrigger value="allocation">Subject allocation</TabsTrigger>}
          <TabsTrigger value="planning">Planning & approvals{isHeadteacher && pendingCount > 0 ? ` (${pendingCount})` : ""}</TabsTrigger>
          <TabsTrigger value="coverage">Syllabus coverage</TabsTrigger>
        </TabsList>

        <TabsContent value="timetable">
          <Card><CardHeader><CardTitle>{isHeadteacher ? "Class and teacher timetables" : "My teaching timetable"}</CardTitle><CardDescription>{isHeadteacher ? "A school-wide view of scheduled lessons, assigned teachers, and learning spaces." : "Your scheduled classes, subjects, periods, and rooms."}</CardDescription></CardHeader><CardContent><TimetableTable rows={schedule} /></CardContent></Card>
        </TabsContent>

        {isHeadteacher && <TabsContent value="allocation">
          <Card><CardHeader><CardTitle>Subject-teacher allocation</CardTitle><CardDescription>Review teaching assignments and weekly lesson loads.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Class / stream</TableHead><TableHead>Assigned teacher</TableHead><TableHead>Periods</TableHead></TableRow></TableHeader><TableBody>{allocations.map((item) => <TableRow key={`${item.subject}-${item.className}`}><TableCell className="font-medium">{item.subject}</TableCell><TableCell>{item.className}</TableCell><TableCell>{item.teacher}</TableCell><TableCell>{item.periods}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>
        </TabsContent>}

        <TabsContent value="planning">
          <Card><CardHeader><CardTitle>{isHeadteacher ? "Schemes of work, lesson plans & records" : "My teaching plans & records"}</CardTitle><CardDescription>{isHeadteacher ? "Check submission status and approve or return teaching documents for revision." : "Track your document submission and review status."}</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Document</TableHead><TableHead>Type</TableHead><TableHead>Class & subject</TableHead><TableHead>Submitted</TableHead><TableHead>Status</TableHead>{isHeadteacher && <TableHead><span className="sr-only">Review actions</span></TableHead>}</TableRow></TableHeader><TableBody>{submissions.map((item) => <TableRow key={item.id}><TableCell className="font-medium">{item.title}</TableCell><TableCell>{item.type}</TableCell><TableCell>{item.className}</TableCell><TableCell className="whitespace-nowrap">{item.submitted}</TableCell><TableCell><StatusBadge status={item.status} /></TableCell>{isHeadteacher && <TableCell><div className="flex justify-end gap-2">{item.status === "Pending review" && <><Button size="sm" variant="outline" aria-label={`Approve ${item.title}`} onClick={() => reviewSubmission(item.id, "Approved")}><Check data-icon="inline-start" />Approve</Button><Button size="sm" variant="ghost" onClick={() => reviewSubmission(item.id, "Needs revision")}>Return</Button></>}</div></TableCell>}</TableRow>)}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        <TabsContent value="coverage">
          <Card><CardHeader><CardTitle>Curriculum & syllabus coverage</CardTitle><CardDescription>Compare completed units with the term plan and spot classes that may need support.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Class</TableHead><TableHead>Coverage</TableHead><TableHead>Progress</TableHead><TableHead>Current position</TableHead></TableRow></TableHeader><TableBody>{syllabusCoverage.map((item) => <TableRow key={`${item.subject}-${item.className}`}><TableCell className="font-medium">{item.subject}</TableCell><TableCell>{item.className}</TableCell><TableCell>{item.covered}%</TableCell><TableCell><div className="flex min-w-32 items-center gap-2"><Progress value={item.covered} aria-label={`${item.subject} ${item.className} syllabus coverage ${item.covered}%`} className="h-2" /><span className="text-xs tabular-nums text-muted-foreground">{item.covered}%</span></div></TableCell><TableCell>{item.planned}</TableCell></TableRow>)}</TableBody></Table></div><div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><BookOpen aria-hidden="true" className="size-4 shrink-0" />Coverage tracking is illustrative until linked to submitted records of work.</div></CardContent></Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
