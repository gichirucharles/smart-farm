"use client"

import { useMemo, useState } from "react"
import {
  AlertCircle,
  BedDouble,
  BellOff,
  BookOpenCheck,
  CalendarDays,
  Check,
  CheckCheck,
  Download,
  FileBarChart2,
  Search,
  Users,
  UserRoundCheck,
  UserRoundX,
  Clock3,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AttendanceRole = "headteacher" | "teacher" | "parent"
type AttendanceStatus = "present" | "absent" | "late"
type AbsenceReason = "sick" | "permitted" | "unexplained"
type StudentRecord = {
  id: string
  name: string
  className: string
  status: AttendanceStatus
  reason?: AbsenceReason
  boarding: boolean
  rollCall: "checked-in" | "awaiting"
}

const startingStudents: StudentRecord[] = [
  { id: "ST-2401", name: "Alice Doe", className: "Grade 7 · A", status: "present", boarding: true, rollCall: "checked-in" },
  { id: "ST-2402", name: "Ethan Otieno", className: "Grade 7 · A", status: "absent", reason: "sick", boarding: false, rollCall: "awaiting" },
  { id: "ST-2403", name: "Asha Mwangi", className: "Grade 7 · A", status: "present", boarding: true, rollCall: "checked-in" },
  { id: "ST-2404", name: "Daniel Kiptoo", className: "Grade 7 · A", status: "absent", reason: "permitted", boarding: true, rollCall: "awaiting" },
  { id: "ST-2405", name: "Zuri Kamau", className: "Grade 7 · A", status: "present", boarding: false, rollCall: "awaiting" },
  { id: "ST-2406", name: "Noah Barasa", className: "Grade 7 · A", status: "late", boarding: true, rollCall: "checked-in" },
  { id: "ST-2407", name: "Lina Hassan", className: "Grade 7 · A", status: "present", boarding: false, rollCall: "awaiting" },
  { id: "ST-2408", name: "Liam Kariuki", className: "Grade 7 · A", status: "absent", reason: "unexplained", boarding: true, rollCall: "awaiting" },
  { id: "ST-2409", name: "Maya Njeri", className: "Grade 7 · B", status: "present", boarding: false, rollCall: "awaiting" },
  { id: "ST-2410", name: "Jayden Maina", className: "Grade 7 · B", status: "present", boarding: true, rollCall: "checked-in" },
  { id: "ST-2411", name: "Imani Wekesa", className: "Grade 7 · B", status: "late", boarding: false, rollCall: "awaiting" },
  { id: "ST-2412", name: "Talia Mutua", className: "Grade 7 · B", status: "absent", reason: "unexplained", boarding: true, rollCall: "awaiting" },
  { id: "ST-2413", name: "Omar Said", className: "Grade 8 · A", status: "present", boarding: true, rollCall: "checked-in" },
  { id: "ST-2414", name: "Nia Wambui", className: "Grade 8 · A", status: "present", boarding: false, rollCall: "awaiting" },
  { id: "ST-2415", name: "Theo Muriuki", className: "Grade 8 · A", status: "absent", reason: "sick", boarding: true, rollCall: "awaiting" },
  { id: "ST-2416", name: "Leila Noor", className: "Grade 8 · A", status: "present", boarding: false, rollCall: "awaiting" },
]

const yearAttendanceByStudent: Record<string, { present: number; absent: number; late: number }> = {
  "ST-2401": { present: 152, absent: 6, late: 2 },
  "ST-2402": { present: 146, absent: 10, late: 4 },
  "ST-2403": { present: 158, absent: 2, late: 0 },
  "ST-2404": { present: 150, absent: 8, late: 2 },
  "ST-2405": { present: 155, absent: 4, late: 1 },
  "ST-2406": { present: 149, absent: 7, late: 4 },
  "ST-2407": { present: 157, absent: 3, late: 0 },
  "ST-2408": { present: 135, absent: 20, late: 5 },
  "ST-2409": { present: 154, absent: 5, late: 1 },
  "ST-2410": { present: 151, absent: 7, late: 2 },
  "ST-2411": { present: 148, absent: 8, late: 4 },
  "ST-2412": { present: 141, absent: 15, late: 4 },
  "ST-2413": { present: 156, absent: 3, late: 1 },
  "ST-2414": { present: 159, absent: 1, late: 0 },
  "ST-2415": { present: 144, absent: 12, late: 4 },
  "ST-2416": { present: 153, absent: 6, late: 1 },
}

const staffRegister = [
  { name: "Grace Muthoni", role: "Class teacher · Grade 7A", checkIn: "7:32 AM", status: "On time" },
  { name: "Peter Ochieng", role: "Mathematics", checkIn: "7:48 AM", status: "Late · 18 min" },
  { name: "Faith Wanjiku", role: "English", checkIn: "—", status: "Absent" },
  { name: "Samuel Kiptoo", role: "Science", checkIn: "7:29 AM", status: "On time" },
]

const weeklyTrend = [
  { period: "Mon", rate: 94 },
  { period: "Tue", rate: 96 },
  { period: "Wed", rate: 93 },
  { period: "Thu", rate: 97 },
  { period: "Fri", rate: 95 },
]

const termTrend = [
  { period: "Sep", rate: 93 },
  { period: "Oct", rate: 95 },
  { period: "Nov", rate: 94 },
  { period: "Dec", rate: 96 },
]

const statusCopy: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
}

