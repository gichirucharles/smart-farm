"use client"

import { CalendarDays, ClipboardCheck, UserRound } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCounselorDashboard } from "@/components/dashboard/counselor/counselor-dashboard-overview"

interface CounselingSessionProps {
  fullWidth?: boolean
  compact?: boolean
}

export function CounselingSession({ fullWidth, compact }: CounselingSessionProps) {
  const { data, error, isLoading } = useCounselorDashboard()
  const sessions = compact ? data?.sessions.slice(0, 5) : data?.sessions

  return (
    <Card className={fullWidth ? "w-full" : undefined}>
      <CardHeader>
        <CardTitle>Recent counseling sessions</CardTitle>
        <CardDescription>Records assigned to your counselor account</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? <p role="alert" className="text-sm text-destructive">{error.message}</p> : isLoading ? <p className="py-6 text-center text-sm text-muted-foreground">Loading counseling records…</p> : sessions?.length ? (
          <div className={`space-y-3 ${compact ? "max-h-64 overflow-y-auto" : ""}`}>
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <UserRound className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{session.studentName}</p>
                    <p className="truncate text-xs text-muted-foreground">{session.sessionType || "Counseling session"}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right text-xs text-muted-foreground">
                  <p className="flex items-center justify-end gap-1"><CalendarDays className="size-3.5" aria-hidden="true" />{new Date(`${session.sessionDate}T00:00:00`).toLocaleDateString()}</p>
                  {session.followUpRequired && <p className="mt-1 flex items-center justify-end gap-1"><ClipboardCheck className="size-3.5" aria-hidden="true" />Follow-up{session.followUpDate ? ` · ${new Date(`${session.followUpDate}T00:00:00`).toLocaleDateString()}` : " required"}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No counseling session records are assigned to your account yet.</p>}
      </CardContent>
    </Card>
  )
}
