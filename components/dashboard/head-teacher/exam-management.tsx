"use client"

import { useMemo, useState } from "react"
import { BarChart3, CalendarDays, Check, ClipboardCheck, Download, FileCheck2, GraduationCap, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ExamRecord = { id: string; name: string; term: string; group: string; date: string; candidates: number; status: string }
type Candidate = { id: string; name: string; grade: string; assessment: string; index: string; status: string }

const initialExams: ExamRecord[] = [
  { id: "term-1", name: "End-term assessment", term: "Term 1, 2026", group: "Grades 4–8 · All subjects", date: "10 Apr 2026", candidates: 176, status: "Completed" },
  { id: "term-2", name: "End-term assessment", term: "Term 2, 2026", group: "Grades 4–8 · All subjects", date: "18 Nov 2026", candidates: 184, status: "Scheduled" },
  { id: "cba-3", name: "CBC classroom assessment", term: "Term 2, 2026", group: "Grades 1–3 · Core learning areas", date: "20 Nov 2026", candidates: 96, status: "Scheduled" },
  { id: "cat-2", name: "CAT 2", term: "Term 2, 2026", group: "Grades 6–8 · Mathematics", date: "24 Nov 2026", candidates: 72, status: "Draft" },
  { id: "term-3", name: "End-term assessment", term: "Term 3, 2026", group: "Grades 4–8 · All subjects", date: "27 Nov 2026", candidates: 190, status: "Draft" },
]

const performanceRows = [
  { subject: "Mathematics", teacher: "Grace Wanjiku", mean: 72, grade: "B", class: "Grade 7A", submitted: "32 / 34" },
  { subject: "English", teacher: "Peter Otieno", mean: 68, grade: "B-", class: "Grade 7A", submitted: "34 / 34" },
  { subject: "Integrated Science", teacher: "Mary Njeri", mean: 76, grade: "B+", class: "Grade 7A", submitted: "31 / 34" },
  { subject: "Kiswahili", teacher: "Daniel Kiptoo", mean: 64, grade: "C+", class: "Grade 7A", submitted: "33 / 34" },
]

const initialCandidates: Candidate[] = [
  { id: "c1", name: "Amina Hassan", grade: "Grade 3", assessment: "KPSEA", index: "Pending allocation", status: "Details needed" },
  { id: "c2", name: "Brian Mwangi", grade: "Grade 6", assessment: "KPSEA", index: "KP-2026-0041", status: "Ready" },
  { id: "c3", name: "Faith Achieng", grade: "Grade 9", assessment: "KJSEA", index: "Pending allocation", status: "Review" },
]

function exportCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n")
  const link = document.createElement("a")
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

function StatusBadge({ status }: { status: string }) {
  const variant = status === "Approved" || status === "Ready" ? "default" : status === "Scheduled" || status === "In review" ? "secondary" : "outline"
  return <Badge variant={variant}>{status}</Badge>
}

export function ExamManagementDashboard() {
  const [exams, setExams] = useState(initialExams)
  const [selectedTerm, setSelectedTerm] = useState("Term 2, 2026")
  const [approvedReports, setApprovedReports] = useState<string[]>([])
  const [generatedReports, setGeneratedReports] = useState<string[]>([])
  const [candidates, setCandidates] = useState(initialCandidates)
  const scheduleForTerm = exams.filter((exam) => exam.term === selectedTerm)
  const reportCards = [
    { id: "r1", group: "Grade 7A", term: "Term 2, 2026", ready: "30 / 34", status: "In review" },
    { id: "r2", group: "Grade 6B", term: "Term 2, 2026", ready: "28 / 28", status: "Ready" },
    { id: "r3", group: "Grade 4A", term: "Term 2, 2026", ready: "26 / 31", status: "Draft" },
  ]
  const mean = useMemo(() => Math.round(performanceRows.reduce((total, row) => total + row.mean, 0) / performanceRows.length), [])

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Assessment &amp; examinations</h1>
          <p className="text-muted-foreground">Plan term assessments, monitor results, approve report cards, and track KNEC candidate readiness.</p>
        </div>
        <Badge variant="outline" className="w-fit">Illustrative sample data</Badge>
      </header>

      <Alert>
        <ClipboardCheck />
        <AlertTitle>Preview workspace</AlertTitle>
        <AlertDescription>All records below are examples. Actions update this preview only; they do not save to the school database or submit candidate details to KNEC.</AlertDescription>
      </Alert>

      <section aria-label="Assessment summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardTitle className="text-sm font-medium">Assessments this term</CardTitle><CalendarDays className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{scheduleForTerm.length}</div><p className="text-xs text-muted-foreground">Across primary and junior school</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardTitle className="text-sm font-medium">School mean score</CardTitle><BarChart3 className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mean}%</div><p className="text-xs text-muted-foreground">Illustrative Term 2 results</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardTitle className="text-sm font-medium">Report cards to review</CardTitle><FileCheck2 className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{reportCards.filter((report) => report.status === "In review").length}</div><p className="text-xs text-muted-foreground">Awaiting headteacher approval</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardTitle className="text-sm font-medium">KNEC candidates</CardTitle><Users className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{candidates.length}</div><p className="text-xs text-muted-foreground">KPSEA and KJSEA readiness</p></CardContent></Card>
      </section>

      <Tabs defaultValue="schedule" className="flex flex-col gap-4">
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto">
          <TabsTrigger value="schedule">Exam schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Report cards</TabsTrigger>
          <TabsTrigger value="knec">KNEC registration</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="flex flex-col gap-4">
          <Card>
            <CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><CardTitle>{selectedTerm} assessment schedule</CardTitle><CardDescription>CATs, CBC assessments, and end-term examinations by class.</CardDescription></div><div className="flex flex-wrap items-center gap-2"><Select value={selectedTerm} onValueChange={setSelectedTerm}><SelectTrigger className="w-[160px]" aria-label="Select academic term"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Term 1, 2026">Term 1, 2026</SelectItem><SelectItem value="Term 2, 2026">Term 2, 2026</SelectItem><SelectItem value="Term 3, 2026">Term 3, 2026</SelectItem></SelectContent></Select><Button variant="outline" onClick={() => setExams((items) => [...items, { id: `draft-${items.length + 1}`, name: "New assessment plan", term: selectedTerm, group: "Select classes and subjects", date: "Date to be set", candidates: 0, status: "Draft" }])}>Add schedule draft</Button></div></div></CardHeader>
            <CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Assessment</TableHead><TableHead>Classes / subjects</TableHead><TableHead>Date</TableHead><TableHead>Candidates</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{scheduleForTerm.map((exam) => <TableRow key={exam.id}><TableCell className="font-medium">{exam.name}</TableCell><TableCell>{exam.group}</TableCell><TableCell>{exam.date}</TableCell><TableCell>{exam.candidates || "—"}</TableCell><TableCell><StatusBadge status={exam.status} /></TableCell></TableRow>)}</TableBody></Table></div></CardContent>
          </Card>
          <Card><CardHeader><CardTitle>Assessment mix</CardTitle><CardDescription>Plan balanced evidence across the term.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3">{[{ label: "Continuous assessment", note: "CBC tasks and rubric evidence", value: 64 }, { label: "CATs", note: "Short cycle subject checks", value: 78 }, { label: "End-term exams", note: "Summative subject assessment", value: 42 }].map((item) => <div key={item.label} className="flex flex-col gap-2 rounded-lg border p-4"><div className="flex items-center justify-between gap-2"><span className="font-medium">{item.label}</span><span className="text-sm text-muted-foreground">{item.value}%</span></div><Progress value={item.value} aria-label={`${item.label} completion`} /><p className="text-sm text-muted-foreground">{item.note}</p></div>)}</CardContent></Card>
        </TabsContent>

        <TabsContent value="performance" className="flex flex-col gap-4">
          <Card><CardHeader><CardTitle>Subject and teacher performance</CardTitle><CardDescription>Sample means, grade bands, class progress, and submitted marks by subject.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Teacher</TableHead><TableHead>Class</TableHead><TableHead>Mean</TableHead><TableHead>Grade</TableHead><TableHead>Marks entered</TableHead></TableRow></TableHeader><TableBody>{performanceRows.map((row) => <TableRow key={row.subject}><TableCell className="font-medium">{row.subject}</TableCell><TableCell>{row.teacher}</TableCell><TableCell>{row.class}</TableCell><TableCell>{row.mean}%</TableCell><TableCell><Badge variant="secondary">{row.grade}</Badge></TableCell><TableCell>{row.submitted}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>
          <div className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle>Class and stream ranking</CardTitle><CardDescription>Term mean score by stream (illustrative).</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">{[{ name: "Grade 7A", mean: 72 }, { name: "Grade 7B", mean: 69 }, { name: "Grade 6A", mean: 66 }].map((item, index) => <div key={item.name} className="flex items-center gap-3"><span className="w-7 text-sm font-semibold text-muted-foreground">{index + 1}</span><span className="w-20 text-sm font-medium">{item.name}</span><Progress value={item.mean} aria-label={`${item.name} mean score`} /><span className="w-12 text-right text-sm tabular-nums">{item.mean}%</span></div>)}</CardContent></Card>
            <Card><CardHeader><CardTitle>Teacher submission progress</CardTitle><CardDescription>Marks entered in the sample Grade 7 cohort.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">{[{ name: "Grace Wanjiku", done: 32, total: 34 }, { name: "Peter Otieno", done: 34, total: 34 }, { name: "Mary Njeri", done: 31, total: 34 }].map((item) => <div key={item.name} className="flex flex-col gap-2"><div className="flex justify-between gap-2 text-sm"><span>{item.name}</span><span className="text-muted-foreground">{item.done}/{item.total}</span></div><Progress value={(item.done / item.total) * 100} aria-label={`${item.name} submission progress`} /></div>)}</CardContent></Card></div>
          <Button variant="outline" className="w-fit" onClick={() => exportCsv("term-2-subject-performance.csv", [["Subject", "Teacher", "Class", "Mean", "Grade", "Marks entered"], ...performanceRows.map((row) => [row.subject, row.teacher, row.class, String(row.mean), row.grade, row.submitted])])}><Download data-icon="inline-start" />Export performance CSV</Button>
        </TabsContent>

        <TabsContent value="reports">
          <Card><CardHeader><CardTitle>Report card generation and approval</CardTitle><CardDescription>Review completion, generate term reports, and approve ready class sets.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Class</TableHead><TableHead>Term</TableHead><TableHead>Reports ready</TableHead><TableHead>Review status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader><TableBody>{reportCards.map((report) => { const approved = approvedReports.includes(report.id); return <TableRow key={report.id}><TableCell className="font-medium">{report.group}</TableCell><TableCell>{report.term}</TableCell><TableCell>{report.ready}</TableCell><TableCell><StatusBadge status={approved ? "Approved" : generatedReports.includes(report.id) ? "In review" : report.status} /></TableCell><TableCell className="text-right"><Button size="sm" variant={approved ? "outline" : "default"} disabled={approved || (report.status === "Draft" && !generatedReports.includes(report.id))} onClick={() => { if (report.status === "Ready" && !generatedReports.includes(report.id)) setGeneratedReports((current) => [...current, report.id]); else setApprovedReports((current) => [...current, report.id]) }}>{approved ? <><Check data-icon="inline-start" />Approved</> : generatedReports.includes(report.id) || report.status === "In review" ? "Approve set" : "Generate report cards"}</Button></TableCell></TableRow> })}</TableBody></Table></div><p className="mt-4 text-sm text-muted-foreground">Report approval is an in-preview demonstration. It does not publish student records or create official report cards.</p></CardContent></Card>
        </TabsContent>

        <TabsContent value="knec">
          <Card><CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><CardTitle className="flex items-center gap-2"><GraduationCap className="size-5" />KNEC candidate readiness</CardTitle><CardDescription>Track KPSEA and KJSEA candidate details and registration status.</CardDescription></div><Button variant="outline" onClick={() => exportCsv("knec-candidate-readiness.csv", [["Learner", "Grade", "Assessment", "Index", "Status"], ...candidates.map((candidate) => [candidate.name, candidate.grade, candidate.assessment, candidate.index, candidate.status])])}><Download data-icon="inline-start" />Export candidate list</Button></div></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Learner</TableHead><TableHead>Grade</TableHead><TableHead>Assessment</TableHead><TableHead>Candidate number</TableHead><TableHead>Registration status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader><TableBody>{candidates.map((candidate) => <TableRow key={candidate.id}><TableCell className="font-medium">{candidate.name}</TableCell><TableCell>{candidate.grade}</TableCell><TableCell><Badge variant="outline">{candidate.assessment}</Badge></TableCell><TableCell>{candidate.index}</TableCell><TableCell><StatusBadge status={candidate.status} /></TableCell><TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => setCandidates((items) => items.map((item) => item.id === candidate.id ? { ...item, status: item.status === "Ready" ? "Review" : "Ready" } : item))}>{candidate.status === "Ready" ? "Mark for review" : "Mark ready"}</Button></TableCell></TableRow>)}</TableBody></Table></div><p className="mt-4 text-sm text-muted-foreground">Use the school’s official KNEC process for final registration and candidate-number verification.</p></CardContent></Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
