"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, FileText, Filter, Search, TrendingUp } from "lucide-react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

export function AcademicPerformance() {
  const [selectedTerm, setSelectedTerm] = useState("current-term")
  const [selectedYear, setSelectedYear] = useState("2023")
  const [selectedClass, setSelectedClass] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for academic performance
  const classPerformance = [
    { class: "Grade 1", averageScore: 78, passingRate: 85, previousScore: 75, trend: "up" },
    { class: "Grade 2", averageScore: 81, passingRate: 88, previousScore: 79, trend: "up" },
    { class: "Grade 3", averageScore: 75, passingRate: 82, previousScore: 77, trend: "down" },
    { class: "Grade 4", averageScore: 83, passingRate: 90, previousScore: 80, trend: "up" },
    { class: "Grade 5", averageScore: 79, passingRate: 86, previousScore: 79, trend: "stable" },
    { class: "Grade 6", averageScore: 76, passingRate: 83, previousScore: 74, trend: "up" },
    { class: "Grade 7", averageScore: 82, passingRate: 89, previousScore: 80, trend: "up" },
    { class: "Grade 8", averageScore: 77, passingRate: 84, previousScore: 79, trend: "down" },
    { class: "Grade 9", averageScore: 80, passingRate: 87, previousScore: 78, trend: "up" },
  ]

  // Mock data for subject performance
  const subjectPerformance = [
    { subject: "English", averageScore: 81, passingRate: 88 },
    { subject: "Mathematics", averageScore: 78, passingRate: 85 },
    { subject: "Science", averageScore: 80, passingRate: 87 },
    { subject: "Social Studies", averageScore: 77, passingRate: 84 },
    { subject: "Art", averageScore: 85, passingRate: 92 },
    { subject: "Physical Education", averageScore: 88, passingRate: 95 },
  ]

  // Mock data for student performance
  const studentPerformance = [
    {
      id: "student1",
      name: "Alice Cooper",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "Grade 5",
      averageScore: 92,
      rank: 1,
      attendance: 98,
      subjects: [
        { name: "English", score: 94 },
        { name: "Mathematics", score: 90 },
        { name: "Science", score: 93 },
        { name: "Social Studies", score: 91 },
      ],
    },
    {
      id: "student2",
      name: "Bob Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "Grade 5",
      averageScore: 85,
      rank: 5,
      attendance: 92,
      subjects: [
        { name: "English", score: 87 },
        { name: "Mathematics", score: 82 },
        { name: "Science", score: 86 },
        { name: "Social Studies", score: 85 },
      ],
    },
    {
      id: "student3",
      name: "Charlie Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "Grade 5",
      averageScore: 88,
      rank: 3,
      attendance: 95,
      subjects: [
        { name: "English", score: 89 },
        { name: "Mathematics", score: 86 },
        { name: "Science", score: 90 },
        { name: "Social Studies", score: 87 },
      ],
    },
    {
      id: "student4",
      name: "Diana Ross",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "Grade 5",
      averageScore: 78,
      rank: 10,
      attendance: 85,
      subjects: [
        { name: "English", score: 80 },
        { name: "Mathematics", score: 75 },
        { name: "Science", score: 79 },
        { name: "Social Studies", score: 78 },
      ],
    },
    {
      id: "student5",
      name: "Edward Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "Grade 5",
      averageScore: 90,
      rank: 2,
      attendance: 97,
      subjects: [
        { name: "English", score: 92 },
        { name: "Mathematics", score: 88 },
        { name: "Science", score: 91 },
        { name: "Social Studies", score: 89 },
      ],
    },
  ]

  // Mock data for performance trends
  const performanceTrends = [
    { term: "Term 1 2022", score: 76 },
    { term: "Term 2 2022", score: 78 },
    { term: "Term 3 2022", score: 80 },
    { term: "Term 1 2023", score: 79 },
    { term: "Term 2 2023", score: 81 },
    { term: "Term 3 2023", score: 83 },
  ]

  // Mock data for grade distribution
  const gradeDistribution = [
    { name: "A", value: 25 },
    { name: "B", value: 35 },
    { name: "C", value: 20 },
    { name: "D", value: 15 },
    { name: "F", value: 5 },
  ]

  // Colors for pie chart
  const COLORS = ["#4f46e5", "#22c55e", "#eab308", "#f97316", "#ef4444"]

  // Filter classes based on selected class
  const filteredClasses =
    selectedClass === "all" ? classPerformance : classPerformance.filter((cls) => cls.class === selectedClass)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Overview of student and class performance</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-term">Current Term</SelectItem>
                  <SelectItem value="previous-term">Previous Term</SelectItem>
                  <SelectItem value="all-terms">All Terms</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="Grade 1">Grade 1</SelectItem>
                  <SelectItem value="Grade 2">Grade 2</SelectItem>
                  <SelectItem value="Grade 3">Grade 3</SelectItem>
                  <SelectItem value="Grade 4">Grade 4</SelectItem>
                  <SelectItem value="Grade 5">Grade 5</SelectItem>
                  <SelectItem value="Grade 6">Grade 6</SelectItem>
                  <SelectItem value="Grade 7">Grade 7</SelectItem>
                  <SelectItem value="Grade 8">Grade 8</SelectItem>
                  <SelectItem value="Grade 9">Grade 9</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {Math.round(
                        classPerformance.reduce((sum, cls) => sum + cls.averageScore, 0) / classPerformance.length,
                      )}
                      %
                    </div>
                    <Progress
                      value={Math.round(
                        classPerformance.reduce((sum, cls) => sum + cls.averageScore, 0) / classPerformance.length,
                      )}
                      className="h-2 mt-2"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Passing Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {Math.round(
                        classPerformance.reduce((sum, cls) => sum + cls.passingRate, 0) / classPerformance.length,
                      )}
                      %
                    </div>
                    <Progress
                      value={Math.round(
                        classPerformance.reduce((sum, cls) => sum + cls.passingRate, 0) / classPerformance.length,
                      )}
                      className="h-2 mt-2"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-green-100 p-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">+2.5%</div>
                        <p className="text-xs text-gray-500">Compared to previous term</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance by Class</CardTitle>
                    <CardDescription>Average scores across different classes</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={classPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="class" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="averageScore" name="Average Score" fill="#4f46e5" />
                        <Bar dataKey="passingRate" name="Passing Rate" fill="#22c55e" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance by Subject</CardTitle>
                    <CardDescription>Average scores across different subjects</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={subjectPerformance} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="subject" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="averageScore" name="Average Score" fill="#4f46e5" />
                        <Bar dataKey="passingRate" name="Passing Rate" fill="#22c55e" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance Trends</CardTitle>
                    <CardDescription>Academic performance over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="term" />
                        <YAxis domain={[70, 90]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="score" name="Average Score" stroke="#4f46e5" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Grade Distribution</CardTitle>
                    <CardDescription>Distribution of grades across all students</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={gradeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="classes" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Class Performance</CardTitle>
                      <CardDescription>
                        {selectedClass === "all" ? "Performance across all classes" : `Performance of ${selectedClass}`}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class</TableHead>
                        <TableHead>Average Score</TableHead>
                        <TableHead>Passing Rate</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClasses.map((cls) => (
                        <TableRow key={cls.class}>
                          <TableCell className="font-medium">{cls.class}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={cls.averageScore} className="h-2 w-24" />
                              <span className="text-sm">{cls.averageScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={cls.passingRate} className="h-2 w-24" />
                              <span className="text-sm">{cls.passingRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                cls.trend === "up" ? "default" : cls.trend === "stable" ? "outline" : "destructive"
                              }
                            >
                              {cls.trend === "up"
                                ? `↑ ${cls.previousScore ? (cls.averageScore - cls.previousScore).toFixed(1) : ""}%`
                                : cls.trend === "down"
                                  ? `↓ ${cls.previousScore ? (cls.previousScore - cls.averageScore).toFixed(1) : ""}%`
                                  : "→ 0%"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
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
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjectPerformance.map((subject) => (
                        <TableRow key={subject.subject}>
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
                          <TableCell className="text-right">
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

            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Student Performance</CardTitle>
                      <CardDescription>Individual student performance</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search students..." className="pl-8 w-[200px]" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Average Score</TableHead>
                        <TableHead>Rank</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentPerformance.map((student) => (
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
                          <TableCell>{student.class}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={student.averageScore} className="h-2 w-24" />
                              <span className="text-sm">{student.averageScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{student.rank}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={student.attendance} className="h-2 w-24" />
                              <span className="text-sm">{student.attendance}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
