import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileHeader } from "@/components/layout/user-profile-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export const metadata: Metadata = {
  title: "Head Teacher Dashboard | ShuleVerse",
  description: "Head Teacher Dashboard for ShuleVerse School Management System",
}

const performanceData = [
  { month: "Jan", average: 72, target: 75 },
  { month: "Feb", average: 74, target: 75 },
  { month: "Mar", average: 73, target: 75 },
  { month: "Apr", average: 76, target: 75 },
]

export default function HeadTeacherDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <UserProfileHeader
        name="Mr. Robert Kipchoge"
        role="Head Teacher"
        school="Sunshine Academy"
        avatarUrl="/placeholder.svg?height=40&width=40"
      />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Head Teacher Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Grade 1-12</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">654</div>
                  <p className="text-xs text-muted-foreground">Active enrollment</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Teaching Staff</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">48</div>
                  <p className="text-xs text-muted-foreground">All departments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Avg. Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">73%</div>
                  <p className="text-xs text-muted-foreground">Current term</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Performance Trend</CardTitle>
                <CardDescription>Average scores vs target</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="average" stroke="#2563eb" name="Average Score" />
                    <Line type="monotone" dataKey="target" stroke="#10b981" name="Target" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Statistics</CardTitle>
                <CardDescription>By grade level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { grade: "Grade 1", students: 55, present: 52, absent: 3 },
                    { grade: "Grade 2", students: 58, present: 56, absent: 2 },
                    { grade: "Grade 3", students: 60, present: 57, absent: 3 },
                  ].map((item) => (
                    <div key={item.grade} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.grade}</p>
                        <p className="text-xs text-muted-foreground">{item.students} students</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-green-600">Present: {item.present}</p>
                        <p className="text-red-600">Absent: {item.absent}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
                <CardDescription>Scheduled assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exam Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Classes</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Mid-Term 1</TableCell>
                        <TableCell>2024-02-15</TableCell>
                        <TableCell>All Grades</TableCell>
                        <TableCell>Scheduled</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Unit Tests</TableCell>
                        <TableCell>2024-02-20</TableCell>
                        <TableCell>Grades 1-6</TableCell>
                        <TableCell>Scheduled</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
