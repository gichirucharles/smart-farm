'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, TrendingUp, BookOpen } from 'lucide-react';

interface PerformanceLevel {
  level: number;
  name: string;
  descriptor: string;
  meaning: string;
  color: string;
  icon: React.ReactNode;
  actions: string[];
}

interface StudentCompetency {
  subject: string;
  competency: string;
  currentLevel: number;
  previousLevel: number;
  trend: 'up' | 'down' | 'stable';
  nextSteps: string[];
}

const performanceLevels: PerformanceLevel[] = [
  {
    level: 1,
    name: 'Below Expectation 2 (BE2)',
    descriptor: '9-15 marks',
    meaning: 'Student is not yet demonstrating the required competency and needs significant support',
    color: 'bg-red-100 border-red-300 text-red-900',
    icon: <AlertCircle className="w-4 h-4" />,
    actions: [
      'Schedule a meeting with the teacher to understand specific challenges',
      'Provide extra support and study materials at home',
      'Consider a student mentor or tutoring support',
      'Regular check-ins on progress',
    ],
  },
  {
    level: 2,
    name: 'Below Expectation 1 (BE1)',
    descriptor: '16-24 marks',
    meaning: 'Student is developing the competency but still below grade level expectation',
    color: 'bg-red-50 border-red-200 text-red-800',
    icon: <AlertCircle className="w-4 h-4" />,
    actions: [
      'Encourage consistent practice and engagement',
      'Connect with teacher for targeted improvement strategies',
      'Celebrate small progress wins',
      'Ensure adequate study time at home',
    ],
  },
  {
    level: 3,
    name: 'Approaching Expectation 2 (AE2)',
    descriptor: '25-33 marks',
    meaning: 'Student is making progress and approaching the grade level expectation',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <TrendingUp className="w-4 h-4" />,
    actions: [
      'Continue encouraging consistent effort',
      'Work with teacher to identify remaining gaps',
      'Provide additional challenging tasks to extend learning',
    ],
  },
  {
    level: 4,
    name: 'Approaching Expectation 1 (AE1)',
    descriptor: '34-42 marks',
    meaning: 'Student is very close to meeting grade level expectation',
    color: 'bg-blue-100 border-blue-300 text-blue-900',
    icon: <TrendingUp className="w-4 h-4" />,
    actions: [
      'Encourage final push to reach grade level expectation',
      'Focus on specific skills still being developed',
      'Provide extension activities for deeper learning',
    ],
  },
  {
    level: 5,
    name: 'Meeting Expectation 2 (ME2)',
    descriptor: '43-51 marks',
    meaning: 'Student has met the grade level expectation for this competency',
    color: 'bg-green-50 border-green-200 text-green-800',
    icon: <CheckCircle className="w-4 h-4" />,
    actions: [
      'Acknowledge achievement and progress',
      'Explore enrichment opportunities',
      'Help apply competency to real-world contexts',
    ],
  },
  {
    level: 6,
    name: 'Meeting Expectation 1 (ME1)',
    descriptor: '52-59 marks',
    meaning: 'Student has clearly met and demonstrated the grade level expectation',
    color: 'bg-green-100 border-green-300 text-green-900',
    icon: <CheckCircle className="w-4 h-4" />,
    actions: [
      'Celebrate strong achievement',
      'Encourage peer mentoring',
      'Explore leadership opportunities in this area',
    ],
  },
  {
    level: 7,
    name: 'Exceeding Expectation (EE)',
    descriptor: '60+ marks',
    meaning: 'Student has exceeded expectations and shows advanced mastery of the competency',
    color: 'bg-orange-100 border-orange-300 text-orange-900',
    icon: <CheckCircle className="w-4 h-4" />,
    actions: [
      'Recognize exceptional achievement',
      'Provide advanced/enriched learning opportunities',
      'Consider leadership or peer teaching roles',
      'Challenge with cross-curricular applications',
    ],
  },
];

const mockStudentData: StudentCompetency[] = [
  {
    subject: 'English',
    competency: 'Reading and Comprehension',
    currentLevel: 5,
    previousLevel: 4,
    trend: 'up',
    nextSteps: ['Continue reading practice', 'Explore diverse texts', 'Discuss reading with teacher'],
  },
  {
    subject: 'Mathematics',
    competency: 'Problem Solving',
    currentLevel: 4,
    previousLevel: 3,
    trend: 'up',
    nextSteps: ['Practice word problems', 'Real-world applications', 'Group study sessions'],
  },
  {
    subject: 'Science',
    competency: 'Scientific Inquiry',
    currentLevel: 3,
    previousLevel: 3,
    trend: 'stable',
    nextSteps: ['Hands-on experiments', 'Teacher support', 'Lab notebook practice'],
  },
];

