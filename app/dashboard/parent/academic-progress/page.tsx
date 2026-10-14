"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
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

const mockChildren = [
  {
    id: 1,
    name: "Alice Doe",
    class: "Grade 7A",
    subjects: [
      { name: "Mathematics", grade: "A", score: 92, trend: "up" },
      { name: "English", grade: "A-", score: 88, trend: "stable" },
      { name: "Science", grade: "B+", score: 85, trend: "up" },
      { name: "History", grade: "A", score: 90, trend: "up" },
      { name: "Geography", grade: "A-", score: 87, trend: "down" },
    ],
    overallAverage: 88.4,
    performanceHistory: [
      { month: "Sep", average: 82 },
      { month: "Oct", average: 84 },
      { month: "Nov", average: 86 },
      { month: "Dec", average: 88 },
      { month: "Jan", average: 88 },
    ],
  },
]

const gradeColors = {
  A: "bg-green-500",
  "A-": "bg-green-400",
  "B+": "bg-blue-500",
  B: "bg-blue-400",
  C: "bg-yellow-500",
}

const getGradeBadgeColor = (grade: string) => {
  if (grade.includes("A")) return "bg-green-100 text-green-800"
  if (grade.includes("B")) return "bg-blue-100 text-blue-800"
  return "bg-yellow-100 text-yellow-800"
}

export default function AcademicProgressPage() {
  const child = mockChildren[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Academic Progress</h1>
        <p className="text-muted-foreground">Track {child.name}'s academic performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
          <CardDescription>{child.class}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Average Score</span>
              <span className="text-sm font-bold">{child.overallAverage.toFixed(1)}%</span>
            </div>
            <Progress value={child.overallAverage} className="h-2" />
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={child.performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[70, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="average" stroke="#0ea5e9" strokeWidth={2} name="Average Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {child.subjects.map((subject) => (
              <div key={subject.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{subject.name}</span>
                  <Badge className={getGradeBadgeColor(subject.grade)}>{subject.grade}</Badge>
                </div>
                <div className="flex justify-between items-end gap-2">
                  <Progress value={subject.score} className="h-2 flex-1" />
                  <span className="text-sm font-semibold">{subject.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={child.subjects}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
