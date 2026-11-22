import { ScheduledReports } from "@/components/dashboard/counselor/scheduled-reports"

export default function CounselorReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and view counseling reports</p>
      </div>
      <ScheduledReports />
    </div>
  )
}
