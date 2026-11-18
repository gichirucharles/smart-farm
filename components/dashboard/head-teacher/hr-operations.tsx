"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarClock, Check, Clock3, ClipboardCheck, GraduationCap, ShieldAlert, Users, X } from "lucide-react"

type LeaveStatus = "Pending" | "Approved" | "Declined"

const initialLeaveRequests = [
  { id: "LV-204", name: "Grace Wanjiku", type: "Annual leave", dates: "Nov 23–27, 2026", days: 5, cover: "Daniel Mwangi", status: "Pending" as LeaveStatus },
  { id: "LV-203", name: "Peter Omondi", type: "Sick leave", dates: "Nov 18–19, 2026", days: 2, cover: "Sarah Njoroge", status: "Pending" as LeaveStatus },
  { id: "LV-202", name: "Amina Hassan", type: "Compassionate", dates: "Nov 12–13, 2026", days: 2, cover: "Unassigned", status: "Approved" as LeaveStatus },
]

const initialAttendance = [
  { id: "att-1", name: "Sarah Njoroge", role: "Senior Teacher", checkIn: "07:18", status: "On time" },
  { id: "att-2", name: "Peter Omondi", role: "Teacher", checkIn: "07:42", status: "Late" },
  { id: "att-3", name: "Grace Wanjiku", role: "Procurement Officer", checkIn: "—", status: "On leave" },
  { id: "att-4", name: "Daniel Mwangi", role: "ICT Support Officer", checkIn: "07:24", status: "On time" },
]

const dutyRoster = [
  { time: "07:00–08:00", duty: "Main gate arrival", staff: "Peter Omondi", location: "Main entrance" },
  { time: "10:20–10:50", duty: "Break supervision", staff: "Sarah Njoroge", location: "Upper playground" },
  { time: "12:30–13:15", duty: "Meal service", staff: "Daniel Mwangi", location: "Dining hall" },
  { time: "15:30–16:00", duty: "Dismissal gate", staff: "Grace Wanjiku", location: "Main entrance" },
]

const appraisals = [
  { name: "Sarah Njoroge", scheme: "TPAD · TSC", cycle: "Term 3, 2026", progress: 82, due: "Nov 28, 2026" },
  { name: "Peter Omondi", scheme: "TPAD · TSC", cycle: "Term 3, 2026", progress: 58, due: "Dec 02, 2026" },
  { name: "Amina Hassan", scheme: "School appraisal", cycle: "Term 3, 2026", progress: 74, due: "Dec 05, 2026" },
]

const trainingLogs = [
  { title: "CBC assessment and reporting", staff: "Sarah Njoroge", date: "Nov 10, 2026", hours: "6 hrs", status: "Completed" },
  { title: "First aid refresher", staff: "Daniel Mwangi", date: "Nov 21, 2026", hours: "4 hrs", status: "Upcoming" },
  { title: "Inclusive classroom practice", staff: "Peter Omondi", date: "Oct 30, 2026", hours: "8 hrs", status: "Completed" },
]

const disciplineCases = [
  { reference: "HR-026", category: "Attendance review", opened: "Nov 11, 2026", stage: "Meeting scheduled" },
  { reference: "HR-024", category: "Conduct review", opened: "Oct 28, 2026", stage: "Under review" },
]

function StatusBadge({ status }: { status: string }) {
  const variant = status === "Approved" || status === "On time" || status === "Completed" ? "default" : status === "Declined" || status === "Late" ? "destructive" : "secondary"
  return <Badge variant={variant}>{status}</Badge>
}

