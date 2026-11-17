'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileHeader } from "@/components/layout/user-profile-header"
import { HeadTeacherOverview } from "@/components/dashboard/head-teacher/overview"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const performanceData = [
  { month: "Jan", average: 72, target: 75 },
  { month: "Feb", average: 74, target: 75 },
  { month: "Mar", average: 73, target: 75 },
  { month: "Apr", average: 76, target: 75 },
]

export default function HeadTeacherDashboardPage() {
  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col">
      <UserProfileHeader
        name="Mr. Robert Kipchoge"
        role="Head Teacher"
        school="Sunshine Academy"
        avatarUrl="/placeholder.svg?height=40&width=40"
      />

      <main className="min-w-0 flex-1 space-y-6 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Head Teacher Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <HeadTeacherOverview />
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
