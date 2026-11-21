"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { AlertTriangle, CalendarDays, Check, ClipboardCheck, HeartPulse, MessageSquareText, Plus, Users, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type Student = {
  id: string; admissionNumber: string; name: string; classId: string; className: string; photoUrl: string | null
  guardians: { id: string; name: string; relationship: string; phone: string | null; email: string | null; emergency_contact: boolean }[]
  healthFlags: { id: string; summary: string; updated_at: string }[]
  attendance: { status: string; remarks: string | null } | null
  marks: { average: number | null; rank: number | null; assessments: number; subjects: { subject: string; score: number | null }[] }
  feeBalance: number
}
type DashboardData = {
  date: string
  classes: { id: string; name: string; gradeLevel: string; stream: string | null; academicYear: string | null }[]
  students: Student[]
  entries: { id: string; class_id: string; student_id: string | null; category: string; title: string; body: string; status: string; visible_to_parent: boolean; created_at: string }[]
  timetable: { id: string; class_id: string; subject: string; day_of_week: number; starts_at: string; ends_at: string; room: string | null }[]
  assessments: { id: string; class_id: string; subject: string; name: string; date: string | null; term: string | null }[]
}
const fetcher = async (url: string): Promise<DashboardData> => {
  const response = await fetch(url, { credentials: "same-origin" })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? "Unable to load class dashboard")
  return data
}
const today = () => new Date().toLocaleDateString("en-CA")
const money = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 })
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function ClassTeacherLiveDashboard() {
  const [date, setDate] = useState(today())
  const [selectedClassId, setSelectedClassId] = useState("")
  const [category, setCategory] = useState("remark")
  const [studentId, setStudentId] = useState("")
  const [entryTitle, setEntryTitle] = useState("")
  const [entryBody, setEntryBody] = useState("")
  const [visibleToParent, setVisibleToParent] = useState(false)
  const [savingAttendance, setSavingAttendance] = useState(false)
  const [savingEntry, setSavingEntry] = useState(false)
  const { data, error, isLoading, mutate } = useSWR(`/api/class-teacher?date=${date}`, fetcher, { revalidateOnFocus: false })
  const activeClassId = selectedClassId || data?.classes[0]?.id || ""
  const activeClass = data?.classes.find((item) => item.id === activeClassId)
  const students = useMemo(() => (data?.students ?? []).filter((student) => student.classId === activeClassId), [data?.students, activeClassId])
  const presentCount = students.filter((student) => student.attendance?.status === "present" || student.attendance?.status === "late").length
  const markedCount = students.filter((student) => student.attendance !== null).length
  const assessedStudents = students.filter((student) => student.marks.average !== null)
  const classAverage = assessedStudents.length ? Math.round(assessedStudents.reduce((sum, item) => sum + (item.marks.average ?? 0), 0) / assessedStudents.length) : null
  const classEntries = (data?.entries ?? []).filter((item) => item.class_id === activeClassId)
  const weeklySchedule = (data?.timetable ?? []).filter((item) => item.class_id === activeClassId)
  const studentName = (id: string | null) => data?.students.find((student) => student.id === id)?.name ?? "Class-wide"

  async function saveAttendance() {
    if (!students.length) return
    setSavingAttendance(true)
    try {
      const response = await fetch("/api/class-teacher", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "attendance", date, records: students.map((student) => ({
          studentId: student.id, classId: student.classId, status: student.attendance?.status ?? "present", remarks: student.attendance?.remarks ?? "",
        })) }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Unable to save register")
      await mutate()
      toast.success("Attendance register saved")
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Unable to save register")
    } finally { setSavingAttendance(false) }
  }

  async function addEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activeClassId || !entryTitle.trim() || !entryBody.trim()) return
    setSavingEntry(true)
    try {
      const response = await fetch("/api/class-teacher", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "entry", classId: activeClassId, studentId: studentId || null, category, title: entryTitle, body: entryBody, visibleToParent }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Unable to save class record")
      setEntryTitle(""); setEntryBody(""); setStudentId(""); setVisibleToParent(false)
      await mutate()
      toast.success("Class record saved")
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Unable to save class record")
    } finally { setSavingEntry(false) }
  }

  if (isLoading) return <div className="grid gap-4 md:grid-cols-3"><Card><CardContent className="p-6 text-sm text-muted-foreground">Loading your assigned class…</CardContent></Card></div>
  if (error) return <Card><CardContent className="p-6"><p className="text-sm text-destructive">{error.message}</p><Button className="mt-3" variant="outline" onClick={() => void mutate()}>Try again</Button></CardContent></Card>
  if (!data?.classes.length) return <Card><CardHeader><CardTitle>No active class assignment</CardTitle><CardDescription>Your school administrator has not assigned an active class to your account yet.</CardDescription></CardHeader></Card>

  return <section className="flex flex-col gap-6" aria-labelledby="class-teacher-title">
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="grid gap-2"><p className="text-sm font-medium text-primary">Classroom home base</p><h1 id="class-teacher-title" className="text-3xl font-semibold tracking-tight">Class teacher</h1><p className="max-w-2xl text-sm text-muted-foreground">Attendance, student wellbeing and progress in one live class workspace.</p></div>
      <div className="flex flex-wrap gap-2">
        <Select value={activeClassId} onValueChange={setSelectedClassId}><SelectTrigger className="w-[190px]" aria-label="Choose assigned class"><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent><SelectGroup>{data.classes.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectGroup></SelectContent></Select>
        <Input aria-label="Attendance date" type="date" className="w-auto" value={date} onChange={(event) => setDate(event.target.value)} />
      </div>
    </header>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={Users} label="Class roster" value={String(students.length)} note={activeClass?.academicYear ?? "Active students"} />
      <Metric icon={ClipboardCheck} label="Attendance" value={`${markedCount}/${students.length}`} note={`${presentCount} present or late · ${date}`} />
      <Metric icon={Check} label="Class average" value={classAverage === null ? "—" : `${classAverage}%`} note={`${assessedStudents.length} students with marks`} />
      <Metric icon={Wallet} label="Fee follow-up" value={String(students.filter((student) => student.feeBalance > 0).length)} note="Students with an outstanding balance" />
    </div>

    <Tabs defaultValue="overview" className="flex flex-col gap-4">
      <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg border bg-background p-1">
        <TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="attendance">Attendance</TabsTrigger><TabsTrigger value="progress">Marks & reports</TabsTrigger><TabsTrigger value="students">Students & wellbeing</TabsTrigger><TabsTrigger value="schedule">Timetable</TabsTrigger><TabsTrigger value="communication">Communication & duties</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card><CardHeader><CardTitle>Today&apos;s class register</CardTitle><CardDescription>{activeClass?.name} · {markedCount} of {students.length} marked</CardDescription></CardHeader><CardContent><div className="flex flex-col gap-3">{students.slice(0, 6).map((student) => <div key={student.id} className="flex items-center justify-between gap-4 border-b pb-3 last:border-0"><div className="min-w-0"><p className="truncate text-sm font-medium">{student.name}</p><p className="text-xs text-muted-foreground">{student.admissionNumber}</p></div><Badge variant={student.attendance?.status === "present" ? "secondary" : student.attendance?.status === "late" ? "outline" : student.attendance?.status === "absent" ? "destructive" : "outline"}>{student.attendance?.status ?? "Not marked"}</Badge></div>)}{!students.length && <p className="text-sm text-muted-foreground">No students are enrolled in this assigned stream yet.</p>}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Needs follow-up</CardTitle><CardDescription>Only the health notes shared for classroom use are shown.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">{students.filter((student) => student.healthFlags.length || student.feeBalance > 0).slice(0, 6).map((student) => <div key={student.id} className="flex items-start gap-3"><span className="mt-0.5 text-primary"><HeartPulse aria-hidden="true" /></span><div className="min-w-0"><p className="text-sm font-medium">{student.name}</p><p className="text-xs text-muted-foreground">{student.healthFlags.map((flag) => flag.summary).join(" · ")}{student.healthFlags.length && student.feeBalance > 0 ? " · " : ""}{student.feeBalance > 0 ? `Fee balance ${money.format(student.feeBalance)}` : ""}</p></div></div>)}{!students.some((student) => student.healthFlags.length || student.feeBalance > 0) && <p className="text-sm text-muted-foreground">No shared health flags or fee follow-up for this class.</p>}</CardContent></Card>
        <Card className="lg:col-span-2"><CardHeader><CardTitle>Recent class activity</CardTitle><CardDescription>Teacher notes, requests, incidents and updates</CardDescription></CardHeader><CardContent><ActivityTable entries={classEntries.slice(0, 5)} studentName={studentName} /></CardContent></Card>
      </TabsContent>
      <TabsContent value="attendance"><Card><CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Daily attendance register</CardTitle><CardDescription>This register is saved to the school attendance record and feeds school reporting.</CardDescription></div><Button onClick={saveAttendance} disabled={savingAttendance || students.length === 0}>{savingAttendance ? "Saving…" : "Save register"}</Button></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Admission no.</TableHead><TableHead>Status</TableHead><TableHead>Absence note</TableHead></TableRow></TableHeader><TableBody>{students.map((student) => <TableRow key={student.id}><TableCell className="font-medium">{student.name}</TableCell><TableCell>{student.admissionNumber}</TableCell><TableCell><Select value={student.attendance?.status ?? "unmarked"} onValueChange={(value) => void mutate((current) => current ? { ...current, students: current.students.map((row) => row.id === student.id ? { ...row, attendance: value === "unmarked" ? null : { status: value, remarks: row.attendance?.remarks ?? null } } : row) } : current, { revalidate: false })}><SelectTrigger className="w-[140px]" aria-label={`Attendance status for ${student.name}`}><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="unmarked">Not marked</SelectItem><SelectItem value="present">Present</SelectItem><SelectItem value="late">Late</SelectItem><SelectItem value="absent">Absent</SelectItem><SelectItem value="excused">Excused</SelectItem></SelectGroup></SelectContent></Select></TableCell><TableCell className="text-muted-foreground">{student.attendance?.remarks || "—"}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card></TabsContent>
      <TabsContent value="progress" className="flex flex-col gap-4"><Card><CardHeader><CardTitle>Compiled class marks</CardTitle><CardDescription>Aggregated from subject-teacher assessment results; ranks are within this assigned class.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Assessments</TableHead><TableHead>Average</TableHead><TableHead>Class rank</TableHead><TableHead>Subject breakdown</TableHead><TableHead>Fee balance</TableHead></TableRow></TableHeader><TableBody>{[...students].sort((a, b) => (b.marks.average ?? -1) - (a.marks.average ?? -1)).map((student) => <TableRow key={student.id}><TableCell className="font-medium">{student.name}</TableCell><TableCell>{student.marks.assessments}</TableCell><TableCell>{student.marks.average === null ? "—" : `${student.marks.average}%`}</TableCell><TableCell>{student.marks.rank ? `#${student.marks.rank}` : "—"}</TableCell><TableCell>{student.marks.subjects.map((subject) => `${subject.subject} ${subject.score ?? "—"}%`).join(" · ") || "No marks submitted"}</TableCell><TableCell>{student.feeBalance > 0 ? <Badge variant="outline">{money.format(student.feeBalance)}</Badge> : "—"}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card><Card><CardHeader><CardTitle>Assessments submitted</CardTitle><CardDescription>Assessment records created for your assigned class.</CardDescription></CardHeader><CardContent><div className="flex flex-wrap gap-2">{(data.assessments ?? []).filter((item) => item.class_id === activeClassId).map((item) => <Badge key={item.id} variant="secondary">{item.subject}: {item.name}{item.date ? ` · ${item.date}` : ""}</Badge>)}{!(data.assessments ?? []).some((item) => item.class_id === activeClassId) && <p className="text-sm text-muted-foreground">Subject teachers have not submitted assessment records for this class yet.</p>}</div></CardContent></Card></TabsContent>
      <TabsContent value="students"><Card><CardHeader><CardTitle>Student profiles and wellbeing</CardTitle><CardDescription>Emergency contacts are marked. Health information is limited to flags explicitly shared with class teachers.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Guardian & emergency contact</TableHead><TableHead>Shared health flags</TableHead><TableHead>Daily attendance</TableHead></TableRow></TableHeader><TableBody>{students.map((student) => <TableRow key={student.id}><TableCell><div className="flex items-center gap-3">{student.photoUrl ? <img src={student.photoUrl} alt="" className="size-9 rounded-full object-cover" /> : <span className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-medium">{student.name.split(" ").map((name) => name[0]).slice(0, 2).join("")}</span>}<span><span className="block font-medium">{student.name}</span><span className="text-xs text-muted-foreground">{student.admissionNumber}</span></span></div></TableCell><TableCell>{student.guardians.map((guardian) => <p key={guardian.id} className="text-sm">{guardian.name} · {guardian.relationship}{guardian.emergency_contact ? " · Emergency" : ""}{guardian.phone ? ` · ${guardian.phone}` : ""}</p>)}{!student.guardians.length && "No guardian contact on file"}</TableCell><TableCell>{student.healthFlags.map((flag) => <Badge key={flag.id} className="mr-1" variant="outline">{flag.summary}</Badge>)}{!student.healthFlags.length && "—"}</TableCell><TableCell className="capitalize">{student.attendance?.status ?? "Not marked"}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card></TabsContent>
      <TabsContent value="schedule"><Card><CardHeader><CardTitle>Class timetable</CardTitle><CardDescription>Published lessons and room assignments for this class.</CardDescription></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{days.map((day, index) => { const lessons = weeklySchedule.filter((item) => item.day_of_week === index + 1); return <div key={day} className="rounded-lg border p-4"><p className="mb-3 font-medium">{day}</p>{lessons.length ? <div className="flex flex-col gap-2">{lessons.map((lesson) => <div key={lesson.id} className="rounded-md bg-muted/50 p-3"><p className="text-sm font-medium">{lesson.subject}</p><p className="text-xs text-muted-foreground">{lesson.starts_at.slice(0, 5)}–{lesson.ends_at.slice(0, 5)}{lesson.room ? ` · ${lesson.room}` : ""}</p></div>)}</div> : <p className="text-sm text-muted-foreground">No lessons published</p>}</div> })}</div></CardContent></Card></TabsContent>
      <TabsContent value="communication" className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Plus aria-hidden="true" />Add class record</CardTitle><CardDescription>Record a parent message, meeting request, announcement, duty, leave request, report comment, remark, incident or referral.</CardDescription></CardHeader><CardContent><form className="flex flex-col gap-4" onSubmit={addEntry}><label className="grid gap-2 text-sm font-medium">Record type<Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{ENTRY_OPTIONS.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></label>{["remark", "incident", "referral", "parent_message", "meeting_request", "report_comment"].includes(category) && <label className="grid gap-2 text-sm font-medium">Student<Select value={studentId} onValueChange={setStudentId}><SelectTrigger><SelectValue placeholder="Choose a student" /></SelectTrigger><SelectContent><SelectGroup>{students.map((student) => <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>)}</SelectGroup></SelectContent></Select></label>}<label className="grid gap-2 text-sm font-medium">Title<Input required maxLength={160} value={entryTitle} onChange={(event) => setEntryTitle(event.target.value)} /></label><label className="grid gap-2 text-sm font-medium">Details<Textarea required maxLength={4000} rows={4} value={entryBody} onChange={(event) => setEntryBody(event.target.value)} /></label>{["remark", "parent_message", "meeting_request", "announcement", "report_comment"].includes(category) && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={visibleToParent} onChange={(event) => setVisibleToParent(event.target.checked)} />Share with the parent portal</label>}<Button type="submit" disabled={savingEntry || !activeClassId}>{savingEntry ? "Saving…" : "Save record"}</Button></form><p className="mt-3 text-xs text-muted-foreground">Saved records are available in this teacher workspace. Parent-portal sharing is recorded for connected parent views.</p></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageSquareText aria-hidden="true" />Class activity</CardTitle><CardDescription>Recent records for {activeClass?.name}</CardDescription></CardHeader><CardContent><ActivityTable entries={classEntries} studentName={studentName} /></CardContent></Card></TabsContent>
    </Tabs>
  </section>
}

const ENTRY_OPTIONS = [
  { value: "remark", label: "Student remark" }, { value: "incident", label: "Minor incident" }, { value: "referral", label: "Counsellor / head teacher referral" },
  { value: "parent_message", label: "Parent message" }, { value: "meeting_request", label: "Parent meeting request" }, { value: "announcement", label: "Class announcement" },
  { value: "duty", label: "Duty roster" }, { value: "leave_request", label: "Leave request" }, { value: "report_comment", label: "Report card comment" },
]
function Metric({ icon: Icon, label, value, note }: { icon: typeof Users; label: string; value: string; note: string }) {
  return <Card><CardHeader className="flex-row items-start justify-between gap-3 pb-2"><div className="grid gap-1"><CardDescription>{label}</CardDescription><CardTitle className="text-2xl tabular-nums">{value}</CardTitle></div><span className="flex size-9 items-center justify-center rounded-xl bg-primary/8 text-primary"><Icon aria-hidden="true" className="size-4" /></span></CardHeader><CardContent><p className="text-xs text-muted-foreground">{note}</p></CardContent></Card>
}
function ActivityTable({ entries, studentName }: { entries: DashboardData["entries"]; studentName: (id: string | null) => string }) {
  if (!entries.length) return <p className="text-sm text-muted-foreground">No class records yet. Add a note, referral or parent update to get started.</p>
  return <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Student</TableHead><TableHead>Record</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>{entries.map((entry) => <TableRow key={entry.id}><TableCell><Badge variant="outline" className="capitalize">{entry.category.replaceAll("_", " ")}</Badge></TableCell><TableCell>{studentName(entry.student_id)}</TableCell><TableCell><span className="font-medium">{entry.title}</span><p className="max-w-md truncate text-xs text-muted-foreground">{entry.body}</p></TableCell><TableCell><Badge variant={entry.status === "resolved" ? "secondary" : "outline"}>{entry.status.replaceAll("_", " ")}{entry.visible_to_parent ? " · parent" : ""}</Badge></TableCell><TableCell className="whitespace-nowrap">{new Date(entry.created_at).toLocaleDateString()}</TableCell></TableRow>)}</TableBody></Table></div>
}
