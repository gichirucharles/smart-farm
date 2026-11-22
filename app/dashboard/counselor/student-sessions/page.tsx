import { CounselingSession } from "@/components/dashboard/counselor/counseling-sessions"

export default function StudentSessionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Sessions</h1>
        <p className="text-muted-foreground">Counseling records assigned to your account</p>
      </div>
      <CounselingSession fullWidth />
    </div>
  )
}
