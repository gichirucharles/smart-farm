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
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getIGCSEGrade, IGCSE_SUBJECTS } from '@/lib/igcse-grading-system'
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react'

interface Student {
  id: string
  name: string
  admissionNumber: string
}

interface ComponentMark {
  componentName: string
  percentage: number
  marksObtained: number
  totalMarks: number
}

interface StudentAssessment {
  studentId: string
  studentName: string
  admissionNumber: string
  marks: ComponentMark[]
  compositeMarks?: number
  compositePercentage?: number
  grade?: string
  submitted: boolean
}

export default function IGCSEMarkEntry() {
  const [examSession, setExamSession] = useState('May/June 2025')
  const [selectedSubject, setSelectedSubject] = useState('0580') // Mathematics
  const [entryMethod, setEntryMethod] = useState<'individual' | 'bulk'>(
    'individual'
  )
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [markProgress, setMarkProgress] = useState(35)

  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      admissionNumber: 'ADM001',
    },
    { id: '2', name: 'Michael Chen', admissionNumber: 'ADM002' },
    {
      id: '3',
      name: 'Emily Kipchoge',
      admissionNumber: 'ADM003',
    },
    {
      id: '4',
      name: 'David Omondi',
      admissionNumber: 'ADM004',
    },
  ]

  const mockAssessments: StudentAssessment[] = [
    {
      studentId: '1',
      studentName: 'Sarah Johnson',
      admissionNumber: 'ADM001',
      marks: [
        { componentName: 'Paper 1 (Non-Calculator)', percentage: 50, marksObtained: 45, totalMarks: 100 },
        { componentName: 'Paper 2 (Calculator)', percentage: 50, marksObtained: 48, totalMarks: 100 },
      ],
      compositeMarks: 93,
      compositePercentage: 93,
      grade: 'A*',
      submitted: true,
    },
    {
      studentId: '2',
      studentName: 'Michael Chen',
      admissionNumber: 'ADM002',
      marks: [
        { componentName: 'Paper 1 (Non-Calculator)', percentage: 50, marksObtained: 38, totalMarks: 100 },
        { componentName: 'Paper 2 (Calculator)', percentage: 50, marksObtained: 0, totalMarks: 100 },
      ],
      submitted: false,
    },
  ]

  const currentSubject = IGCSE_SUBJECTS.find((s) => s.code === selectedSubject)
  const currentStudent = mockAssessments.find((s) => s.studentId === selectedStudent)

  const handleMarkSubmit = () => {
    console.log('[v0] IGCSE marks submitted for:', {
      examSession,
      subject: currentSubject?.name,
      student: currentStudent?.studentName,
    })
    setMarkProgress(100)
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">IGCSE Mark Entry</h1>
        <p className="text-slate-600 mt-2">
          Cambridge International IGCSE Assessment Management
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Enter marks for IGCSE components. Cambridge automatic grading will be applied upon submission. All marks must be verified before final submission.
        </AlertDescription>
      </Alert>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Assessment Configuration</CardTitle>
          <CardDescription>
            Select exam session, subject, and entry method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Exam Session
              </label>
              <Select value={examSession} onValueChange={setExamSession}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="May/June 2025">May/June 2025</SelectItem>
                  <SelectItem value="October/November 2024">
                    October/November 2024
                  </SelectItem>
                  <SelectItem value="March 2025">March 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Subject
              </label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IGCSE_SUBJECTS.map((subject) => (
                    <SelectItem key={subject.code} value={subject.code}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Entry Method
              </label>
              <Select
                value={entryMethod}
                onValueChange={(v) => setEntryMethod(v as 'individual' | 'bulk')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual Entry</SelectItem>
                  <SelectItem value="bulk">Bulk Upload (CSV)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentSubject && (
            <Alert className="border-slate-200 bg-slate-50">
              <AlertDescription className="text-sm text-slate-700">
                <strong>{currentSubject.name}</strong> has{' '}
                <strong>{currentSubject.totalComponents}</strong> components.
                {currentSubject.hasPractical && (
                  <>
                    {' '}
                    Practical Assessment:{' '}
                    <strong>{currentSubject.practicalPercentage}%</strong>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="individual" value={entryMethod} onValueChange={(v) => setEntryMethod(v as 'individual' | 'bulk')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual Entry</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Student Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedStudent || ''} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.admissionNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedStudent && currentStudent && (
            <>
              <Card className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle>Mark Entry: {currentStudent.studentName}</CardTitle>
                  <CardDescription>
                    {currentStudent.admissionNumber} • {currentSubject?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentSubject?.componentWeighting.map(
                    (component, index) => {
                      const markData = currentStudent.marks[index]
                      return (
                        <div key={component.name} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="font-medium text-slate-700">
                              {component.name}
                            </label>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 border-blue-200 text-blue-700"
                            >
                              {component.percentage}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-slate-600">
                                Marks Obtained
                              </label>
                              <Input
                                type="number"
                                placeholder="0"
                                defaultValue={markData?.marksObtained || 0}
                                max={markData?.totalMarks || 100}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-slate-600">
                                Out of {markData?.totalMarks || 100}
                              </label>
                              <div className="mt-1 p-2 bg-slate-100 rounded text-sm font-medium">
                                {markData?.totalMarks || 100}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  )}

                  {currentSubject?.hasPractical && (
                    <div className="border-t border-slate-200 pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="font-medium text-slate-700">
                          Practical Assessment
                        </label>
                        <Badge
                          variant="outline"
                          className="bg-green-50 border-green-200 text-green-700"
                        >
                          {currentSubject.practicalPercentage}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-slate-600">
                            Practical Marks
                          </label>
                          <Input
                            type="number"
                            placeholder="0"
                            max={100}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-600">
                            Safety Rating
                          </label>
                          <Select defaultValue="good">
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="acceptable">Acceptable</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Teacher Comments & Evidence
                    </label>
                    <Textarea
                      placeholder="Enter any comments, evidence notes, or observations..."
                      className="h-24 resize-none"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">
                        Composite Score:
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        {currentStudent.compositePercentage
                          ? `${currentStudent.compositePercentage}%`
                          : '--'}
                      </span>
                    </div>
                    {currentStudent.grade && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">
                          Predicted Grade:
                        </span>
                        <Badge className="text-lg px-3 py-1 bg-purple-600 hover:bg-purple-700">
                          {currentStudent.grade}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleMarkSubmit}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Submit & Save Marks
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Bulk Mark Upload</CardTitle>
              <CardDescription>
                Upload marks for multiple students via CSV file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  Download the template CSV file, fill in student marks, and
                  upload to import all marks at once.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Download Template CSV
                </Button>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV File
                </Button>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded p-8 text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-600">
                  Drag and drop your CSV file here, or click to browse
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded text-sm space-y-2">
                <p className="font-medium text-slate-700">CSV Format:</p>
                <p className="text-slate-600">
                  admissionNumber,studentName,paper1Marks,paper2Marks,practicalMarks
                </p>
                <p className="text-slate-600">
                  ADM001,Sarah Johnson,45,48,90
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Mark Submission Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Mark Entry Progress</span>
              <span className="font-medium">{markProgress}%</span>
            </div>
            <Progress value={markProgress} className="h-2" />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Admission No.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Composite %</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAssessments.map((assessment) => (
                <TableRow key={assessment.studentId}>
                  <TableCell className="font-medium">
                    {assessment.studentName}
                  </TableCell>
                  <TableCell>{assessment.admissionNumber}</TableCell>
                  <TableCell>
                    <Badge
                      variant={assessment.submitted ? 'default' : 'secondary'}
                      className={
                        assessment.submitted
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }
                    >
                      {assessment.submitted ? 'Submitted' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {assessment.compositePercentage
                      ? `${assessment.compositePercentage}%`
                      : '--'}
                  </TableCell>
                  <TableCell>
                    {assessment.grade && (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                        {assessment.grade}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
