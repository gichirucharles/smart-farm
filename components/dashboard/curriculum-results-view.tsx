'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BarChart3, TrendingUp, Award, Zap } from 'lucide-react'

interface CBCResult {
  curriculum_type: 'CBC'
  competency: string
  performance_level: number // 1-7
  descriptor: string
  evidence: string
}

interface IGCSEResult {
  curriculum_type: 'IGCSE'
  subject: string
  component: string
  marks: number
  total_marks: number
  percentage: number
  grade: string
  predicted_grade?: string
}

interface KCSEResult {
  curriculum_type: 'KCSE'
  subject: string
  marks: number
  total_marks: number
  grade: string
  points: number
}

interface IBResult {
  curriculum_type: 'IB'
  subject: string
  internal_assessment: number
  external_assessment: number
  total_points: number
}

type CurriculumResult = CBCResult | IGCSEResult | KCSEResult | IBResult

interface CurriculumResultsViewProps {
  results: CurriculumResult[]
  curriculum: string
  studentName: string
}

const PERFORMANCE_DESCRIPTORS = {
  1: 'Developing',
  2: 'Developing',
  3: 'Proficient',
  4: 'Proficient',
  5: 'Advanced',
  6: 'Advanced',
  7: 'Exceeds Expectations',
}

const PERFORMANCE_COLORS = {
  1: 'bg-red-100 text-red-800',
  2: 'bg-orange-100 text-orange-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-blue-100 text-blue-800',
  5: 'bg-green-100 text-green-800',
  6: 'bg-green-100 text-green-800',
  7: 'bg-emerald-100 text-emerald-800',
}

const IGCSE_GRADE_COLORS = {
  'A*': 'bg-emerald-100 text-emerald-800',
  A: 'bg-green-100 text-green-800',
  B: 'bg-blue-100 text-blue-800',
  C: 'bg-cyan-100 text-cyan-800',
  D: 'bg-yellow-100 text-yellow-800',
  E: 'bg-orange-100 text-orange-800',
  F: 'bg-red-100 text-red-800',
  G: 'bg-red-200 text-red-900',
  U: 'bg-gray-100 text-gray-800',
}

export function CurriculumResultsView({ results, curriculum, studentName }: CurriculumResultsViewProps) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BarChart3 className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No results available yet for {studentName}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (curriculum === 'CBC') {
    return <CBCResultsView results={results as CBCResult[]} studentName={studentName} />
  }

  if (curriculum === 'IGCSE') {
    return <IGCSEResultsView results={results as IGCSEResult[]} studentName={studentName} />
  }

  if (curriculum === 'KCSE') {
    return <KCSEResultsView results={results as KCSEResult[]} studentName={studentName} />
  }

  if (curriculum === 'IB') {
    return <IBResultsView results={results as IBResult[]} studentName={studentName} />
  }

  return null
}

function CBCResultsView({ results, studentName }: { results: CBCResult[]; studentName: string }) {
  const groupedByCompetency = results.reduce(
    (acc, result) => {
      if (!acc[result.competency]) {
        acc[result.competency] = []
      }
      acc[result.competency].push(result)
      return acc
    },
    {} as Record<string, CBCResult[]>,
  )

  const averagePerformance =
    results.reduce((sum, r) => sum + r.performance_level, 0) / results.length

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            CBC Performance Report - {studentName}
          </CardTitle>
          <CardDescription>Competency-based assessment results (Grades 1-7 scale)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Average Performance</p>
                  <div className="mt-2 text-3xl font-bold">{averagePerformance.toFixed(1)}</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {PERFORMANCE_DESCRIPTORS[Math.round(averagePerformance) as keyof typeof PERFORMANCE_DESCRIPTORS]}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Competencies Assessed</p>
                  <div className="mt-2 text-3xl font-bold">{results.length}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Competency Areas</p>
                  <div className="mt-2 text-3xl font-bold">{Object.keys(groupedByCompetency).length}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {Object.entries(groupedByCompetency).map(([competency, competencyResults]) => (
        <Card key={competency}>
          <CardHeader>
            <CardTitle className="text-base">{competency}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {competencyResults.map((result, idx) => (
              <div key={idx} className="space-y-2 border-b pb-3 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.descriptor}</span>
                  <Badge
                    className={`${PERFORMANCE_COLORS[result.performance_level as keyof typeof PERFORMANCE_COLORS]}`}
                  >
                    Level {result.performance_level}
                  </Badge>
                </div>
                <Progress value={(result.performance_level / 7) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">Evidence: {result.evidence}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function IGCSEResultsView({ results, studentName }: { results: IGCSEResult[]; studentName: string }) {
  const totalMarks = results.reduce((sum, r) => sum + r.marks, 0)
  const totalPossible = results.reduce((sum, r) => sum + r.total_marks, 0)
  const overallPercentage = ((totalMarks / totalPossible) * 100).toFixed(1)

  const gradeDistribution = results.reduce(
    (acc, r) => {
      acc[r.grade] = (acc[r.grade] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            IGCSE Results - {studentName}
          </CardTitle>
          <CardDescription>Cambridge International General Certificate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Overall Performance</p>
                  <div className="mt-2 text-3xl font-bold">{overallPercentage}%</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Subjects Taken</p>
                  <div className="mt-2 text-3xl font-bold">{results.length}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Marks</p>
                  <div className="mt-2 text-3xl font-bold">
                    {totalMarks}/{totalPossible}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subject Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.map((result, idx) => (
              <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{result.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.marks}/{result.total_marks} ({result.percentage.toFixed(1)}%)
                  </p>
                  {result.component && <p className="text-xs text-muted-foreground">{result.component}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={IGCSE_GRADE_COLORS[result.grade as keyof typeof IGCSE_GRADE_COLORS]}>
                    {result.grade}
                  </Badge>
                  {result.predicted_grade && (
                    <Badge variant="outline" className="text-xs">
                      Predicted: {result.predicted_grade}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KCSEResultsView({ results, studentName }: { results: KCSEResult[]; studentName: string }) {
  const totalPoints = results.reduce((sum, r) => sum + r.points, 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            KCSE Results - {studentName}
          </CardTitle>
          <CardDescription>Kenya National Examination Council</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <div className="mt-2 text-3xl font-bold">{totalPoints}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Subjects Taken</p>
                  <div className="mt-2 text-3xl font-bold">{results.length}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Average Grade</p>
                  <div className="mt-2 text-3xl font-bold">
                    {results[0]?.grade ? results.map((r) => r.grade).join(',') : 'TBD'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subject Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.map((result, idx) => (
              <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{result.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.marks}/{result.total_marks}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{result.grade}</Badge>
                  <span className="text-sm font-semibold text-muted-foreground">{result.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function IBResultsView({ results, studentName }: { results: IBResult[]; studentName: string }) {
  const totalPoints = results.reduce((sum, r) => sum + r.total_points, 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            IB Results - {studentName}
          </CardTitle>
          <CardDescription>International Baccalaureate Program</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <div className="mt-2 text-3xl font-bold">{totalPoints}</div>
                  <p className="mt-1 text-xs text-muted-foreground">out of 45</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Subjects</p>
                  <div className="mt-2 text-3xl font-bold">{results.length}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Performance %</p>
                  <div className="mt-2 text-3xl font-bold">{((totalPoints / 45) * 100).toFixed(1)}%</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subject Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.map((result, idx) => (
              <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{result.subject}</p>
                  <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                    <span>Internal: {result.internal_assessment}/7</span>
                    <span>External: {result.external_assessment}/7</span>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">{result.total_points} pts</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { Globe } from 'lucide-react'