const reasonCopy: Record<AbsenceReason, string> = {
  sick: "Sick",
  permitted: "Permitted",
  unexplained: "Unexplained",
}

function MetricCard({
  title,
  value,
  note,
  icon: Icon,
}: {
  title: string
  value: string
  note: string
  icon: typeof Users
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3 pb-2">
        <div className="grid gap-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </CardHeader>
      <CardContent><p className="text-xs text-muted-foreground">{note}</p></CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const variant = status === "present" ? "secondary" : status === "late" ? "outline" : "destructive"
  return <Badge variant={variant} className="capitalize">{statusCopy[status]}</Badge>
}

function SampleLabel() {
  return <Badge variant="outline" className="shrink-0">Preview data</Badge>
}

export function AttendanceDashboard({ role }: { role: AttendanceRole }) {
  const [students, setStudents] = useState(startingStudents)
  const [selectedClass, setSelectedClass] = useState(role === "headteacher" ? "All classes" : "Grade 7 · A")
  const [selectedDate, setSelectedDate] = useState("2026-11-18")
  const [reportPeriod, setReportPeriod] = useState<"Weekly" | "Termly" | "Per student">("Weekly")
  const [studentSearch, setStudentSearch] = useState("")
  const [saveMessage, setSaveMessage] = useState("")

  const visibleStudents = useMemo(
    () => selectedClass === "All classes" ? students : students.filter((student) => student.className === selectedClass),
    [selectedClass, students],
  )
  const counts = useMemo(() => visibleStudents.reduce(
    (summary, student) => {
      summary[student.status] += 1
      return summary
    },
    { present: 0, absent: 0, late: 0 },
  ), [visibleStudents])
  const classRate = visibleStudents.length
    ? Math.round(((counts.present + counts.late) / visibleStudents.length) * 100)
    : 0
  const reportData = reportPeriod === "Termly" ? termTrend : weeklyTrend
  const searchedStudents = students.filter((student) =>
    `${student.name} ${student.id} ${student.className}`.toLowerCase().includes(studentSearch.toLowerCase()),
  )
  const myChild = students.find((student) => student.id === "ST-2401")!
  const isParent = role === "parent"
  const canManageSchool = role === "headteacher"

  function updateStudent(id: string, patch: Partial<StudentRecord>) {
    setStudents((current) => current.map((student) => student.id === id ? { ...student, ...patch } : student))
    setSaveMessage("")
  }

  function downloadReport() {
    const rows = reportPeriod === "Per student"
      ? [
          ["Student ID", "Student", "Class", "Days present", "Absence days", "Late days", "Attendance rate"],
          ...searchedStudents.map((student) => {
            const summary = yearAttendanceByStudent[student.id]
            const total = summary.present + summary.absent + summary.late
            return [student.id, student.name, student.className, String(summary.present), String(summary.absent), String(summary.late), `${Math.round((summary.present / total) * 100)}%`]
          }),
        ]
      : [
          ["Student ID", "Student", "Class", "Status", "Reason"],
          ...searchedStudents.map((student) => [
            student.id,
            student.name,
            student.className,
            statusCopy[student.status],
            student.reason ? reasonCopy[student.reason] : "",
          ]),
        ]
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `attendance-${reportPeriod.toLowerCase().replaceAll(" ", "-")}-${selectedDate}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (isParent) {
    return <ParentAttendance student={myChild} />
  }

  return (
    <section className="flex flex-col gap-6" aria-labelledby="attendance-title">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 id="attendance-title" className="text-3xl font-semibold tracking-tight">Attendance</h1>
            <SampleLabel />
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {canManageSchool
              ? "School-wide student, staff and boarding attendance, with clear follow-up for every absence."
              : "Take today’s class register and record a reason for each absence."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canManageSchool && (
            <label className="sr-only" htmlFor="attendance-class">Filter by class and stream</label>
          )}
          {canManageSchool && (
            <select
              id="attendance-class"
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              aria-label="Filter attendance by class and stream"
            >
              <option value="All classes">All classes</option>
              {[...new Set(students.map((student) => student.className))].map((className) => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          )}
          <label className="sr-only" htmlFor="attendance-date">Attendance date</label>
          <Input id="attendance-date" type="date" className="w-auto" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Present" value={`${counts.present} / ${visibleStudents.length}`} note={`${classRate}% attendance for ${selectedClass}`} icon={UserRoundCheck} />
        <MetricCard title="Absent" value={String(counts.absent)} note="Requires a reason and follow-up" icon={UserRoundX} />
        <MetricCard title="Late" value={String(counts.late)} note="Late arrivals recorded today" icon={Clock3} />
        {canManageSchool ? (
          <MetricCard title="Boarders checked in" value={`${students.filter((student) => student.boarding && student.rollCall === "checked-in").length} / ${students.filter((student) => student.boarding).length}`} note="Across the boarding houses" icon={BedDouble} />
        ) : (
          <MetricCard title="Students on roll" value={String(visibleStudents.length)} note={`${selectedClass} class register`} icon={Users} />
        )}
      </div>

      <Tabs defaultValue="register" className="flex flex-col gap-4">
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg border bg-background p-1">
          <TabsTrigger value="register">Student register</TabsTrigger>
          {canManageSchool && <TabsTrigger value="staff">Teacher attendance</TabsTrigger>}
          {canManageSchool && <TabsTrigger value="boarding">Boarding roll call</TabsTrigger>}
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="flex flex-col gap-4">
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Daily student register</CardTitle>
                <CardDescription>{visibleStudents.length} students · {selectedClass} · {selectedDate}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setStudents((current) => current.map((student) => student.className === selectedClass ? { ...student, status: "present", reason: undefined } : student))
                  setSaveMessage("")
                }}>
                  <CheckCheck data-icon="inline-start" /> Mark all present
                </Button>
                <Button size="sm" onClick={() => setSaveMessage("Register saved in this preview session.")}>
                  <Check data-icon="inline-start" /> Save register
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      {canManageSchool && <TableHead>Class & stream</TableHead>}
                      <TableHead>Status</TableHead>
                      <TableHead>Absence reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-muted-foreground">{student.id}</div>
                        </TableCell>
                        {canManageSchool && <TableCell>{student.className}</TableCell>}
                        <TableCell>
                          <label className="sr-only" htmlFor={`status-${student.id}`}>Attendance status for {student.name}</label>
                          <select
                            id={`status-${student.id}`}
                            value={student.status}
                            onChange={(event) => {
                              const status = event.target.value as AttendanceStatus
                              updateStudent(student.id, { status, reason: status === "absent" ? student.reason ?? "unexplained" : undefined })
                            }}
                            className="h-9 min-w-28 rounded-md border border-input bg-background px-2 text-sm"
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          {student.status === "absent" ? (
                            <label className="sr-only" htmlFor={`reason-${student.id}`}>Absence reason for {student.name}</label>
                          ) : <span className="text-sm text-muted-foreground">—</span>}
                          {student.status === "absent" && (
                            <select
                              id={`reason-${student.id}`}
                              value={student.reason ?? "unexplained"}
                              onChange={(event) => updateStudent(student.id, { reason: event.target.value as AbsenceReason })}
                              className="h-9 min-w-32 rounded-md border border-input bg-background px-2 text-sm"
                            >
                              <option value="sick">Sick</option>
                              <option value="permitted">Permitted</option>
                              <option value="unexplained">Unexplained</option>
                            </select>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {saveMessage && <p role="status" className="mt-3 text-sm text-muted-foreground">{saveMessage}</p>}
            </CardContent>
          </Card>
          <Alert>
            <BellOff />
            <AlertTitle>Parent notifications are not connected</AlertTitle>
            <AlertDescription>Absence reasons are recorded in this preview, but no parent messages are sent. Configure a notification service and persistent attendance storage to enable automatic alerts.</AlertDescription>
          </Alert>
        </TabsContent>

        {canManageSchool && (
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Teacher attendance & punctuality</CardTitle>
                <CardDescription>Today’s staff check-ins and late arrivals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Teacher</TableHead><TableHead>Assignment</TableHead><TableHead>Check-in</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                    <TableBody>{staffRegister.map((teacher) => (
                      <TableRow key={teacher.name}>
                        <TableCell className="font-medium">{teacher.name}</TableCell><TableCell>{teacher.role}</TableCell><TableCell>{teacher.checkIn}</TableCell>
                        <TableCell><Badge variant={teacher.status === "Absent" ? "destructive" : teacher.status.startsWith("Late") ? "outline" : "secondary"}>{teacher.status}</Badge></TableCell>
                      </TableRow>
                    ))}</TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canManageSchool && (
          <TabsContent value="boarding">
            <Card>
              <CardHeader>
                <CardTitle>Boarding roll call</CardTitle>
                <CardDescription>Confirm evening roll call for resident students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Class</TableHead><TableHead>Roll call</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                    <TableBody>{students.filter((student) => student.boarding).map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell><TableCell>{student.className}</TableCell>
                        <TableCell><Badge variant={student.rollCall === "checked-in" ? "secondary" : "outline"}>{student.rollCall === "checked-in" ? "Checked in" : "Awaiting"}</Badge></TableCell>
                        <TableCell><Button variant="outline" size="sm" onClick={() => updateStudent(student.id, { rollCall: student.rollCall === "checked-in" ? "awaiting" : "checked-in" })}>{student.rollCall === "checked-in" ? "Undo" : "Confirm roll call"}</Button></TableCell>
                      </TableRow>
                    ))}</TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="reports" className="flex flex-col gap-4">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,1fr)]">
            <Card>
              <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div><CardTitle>Attendance reports</CardTitle><CardDescription>Review school attendance trends and export the current register.</CardDescription></div>
                <Button variant="outline" size="sm" onClick={downloadReport}><Download data-icon="inline-start" /> Export CSV</Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {(["Weekly", "Termly", "Per student"] as const).map((period) => (
                    <Button key={period} size="sm" variant={reportPeriod === period ? "default" : "outline"} onClick={() => setReportPeriod(period)}>{period}</Button>
                  ))}
                  {reportPeriod === "Per student" && (
                    <div className="relative min-w-48 flex-1">
                      <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-9" aria-label="Search student attendance" placeholder="Search student or ID" value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} />
                    </div>
                  )}
                </div>
                {reportPeriod === "Per student" ? (
                  <div className="max-h-80 overflow-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Class</TableHead><TableHead>Present</TableHead><TableHead>Absent</TableHead><TableHead>Late</TableHead><TableHead>Rate</TableHead></TableRow></TableHeader>
                      <TableBody>{searchedStudents.map((student) => {
                        const summary = yearAttendanceByStudent[student.id]
                        const total = summary.present + summary.absent + summary.late
                        const rate = Math.round((summary.present / total) * 100)
                        return (
                          <TableRow key={student.id}>
                            <TableCell><div className="font-medium">{student.name}</div><div className="text-xs text-muted-foreground">{student.id}</div></TableCell>
                            <TableCell>{student.className}</TableCell>
                            <TableCell>{summary.present}</TableCell>
                            <TableCell>{summary.absent}</TableCell>
                            <TableCell>{summary.late}</TableCell>
                            <TableCell><div className="flex items-center gap-2"><span>{rate}%</span><Progress value={rate} aria-label={`${student.name} attendance rate ${rate}%`} className="h-1.5 w-16" /></div></TableCell>
                          </TableRow>
                        )
                      })}</TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="h-64 w-full" role="img" aria-label={`${reportPeriod} student attendance rate trend`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="period" axisLine={false} tickLine={false} tickMargin={8} />
                        <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tickFormatter={(value: number) => `${value}%`} />
                        <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                        <Bar dataKey="rate" name="Attendance rate" fill="hsl(var(--chart-1))" radius={[5, 5, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Follow-up queue</CardTitle><CardDescription>Absence reasons to review for {selectedClass}</CardDescription></CardHeader>
              <CardContent className="grid gap-3">
                {visibleStudents.filter((student) => student.status === "absent").map((student) => (
                  <div key={student.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700"><AlertCircle aria-hidden="true" className="size-4" /></span>
                    <div className="min-w-0 flex-1"><p className="text-sm font-medium">{student.name}</p><p className="text-xs text-muted-foreground">{reasonCopy[student.reason ?? "unexplained"]} absence</p></div>
                    <Badge variant={student.reason === "unexplained" ? "destructive" : "outline"}>{student.reason === "unexplained" ? "Review" : "Recorded"}</Badge>
                  </div>
                ))}
                {!visibleStudents.some((student) => student.status === "absent") && <p className="text-sm text-muted-foreground">No absences to follow up in this class.</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        <CalendarDays aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-amber-700" />
        This dashboard uses illustrative sample records. Changes remain in page memory only and are not written to the school database.
      </p>
    </section>
  )
}

function ParentAttendance({ student }: { student: StudentRecord }) {
  const attendanceRate = 95
  const daysPresent = 152
  const daysAbsent = 6
  const daysLate = 2
  const recentDays = [
    { date: "Nov 18, 2026", label: "Present", detail: "Checked in at 7:52 AM", status: "present" as const },
    { date: "Nov 17, 2026", label: "Sick leave", detail: "Absence reason recorded by the school", status: "absent" as const },
    { date: "Nov 16, 2026", label: "Present", detail: "Checked in at 7:49 AM", status: "present" as const },
    { date: "Nov 13, 2026", label: "Late arrival", detail: "Checked in at 8:14 AM", status: "late" as const },
  ]

  return (
    <section className="flex flex-col gap-6" aria-labelledby="attendance-title">
      <header className="grid gap-2">
        <div className="flex flex-wrap items-center gap-2"><h1 id="attendance-title" className="text-3xl font-semibold tracking-tight">Attendance</h1><SampleLabel /></div>
        <p className="text-sm text-muted-foreground">{student.name} · {student.className} · Term 3</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Attendance rate" value={`${attendanceRate}%`} note="Of 160 school days this year" icon={FileBarChart2} />
        <MetricCard title="Present" value={String(daysPresent)} note="Days attended" icon={UserRoundCheck} />
        <MetricCard title="Absent" value={String(daysAbsent)} note="Recorded absence days" icon={UserRoundX} />
        <MetricCard title="Late" value={String(daysLate)} note="Late arrivals this year" icon={Clock3} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,1fr)]">
        <Card>
          <CardHeader><CardTitle>Recent attendance</CardTitle><CardDescription>Daily check-ins and recorded absence reasons</CardDescription></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Details</TableHead></TableRow></TableHeader>
                <TableBody>{recentDays.map((day) => (
                  <TableRow key={day.date}><TableCell className="whitespace-nowrap">{day.date}</TableCell><TableCell>{day.status === "absent" ? <Badge variant="destructive">{day.label}</Badge> : <StatusBadge status={day.status} />}</TableCell><TableCell>{day.detail}</TableCell></TableRow>
                ))}</TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Attendance this term</CardTitle><CardDescription>Progress toward the school&apos;s 95% target</CardDescription></CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-baseline justify-between"><span className="text-sm text-muted-foreground">Current rate</span><span className="text-2xl font-semibold tabular-nums">{attendanceRate}%</span></div>
            <Progress value={attendanceRate} aria-label={`${attendanceRate}% attendance`} />
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><BookOpenCheck aria-hidden="true" className="size-4" />{daysPresent} days present out of {daysPresent + daysAbsent + daysLate} recorded</div>
          </CardContent>
        </Card>
      </div>
      <Alert>
        <BellOff />
        <AlertTitle>Automatic absence messages are unavailable</AlertTitle>
        <AlertDescription>This preview shows attendance information only. The school has not connected parent notification delivery, so no messages are being sent.</AlertDescription>
      </Alert>
      <p className="text-xs text-muted-foreground">Attendance figures shown here are illustrative preview data and are not live school records.</p>
    </section>
  )
}
