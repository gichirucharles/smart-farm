"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { AlertCircle, ArrowUpRight, BookOpen, CalendarDays, ChartColumnIncreasing, ClipboardList, GraduationCap, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type View = "overview" | "classes" | "students" | "gradebook"
type Assignment = { key: string; classId: string; className: string; gradeLevel: string; stream: string | null; academicYear: string | null; subjectId: string; subjectName: string; studentCount: number }
type Student = { id: string; admissionNumber: string; name: string; classId: string }
type Assessment = { id: string; class_id: string; subject_id: string; name: string; type: string; total_marks: number; date: string; academic_year: string; term: string; results: { student_id: string; marks_obtained: number; grade: string | null; remarks: string | null }[]; className: string; subjectName: string }
type TimetableEntry = { id: string; class_id: string; subject_id: string; day_of_week: number; starts_at: string; ends_at: string; room: string | null; className: string; subjectName: string }
type WorkspaceData = { teacher: { firstName: string; lastName: string }; assignments: Assignment[]; students: Student[]; timetable: TimetableEntry[]; assessments: Assessment[] }

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const fetcher = async (url: string): Promise<WorkspaceData> => {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || "Unable to load teaching records")
  return body
}

export function SubjectTeacherWorkspace({ view }: { view: View }) {
  const { data, error, isLoading, mutate } = useSWR<WorkspaceData>("/api/subject-teacher", fetcher)
  const [selectedKey, setSelectedKey] = useState("")
  const [assessmentName, setAssessmentName] = useState("")
  const [assessmentType, setAssessmentType] = useState("CAT")
  const [totalMarks, setTotalMarks] = useState("100")
  const [term, setTerm] = useState("Term 1")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [scores, setScores] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)
  const assignments = data?.assignments ?? []
  const selected = assignments.find((item) => item.key === selectedKey) ?? assignments[0]
  const students = selected ? (data?.students ?? []).filter((student) => student.classId === selected.classId) : []
  const recentAssessments = useMemo(() => (data?.assessments ?? []).slice(0, 8), [data?.assessments])
  const title = view === "overview" ? "Subject teacher dashboard" : view === "classes" ? "My classes" : view === "students" ? "Class lists" : "Gradebook & marks"

  async function saveMarks(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selected) return
    const marks = students.filter((student) => scores[student.id] !== undefined && scores[student.id] !== "").map((student) => ({ studentId: student.id, score: Number(scores[student.id]), remarks: "" }))
    if (!marks.length) { setMessage("Enter at least one mark before saving."); return }
    setSaving(true); setMessage("")
    try {
      const response = await fetch("/api/subject-teacher", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ classId: selected.classId, subjectId: selected.subjectId, assessmentName, assessmentType, totalMarks: Number(totalMarks), date, academicYear: selected.academicYear || String(new Date().getFullYear()), term, marks }) })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || "Unable to save marks")
      setMessage(`Saved marks for ${body.saved} students.`)
      setAssessmentName(""); setScores({})
      await mutate()
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save marks") }
    finally { setSaving(false) }
  }

  return <main className="flex min-w-0 flex-col gap-6">
    <header className="flex flex-col gap-1"><h1 className="text-3xl font-bold tracking-tight">{title}</h1><p className="text-muted-foreground">{data ? `Welcome, ${data.teacher.firstName}. Your records are limited to your assigned subjects and classes.` : "Your classes, learners, timetable, and assessment results."}</p></header>
    {isLoading && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Card key={index} className="h-28 animate-pulse" />)}</div>}
    {error && <Alert variant="destructive"><AlertCircle className="size-4" /><AlertDescription>{error.message}</AlertDescription></Alert>}
    {data && assignments.length === 0 && <Card><CardContent className="py-10 text-center"><BookOpen className="mx-auto mb-3 size-8 text-muted-foreground" /><h2 className="font-semibold">No active teaching assignments</h2><p className="mt-1 text-sm text-muted-foreground">Your timetable will appear here after classes and subjects are assigned to you.</p></CardContent></Card>}
    {data && assignments.length > 0 && <>
      {(view === "overview" || view === "classes") && <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Teaching summary">
        <Metric label="Assigned classes" value={assignments.length} caption="Class and subject combinations" icon={<BookOpen className="size-4" />} />
        <Metric label="Learners" value={new Set(data.students.map((item) => item.id)).size} caption="Across assigned classes" icon={<Users className="size-4" />} />
        <Metric label="Lessons this week" value={data.timetable.length} caption="From your school timetable" icon={<CalendarDays className="size-4" />} />
        <Metric label="Assessments" value={data.assessments.length} caption="Recorded for your classes" icon={<ChartColumnIncreasing className="size-4" />} />
      </section>}
      {(view === "overview" || view === "classes") && <Card><CardHeader><CardTitle>My teaching assignments</CardTitle><CardDescription>Classes and subjects currently assigned to you.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Class</TableHead><TableHead>Subject</TableHead><TableHead>Stream</TableHead><TableHead>Learners</TableHead><TableHead>Academic year</TableHead></TableRow></TableHeader><TableBody>{assignments.map((item) => <TableRow key={item.key}><TableCell className="font-medium">{item.className}</TableCell><TableCell>{item.subjectName}</TableCell><TableCell>{item.stream || "—"}</TableCell><TableCell>{item.studentCount}</TableCell><TableCell>{item.academicYear || "—"}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>}
      {(view === "overview" || view === "classes") && <Card><CardHeader><CardTitle>My timetable</CardTitle><CardDescription>Upcoming lesson periods assigned to your classes.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Day</TableHead><TableHead>Time</TableHead><TableHead>Class</TableHead><TableHead>Subject</TableHead><TableHead>Room</TableHead></TableRow></TableHeader><TableBody>{data.timetable.length ? data.timetable.map((item) => <TableRow key={item.id}><TableCell>{dayNames[item.day_of_week] ?? "—"}</TableCell><TableCell className="whitespace-nowrap">{item.starts_at.slice(0, 5)}–{item.ends_at.slice(0, 5)}</TableCell><TableCell>{item.className}</TableCell><TableCell>{item.subjectName}</TableCell><TableCell>{item.room || "—"}</TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No timetable periods have been recorded.</TableCell></TableRow>}</TableBody></Table></div></CardContent></Card>}
      {(view === "overview" || view === "gradebook") && <Card><CardHeader><CardTitle>Subject performance</CardTitle><CardDescription>Class averages from recorded assessment marks only.</CardDescription></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{assignments.map((assignment) => {
        const classAssessments = data.assessments.filter((item) => item.class_id === assignment.classId && item.subject_id === assignment.subjectId)
        const scores = classAssessments.flatMap((item) => item.results.map((result) => result.marks_obtained / item.total_marks * 100))
        const average = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : null
        return <div key={assignment.key} className="rounded-lg border p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{assignment.className} · {assignment.subjectName}</p><p className="mt-1 text-sm text-muted-foreground">{classAssessments.length} assessments · {scores.length} marks</p></div><Badge variant="outline">{average === null ? "No marks" : `${average}% avg.`}</Badge></div></div>
      })}</div></CardContent></Card>}
      {(view === "overview" || view === "gradebook") && <Card><CardHeader><CardTitle>Recent assessments</CardTitle><CardDescription>Recorded marks for your teaching assignments.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Assessment</TableHead><TableHead>Class</TableHead><TableHead>Subject</TableHead><TableHead>Date</TableHead><TableHead>Marks recorded</TableHead></TableRow></TableHeader><TableBody>{recentAssessments.length ? recentAssessments.map((item) => <TableRow key={item.id}><TableCell className="font-medium">{item.name}<div className="text-xs text-muted-foreground">{item.type} · out of {item.total_marks}</div></TableCell><TableCell>{item.className}</TableCell><TableCell>{item.subjectName}</TableCell><TableCell>{item.date}</TableCell><TableCell>{item.results.length}</TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No assessments have been recorded yet.</TableCell></TableRow>}</TableBody></Table></div></CardContent></Card>}
      {(view === "overview" || view === "students") && <Card><CardHeader><CardTitle>Class lists</CardTitle><CardDescription>Student information is view-only, grouped by assigned class.</CardDescription></CardHeader><CardContent className="space-y-5">{assignments.map((assignment) => {
        const roster = data.students.filter((student) => student.classId === assignment.classId)
        return <section key={assignment.key} aria-label={`${assignment.className} ${assignment.subjectName}`}><div className="mb-2 flex items-center justify-between gap-2"><h3 className="font-semibold">{assignment.className} · {assignment.subjectName}</h3><Badge variant="secondary">{roster.length} learners</Badge></div><div className="overflow-x-auto rounded-md border"><Table><TableHeader><TableRow><TableHead>Admission number</TableHead><TableHead>Student</TableHead></TableRow></TableHeader><TableBody>{roster.length ? roster.map((student) => <TableRow key={student.id}><TableCell>{student.admissionNumber || "—"}</TableCell><TableCell className="font-medium">{student.name}</TableCell></TableRow>) : <TableRow><TableCell colSpan={2} className="py-5 text-center text-muted-foreground">No active students match this class.</TableCell></TableRow>}</TableBody></Table></div></section>
      })}</CardContent></Card>}
      {view === "gradebook" && <Card><CardHeader><CardTitle>Enter assessment marks</CardTitle><CardDescription>New marks are saved to the school assessment records and scoped to your assigned class and subject.</CardDescription></CardHeader><CardContent><form onSubmit={saveMarks} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><div className="space-y-2"><Label htmlFor="marks-class">Class and subject</Label><Select value={selected?.key} onValueChange={(value) => { setSelectedKey(value); setScores({}) }}><SelectTrigger id="marks-class"><SelectValue /></SelectTrigger><SelectContent>{assignments.map((item) => <SelectItem key={item.key} value={item.key}>{item.className} · {item.subjectName}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="assessment-name">Assessment name</Label><Input id="assessment-name" required maxLength={120} value={assessmentName} onChange={(event) => setAssessmentName(event.target.value)} placeholder="e.g. Fractions CAT" /></div><div className="space-y-2"><Label htmlFor="assessment-type">Type</Label><Select value={assessmentType} onValueChange={setAssessmentType}><SelectTrigger id="assessment-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="CAT">CAT</SelectItem><SelectItem value="assignment">Assignment</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="CBC rubric">CBC rubric</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label htmlFor="total-marks">Maximum marks</Label><Input id="total-marks" type="number" min="1" max="1000" required value={totalMarks} onChange={(event) => setTotalMarks(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="assessment-date">Assessment date</Label><Input id="assessment-date" type="date" required value={date} onChange={(event) => setDate(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="assessment-term">Term</Label><Input id="assessment-term" required maxLength={30} value={term} onChange={(event) => setTerm(event.target.value)} /></div></div>
        <div className="overflow-x-auto rounded-md border"><Table><TableHeader><TableRow><TableHead>Learner</TableHead><TableHead>Admission number</TableHead><TableHead>Mark / {totalMarks || "—"}</TableHead></TableRow></TableHeader><TableBody>{students.map((student) => <TableRow key={student.id}><TableCell className="font-medium">{student.name}</TableCell><TableCell>{student.admissionNumber || "—"}</TableCell><TableCell><Input className="w-28" type="number" min="0" max={totalMarks} step="1" aria-label={`Mark for ${student.name}`} value={scores[student.id] ?? ""} onChange={(event) => setScores((current) => ({ ...current, [student.id]: event.target.value }))} /></TableCell></TableRow>)}</TableBody></Table></div>
        {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}<Button type="submit" disabled={saving || students.length === 0}>{saving ? "Saving…" : "Save marks"}<ArrowUpRight data-icon="inline-end" /></Button>
      </form></CardContent></Card>}
    </>}
  </main>
}

function Metric({ label, value, caption, icon }: { label: string; value: number; caption: string; icon: React.ReactNode }) {
  return <Card><CardHeader className="flex flex-row items-center justify-between gap-3 pb-2"><CardDescription>{label}</CardDescription><span className="text-muted-foreground" aria-hidden="true">{icon}</span></CardHeader><CardContent><p className="text-3xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-muted-foreground">{caption}</p></CardContent></Card>
}