export function HROperations() {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests)
  const [attendance, setAttendance] = useState(initialAttendance)

  const updateLeave = (id: string, status: LeaveStatus) => {
    setLeaveRequests((requests) => requests.map((request) => request.id === id ? { ...request, status } : request))
  }

  const markPresent = (id: string) => {
    const now = new Date()
    const checkIn = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    setAttendance((records) => records.map((record) => record.id === id ? { ...record, checkIn, status: "On time" } : record))
  }

  return (
    <section className="flex min-w-0 flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">HR operations</h1>
        <p className="text-muted-foreground">Coordinate staff attendance, leave, daily duties, appraisals, conduct, and professional learning.</p>
        <p className="text-xs text-muted-foreground">Illustrative records for the dashboard prototype. HR actions are temporary and are not saved to the school database.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardDescription>Present today</CardDescription><Users aria-hidden="true" className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-semibold">3 / 4</p><p className="text-xs text-muted-foreground">One staff member on leave</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardDescription>Pending leave</CardDescription><CalendarClock aria-hidden="true" className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-semibold">{leaveRequests.filter((request) => request.status === "Pending").length}</p><p className="text-xs text-muted-foreground">Requests awaiting review</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardDescription>Appraisals in progress</CardDescription><ClipboardCheck aria-hidden="true" className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-semibold">{appraisals.length}</p><p className="text-xs text-muted-foreground">Including TSC TPAD cycle</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardDescription>Training hours logged</CardDescription><GraduationCap aria-hidden="true" className="size-4 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-semibold">18 hrs</p><p className="text-xs text-muted-foreground">Across completed sessions</p></CardContent></Card>
      </div>

      <Tabs defaultValue="attendance" className="flex flex-col gap-4">
        <TabsList className="h-auto w-full justify-start overflow-x-auto">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="duties">Duty roster</TabsTrigger>
          <TabsTrigger value="appraisals">Appraisals</TabsTrigger>
          <TabsTrigger value="discipline">Discipline</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card><CardHeader><CardTitle>Staff attendance & punctuality</CardTitle><CardDescription>Today&apos;s check-in record across teaching and non-teaching roles.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Staff member</TableHead><TableHead>Role</TableHead><TableHead>Check-in</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Attendance action</span></TableHead></TableRow></TableHeader><TableBody>{attendance.map((record) => <TableRow key={record.id}><TableCell className="font-medium">{record.name}</TableCell><TableCell>{record.role}</TableCell><TableCell>{record.checkIn}</TableCell><TableCell><StatusBadge status={record.status} /></TableCell><TableCell className="text-right">{record.status === "—" || record.status === "On leave" ? <span className="text-sm text-muted-foreground">Not expected</span> : <Button size="sm" variant="outline" disabled={record.checkIn !== "—"} onClick={() => markPresent(record.id)}>Mark present</Button>}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card><CardHeader><CardTitle>Leave requests & balances</CardTitle><CardDescription>Review leave requests and identify the proposed cover arrangement.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Request</TableHead><TableHead>Type & dates</TableHead><TableHead>Days</TableHead><TableHead>Cover plan</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Approval actions</span></TableHead></TableRow></TableHeader><TableBody>{leaveRequests.map((request) => <TableRow key={request.id}><TableCell><span className="font-medium">{request.name}</span><span className="block text-xs text-muted-foreground">{request.id}</span></TableCell><TableCell>{request.type}<span className="block text-xs text-muted-foreground">{request.dates}</span></TableCell><TableCell>{request.days}</TableCell><TableCell>{request.cover}</TableCell><TableCell><StatusBadge status={request.status} /></TableCell><TableCell><div className="flex justify-end gap-2">{request.status === "Pending" && <><Button size="sm" variant="outline" aria-label={`Approve ${request.name}'s leave`} onClick={() => updateLeave(request.id, "Approved")}><Check data-icon="inline-start" />Approve</Button><Button size="sm" variant="ghost" aria-label={`Decline ${request.name}'s leave`} onClick={() => updateLeave(request.id, "Declined")}><X data-icon="inline-start" />Decline</Button></>}</div></TableCell></TableRow>)}</TableBody></Table></div><p className="mt-4 text-xs text-muted-foreground">Leave balances are not shown until a verified staff leave ledger is connected.</p></CardContent></Card>
        </TabsContent>

        <TabsContent value="duties">
          <Card><CardHeader><CardTitle>Today&apos;s duty roster</CardTitle><CardDescription>Gate, meals, break supervision, and dismissal assignments.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Duty</TableHead><TableHead>Assigned staff</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{dutyRoster.map((duty) => <TableRow key={duty.duty}><TableCell className="whitespace-nowrap">{duty.time}</TableCell><TableCell className="font-medium">{duty.duty}</TableCell><TableCell>{duty.staff}</TableCell><TableCell>{duty.location}</TableCell><TableCell><Badge variant="outline"><Clock3 data-icon="inline-start" />Scheduled</Badge></TableCell></TableRow>)}</TableBody></Table></div><div className="mt-4 rounded-md border border-dashed p-4 text-sm text-muted-foreground">Roster assignment editor will be enabled when schedules can be saved to the school record.</div></CardContent></Card>
        </TabsContent>

        <TabsContent value="appraisals">
          <Card><CardHeader><CardTitle>Staff appraisals</CardTitle><CardDescription>Track the school appraisal cycle and TSC TPAD progress.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Staff member</TableHead><TableHead>Framework</TableHead><TableHead>Cycle</TableHead><TableHead>Progress</TableHead><TableHead>Due date</TableHead></TableRow></TableHeader><TableBody>{appraisals.map((item) => <TableRow key={item.name}><TableCell className="font-medium">{item.name}</TableCell><TableCell>{item.scheme}</TableCell><TableCell>{item.cycle}</TableCell><TableCell><div className="flex min-w-28 items-center gap-2"><div className="h-2 flex-1 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${item.progress}%` }} /></div><span className="text-sm">{item.progress}%</span></div></TableCell><TableCell>{item.due}</TableCell></TableRow>)}</TableBody></Table></div><div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><ClipboardCheck aria-hidden="true" className="size-4" />Store observation notes and signed appraisal documents in an access-controlled record.</div></CardContent></Card>
        </TabsContent>

        <TabsContent value="discipline">
          <Card><CardHeader><CardTitle>Disciplinary records</CardTitle><CardDescription>Restricted case tracking for authorized school leadership.</CardDescription></CardHeader><CardContent><div className="mb-4 flex items-start gap-3 rounded-md border p-3 text-sm"><ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><p>Staff identities and case details are withheld in this prototype. Do not add allegations or sensitive notes to sample records.</p></div><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Reference</TableHead><TableHead>Case category</TableHead><TableHead>Opened</TableHead><TableHead>Stage</TableHead></TableRow></TableHeader><TableBody>{disciplineCases.map((item) => <TableRow key={item.reference}><TableCell className="font-medium">{item.reference}</TableCell><TableCell>{item.category}</TableCell><TableCell>{item.opened}</TableCell><TableCell><StatusBadge status={item.stage} /></TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        <TabsContent value="training">
          <Card><CardHeader><CardTitle>Professional development</CardTitle><CardDescription>Training history and upcoming learning opportunities for school staff.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Training</TableHead><TableHead>Staff member</TableHead><TableHead>Date</TableHead><TableHead>Duration</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{trainingLogs.map((item) => <TableRow key={item.title}><TableCell className="font-medium">{item.title}</TableCell><TableCell>{item.staff}</TableCell><TableCell>{item.date}</TableCell><TableCell>{item.hours}</TableCell><TableCell><StatusBadge status={item.status} /></TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
