"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Download } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

export function SchoolPerformanceChart() {
  const [selectedYear, setSelectedYear] = useState("2023")
  const [selectedTerm, setSelectedTerm] = useState("all")
  const [chartType, setChartType] = useState("academic")

  // Mock data for academic performance by grade
  const academicData = [
    { grade: "PP1", score: 78 },
    { grade: "PP2", score: 81 },
    { grade: "PP3", score: 75 },
    { grade: "Grade 1", score: 83 },
    { grade: "Grade 2", score: 79 },
    { grade: "Grade 3", score: 76 },
    { grade: "Grade 4", score: 82 },
    { grade: "Grade 5", score: 77 },
    { grade: "Grade 6", score: 80 },
    { grade: "Grade 7", score: 75 },
    { grade: "Grade 8", score: 79 },
    { grade: "Grade 9", score: 81 },
  ]

  // Mock data for subject performance
  const subjectData = [
    { subject: "English", score: 81 },
    { subject: "Mathematics", score: 78 },
    { subject: "Science", score: 80 },
    { subject: "Social Studies", score: 77 },
    { subject: "Art", score: 85 },
    { subject: "Physical Education", score: 88 },
    { subject: "Music", score: 83 },
    { subject: "Computer Science", score: 79 },
  ]

  // Mock data for performance trends over time
  const trendData = [
    { term: "Term 1 2021", score: 76 },
    { term: "Term 2 2021", score: 78 },
    { term: "Term 3 2021", score: 80 },
    { term: "Term 1 2022", score: 79 },
    { term: "Term 2 2022", score: 81 },
    { term: "Term 3 2022", score: 83 },
    { term: "Term 1 2023", score: 82 },
    { term: "Term 2 2023", score: 84 },
    { term: "Term 3 2023", score: 85 },
  ]

  // Mock data for grade distribution
  const gradeDistributionData = [
    { name: "A", value: 25 },
    { name: "B", value: 35 },
    { name: "C", value: 20 },
    { name: "D", value: 15 },
    { name: "F", value: 5 },
  ]

  // Colors for pie chart
  const COLORS = ["#4f46e5", "#22c55e", "#eab308", "#f97316", "#ef4444"]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>School Performance Trends</CardTitle>
            <CardDescription>Visualize school performance data across different metrics</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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

            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                <SelectItem value="term1">Term 1</SelectItem>
                <SelectItem value="term2">Term 2</SelectItem>
                <SelectItem value="term3">Term 3</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="academic" value={chartType} onValueChange={setChartType}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="academic">Academic Performance</TabsTrigger>
            <TabsTrigger value="subjects">Subject Performance</TabsTrigger>
            <TabsTrigger value="trends">Performance Trends</TabsTrigger>
            <TabsTrigger value="distribution">Grade Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="academic" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={academicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="Average Score" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="subjects" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="subject" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="Average Score" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="trends" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="term" />
                <YAxis domain={[70, 90]} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="score" name="Average Score" stroke="#3b82f6" fill="#93c5fd" />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="distribution" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} students`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
