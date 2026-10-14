import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileHeader } from "@/components/layout/user-profile-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Class Teacher Dashboard | ShuleVerse",
  description: "Class Teacher Dashboard for ShuleVerse School Management System",
}

export default function ClassTeacherDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <UserProfileHeader
        name="Ms. Catherine Njoroge"
        role="Class Teacher"
        school="Sunshine Academy"
        avatarUrl="/placeholder.svg?height=40&width=40"
      />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Class Teacher Dashboard - Grade 6</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">38</div>
                  <p className="text-xs text-muted-foreground">Grade 6A</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Present Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">36</div>
                  <p className="text-xs text-muted-foreground">94.7% attendance</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Avg. Grade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">B+</div>
                  <p className="text-xs text-muted-foreground">Current term</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Assignments Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>Today&apos;s attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>John Muigai</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Present</Badge>
                        </TableCell>
                        <TableCell>08:00 AM</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sarah Omondi</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Present</Badge>
                        </TableCell>
                        <TableCell>08:05 AM</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Alex Kariuki</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-500">Late</Badge>
                        </TableCell>
                        <TableCell>08:30 AM</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Grades</CardTitle>
                <CardDescription>Current term performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Math</TableHead>
                        <TableHead>English</TableHead>
                        <TableHead>Science</TableHead>
                        <TableHead>Average</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">John Muigai</TableCell>
                        <TableCell>85</TableCell>
                        <TableCell>78</TableCell>
                        <TableCell>82</TableCell>
                        <TableCell>81.7</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sarah Omondi</TableCell>
                        <TableCell>92</TableCell>
                        <TableCell>88</TableCell>
                        <TableCell>90</TableCell>
                        <TableCell>90.0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Alex Kariuki</TableCell>
                        <TableCell>75</TableCell>
                        <TableCell>72</TableCell>
                        <TableCell>78</TableCell>
                        <TableCell>75.0</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
                <CardDescription>Manage class assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Math Chapter 5 Exercises", dueDate: "2024-02-01", submitted: 28, total: 38 },
                    { title: "English Essay", dueDate: "2024-02-03", submitted: 35, total: 38 },
                    { title: "Science Project", dueDate: "2024-02-05", submitted: 32, total: 38 },
                  ].map((assignment, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                        </div>
                        <Badge variant="secondary">
                          {assignment.submitted}/{assignment.total} submitted
                        </Badge>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
