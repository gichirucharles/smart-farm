import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CounselorDashboardOverview } from "@/components/dashboard/counselor/counselor-dashboard-overview"
import { CounselingSession } from "@/components/dashboard/counselor/counseling-sessions"
import { StudentReferrals } from "@/components/dashboard/counselor/student-referrals"
import { StudentRecords } from "@/components/dashboard/counselor/student-records"
import { ScheduledReports } from "@/components/dashboard/counselor/scheduled-reports"

export const metadata: Metadata = {
  title: "School Counselor Dashboard | ShuleVerse",
  description: "School Counselor Dashboard for ShuleVerse School Management System",
}

export default function CounselorDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">School Counselor Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="records">Student Records</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CounselorDashboardOverview />
            <div className="grid gap-6 md:grid-cols-2">
              <CounselingSession compact />
              <StudentReferrals compact />
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <CounselingSession fullWidth />
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <StudentReferrals />
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <StudentRecords />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ScheduledReports />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
