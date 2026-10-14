import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileHeader } from "@/components/layout/user-profile-header"
import { UserManagement } from "@/components/dashboard/system-admin/user-management"
import { SchoolManagement } from "@/components/dashboard/system-admin/school-management"
import { SystemLogs } from "@/components/dashboard/system-admin/system-logs"
import { BackupRestore } from "@/components/dashboard/system-admin/backup-restore"
import { SystemSettings } from "@/components/dashboard/system-admin/system-settings"

export const metadata: Metadata = {
  title: "System Administrator Dashboard | ShuleVerse",
  description: "System Administrator Dashboard for ShuleVerse School Management System",
}

export default function SystemAdminDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <UserProfileHeader
        name="Admin John Doe"
        role="System Administrator"
        school="ShuleVerse Systems"
        avatarUrl="/placeholder.svg?height=40&width=40"
      />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">System Administrator Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="schools">School Management</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Schools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">+3 this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12,543</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">98.7%</div>
                  <p className="text-xs text-muted-foreground">Uptime last 30 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Pending Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">2 high priority</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <SystemLogs compact />
              <SchoolManagement compact />
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="schools" className="space-y-6">
            <SchoolManagement />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <SystemLogs />
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <BackupRestore />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
