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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Download,
  FileText,
  Mail,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react'

interface IGCSEStudent {
  id: string
  name: string
  admissionNumber: string
  grade: string
  results: {
    subject: string
    code: string
    grade: string
    percentage: number
    ucasPoints: number
  }[]
  totalUCASPoints: number
  averageGrade: string
  examSession: string
}

interface ReportTemplate {
  id: string
  name: string
  type: 'transcript' | 'certificate' | 'analysis' | 'detailed'
  description: string
}

export default function IGCSEReportGenerator() {
  const [examSession, setExamSession] = useState('May/June 2025')
  const [reportType, setReportType] = useState<'transcript' | 'certificate' | 'analysis' | 'detailed'>('transcript')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed'>('idle')

  const mockStudents: IGCSEStudent[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      admissionNumber: 'ADM001',
      grade: 'A*',
      results: [
        { subject: 'English Language', code: '0511', grade: 'A', percentage: 82, ucasPoints: 7 },
        { subject: 'Mathematics', code: '0580', grade: 'A*', percentage: 93, ucasPoints: 8 },
        { subject: 'Biology', code: '0610', grade: 'A', percentage: 85, ucasPoints: 7 },
        { subject: 'Chemistry', code: '0620', grade: 'A', percentage: 87, ucasPoints: 7 },
        { subject: 'Physics', code: '0625', grade: 'A*', percentage: 91, ucasPoints: 8 },
        { subject: 'History', code: '0680', grade: 'B', percentage: 76, ucasPoints: 6 },
        { subject: 'Geography', code: '0686', grade: 'A', percentage: 88, ucasPoints: 7 },
        { subject: 'Computer Science', code: '0984', grade: 'A*', percentage: 92, ucasPoints: 8 },
      ],
      totalUCASPoints: 58,
      averageGrade: 'A',
      examSession: 'May/June 2025',
    },
    {
      id: '2',
      name: 'Michael Chen',
      admissionNumber: 'ADM002',
      grade: 'B',
      results: [
        { subject: 'English Language', code: '0511', grade: 'B', percentage: 73, ucasPoints: 6 },
        { subject: 'Mathematics', code: '0580', grade: 'A', percentage: 81, ucasPoints: 7 },
        { subject: 'Biology', code: '0610', grade: 'B', percentage: 72, ucasPoints: 6 },
        { subject: 'Chemistry', code: '0620', grade: 'C', percentage: 68, ucasPoints: 5 },
        { subject: 'Physics', code: '0625', grade: 'B', percentage: 74, ucasPoints: 6 },
        { subject: 'History', code: '0680', grade: 'B', percentage: 75, ucasPoints: 6 },
        { subject: 'Geography', code: '0686', grade: 'B', percentage: 71, ucasPoints: 6 },
        { subject: 'Computer Science', code: '0984', grade: 'A', percentage: 79, ucasPoints: 7 },
      ],
      totalUCASPoints: 49,
      averageGrade: 'B',
      examSession: 'May/June 2025',
    },
    {
      id: '3',
      name: 'Emily Kipchoge',
      admissionNumber: 'ADM003',
      grade: 'A',
      results: [
        { subject: 'English Language', code: '0511', grade: 'A', percentage: 84, ucasPoints: 7 },
        { subject: 'Mathematics', code: '0580', grade: 'A', percentage: 86, ucasPoints: 7 },
        { subject: 'Biology', code: '0610', grade: 'A*', percentage: 90, ucasPoints: 8 },
        { subject: 'Chemistry', code: '0620', grade: 'A', percentage: 83, ucasPoints: 7 },
        { subject: 'Physics', code: '0625', grade: 'A', percentage: 81, ucasPoints: 7 },
        { subject: 'History', code: '0680', grade: 'A', percentage: 89, ucasPoints: 7 },
        { subject: 'Geography', code: '0686', grade: 'A', percentage: 85, ucasPoints: 7 },
        { subject: 'Computer Science', code: '0984', grade: 'B', percentage: 77, ucasPoints: 6 },
      ],
      totalUCASPoints: 56,
      averageGrade: 'A',
      examSession: 'May/June 2025',
    },
  ]

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'transcript',
      name: 'Official Transcript',
      type: 'transcript',
      description:
        'Complete subject results with grades, marks, UCAS points. Suitable for university applications.',
    },
    {
      id: 'certificate',
      name: 'Results Certificate',
      type: 'certificate',
      description: 'Formal certificate showing all grades. Can be printed and laminated.',
    },
    {
      id: 'analysis',
      name: 'Performance Analysis',
      type: 'analysis',
      description: 'Detailed analysis with strengths, areas for improvement, and recommendations.',
    },
    {
      id: 'detailed',
      name: 'Detailed Report',
      type: 'detailed',
      description:
        'Comprehensive report including all components, practicals, and narrative feedback.',
    },
  ]

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === mockStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(mockStudents.map((s) => s.id))
    }
  }

  const handleGenerateReports = () => {
    setGenerationStatus('generating')
    setTimeout(() => {
      setGenerationStatus('completed')
    }, 2000)
  }

  const handleExportFormat = (format: 'pdf' | 'word' | 'excel') => {
    console.log('[v0] Exporting reports in format:', format)
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          IGCSE Report Generator
        </h1>
        <p className="text-slate-600 mt-2">
          Generate transcripts, certificates, and performance reports for IGCSE students
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Select report type, students, and format. Reports are generated with official Cambridge IGCSE formatting and can be printed, emailed, or exported.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer border-2 transition-all ${
              reportType === template.type
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setReportType(template.type)}
          >
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium text-slate-900">{template.name}</h3>
              <p className="text-xs text-slate-600 mt-1">
                {template.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Select Students</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="export">Export & Send</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Exam Session & Students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Exam Session
                </label>
                <Select value={examSession} onValueChange={setExamSession}>
                  <SelectTrigger className="mt-1">
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

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-slate-700">
                    Select Students
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedStudents.length === mockStudents.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </Button>
                </div>

                <div className="space-y-2">
                  {mockStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => handleSelectStudent(student.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {student.admissionNumber}
                        </p>
                      </div>
                      <Badge
                        className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                      >
                        {student.grade}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>
                Preview of {reportType} for selected students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedStudents.length === 0 ? (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Select at least one student to preview report
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  {mockStudents
                    .filter((s) => selectedStudents.includes(s.id))
                    .map((student) => (
                      <div
                        key={student.id}
                        className="border border-slate-300 rounded-lg p-6 bg-slate-50"
                      >
                        {/* IGCSE Transcript Template */}
                        {reportType === 'transcript' && (
                          <div className="space-y-4">
                            <div className="text-center pb-4 border-b-2 border-slate-300">
                              <h2 className="text-2xl font-bold text-slate-900">
                                IGCSE Results Transcript
                              </h2>
                              <p className="text-sm text-slate-600">
                                Cambridge International Examination
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-slate-700">
                                  Student Name
                                </p>
                                <p className="text-slate-900">
                                  {student.name}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-slate-700">
                                  Admission Number
                                </p>
                                <p className="text-slate-900">
                                  {student.admissionNumber}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-slate-700">
                                  Exam Session
                                </p>
                                <p className="text-slate-900">
                                  {student.examSession}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-slate-700">
                                  Overall Grade
                                </p>
                                <p className="text-slate-900 font-bold text-lg">
                                  {student.grade}
                                </p>
                              </div>
                            </div>

                            <div className="pt-4">
                              <h3 className="font-semibold text-slate-900 mb-3">
                                Subject Results
                              </h3>
                              <table className="w-full text-sm border-collapse">
                                <thead>
                                  <tr className="bg-slate-200">
                                    <th className="text-left p-2 font-medium text-slate-900">
                                      Subject
                                    </th>
                                    <th className="text-center p-2 font-medium text-slate-900">
                                      Code
                                    </th>
                                    <th className="text-center p-2 font-medium text-slate-900">
                                      %
                                    </th>
                                    <th className="text-center p-2 font-medium text-slate-900">
                                      Grade
                                    </th>
                                    <th className="text-center p-2 font-medium text-slate-900">
                                      UCAS
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {student.results.map((result) => (
                                    <tr
                                      key={result.code}
                                      className="border-b border-slate-300"
                                    >
                                      <td className="text-left p-2 text-slate-900">
                                        {result.subject}
                                      </td>
                                      <td className="text-center p-2 text-slate-600">
                                        {result.code}
                                      </td>
                                      <td className="text-center p-2 text-slate-900">
                                        {result.percentage}%
                                      </td>
                                      <td className="text-center p-2 font-bold text-purple-600">
                                        {result.grade}
                                      </td>
                                      <td className="text-center p-2 text-slate-900">
                                        {result.ucasPoints}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="bg-white p-4 rounded border border-slate-200 text-sm">
                              <p className="font-medium text-slate-900">
                                Total UCAS Points: {student.totalUCASPoints}
                              </p>
                              <p className="text-slate-600 mt-1 text-xs">
                                These UCAS points are for informational purposes. Official
                                UCAS conversion will be determined by the university.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Certificate Template */}
                        {reportType === 'certificate' && (
                          <div className="text-center space-y-8 py-12 px-8">
                            <div>
                              <h2 className="text-4xl font-bold text-slate-900">
                                Cambridge IGCSE
                              </h2>
                              <p className="text-sm text-slate-600 mt-2">
                                CERTIFICATE OF ACHIEVEMENT
                              </p>
                            </div>

                            <div>
                              <p className="text-slate-600">This is to certify that</p>
                              <p className="text-3xl font-bold text-slate-900 mt-4 mb-4">
                                {student.name}
                              </p>
                              <p className="text-slate-600">
                                has successfully completed the Cambridge IGCSE
                                examination
                              </p>
                            </div>

                            <div className="text-lg font-semibold text-slate-900">
                              Examination Session: {student.examSession}
                            </div>

                            <div className="border-t-2 border-b-2 border-slate-300 py-6">
                              <p className="text-sm text-slate-600 mb-2">
                                Overall Performance Grade
                              </p>
                              <p className="text-5xl font-bold text-purple-600">
                                {student.grade}
                              </p>
                            </div>

                            <div className="text-xs text-slate-500 space-y-1">
                              <p>Awarded: {new Date().toLocaleDateString()}</p>
                              <p>Validity: International Recognition</p>
                            </div>
                          </div>
                        )}

                        {/* Placeholder for other report types */}
                        {(reportType === 'analysis' ||
                          reportType === 'detailed') && (
                          <div className="text-center py-8 text-slate-500">
                            <p className="text-sm">
                              {reportType === 'analysis'
                                ? 'Performance Analysis Report Preview'
                                : 'Detailed Report Preview'}
                            </p>
                            <p className="text-xs mt-2">
                              Full report content will be displayed here
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Export & Distribution</CardTitle>
              <CardDescription>
                Choose format and distribution method for reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generationStatus === 'idle' && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      onClick={() => handleExportFormat('pdf')}
                      className="flex-col h-auto py-4"
                      variant="outline"
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      Export as PDF
                    </Button>
                    <Button
                      onClick={() => handleExportFormat('word')}
                      className="flex-col h-auto py-4"
                      variant="outline"
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      Export as Word
                    </Button>
                    <Button
                      onClick={() => handleExportFormat('excel')}
                      className="flex-col h-auto py-4"
                      variant="outline"
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      Export as Excel
                    </Button>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="font-medium text-slate-900 mb-3">
                      Distribution Options
                    </h3>
                    <div className="space-y-2">
                      <Button
                        className="w-full justify-start bg-transparent"
                        variant="outline"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email to Parents
                      </Button>
                      <Button
                        className="w-full justify-start bg-transparent"
                        variant="outline"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download All Reports
                      </Button>
                      <Button
                        className="w-full justify-start bg-transparent"
                        variant="outline"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Upload to Portal
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateReports}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-10"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Generate All Reports
                  </Button>
                </>
              )}

              {generationStatus === 'generating' && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                  <AlertDescription className="text-blue-800">
                    Generating {selectedStudents.length} reports...
                  </AlertDescription>
                </Alert>
              )}

              {generationStatus === 'completed' && (
                <>
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Successfully generated {selectedStudents.length} reports!
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2 pt-4">
                    <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                      <Download className="mr-2 h-4 w-4" />
                      Download All Reports (ZIP)
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email to Parents
                    </Button>
                    <Button
                      onClick={() => setGenerationStatus('idle')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      Generate More Reports
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-50">
            <CardHeader>
              <CardTitle className="text-sm">Report Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <strong>Students:</strong> {selectedStudents.length} selected
              </p>
              <p>
                <strong>Report Type:</strong> {reportType}
              </p>
              <p>
                <strong>Exam Session:</strong> {examSession}
              </p>
              <p>
                <strong>Generated:</strong> {new Date().toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
