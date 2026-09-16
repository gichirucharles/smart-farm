"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText } from "lucide-react"

interface ClassDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  classData: {
    id: string
    name: string
    grade: string
    stream: string
    teacherName: string
    teacherAvatar?: string
    studentCount: number
    averagePerformance: number
    subjects: Array<{
      name: string
      teacher: string
      averageScore: number
    }>
    students: Array<{
      id: string
      name: string
      avatar?: string
      attendance: number
      overallGrade: string
      performance: number
    }>
    recentAssignments: Array<{
      id: string
      title: string
      subject: string
      dueDate: string
      submissionRate: number
    }>
  }
}

export function ClassDetailsModal({ isOpen, onClose, classData }: ClassDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!classData) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {classData.grade} {classData.stream} - Class Details
          </DialogTitle>
          <DialogDescription>
            Class teacher: {classData.teacherName} | Students: {classData.studentCount}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Class Performance</CardTitle>
                  <CardDescription>Overall academic performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Average Score</span>
                        <span className="text-sm font-bold">{classData.averagePerformance}%</span>
                      </div>
                      <Progress value={classData.averagePerformance} className="h-2" />
                    </div>

                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        View Detailed Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Class Teacher</CardTitle>
                  <CardDescription>Teacher information and contact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={classData.teacherAvatar || "/placeholder.svg"} alt={classData.teacherName} />
                      <AvatarFallback>{classData.teacherName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{classData.teacherName}</p>
                      <p className="text-sm text-gray-500">Class Teacher</p>
                      <p className="text-sm text-blue-600 mt-1">Contact Teacher</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Assignments</CardTitle>
                <CardDescription>Latest assignments for this class</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Submission Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classData.recentAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>{assignment.subject}</TableCell>
                        <TableCell>{assignment.dueDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={assignment.submissionRate} className="h-2 w-24" />
                            <span className="text-sm">{assignment.submissionRate}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Student List</CardTitle>
                    <CardDescription>
                      All students in {classData.grade} {classData.stream}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classData.students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                              <AvatarFallback>{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.attendance}%</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={student.performance} className="h-2 w-24" />
                            <span className="text-sm">{student.performance}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.overallGrade === "A" || student.overallGrade === "B"
                                ? "default"
                                : student.overallGrade === "C" || student.overallGrade === "D"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {student.overallGrade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Subject Performance</CardTitle>
                <CardDescription>Performance across all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classData.subjects.map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{subject.name}</TableCell>
                        <TableCell>{subject.teacher}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={subject.averageScore} className="h-2 w-24" />
                            <span className="text-sm">{subject.averageScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
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

          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">All Assignments</CardTitle>
                    <CardDescription>
                      Assignments for {classData.grade} {classData.stream}
                    </CardDescription>
                  </div>
                  <Button size="sm">Create Assignment</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Submission Rate</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classData.recentAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>{assignment.subject}</TableCell>
                        <TableCell>{assignment.dueDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={assignment.submissionRate} className="h-2 w-24" />
                            <span className="text-sm">{assignment.submissionRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Results
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
