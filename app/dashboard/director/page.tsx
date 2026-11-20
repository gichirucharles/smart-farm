import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileHeader } from "@/components/layout/user-profile-header"
import { FinancialOverview } from "@/components/dashboard/director/financial-overview"
import { DirectorAcademicPerformance } from "@/components/dashboard/director/academic-performance"
import { StaffOverview } from "@/components/dashboard/director/staff-overview"
import { NetworkSettings } from "@/components/dashboard/director/network-settings"
import { GovernanceWorkspace } from "@/components/dashboard/director/governance-workspace"
import { DirectorOverview } from "@/components/dashboard/director/director-overview"

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
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DirectorOverview />
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

          <TabsContent id="governance" value="governance" className="space-y-6">
            <GovernanceWorkspace />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