export default function CBCPerformanceGuide() {
  const [selectedLevel, setSelectedLevel] = useState<number>(5);

  return (
    <div className="w-full space-y-6 p-6 bg-gradient-to-br from-[#b8d4f0] to-[#a8c8e8] min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#1e3a8a]">Understanding CBC Performance</h1>
        <p className="text-[#1e3a8a]/70 mt-2">
          Kenya's Competency-Based Curriculum uses a 7-level scale to show your child's learning progress
        </p>
      </div>

      <Tabs defaultValue="guide" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/80">
          <TabsTrigger value="guide">Performance Levels Guide</TabsTrigger>
          <TabsTrigger value="child-progress">Your Child's Progress</TabsTrigger>
          <TabsTrigger value="support">How to Support</TabsTrigger>
        </TabsList>

        <TabsContent value="guide" className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              The 7-level scale replaces the traditional A-F grading system. Each level shows your child's
              competency development in specific skills and knowledge areas.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {performanceLevels.map((level) => (
              <Card
                key={level.level}
                className={`cursor-pointer border-2 transition-all ${level.color}`}
                onClick={() => setSelectedLevel(level.level)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{level.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">{level.descriptor}</CardDescription>
                    </div>
                    {level.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{level.meaning}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold">What this means:</p>
                    <ul className="text-xs space-y-1">
                      {level.actions.slice(0, 2).map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed View for Selected Level */}
          {selectedLevel && (
            <Card className="bg-white/90 border-white/50">
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">
                  {performanceLevels.find((l) => l.level === selectedLevel)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#1e3a8a] mb-2">How Parents Can Help:</h4>
                  <ul className="space-y-2">
                    {performanceLevels
                      .find((l) => l.level === selectedLevel)
                      ?.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-[#1e3a8a]">{action}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                <Alert>
                  <AlertDescription className="text-sm">
                    Remember: Learning is a journey. Each level shows progress. Celebrate achievements and work
                    with teachers to support growth.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="child-progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/90">
              <CardContent className="pt-6">
                <div className="text-center">
                  <BookOpen className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-3xl font-bold text-[#1e3a8a]">12</p>
                  <p className="text-sm text-[#1e3a8a]/60">Competencies Assessed</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90">
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <p className="text-3xl font-bold text-[#1e3a8a]">+2</p>
                  <p className="text-sm text-[#1e3a8a]/60">Levels Improved</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                  <p className="text-3xl font-bold text-[#1e3a8a]">1</p>
                  <p className="text-sm text-[#1e3a8a]/60">Exceeding Expectations</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {mockStudentData.map((data, idx) => (
            <Card key={idx} className="bg-white/90">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-[#1e3a8a]">{data.subject}</CardTitle>
                    <CardDescription>{data.competency}</CardDescription>
                  </div>
                  <Badge
                    className={`${data.trend === 'up' ? 'bg-green-100 text-green-800' : data.trend === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {data.trend === 'up' ? 'Improving' : data.trend === 'down' ? 'Needs Support' : 'Stable'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-[#1e3a8a]/60 mb-1">Previous Level</p>
                    <Badge className="bg-blue-100 text-blue-800">{data.previousLevel}</Badge>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div className="flex-1 text-right">
                    <p className="text-xs text-[#1e3a8a]/60 mb-1">Current Level</p>
                    <Badge className="bg-green-100 text-green-800">{data.currentLevel}</Badge>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="text-xs font-semibold text-[#1e3a8a] mb-2">Next Steps:</p>
                  <ul className="space-y-1 text-sm">
                    {data.nextSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span className="text-[#1e3a8a]">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle className="text-[#1e3a8a]">How to Support Your Child's Learning</CardTitle>
              <CardDescription>Evidence-based strategies for parents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Daily Reading',
                    description: 'Read together for 20-30 minutes daily. Discuss stories and new words.',
                    icon: '📚',
                  },
                  {
                    title: 'Math in Daily Life',
                    description: 'Use math during cooking, shopping, and other daily activities.',
                    icon: '🧮',
                  },
                  {
                    title: 'Encourage Questions',
                    description: 'Ask open-ended questions and explore answers together.',
                    icon: '❓',
                  },
                  {
                    title: 'Regular Communication',
                    description: 'Check in regularly with the teacher about progress.',
                    icon: '💬',
                  },
                  {
                    title: 'Create a Study Space',
                    description: 'Provide a quiet, well-lit area for studying and homework.',
                    icon: '🏠',
                  },
                  {
                    title: 'Celebrate Progress',
                    description: 'Acknowledge effort and improvements, no matter how small.',
                    icon: '🎉',
                  },
                ].map((item, idx) => (
                  <Card key={idx} className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <p className="text-2xl mb-2">{item.icon}</p>
                      <p className="font-semibold text-[#1e3a8a]">{item.title}</p>
                      <p className="text-sm text-[#1e3a8a]/70 mt-1">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert className="bg-orange-50 border-orange-200">
                <AlertDescription className="text-sm">
                  <strong>Remember:</strong> Every child learns at their own pace. Focus on growth, not perfection.
                  Work together with teachers to support your child's journey.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
