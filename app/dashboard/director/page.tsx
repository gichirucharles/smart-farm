import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileHeader } from "@/components/layout/user-profile-header"
import { SchoolManagement } from "@/components/dashboard/director/school-management"
import { FinancialOverview } from "@/components/dashboard/director/financial-overview"
import { DirectorAcademicPerformance } from "@/components/dashboard/director/academic-performance"
import { StaffOverview } from "@/components/dashboard/director/staff-overview"
import { NetworkSettings } from "@/components/dashboard/director/network-settings"

export const metadata: Metadata = {
  title: "Director Dashboard | ShuleVerse",
  description: "Director Dashboard for ShuleVerse School Management System",
}

export default function DirectorDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <UserProfileHeader
        name="Dr. James Mwangi"
        role="School Director"
        school="Sunshine Academy"
        avatarUrl="/placeholder.svg?height=40&width=40"
      />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Director Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Students</CardTitle>
                  <CardDescription>Across all schools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2,543</div>
                  <p className="text-xs text-muted-foreground">+12% from last term</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Staff</CardTitle>
                  <CardDescription>Teaching and non-teaching</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">187</div>
                  <p className="text-xs text-muted-foreground">+3% from last term</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Current term</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$1.2M</div>
                  <p className="text-xs text-muted-foreground">+18% from last term</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <SchoolManagement />
              <DirectorAcademicPerformance />
            </div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <DirectorAcademicPerformance />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <FinancialOverview />
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <StaffOverview />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <NetworkSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
