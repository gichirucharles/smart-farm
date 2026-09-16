import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileHeader } from "@/components/layout/user-profile-header"
import { SickBayVisits } from "@/components/dashboard/nurse/sick-bay-visits"
import { StudentHealthRecords } from "@/components/dashboard/nurse/student-health-records"
import { MedicationManagement } from "@/components/dashboard/nurse/medication-management"
import { ScheduledCheckups } from "@/components/dashboard/nurse/scheduled-checkups"
import { HealthReports } from "@/components/dashboard/nurse/health-reports"

export const metadata: Metadata = {
  title: "School Nurse Dashboard | ShuleVerse",
  description: "School Nurse Dashboard for ShuleVerse School Management System",
}

export default function NurseDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <UserProfileHeader
        name="Nurse Sarah Kimani"
        role="School Nurse"
        school="Sunshine Academy"
        avatarUrl="/placeholder.svg?height=40&width=40"
      />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">School Nurse Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Health Records</TabsTrigger>
            <TabsTrigger value="medication">Medication</TabsTrigger>
            <TabsTrigger value="checkups">Checkups</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Today's Visits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">3 pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Scheduled Checkups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Medication Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">Next 2 hours</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Critical Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground text-red-500">Requires attention</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <SickBayVisits />
              <ScheduledCheckups compact />
            </div>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <StudentHealthRecords />
          </TabsContent>

          <TabsContent value="medication" className="space-y-6">
            <MedicationManagement />
          </TabsContent>

          <TabsContent value="checkups" className="space-y-6">
            <ScheduledCheckups />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <HealthReports />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
