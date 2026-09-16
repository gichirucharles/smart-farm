"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, FileText, Printer, Share2 } from "lucide-react"
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

interface ExaminationReportModalProps {
  isOpen: boolean
  onClose: () => void
  examData: {
    id: string
    title: string
    term: string
    year: string
    class: string
    subject: string
    examDate: string
    totalStudents: number
    averageScore: number
    highestScore: number
    lowestScore: number
    passingRate: number
    gradeDistribution: {
      A: number
      B: number
      C: number
      D: number
      F: number
    }
    subjectPerformance: Array<{
      subject: string
      averageScore: number
      passingRate: number
    }>
    studentResults: Array<{
      id: string
      name: string
      avatar?: string
      score: number
      grade: string
      rank: number
      previousScore?: number
      trend: "up" | "down" | "stable"
    }>
    performanceTrend: Array<{
      exam: string
      averageScore: number
    }>
  }
}

export function ExaminationReportModal({ isOpen, onClose, examData }: ExaminationReportModalProps) {
  if (!examData) return null

  // Prepare data for grade distribution chart
  const gradeDistributionData = Object.entries(examData.gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
  }))

  // Calculate percentages for grade distribution
  const totalStudents = examData.totalStudents
  const gradePercentages = Object.entries(examData.gradeDistribution).map(([grade, count]) => ({
    grade,
    percentage: Math.round((count / totalStudents) * 100),
  }))

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{examData.title}</DialogTitle>
          <DialogDescription>
            {examData.class} | {examData.term} {examData.year} | Exam Date:{" "}
            {new Date(examData.examDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Student Results</TabsTrigger>
            <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
            <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{examData.averageScore}%</div>
                  <Progress value={examData.averageScore} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Passing Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{examData.passingRate}%</div>
                  <Progress value={examData.passingRate} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Score Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Lowest</p>
                      <p className="text-xl font-bold">{examData.lowestScore}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Highest</p>
                      <p className="text-xl font-bold">{examData.highestScore}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Grade Distribution</CardTitle>
                    <CardDescription>Distribution of grades across the class</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gradeDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="grade" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Number of Students" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {gradePercentages.map((item) => (
                      <div key={item.grade} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge
                              variant={
                                item.grade === "A" || item.grade === "B"
                                  ? "default"
                                  : item.grade === "C" || item.grade === "D"
                                    ? "outline"
                                    : "destructive"
                              }
                              className="mr-2"
                            >
                              {item.grade}
                            </Badge>
                            <span className="text-sm">
                              {examData.gradeDistribution[item.grade as keyof typeof examData.gradeDistribution]}{" "}
                              students
                            </span>
                          </div>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Student Results</CardTitle>
                    <CardDescription>Individual student performance</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Results
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examData.studentResults.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.rank}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                              <AvatarFallback>{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.score}%</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.grade === "A" || student.grade === "B"
                                ? "default"
                                : student.grade === "C" || student.grade === "D"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {student.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.trend === "up"
                                ? "default"
                                : student.trend === "stable"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {student.trend === "up"
                              ? `↑ ${student.previousScore ? (student.score - student.previousScore).toFixed(1) : ""}%`
                              : student.trend === "down"
                                ? `↓ ${student.previousScore ? (student.previousScore - student.score).toFixed(1) : ""}%`
                                : "→ 0%"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Details
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
                <CardDescription>Performance across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Passing Rate</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examData.subjectPerformance.map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{subject.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={subject.averageScore} className="h-2 w-24" />
                            <span className="text-sm">{subject.averageScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={subject.passingRate} className="h-2 w-24" />
                            <span className="text-sm">{subject.passingRate}%</span>
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

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance Trends</CardTitle>
                <CardDescription>Exam performance over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={examData.performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exam" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="averageScore"
                      name="Average Score"
                      stroke="#4f46e5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <div className="space-x-2">
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Report
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Report
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
