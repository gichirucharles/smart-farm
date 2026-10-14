"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Mail, Phone } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface TeacherPerformanceModalProps {
  isOpen: boolean
  onClose: () => void
  teacher: {
    id: string
    name: string
    avatar?: string
    position: string
    department: string
    email: string
    phone: string
    joinDate: string
    performance: {
      overall: number
      teaching: number
      classManagement: number
      studentEngagement: number
      professionalDevelopment: number
      attendance: number
    }
    classes: Array<{
      id: string
      name: string
      subject: string
      students: number
      averageScore: number
    }>
    observations: Array<{
      id: string
      date: string
      observer: string
      rating: number
      strengths: string[]
      areasForImprovement: string[]
    }>
    performanceTrend: Array<{
      month: string
      score: number
    }>
  }
}

export function TeacherPerformanceModal({ isOpen, onClose, teacher }: TeacherPerformanceModalProps) {
  if (!teacher) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Prepare data for performance chart
  const performanceData = [
    { category: "Teaching", value: teacher.performance.teaching },
    { category: "Class Management", value: teacher.performance.classManagement },
    { category: "Student Engagement", value: teacher.performance.studentEngagement },
    { category: "Professional Dev", value: teacher.performance.professionalDevelopment },
    { category: "Attendance", value: teacher.performance.attendance },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Teacher Performance Review</DialogTitle>
          <DialogDescription>Performance details for {teacher.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Teacher Profile */}
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Avatar className="h-20 w-20">
              <AvatarImage src={teacher.avatar || "/placeholder.svg"} alt={teacher.name} />
              <AvatarFallback>{teacher.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-xl font-bold">{teacher.name}</h2>
                <p className="text-gray-500">
                  {teacher.position} - {teacher.department}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">{teacher.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">{teacher.phone}</span>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Joined:</span>
                <span className="text-sm">{formatDate(teacher.joinDate)}</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-center">{teacher.performance.overall}%</div>
              <div className="text-sm text-gray-500">Overall Rating</div>
              <div className="mt-2">
                <Badge
                  variant={
                    teacher.performance.overall >= 80
                      ? "default"
                      : teacher.performance.overall >= 60
                        ? "outline"
                        : "destructive"
                  }
                >
                  {teacher.performance.overall >= 80
                    ? "Excellent"
                    : teacher.performance.overall >= 60
                      ? "Good"
                      : "Needs Improvement"}
                </Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="observations">Observations</TabsTrigger>
              <TabsTrigger value="trends">Performance Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance Breakdown</CardTitle>
                    <CardDescription>Scores across different performance areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Teaching Quality</span>
                          <span className="text-sm font-bold">{teacher.performance.teaching}%</span>
                        </div>
                        <Progress value={teacher.performance.teaching} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Class Management</span>
                          <span className="text-sm font-bold">{teacher.performance.classManagement}%</span>
                        </div>
                        <Progress value={teacher.performance.classManagement} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Student Engagement</span>
                          <span className="text-sm font-bold">{teacher.performance.studentEngagement}%</span>
                        </div>
                        <Progress value={teacher.performance.studentEngagement} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Professional Development</span>
                          <span className="text-sm font-bold">{teacher.performance.professionalDevelopment}%</span>
                        </div>
                        <Progress value={teacher.performance.professionalDevelopment} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Attendance</span>
                          <span className="text-sm font-bold">{teacher.performance.attendance}%</span>
                        </div>
                        <Progress value={teacher.performance.attendance} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance Chart</CardTitle>
                    <CardDescription>Visual representation of performance areas</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Score" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Summary</CardTitle>
                      <CardDescription>Overall performance assessment</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Strengths</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li className="text-sm">Excellent teaching methodology and subject knowledge</li>
                        <li className="text-sm">Strong student engagement and classroom management</li>
                        <li className="text-sm">Consistent attendance and punctuality</li>
                        <li className="text-sm">Active participation in professional development activities</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Areas for Improvement</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li className="text-sm">Enhance use of technology in classroom teaching</li>
                        <li className="text-sm">Increase parent communication and engagement</li>
                        <li className="text-sm">Further develop differentiated instruction techniques</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Recommendations</h3>
                      <p className="text-sm">
                        Based on the performance review, we recommend continued professional development in educational
                        technology and differentiated instruction. Consider mentoring newer teachers and sharing best
                        practices in student engagement.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="classes" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Classes & Subjects</CardTitle>
                  <CardDescription>Performance across assigned classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Average Score</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacher.classes.map((cls) => (
                        <TableRow key={cls.id}>
                          <TableCell className="font-medium">{cls.name}</TableCell>
                          <TableCell>{cls.subject}</TableCell>
                          <TableCell>{cls.students}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={cls.averageScore} className="h-2 w-24" />
                              <span className="text-sm">{cls.averageScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="observations" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Classroom Observations</CardTitle>
                  <CardDescription>Feedback from classroom observations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {teacher.observations.map((observation) => (
                      <div key={observation.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium">{formatDate(observation.date)}</h3>
                            <p className="text-sm text-gray-500">Observer: {observation.observer}</p>
                          </div>
                          <Badge
                            variant={
                              observation.rating >= 4 ? "default" : observation.rating >= 3 ? "outline" : "destructive"
                            }
                          >
                            Rating: {observation.rating}/5
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Strengths</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {observation.strengths.map((strength, index) => (
                                <li key={index} className="text-sm">
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Areas for Improvement</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {observation.areasForImprovement.map((area, index) => (
                                <li key={index} className="text-sm">
                                  {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Performance Trends</CardTitle>
                  <CardDescription>Performance over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={teacher.performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" name="Performance Score" stroke="#4f46e5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Performance Analysis</CardTitle>
                  <CardDescription>Analysis of performance trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Trend Analysis</h3>
                      <p className="text-sm">
                        The teacher has shown consistent improvement over the past academic year, with notable growth in
                        classroom management and student engagement. The performance peaked in the middle of the year
                        and has maintained a high level since then.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Key Observations</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li className="text-sm">Consistent upward trend in overall performance</li>
                        <li className="text-sm">Significant improvement in student engagement metrics</li>
                        <li className="text-sm">Stable high performance in teaching quality</li>
                        <li className="text-sm">Gradual improvement in professional development activities</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Future Goals</h3>
                      <p className="text-sm">
                        Based on the performance trends, we recommend focusing on maintaining the high standards while
                        further developing skills in educational technology integration and differentiated instruction
                        to address the needs of all students.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
