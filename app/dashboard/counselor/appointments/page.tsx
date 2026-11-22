import { CalendarDays, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">View and manage counselor appointments</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarDays className="size-5" aria-hidden="true" />Appointment schedule</CardTitle>
          <CardDescription>Scheduled start times and duration for counseling sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-lg border border-dashed p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">The connected counseling records store session dates but not appointment start times or duration, so there is no reliable schedule to show yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
