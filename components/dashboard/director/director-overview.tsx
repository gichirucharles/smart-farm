"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Activity, ArrowUpRight, BellRing, BookOpenCheck, Building2, Check, CircleDollarSign, LoaderCircle, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SchoolMetric = {
  id: string
  name: string
  county: string | null
  enrolment: number
  feesCollected: number
  attendanceRate: number | null
  meanScore: number | null
}
type DashboardData = {
  schools: SchoolMetric[]
  approvals: Array<{ id: string; school_id: string; request_type: string; subject: string; amount: number | null; status: string; requested_at: string }>
  summary: { pendingApprovals: number; escalations: number }
  audit: Array<{ school_id: string | null; action: string }>
}

async function fetcher(url: string): Promise<DashboardData> {
  const response = await fetch(url, { cache: "no-store" })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || "Unable to load school overview")
  return result
}

const formatMoney = (amount: number) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount)
const formatType = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
const EMPTY_SCHOOLS: SchoolMetric[] = []

export function DirectorOverview() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>("/api/governance", fetcher, { revalidateOnFocus: true })
  const [selectedSchoolId, setSelectedSchoolId] = useState("all")
  const [busyId, setBusyId] = useState<string | null>(null)

  const schools = data?.schools ?? EMPTY_SCHOOLS
  const displayedSchools = useMemo(
    () => selectedSchoolId === "all" ? schools : schools.filter((school) => school.id === selectedSchoolId),
    [schools, selectedSchoolId],
  )
  const totals = useMemo(() => displayedSchools.reduce((result, school) => ({
    enrolment: result.enrolment + school.enrolment,
    feesCollected: result.feesCollected + school.feesCollected,
  }), { enrolment: 0, feesCollected: 0 }), [displayedSchools])
  const selectedSchoolIds = new Set(displayedSchools.map((school) => school.id))
  const matchingApprovals = (data?.approvals ?? []).filter((approval) => approval.status === "pending" && selectedSchoolIds.has(approval.school_id))
  const pendingApprovals = matchingApprovals.slice(0, 4)
  const escalationCount = (data?.audit ?? []).filter((item) => item.action === "escalated" && item.school_id && selectedSchoolIds.has(item.school_id)).length
  const schoolNames = new Map(schools.map((school) => [school.id, school.name]))

  async function reviewApproval(id: string, status: "approved" | "rejected") {
    setBusyId(id)
    try {
      const response = await fetch("/api/governance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "review", id, status, note: "" }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to review request")
      await mutate()
      toast({ title: status === "approved" ? "Request approved" : "Request declined" })
    } catch (reason) {
      toast({ title: "Unable to review request", description: reason instanceof Error ? reason.message : "Please try again.", variant: "destructive" })
    } finally {
      setBusyId(null)
    }
  }

  if (isLoading) return <div className="flex min-h-56 items-center justify-center text-sm text-muted-foreground"><LoaderCircle className="mr-2 size-4 animate-spin" />Loading live school data…</div>
  if (error) return <Card><CardContent className="flex flex-col items-start gap-3 p-6"><p role="alert" className="text-sm text-destructive">{error.message}</p><Button variant="outline" onClick={() => mutate()}>Try again</Button></CardContent></Card>
  if (!data) return null

  return <section className="flex flex-col gap-6" aria-label="Director school overview">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-medium text-primary">Network overview</p><h2 className="text-2xl font-semibold tracking-tight">A clear view across your schools</h2><p className="mt-1 text-sm text-muted-foreground">Live aggregates from enrolment, recorded payments, attendance and assessments.</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="director-school-filter">Filter by school</label>
        <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
          <SelectTrigger id="director-school-filter" className="w-[220px]" aria-label="Filter dashboard by school"><SelectValue placeholder="All schools" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All assigned schools</SelectItem>{schools.map((school) => <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>)}</SelectContent>
        </Select>
        <Button asChild variant="outline"><Link href="/dashboard/director/reports">Reports<ArrowUpRight data-icon="inline-end" /></Link></Button>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={<Building2 />} label="Schools in view" value={displayedSchools.length.toLocaleString()} note="Assigned to your director account" />
      <Metric icon={<Users />} label="Active enrolment" value={totals.enrolment.toLocaleString()} note="Across selected schools" />
      <Metric icon={<CircleDollarSign />} label="Fees collected" value={formatMoney(totals.feesCollected)} note="Recorded payments · all time" />
      <Metric icon={<Check />} label="Awaiting approval" value={matchingApprovals.length.toLocaleString()} note="Requests across selected schools" />
    </div>

    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
      <Card className="min-w-0">
        <CardHeader><CardTitle>Compare schools</CardTitle><CardDescription>Switch to one school above, or compare key signals across your network.</CardDescription></CardHeader>
        <CardContent><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="pb-3 font-medium">School</th><th className="pb-3 text-right font-medium">Enrolment</th><th className="pb-3 text-right font-medium">Fees collected</th><th className="pb-3 text-right font-medium">Attendance · 30d</th><th className="pb-3 text-right font-medium">Mean score</th></tr></thead><tbody>{displayedSchools.map((school) => <tr className="border-b last:border-0" key={school.id}><th scope="row" className="py-3 pr-4 text-left font-medium"><span>{school.name}</span>{school.county && <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{school.county}</span>}</th><td className="py-3 text-right tabular-nums">{school.enrolment.toLocaleString()}</td><td className="py-3 text-right tabular-nums">{formatMoney(school.feesCollected)}</td><td className="py-3 text-right tabular-nums">{school.attendanceRate == null ? "—" : `${school.attendanceRate}%`}</td><td className="py-3 text-right tabular-nums">{school.meanScore == null ? "—" : `${school.meanScore}%`}</td></tr>)}</tbody></table>
          {!displayedSchools.length && <p className="py-8 text-center text-sm text-muted-foreground">No schools are assigned to this director account yet.</p>}
        </div><p className="mt-3 text-xs text-muted-foreground">Attendance covers the last 30 days. Mean score uses valid recorded assessment results. A dash means no records are available.</p></CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card><CardHeader className="flex flex-row items-start justify-between gap-3"><div><CardTitle>Approval queue</CardTitle><CardDescription>Review requests routed by school leaders.</CardDescription></div><Badge variant={matchingApprovals.length ? "secondary" : "outline"}>{matchingApprovals.length} pending</Badge></CardHeader><CardContent className="flex flex-col gap-3">
          {pendingApprovals.map((item) => <div key={item.id} className="rounded-lg border p-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-medium">{item.subject}</p><p className="mt-1 text-xs text-muted-foreground">{schoolNames.get(item.school_id) ?? "School"} · {formatType(item.request_type)}{item.amount != null ? ` · ${formatMoney(Number(item.amount))}` : ""}</p></div><Badge variant="outline">Pending</Badge></div><div className="mt-3 flex gap-2"><Button size="sm" onClick={() => reviewApproval(item.id, "approved")} disabled={busyId !== null}>{busyId === item.id ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <Check data-icon="inline-start" />}Approve</Button><Button size="sm" variant="outline" onClick={() => reviewApproval(item.id, "rejected")} disabled={busyId !== null}>Decline</Button></div></div>)}
          {!pendingApprovals.length && <p className="py-4 text-sm text-muted-foreground">No requests are awaiting review.</p>}
          {matchingApprovals.length > 4 && <p className="text-xs text-muted-foreground">See the Governance tab for the remaining {matchingApprovals.length - 4} requests.</p>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><BellRing className="size-4 text-primary" />Recent head-teacher alerts</CardTitle><CardDescription>Escalation count only. Sensitive case details stay out of the network overview.</CardDescription></CardHeader><CardContent className="flex items-center justify-between gap-4"><div><p className="text-2xl font-semibold tabular-nums">{escalationCount}</p><p className="text-xs text-muted-foreground">Recorded escalations</p></div><Button asChild variant="outline" size="sm"><Link href="#governance">Review securely<ArrowUpRight data-icon="inline-end" /></Link></Button></CardContent></Card>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-3">
      <QuickLink href="#governance" icon={<Check />} title="Approvals & access" description="Review requests and staff assignments" />
      <QuickLink href="/dashboard/director/school-management" icon={<Building2 />} title="School records" description="Open school management" />
      <QuickLink href="/dashboard/director/financial-overview" icon={<BookOpenCheck />} title="Financial operations" description="Review school finance tools" />
    </div>
    {escalationCount > 0 && <p className="sr-only"><Activity />There are escalated items requiring attention.</p>}
  </section>
}

function Metric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return <Card><CardContent className="flex items-start gap-3 p-5"><span className="rounded-md bg-muted p-2 text-primary">{icon}</span><div className="min-w-0"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 truncate text-xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div></CardContent></Card>
}

function QuickLink({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return <Card><CardContent className="flex items-center gap-3 p-4"><span className="rounded-md bg-muted p-2 text-primary">{icon}</span><div className="min-w-0"><p className="font-medium">{title}</p><p className="text-xs text-muted-foreground">{description}</p></div><Button asChild size="icon" variant="ghost" className="ml-auto shrink-0" aria-label={title}><Link href={href}><ArrowUpRight /></Link></Button></CardContent></Card>
}
