'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  assessmentStatus: 'pending' | 'in-progress' | 'completed';
}

interface Competency {
  id: string;
  name: string;
  description: string;
  domain: string;
}

interface PerformanceLevel {
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  descriptor: string;
  color: string;
}

const performanceLevels: PerformanceLevel[] = [
  { level: 1, descriptor: 'Below Expectation 2 (BE2)', color: 'bg-red-100 border-red-300' },
  { level: 2, descriptor: 'Below Expectation 1 (BE1)', color: 'bg-red-50 border-red-200' },
  { level: 3, descriptor: 'Approaching Expectation 2 (AE2)', color: 'bg-blue-50 border-blue-200' },
  { level: 4, descriptor: 'Approaching Expectation 1 (AE1)', color: 'bg-blue-100 border-blue-300' },
  { level: 5, descriptor: 'Meeting Expectation 2 (ME2)', color: 'bg-green-50 border-green-200' },
  { level: 6, descriptor: 'Meeting Expectation 1 (ME1)', color: 'bg-green-100 border-green-300' },
  { level: 7, descriptor: 'Exceeding Expectation 1 (EE1)', color: 'bg-orange-100 border-orange-300' },
];

export default function CBCAssessmentEntry() {
  const [selectedTerm, setSelectedTerm] = useState<'term_1' | 'term_2' | 'term_3'>('term_1');
  const [selectedLearningArea, setSelectedLearningArea] = useState<string>('english');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [assessmentProgress, setAssessmentProgress] = useState(42);

  const mockStudents: Student[] = [
    { id: '1', name: 'John Kimani', admissionNumber: 'ADM001', assessmentStatus: 'completed' },
    { id: '2', name: 'Mary Omondi', admissionNumber: 'ADM002', assessmentStatus: 'in-progress' },
    { id: '3', name: 'David Kipchoge', admissionNumber: 'ADM003', assessmentStatus: 'pending' },
    { id: '4', name: 'Sarah Njeri', admissionNumber: 'ADM004', assessmentStatus: 'pending' },
  ];

  const mockCompetencies: Competency[] = [
    {
      id: 'c1',
      name: 'Reading and Comprehension',
      description: 'Ability to read, understand and interpret written text',
      domain: 'communication_and_collaboration',
    },
    {
      id: 'c2',
      name: 'Writing and Expression',
      description: 'Ability to write coherently and express ideas effectively',
      domain: 'communication_and_collaboration',
    },
    {
      id: 'c3',
      name: 'Oral Communication',
      description: 'Ability to communicate effectively in English',
      domain: 'communication_and_collaboration',
    },
    {
      id: 'c4',
      name: 'Critical Thinking',
      description: 'Ability to analyze and think critically about text',
      domain: 'critical_thinking_and_problem_solving',
    },
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full space-y-6 p-6 bg-gradient-to-br from-[#b8d4f0] to-[#a8c8e8] min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a8a]">CBC Assessment Entry</h1>
          <p className="text-[#1e3a8a]/70 mt-2">Continuous Assessment for Competency-Based Curriculum</p>
        </div>
        <Alert className="w-64 bg-white/90 border-blue-200">
          <AlertDescription className="text-sm">
            <strong>Assessment Progress:</strong> {assessmentProgress}% of competencies assessed this term
            <Progress value={assessmentProgress} className="mt-2 h-2" />
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="by-student" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/80">
          <TabsTrigger value="by-student">By Student</TabsTrigger>
          <TabsTrigger value="by-competency">By Competency</TabsTrigger>
          <TabsTrigger value="bulk-entry">Bulk Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="by-student" className="space-y-4">
          <Card className="bg-white/90 border-white/50">
            <CardHeader>
              <CardTitle className="text-[#1e3a8a]">Assess Individual Student</CardTitle>
              <CardDescription>Select a student and their competencies to assess</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Term and Learning Area Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1e3a8a]">Term</label>
                  <select
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value as any)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="term_1">Term 1</option>
                    <option value="term_2">Term 2</option>
                    <option value="term_3">Term 3</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1e3a8a]">Learning Area</label>
                  <select
                    value={selectedLearningArea}
                    onChange={(e) => setSelectedLearningArea(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="english">English</option>
                    <option value="kiswahili">Kiswahili</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science and Technology</option>
                    <option value="social">Social Studies</option>
                  </select>
                </div>
              </div>

              {/* Student List */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1e3a8a]">Select Student</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                  {mockStudents.map((student) => (
                    <Card
                      key={student.id}
                      className={`cursor-pointer border-2 transition-all ${
                        selectedStudent === student.id
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-blue-100 hover:border-blue-200'
                      }`}
                      onClick={() => setSelectedStudent(student.id)}
                    >
                      <CardContent className="p-3">
                        <p className="font-semibold text-[#1e3a8a]">{student.name}</p>
                        <p className="text-sm text-[#1e3a8a]/60">{student.admissionNumber}</p>
                        <Badge className={`mt-2 ${getStatusBadgeColor(student.assessmentStatus)}`}>
                          {student.assessmentStatus}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Competency Assessment Matrix */}
              {selectedStudent && (
                <div className="mt-6 space-y-3 border-t pt-4">
                  <h3 className="font-semibold text-[#1e3a8a]">Assess Competencies for {mockStudents.find(s => s.id === selectedStudent)?.name}</h3>

                  {mockCompetencies.map((competency) => (
                    <Card key={competency.id} className="bg-white/50 border-blue-100">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-[#1e3a8a]">{competency.name}</p>
                            <p className="text-sm text-[#1e3a8a]/60">{competency.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">{competency.domain.replace(/_/g, ' ')}</Badge>
                        </div>

                        {/* Performance Level Selection */}
                        <div className="grid grid-cols-7 gap-1">
                          {performanceLevels.map((perf) => (
                            <button
                              key={perf.level}
                              className={`p-2 rounded border text-center text-xs font-bold transition-all ${perf.color} hover:shadow-md`}
                              title={perf.descriptor}
                            >
                              <div className="text-lg">{perf.level}</div>
                              <div className="text-[10px]">{perf.level > 4 ? 'EE' : perf.level > 2 ? 'AE' : 'BE'}</div>
                            </button>
                          ))}
                        </div>

                        {/* Evidence Notes */}
                        <textarea
                          placeholder="Add evidence notes (optional)"
                          className="w-full mt-3 px-3 py-2 border border-blue-200 rounded text-sm focus:ring-2 focus:ring-blue-400"
                          rows={2}
                        />
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex gap-2 justify-end pt-4">
                    <Button variant="outline" className="border-blue-300 text-[#1e3a8a] bg-transparent">
                      Save as Draft
                    </Button>
                    <Button className="bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857]">
                      Submit Assessment
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-competency" className="space-y-4">
          <Card className="bg-white/90 border-white/50">
            <CardHeader>
              <CardTitle className="text-[#1e3a8a]">Assess by Competency</CardTitle>
              <CardDescription>Assess all students for a specific competency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCompetencies.map((competency) => (
                  <Card key={competency.id} className="bg-white/50 border-blue-100">
                    <CardContent className="p-4">
                      <p className="font-semibold text-[#1e3a8a] mb-3">{competency.name}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-48 overflow-y-auto">
                        {mockStudents.map((student) => (
                          <div key={student.id} className="flex items-center justify-between p-2 bg-white/50 rounded border border-blue-100">
                            <span className="text-sm font-medium text-[#1e3a8a]">{student.name}</span>
                            <select className="px-2 py-1 border border-blue-200 rounded text-sm focus:ring-2 focus:ring-blue-400">
                              <option>Select level</option>
                              {performanceLevels.map((perf) => (
                                <option key={perf.level} value={perf.level}>
                                  {perf.level} - {perf.descriptor}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-entry" className="space-y-4">
          <Card className="bg-white/90 border-white/50">
            <CardHeader>
              <CardTitle className="text-[#1e3a8a]">Bulk Assessment Entry</CardTitle>
              <CardDescription>Upload multiple assessments via CSV or spreadsheet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50/50">
                <p className="text-[#1e3a8a] font-semibold">Drag and drop your CSV file here</p>
                <p className="text-sm text-[#1e3a8a]/60 mt-1">or click to browse</p>
                <input type="file" accept=".csv,.xlsx" className="hidden" />
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Format:</strong> StudentAdmission, Competency, PerformanceLevel, EvidenceNotes
                </AlertDescription>
              </Alert>

              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600">
                Upload Assessments
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
