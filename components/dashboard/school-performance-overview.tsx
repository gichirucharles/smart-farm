"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, FileText } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
} from "recharts"

interface ClassPerformance {
  id: string
  name: string
  grade: string
  stream: string
  studentCount: number
  averageScore: number
  previousScore?: number
  trend: "up" | "down" | "stable"
  subjects: {
    name: string
    score: number
  }[]
}

export function SchoolPerformanceOverview() {
  const [selectedTerm, setSelectedTerm] = useState("term1")
  const [selectedYear, setSelectedYear] = useState("2023")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for all classes
  const classPerformance: ClassPerformance[] = [
    {
      id: "class1",
      name: "PP1 A",
      grade: "PP1",
      stream: "A",
      studentCount: 25,
      averageScore: 78,
      previousScore: 75,
      trend: "up",
      subjects: [
        { name: "English", score: 82 },
        { name: "Mathematics", score: 76 },
        { name: "Science", score: 79 },
        { name: "Social Studies", score: 75 },
      ],
    },
    {
      id: "class2",
      name: "PP2 B",
      grade: "PP2",
      stream: "B",
      studentCount: 28,
      averageScore: 81,
      previousScore: 79,
      trend: "up",
      subjects: [
        { name: "English", score: 84 },
        { name: "Mathematics", score: 80 },
        { name: "Science", score: 82 },
        { name: "Social Studies", score: 78 },
      ],
    },
    {
      id: "class3",
      name: "PP3 A",
      grade: "PP3",
      stream: "A",
      studentCount: 26,
      averageScore: 75,
      previousScore: 77,
      trend: "down",
      subjects: [
        { name: "English", score: 78 },
        { name: "Mathematics", score: 72 },
        { name: "Science", score: 76 },
        { name: "Social Studies", score: 74 },
      ],
    },
    {
      id: "class4",
      name: "Grade 1 A",
      grade: "Grade 1",
      stream: "A",
      studentCount: 30,
      averageScore: 83,
      previousScore: 80,
      trend: "up",
      subjects: [
        { name: "English", score: 85 },
        { name: "Mathematics", score: 82 },
        { name: "Science", score: 84 },
        { name: "Social Studies", score: 81 },
      ],
    },
    {
      id: "class5",
      name: "Grade 2 B",
      grade: "Grade 2",
      stream: "B",
      studentCount: 29,
      averageScore: 79,
      previousScore: 79,
      trend: "stable",
      subjects: [
        { name: "English", score: 81 },
        { name: "Mathematics", score: 78 },
        { name: "Science", score: 80 },
        { name: "Social Studies", score: 77 },
      ],
    },
    {
      id: "class6",
      name: "Grade 3 A",
      grade: "Grade 3",
      stream: "A",
      studentCount: 27,
      averageScore: 76,
      previousScore: 74,
      trend: "up",
      subjects: [
        { name: "English", score: 78 },
        { name: "Mathematics", score: 75 },
        { name: "Science", score: 77 },
        { name: "Social Studies", score: 74 },
      ],
    },
    {
      id: "class7",
      name: "Grade 4 B",
      grade: "Grade 4",
      stream: "B",
      studentCount: 28,
      averageScore: 82,
      previousScore: 80,
      trend: "up",
      subjects: [
        { name: "English", score: 84 },
        { name: "Mathematics", score: 81 },
        { name: "Science", score: 83 },
        { name: "Social Studies", score: 80 },
      ],
    },
    {
      id: "class8",
      name: "Grade 5 A",
      grade: "Grade 5",
      stream: "A",
      studentCount: 26,
      averageScore: 77,
      previousScore: 79,
      trend: "down",
      subjects: [
        { name: "English", score: 79 },
        { name: "Mathematics", score: 76 },
        { name: "Science", score: 78 },
        { name: "Social Studies", score: 75 },
      ],
    },
    {
      id: "class9",
      name: "Grade 6 B",
      grade: "Grade 6",
      stream: "B",
      studentCount: 29,
      averageScore: 80,
      previousScore: 78,
      trend: "up",
      subjects: [
        { name: "English", score: 82 },
        { name: "Mathematics", score: 79 },
        { name: "Science", score: 81 },
        { name: "Social Studies", score: 78 },
      ],
    },
    {
      id: "class10",
      name: "Grade 7 A",
      grade: "Grade 7",
      stream: "A",
      studentCount: 27,
      averageScore: 75,
      previousScore: 76,
      trend: "down",
      subjects: [
        { name: "English", score: 77 },
        { name: "Mathematics", score: 74 },
        { name: "Science", score: 76 },
        { name: "Social Studies", score: 73 },
      ],
    },
    {
      id: "class11",
      name: "Grade 8 B",
      grade: "Grade 8",
      stream: "B",
      studentCount: 28,
      averageScore: 79,
      previousScore: 77,
      trend: "up",
      subjects: [
        { name: "English", score: 81 },
        { name: "Mathematics", score: 78 },
        { name: "Science", score: 80 },
        { name: "Social Studies", score: 77 },
      ],
    },
    {
      id: "class12",
      name: "Grade 9 A",
      grade: "Grade 9",
      stream: "A",
      studentCount: 26,
      averageScore: 81,
      previousScore: 79,
      trend: "up",
      subjects: [
        { name: "English", score: 83 },
        { name: "Mathematics", score: 80 },
        { name: "Science", score: 82 },
        { name: "Social Studies", score: 79 },
      ],
    },
  ]

  // Filter classes based on selected grade
  const filteredClasses =
    selectedGrade === "all" ? classPerformance : classPerformance.filter((cls) => cls.grade === selectedGrade)

  // Prepare data for charts
  const gradeAverages = Array.from(new Set(classPerformance.map((cls) => cls.grade)))
    .map((grade) => {
      const classesInGrade = classPerformance.filter((cls) => cls.grade === grade)
      const averageScore = classesInGrade.reduce((sum, cls) => sum + cls.averageScore, 0) / classesInGrade.length
      return {
        grade,
        averageScore: Math.round(averageScore * 10) / 10,
      }
    })
    .sort((a, b) => {
      // Sort grades in correct order (PP1, PP2, PP3, Grade 1, Grade 2, etc.)
      if (a.grade.startsWith("PP") && b.grade.startsWith("PP")) {
        return Number.parseInt(a.grade.slice(2)) - Number.parseInt(b.grade.slice(2))
      }
      if (a.grade.startsWith("PP") && b.grade.startsWith("Grade")) {
        return -1
      }
      if (a.grade.startsWith("Grade") && b.grade.startsWith("PP")) {
        return 1
      }
      return Number.parseInt(a.grade.split(" ")[1]) - Number.parseInt(b.grade.split(" ")[1])
    })

  // Subject performance across all grades
  const subjectPerformance = [
    { subject: "English", score: 81 },
    { subject: "Mathematics", score: 78 },
    { subject: "Science", score: 80 },
    { subject: "Social Studies", score: 77 },
    { subject: "Art", score: 85 },
    { subject: "Physical Education", score: 88 },
  ]

  // Performance trend data (mock data for different terms)
  const performanceTrends = [
    { term: "Term 1", score: 76 },
    { term: "Term 2", score: 78 },
    { term: "Term 3", score: 80 },
    { term: "Term 1", score: 79 },
    { term: "Term 2", score: 81 },
    { term: "Term 3", score: 83 },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>School Performance Overview</CardTitle>
            <CardDescription>Academic performance across all grades and classes</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="term1">Term 1</SelectItem>
                <SelectItem value="term2">Term 2</SelectItem>
                <SelectItem value="term3">Term 3</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="PP1">PP1</SelectItem>
                <SelectItem value="PP2">PP2</SelectItem>
                <SelectItem value="PP3">PP3</SelectItem>
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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Grade Performance</CardTitle>
                  <CardDescription>Average performance by grade</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeAverages}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="averageScore" name="Average Score" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Subject Performance</CardTitle>
                  <CardDescription>Average performance by subject</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="subject" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" name="Average Score" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance Trends</CardTitle>
                <CardDescription>School performance over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="term" />
                    <YAxis domain={[70, 90]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" name="Average Score" stroke="#3b82f6" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Class Performance</CardTitle>
                    <CardDescription>
                      {selectedGrade === "all"
                        ? "Performance across all classes"
                        : `Performance of ${selectedGrade} classes`}
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
                      <TableHead>Students</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell className="font-medium">{cls.name}</TableCell>
                        <TableCell>{cls.studentCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={cls.averageScore} className="h-2 w-24" />
                            <span className="text-sm">{cls.averageScore}%</span>
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

          <TabsContent value="subjects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Subject Analysis</CardTitle>
                  <CardDescription>Performance breakdown by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjectPerformance.map((subject) => (
                      <div key={subject.subject} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{subject.subject}</span>
                          <span className="text-sm font-bold">{subject.score}%</span>
                        </div>
                        <Progress value={subject.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Subject Comparison</CardTitle>
                  <CardDescription>Compare performance across subjects</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" name="Average Score" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Subject Performance by Class</CardTitle>
                    <CardDescription>Detailed breakdown of subject performance</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>English</TableHead>
                      <TableHead>Mathematics</TableHead>
                      <TableHead>Science</TableHead>
                      <TableHead>Social Studies</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell className="font-medium">{cls.name}</TableCell>
                        {cls.subjects.map((subject, index) => (
                          <TableCell key={index}>
                            <div className="flex items-center space-x-2">
                              <Progress value={subject.score} className="h-2 w-16" />
                              <span className="text-sm">{subject.score}%</span>
                            </div>
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Report
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
  )
}
