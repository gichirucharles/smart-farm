"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  CreditCard,
  GraduationCap,
  HeartPulse,
  Users,
  UserX,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const trendData = [
  { period: "Jun", attendance: 91, enrolment: 612, results: 68 },
  { period: "Jul", attendance: 93, enrolment: 620, results: 70 },
  { period: "Aug", attendance: 92, enrolment: 628, results: 71 },
  { period: "Sep", attendance: 94, enrolment: 639, results: 73 },
  { period: "Oct", attendance: 93, enrolment: 647, results: 74 },
  { period: "Nov", attendance: 95, enrolment: 654, results: 76 },
]

const approvals = [
  { label: "Leave requests", count: 4 },
  { label: "Requisitions", count: 3 },
  { label: "Admissions", count: 6 },
  { label: "Transfers", count: 2 },
]

const alerts = [
  { icon: UserX, title: "Chronic absenteeism", detail: "8 students absent 3+ days this month", tone: "text-amber-700 bg-amber-500/10" },
  { icon: CreditCard, title: "Fee arrears", detail: "24 students have an overdue balance", tone: "text-rose-700 bg-rose-500/10" },
  { icon: Users, title: "Staff attendance", detail: "2 teachers absent · 1 on approved leave", tone: "text-sky-700 bg-sky-500/10" },
  { icon: CircleAlert, title: "Document expiry", detail: "3 staff licences need renewal this term", tone: "text-violet-700 bg-violet-500/10" },
]

const events = [
  { day: "18", month: "NOV", title: "End-of-term examinations", detail: "Grades 4–8 · 8:00 AM" },
  { day: "20", month: "NOV", title: "Practical assessments", detail: "Grades 3–6 · Science block" },
  { day: "24", month: "NOV", title: "Reading assessment", detail: "Grades 1–2 · Library" },
]

function Trend({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
      {value} <span className="font-normal text-muted-foreground">{label}</span>
    </span>
  )
}

function OverviewMetric({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  children,
}: {
  title: string
  value: string
  subtitle: string
  icon: typeof Users
  trend?: string
  children?: ReactNode
}) {
  return (
    <Card className="gap-4 py-5">
      <CardHeader className="flex-row items-start justify-between gap-3 px-5 pb-0">
        <div className="grid gap-1">
          <CardDescription className="text-xs font-medium uppercase tracking-wide">{title}</CardDescription>
          <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </CardHeader>
      <CardContent className="grid gap-2 px-5 pt-0">
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        {children}
        {trend ? <Trend value={trend} label="vs. last month" /> : null}
      </CardContent>
    </Card>
  )
}

