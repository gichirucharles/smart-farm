"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountAccessPanel } from "@/components/admin/account-access-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SystemAdminDashboard() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">System Administrator Dashboard</h1>
          <p className="text-gray-500">Manage all schools and users in the ShuleVerse platform</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <Tabs defaultValue="account-access" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="account-access">Account Access</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="system-logs">System Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="account-access">
          <AccountAccessPanel />
        </TabsContent>

        <TabsContent value="schools">
          <Card>
            <CardHeader>
              <CardTitle>Schools Management</CardTitle>
              <CardDescription>View and manage all schools in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <p>School management functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-logs">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>View system activities and audit logs</CardDescription>
            </CardHeader>
            <CardContent>
              <p>System logs will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure global system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>System settings will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
