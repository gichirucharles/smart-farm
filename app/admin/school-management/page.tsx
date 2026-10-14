"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SchoolRegistrationForm } from "@/components/admin/school-registration-form"
import { StudentBulkUpload } from "@/components/admin/student-bulk-upload"
import { School, Users, Settings, BarChart3 } from "lucide-react"

export default function SchoolManagementPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">School Management</h1>
          <p className="text-gray-600">Manage schools and student registrations in the ShuleVerse system</p>
        </div>
      </div>

      <Tabs defaultValue="school-registration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="school-registration" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            School Registration
          </TabsTrigger>
          <TabsTrigger value="student-management" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Student Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="school-registration">
          <SchoolRegistrationForm />
        </TabsContent>

        <TabsContent value="student-management">
          <StudentBulkUpload />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <p className="text-xs text-muted-foreground">+573 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-muted-foreground">91.7% active rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