export function HeadTeacherOverview() {
  const pendingTotal = approvals.reduce((total, item) => total + item.count, 0)

  return (
    <section className="flex flex-col gap-6" aria-labelledby="overview-heading">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="overview-heading" className="text-2xl font-semibold tracking-tight">School overview</h2>
            <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-800">Example data</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">A quick view of enrolment, attendance, finances, and what needs attention.</p>
        </div>
        <p className="text-sm text-muted-foreground">Tuesday, November 17, 2026 <span className="mx-1">·</span> Term 3</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <OverviewMetric title="Total enrolment" value="654" subtitle="Across 12 classes · 18 streams" icon={GraduationCap} trend="1.1%">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>Girls <strong className="font-medium text-foreground">328</strong></span>
            <span>Boys <strong className="font-medium text-foreground">326</strong></span>
          </div>
          <Progress value={50.2} aria-label="Female student proportion" className="h-1.5" />
        </OverviewMetric>
        <OverviewMetric title="Student attendance" value="94.8%" subtitle="620 of 654 students present today" icon={Check} trend="1.6%" />
        <OverviewMetric title="Teacher attendance" value="95.8%" subtitle="46 of 48 teachers present today" icon={Users} />
        <OverviewMetric title="Fee collection" value="KES 4.82M" subtitle="Collected of KES 6.10M expected" icon={CreditCard}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">KES 1.28M outstanding</span>
            <span className="font-medium text-foreground">79%</span>
          </div>
          <Progress value={79} aria-label="79 percent of expected fees collected" className="h-1.5" />
        </OverviewMetric>
        <OverviewMetric title="Staff" value="62" subtitle="48 teaching · 14 non-teaching" icon={HeartPulse} trend="2 new">
          <span className="text-xs text-muted-foreground">Across all departments</span>
        </OverviewMetric>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,1fr)]">
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>School trends</CardTitle>
              <CardDescription>Attendance, enrolment, and exam results · last 6 months</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1"><Activity aria-hidden="true" className="size-3.5" /> 6 months</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full" role="img" aria-label="Line chart showing attendance, enrolment, and exam performance trending upward over the last six months">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.16} /><stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} /></linearGradient>
                    <linearGradient id="resultsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.12} /><stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tickMargin={8} />
                  <YAxis yAxisId="percent" domain={[60, 100]} axisLine={false} tickLine={false} tickFormatter={(value: number) => `${value}%`} />
                  <YAxis yAxisId="students" orientation="right" domain={[580, 680]} hide />
                  <Tooltip formatter={(value, name) => [name === "Enrolment" ? `${value} students` : `${value}%`, name]} />
                  <Area yAxisId="percent" type="monotone" dataKey="attendance" name="Attendance" stroke="hsl(var(--chart-1))" fill="url(#attendanceFill)" strokeWidth={2.5} isAnimationActive={false} />
                  <Area yAxisId="percent" type="monotone" dataKey="results" name="Exam average" stroke="hsl(var(--chart-2))" fill="url(#resultsFill)" strokeWidth={2.5} isAnimationActive={false} />
                  <Area yAxisId="students" type="monotone" dataKey="enrolment" name="Enrolment" stroke="hsl(var(--chart-3))" fill="none" strokeWidth={2.5} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[hsl(var(--chart-1))]" />Attendance</span>
              <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[hsl(var(--chart-2))]" />Exam average</span>
              <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[hsl(var(--chart-3))]" />Enrolment</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending approvals <Badge variant="secondary" className="ml-1 align-middle">{pendingTotal}</Badge></CardTitle>
            <CardDescription>Items waiting for your review</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1">
            {approvals.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg px-2 py-3">
                <span className="flex items-center gap-3 text-sm"><span className="flex size-8 items-center justify-center rounded-lg bg-muted"><ClipboardCheck aria-hidden="true" className="size-4 text-muted-foreground" /></span>{item.label}</span>
                <Badge variant={item.count > 4 ? "destructive" : "outline"}>{item.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Needs attention</CardTitle>
            <CardDescription>Follow up on these school-wide alerts</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {alerts.map(({ icon: Icon, title, detail, tone }) => (
              <div key={title} className="flex items-start gap-3 rounded-xl border p-3">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tone}`}><Icon aria-hidden="true" className="size-4" /></span>
                <div className="min-w-0"><p className="text-sm font-medium">{title}</p><p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{detail}</p></div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div><CardTitle>Upcoming events & deadlines</CardTitle><CardDescription>Key dates for the school calendar</CardDescription></div>
            <CalendarDays aria-hidden="true" className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="grid gap-1">
            {events.map((event) => (
              <div key={event.title} className="flex items-center gap-3 rounded-lg px-2 py-2.5">
                <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg border bg-muted/40">
                  <span className="text-base font-semibold leading-none">{event.day}</span><span className="mt-1 text-[9px] font-medium tracking-wide text-muted-foreground">{event.month}</span>
                </div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{event.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{event.detail}</p></div>
                <Clock3 aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              </div>
            ))}
            <Link href="/dashboard/head-teacher/calendar" className="mt-1 flex items-center justify-center gap-1 rounded-lg py-2 text-sm font-medium text-primary hover:underline">View school calendar <ChevronRight aria-hidden="true" className="size-4" /></Link>
          </CardContent>
        </Card>
      </div>

      <p className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        <ArrowDownRight aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-amber-700" />
        These figures are illustrative. The connected school database currently has no school records, and fee, approvals, and document-expiry data are not available in its current schema.
      </p>
    </section>
  )
}
