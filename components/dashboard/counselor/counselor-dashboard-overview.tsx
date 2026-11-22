"use client"

import useSWR from "swr"
import { CalendarDays, ClipboardCheck, HeartHandshake, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type CounselorDashboardData = {
  counselorName: string
  schoolName: string
  metrics: { sessionsToday: number; followUpsNext7Days: number; totalSessions: number }
  sessions: Array<{ id: string; studentName: string; sessionDate: string; sessionType: string | null; followUpRequired: boolean; followUpDate: string | null }>
  referrals: { available: boolean; count: number }
}

export async function fetchCounselorDashboard(url: string): Promise<CounselorDashboardData> {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || "Unable to load counselor dashboard")
  return data
}

export function useCounselorDashboard() {
  return useSWR<CounselorDashboardData>("/api/counselor/dashboard", fetchCounselorDashboard, { revalidateOnFocus: false })
}

const metrics = [
  { key: "sessionsToday", label: "Sessions today", icon: CalendarDays },
  { key: "followUpsNext7Days", label: "Follow-ups next 7 days", icon: ClipboardCheck },
  { key: "totalSessions", label: "Your session records", icon: Users },
] as const

export function CounselorDashboardOverview() {
  const { data, error, isLoading } = useCounselorDashboard()

  return <div className="space-y-5">
    {data && <div><p className="text-sm text-muted-foreground">{data.schoolName}</p><h2 className="text-xl font-semibold">Welcome, {data.counselorName}</h2></div>}
    {error && <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error.message}</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ key, label, icon: Icon }) => <Card key={key}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{label}</CardTitle><Icon className="size-4 text-muted-foreground" aria-hidden="true" /></CardHeader>
        <CardContent><p className="text-3xl font-semibold">{isLoading ? "—" : data?.metrics[key] ?? "—"}</p><p className="mt-1 text-xs text-muted-foreground">From your assigned counseling records</p></CardContent>
      </Card>)}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Counselor referrals</CardTitle><HeartHandshake className="size-4 text-muted-foreground" aria-hidden="true" /></CardHeader>
        <CardContent><p className="text-3xl font-semibold">—</p><p className="mt-1 text-xs text-muted-foreground">No dedicated referral source is connected</p></CardContent>
      </Card>
    </div>
    <Card>
      <CardHeader><CardTitle>Data connection notes</CardTitle><CardDescription>What is and is not represented by the current database</CardDescription></CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>Session history and follow-up dates are read from your own counseling records. Private session notes are not returned to this dashboard.</p>
        <p>The connected database has no counselor-specific referral, appointment-time, wellbeing-survey, career-guidance, or scheduled-report table. Clinic referrals are a separate nurse workflow, so they are not shown as counselor referrals.</p>
      </CardContent>
    </Card>
  </div>
}
