"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, ArrowUpRight, ArrowDownRight, Award } from "lucide-react"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export function DirectorAcademicPerformance() {
  const [selectedTerm, setSelectedTerm] = useState("current")
  const [selectedYear, setSelectedYear] = useState("2023")

  // Mock data for academic performance
  const academicOverview = {
    averagePerformance: 82.4,
    performanceTrend: 3.5,
    passingRate: 93.2,
    passingRateTrend: 1.8,
    totalStudents: 4803,
    examsTaken: 28762,
    topPerformingSchool: "Excellence Academy",
    topPerformingScore: 92.7,
    mostImprovedSchool: "Unity Primary School",
    improvementRate: 7.2,
  }

  const schoolPerformanceData = [
    { name: "Excellence Academy", score: 92.7, previousScore: 91.3, students: 1045, passRate: 98.2 },
    { name: "Pioneer Secondary", score: 89.3, previousScore: 87.5, students: 912, passRate: 97.1 },
    { name: "Unity Primary", score: 84.8, previousScore: 77.6, students: 856, passRate: 95.8 },
    { name: "Heritage Int'l", score: 84.2, previousScore: 83.9, students: 723, passRate: 93.7 },
    { name: "Lakeside Int'l", score: 78.9, previousScore: 77.1, students: 589, passRate: 91.2 },
    { name: "Greenview Primary", score: 74.5, previousScore: 72.8, students: 678, passRate: 84.4 },
  ]

  const subjectPerformanceData = [
    { subject: "Mathematics", score: 78.4, previousScore: 76.2, trend: "up" },
    { subject: "English", score: 84.6, previousScore: 82.1, trend: "up" },
    { subject: "Science", score: 81.2, previousScore: 79.8, trend: "up" },
    { subject: "Social Studies", score: 83.7, previousScore: 82.9, trend: "up" },
    { subject: "ICT", score: 85.9, previousScore: 82.3, trend: "up" },
    { subject: "Physical Education", score: 89.2, previousScore: 88.7, trend: "up" },
    { subject: "Arts", score: 87.3, previousScore: 86.8, trend: "up" },
    { subject: "Foreign Languages", score: 76.8, previousScore: 78.2, trend: "down" },
  ]

  const performanceTrendData = [
    { term: "2021 Term 1", score: 76.8 },
    { term: "2021 Term 2", score: 77.5 },
    { term: "2021 Term 3", score: 78.2 },
    { term: "2022 Term 1", score: 78.9 },
    { term: "2022 Term 2", score: 79.7 },
    { term: "2022 Term 3", score: 80.3 },
    { term: "2023 Term 1", score: 81.2 },
    { term: "2023 Term 2", score: 82.4 },
  ]

  const gradeDistributionData = [
    { grade: "A", percentage: 18.5 },
    { grade: "B", percentage: 32.7 },
    { grade: "C", percentage: 28.3 },
    { grade: "D", percentage: 15.8 },
    { grade: "F", percentage: 4.7 },
  ]

  const schoolCompetencyData = [
    {
      school: "Excellence Academy",
      math: 95,
      english: 92,
      science: 94,
      social: 90,
      ict: 96,
    },
    {
      school: "Pioneer Secondary",
      math: 92,
      english: 90,
      science: 91,
      social: 89,
      ict: 94,
    },
    {
      school: "Unity Primary",
      math: 87,
      english: 88,
      science: 85,
      social: 86,
      ict: 90,
    },
    {
      school: "Heritage Int'l",
      math: 86,
      english: 89,
      science: 83,
      social: 85,
      ict: 87,
    },
    {
      school: "Lakeside Int'l",
      math: 82,
      english: 85,
      science: 80,
      social: 82,
      ict: 84,
    },
    {
      school: "Greenview Primary",
      math: 78,
      english: 76,
      science: 75,
      social: 77,
      ict: 80,
    },
  ]

  // For radar chart
  const competencyRadarData = [
    { subject: "Mathematics", A: 90, B: 85, fullMark: 100 },
    { subject: "English", A: 93, B: 88, fullMark: 100 },
    { subject: "Science", A: 92, B: 81, fullMark: 100 },
    { subject: "Social Studies", A: 89, B: 83, fullMark: 100 },
    { subject: "ICT", A: 94, B: 85, fullMark: 100 },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Network Academic Performance</CardTitle>
            <CardDescription>Consolidated academic data across all schools</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Term</SelectItem>
                <SelectItem value="previous">Previous Term</SelectItem>
                <SelectItem value="all">All Terms</SelectItem>
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

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schools">Schools Comparison</TabsTrigger>
            <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
            <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-blue-100 p-2">
                      <Award className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{academicOverview.averagePerformance}%</div>
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />+{academicOverview.performanceTrend}% from previous term
                      </div>
                    </div>
                  </div>
                  <Progress value={academicOverview.averagePerformance} className="h-2 mt-4" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Passing Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-green-100 p-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{academicOverview.passingRate}%</div>
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />+{academicOverview.passingRateTrend}% from previous term
                      </div>
                    </div>
                  </div>
                  <Progress value={academicOverview.passingRate} className="h-2 mt-4" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Performing School</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-amber-100 p-2">
                      <Award className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{academicOverview.topPerformingSchool}</div>
                      <div className="flex items-center text-xs text-amber-600">
                        Score: {academicOverview.topPerformingScore}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Performance Trend</CardTitle>
                  <CardDescription>Average score across all schools over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="term" />
                      <YAxis domain={[70, 90]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Average Score"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Subject Performance</CardTitle>
                  <CardDescription>Average scores by subject across all schools</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectPerformanceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="subject" type="category" width={120} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" name="Average Score" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Grade Distribution</CardTitle>
                  <CardDescription>Overall grade distribution across all schools</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="percentage" name="Percentage of Students" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Core Competencies</CardTitle>
                  <CardDescription>Comparison of key subject competencies</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={competencyRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Top School" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="Network Average" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schools">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">School Performance Comparison</CardTitle>
                <CardDescription>Academic performance across all schools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border mb-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>School Name</TableHead>
                        <TableHead>Average Score</TableHead>
                        <TableHead>Previous Score</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Passing Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schoolPerformanceData.map((school) => (
                        <TableRow key={school.name}>
                          <TableCell className="font-medium">{school.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={school.score} className="h-2 w-24" />
                              <span>{school.score}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{school.previousScore}%</TableCell>
                          <TableCell>
                            {school.score > school.previousScore ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center w-fit">
                                <ArrowUpRight className="h-3 w-3 mr-1" />+
                                {(school.score - school.previousScore).toFixed(1)}%
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center w-fit">
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                                {(school.score - school.previousScore).toFixed(1)}%
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{school.students}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={school.passRate} className="h-2 w-24" />
                              <span>{school.passRate}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={schoolPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" name="Current Score" fill="#3b82f6" />
                      <Bar dataKey="previousScore" name="Previous Score" fill="#94a3b8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subject Performance Analysis</CardTitle>
                <CardDescription>Academic performance across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border mb-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Average Score</TableHead>
                        <TableHead>Previous Score</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjectPerformanceData.map((subject) => (
                        <TableRow key={subject.subject}>
                          <TableCell className="font-medium">{subject.subject}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={subject.score} className="h-2 w-24" />
                              <span>{subject.score}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{subject.previousScore}%</TableCell>
                          <TableCell>
                            {subject.score > subject.previousScore ? (
                              <span className="text-green-600">
                                +{(subject.score - subject.previousScore).toFixed(1)}%
                              </span>
                            ) : (
                              <span className="text-red-600">
                                {(subject.score - subject.previousScore).toFixed(1)}%
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {subject.trend === "up" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Improving
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700">
                                Declining
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" name="Current Score" fill="#3b82f6" />
                      <Bar dataKey="previousScore" name="Previous Score" fill="#94a3b8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Trends</CardTitle>
                <CardDescription>Academic performance trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="term" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Average Score"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Performance Insights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start text-sm text-blue-700">
                      <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                      <span>
                        Overall network performance has shown a consistent upward trend of approximately{" "}
                        {academicOverview.performanceTrend}% term-over-term.
                      </span>
                    </li>
                    <li className="flex items-start text-sm text-blue-700">
                      <Award className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                      <span>
                        {academicOverview.mostImprovedSchool} has shown the most significant improvement at +
                        {academicOverview.improvementRate}% over the past year.
                      </span>
                    </li>
                    <li className="flex items-start text-sm text-blue-700">
                      <Award className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                      <span>Mathematics and ICT have shown the most consistent improvement across all schools.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
