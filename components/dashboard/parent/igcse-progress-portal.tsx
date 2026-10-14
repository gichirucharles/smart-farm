'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { AlertCircle, TrendingUp, Award, BookOpen } from 'lucide-react'

interface SubjectProgress {
  code: string
  name: string
  papers: number
  completedPapers: number
  latestMarks?: number
  latestPercentage?: number
  predictedGrade?: string
  status: 'pending' | 'in-progress' | 'completed'
}

interface ExamProgress {
  examSession: string
  startDate: string
  endDate: string
  totalSubjects: number
  completedSubjects: number
  overallProgress: number
}

export default function IGCSEProgressPortal() {
  const [selectedStudent, setSelectedStudent] = useState('Emily')
  const [selectedExamSession, setSelectedExamSession] = useState('May/June 2025')

  const studentSubjects: SubjectProgress[] = [
    {
      code: '0511',
      name: 'English Language',
      papers: 2,
      completedPapers: 2,
      latestMarks: 78,
      latestPercentage: 78,
      predictedGrade: 'B',
      status: 'completed',
    },
    {
      code: '0580',
      name: 'Mathematics',
      papers: 2,
      completedPapers: 1,
      latestMarks: 82,
      latestPercentage: 82,
      predictedGrade: 'A',
      status: 'in-progress',
    },
    {
      code: '0610',
      name: 'Biology',
      papers: 3,
      completedPapers: 2,
      latestPercentage: 85,
      predictedGrade: 'A*',
      status: 'in-progress',
    },
    {
      code: '0620',
      name: 'Chemistry',
      papers: 3,
      completedPapers: 1,
      latestPercentage: 72,
      predictedGrade: 'B',
      status: 'in-progress',
    },
    {
      code: '0625',
      name: 'Physics',
      papers: 3,
      completedPapers: 0,
      status: 'pending',
    },
    {
      code: '0680',
      name: 'History',
      papers: 2,
      completedPapers: 0,
      status: 'pending',
    },
    {
      code: '0686',
      name: 'Geography',
      papers: 3,
      completedPapers: 1,
      latestPercentage: 80,
      predictedGrade: 'A',
      status: 'in-progress',
    },
    {
      code: '0984',
      name: 'Computer Science',
      papers: 2,
      completedPapers: 2,
      latestPercentage: 89,
      predictedGrade: 'A',
      status: 'completed',
    },
  ]

  const examProgresses: ExamProgress[] = [
    {
      examSession: 'May/June 2025',
      startDate: 'May 5, 2025',
      endDate: 'June 20, 2025',
      totalSubjects: 8,
      completedSubjects: 2,
      overallProgress: 28,
    },
  ]

  const gradeDistributionData = [
    { name: 'A*', value: 1, fill: '#a855f7' },
    { name: 'A', value: 3, fill: '#8b5cf6' },
    { name: 'B', value: 2, fill: '#3b82f6' },
    { name: 'C', value: 1, fill: '#06b6d4' },
    { name: 'Not Yet', value: 1, fill: '#e5e7eb' },
  ]

  const performanceTrendData = [
    { month: 'Sept', english: 72, maths: 75, science: 70 },
    { month: 'Oct', english: 74, maths: 78, science: 73 },
    { month: 'Nov', english: 76, maths: 82, science: 78 },
    { month: 'Dec', english: 78, maths: 82, science: 80 },
    { month: 'Jan', english: 78, maths: 82, science: 85 },
  ]

  const subjectComparison = studentSubjects
    .filter((s) => s.latestPercentage)
    .map((s) => ({
      name: s.name.split(' ')[0],
      percentage: s.latestPercentage || 0,
      grade: s.predictedGrade || '--',
    }))

  const currentExam = examProgresses[0]
  const completedCount = studentSubjects.filter((s) => s.status === 'completed').length
  const inProgressCount = studentSubjects.filter((s) => s.status === 'in-progress').length
  const pendingCount = studentSubjects.filter((s) => s.status === 'pending').length
  const averageScore =
    Math.round(
      studentSubjects
        .filter((s) => s.latestPercentage)
        .reduce((sum, s) => sum + (s.latestPercentage || 0), 0) /
        studentSubjects.filter((s) => s.latestPercentage).length
    ) || 0

  return (
    <div className="w-full space-y-6 bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {selectedStudent}'s IGCSE Progress
        </h1>
        <p className="text-slate-600 mt-2">
          Cambridge International IGCSE Progress Tracker and Performance Analysis
        </p>
      </div>

      <Alert className="border-purple-200 bg-purple-50">
        <AlertCircle className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-800">
          This page shows your child's real-time progress across all IGCSE subjects.
          Predicted grades are based on current performance and are updated as new
          marks are submitted.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">
                {currentExam.completedSubjects}
                <span className="text-lg text-slate-500 ml-2">
                  / {currentExam.totalSubjects}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">Subjects Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{averageScore}%</div>
              <p className="text-sm text-slate-600 mt-2">Average Score</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                {completedCount + inProgressCount}
              </div>
              <p className="text-sm text-slate-600 mt-2">Active Subjects</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600">
                {currentExam.overallProgress}%
              </div>
              <p className="text-sm text-slate-600 mt-2">Overall Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="guidance">Guidance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Exam Session Progress</CardTitle>
              <CardDescription>
                {currentExam.examSession} • {currentExam.startDate} to{' '}
                {currentExam.endDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Overall Completion</span>
                  <span className="text-slate-600">
                    {currentExam.completedSubjects} of {currentExam.totalSubjects}{' '}
                    subjects
                  </span>
                </div>
                <Progress
                  value={currentExam.overallProgress}
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {completedCount}
                  </p>
                  <p className="text-sm text-slate-600">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {inProgressCount}
                  </p>
                  <p className="text-sm text-slate-600">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">
                    {pendingCount}
                  </p>
                  <p className="text-sm text-slate-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Predicted Grade Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={gradeDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gradeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Subject Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentSubjects.map((subject) => (
                  <div
                    key={subject.code}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {subject.code}
                        </p>
                      </div>
                      <Badge
                        className={
                          subject.status === 'completed'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : subject.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                        }
                      >
                        {subject.status.charAt(0).toUpperCase() +
                          subject.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Papers</p>
                        <p className="font-medium">
                          {subject.completedPapers} / {subject.papers}
                        </p>
                      </div>
                      {subject.latestPercentage && (
                        <>
                          <div>
                            <p className="text-slate-600">Latest Score</p>
                            <p className="font-medium">
                              {subject.latestPercentage}%
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600">Predicted Grade</p>
                            <Badge className="mt-1 bg-purple-100 text-purple-800 hover:bg-purple-200">
                              {subject.predictedGrade}
                            </Badge>
                          </div>
                        </>
                      )}
                    </div>

                    {subject.latestPercentage && (
                      <div className="mt-3">
                        <Progress
                          value={subject.latestPercentage}
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="english"
                    stroke="#8b5cf6"
                    name="English"
                  />
                  <Line
                    type="monotone"
                    dataKey="maths"
                    stroke="#3b82f6"
                    name="Mathematics"
                  />
                  <Line
                    type="monotone"
                    dataKey="science"
                    stroke="#10b981"
                    name="Sciences"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Subject Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidance" className="space-y-4">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                Understanding IGCSE Grades
              </CardTitle>
              <CardDescription>
                How IGCSE grades work and what they mean for your child's future
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-purple-600 bg-purple-50 rounded">
                  <p className="font-medium text-slate-900">A* (90-100%)</p>
                  <p className="text-sm text-slate-600">
                    Outstanding performance. Excellent for competitive university
                    programs.
                  </p>
                </div>
                <div className="p-3 border-l-4 border-purple-500 bg-purple-50 rounded">
                  <p className="font-medium text-slate-900">A (80-89%)</p>
                  <p className="text-sm text-slate-600">
                    Excellent performance. Opens doors to most universities.
                  </p>
                </div>
                <div className="p-3 border-l-4 border-blue-600 bg-blue-50 rounded">
                  <p className="font-medium text-slate-900">B (70-79%)</p>
                  <p className="text-sm text-slate-600">
                    Good performance. Suitable for university entry.
                  </p>
                </div>
                <div className="p-3 border-l-4 border-green-600 bg-green-50 rounded">
                  <p className="font-medium text-slate-900">C (60-69%)</p>
                  <p className="text-sm text-slate-600">
                    Satisfactory. Meets basic requirements for most programs.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="font-medium text-slate-900 mb-2">
                  Tips to Support Your Child:
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• Create a dedicated study space free from distractions</li>
                  <li>• Encourage consistent revision, especially for theory papers</li>
                  <li>• Support practical work where applicable (sciences, geography)</li>
                  <li>• Ensure adequate sleep and healthy lifestyle</li>
                  <li>• Monitor progress regularly and discuss challenges</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-900">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-amber-900">
              <p>
                Contact the school if you have concerns about any subject
              </p>
              <Button variant="outline" className="w-full border-amber-300 text-amber-900 hover:bg-amber-100 bg-transparent">
                Schedule Parent-Teacher Conference
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
