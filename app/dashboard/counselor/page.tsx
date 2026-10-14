import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileHeader } from "@/components/layout/user-profile-header"
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
      <UserProfileHeader
        name="Dr. Mary Njoroge"
        role="School Counselor"
        school="Sunshine Academy"
        avatarUrl="/placeholder.svg?height=40&width=40"
      />

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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Today's Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">2 completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>New Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Follow-ups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">Next 7 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Reports Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">End of week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <CounselingSession />
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
