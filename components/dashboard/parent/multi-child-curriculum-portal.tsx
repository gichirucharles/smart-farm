'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, BookOpen, TrendingUp, Award, Globe } from 'lucide-react'
import { getParentChildrenEnrollments } from '@/lib/curriculum-enrollment-service'

interface ChildEnrollmentData {
  student: {
    id: string
    first_name: string
    last_name: string
    grade_level: string
  }
  enrollment: {
    curriculum_type: string
    academic_year: number
    status: string
  } | null
}

interface MultiChildCurriculumPortalProps {
  parentId: string
  academicYear?: number
}

const CURRICULUM_INFO = {
  CBC: {
    name: 'CBC (Competency-Based Curriculum)',
    description: 'Focus on developing competencies through continuous assessment',
    grades: 'Grades 1-9',
    color: 'bg-blue-50 border-blue-200',
    icon: BookOpen,
    gradingScale: '1-7 Performance Levels',
    assessmentType: 'Continuous Assessment',
  },
  IGCSE: {
    name: 'IGCSE (Cambridge International)',
    description: 'International qualification recognized globally',
    grades: 'Years 10-11',
    color: 'bg-purple-50 border-purple-200',
    icon: Globe,
    gradingScale: 'A*-G / U',
    assessmentType: 'External Examinations + Coursework',
  },
  KCSE: {
    name: 'KCSE (Kenya Certificate)',
    description: 'National examination council qualification',
    grades: 'Forms 1-4',
    color: 'bg-green-50 border-green-200',
    icon: Award,
    gradingScale: 'A-E Points',
    assessmentType: 'National Examinations',
  },
  IB: {
    name: 'IB (International Baccalaureate)',
    description: 'Comprehensive international diploma program',
    grades: 'Grades 11-12',
    color: 'bg-yellow-50 border-yellow-200',
    icon: TrendingUp,
    gradingScale: '1-7 Points',
    assessmentType: 'External & Internal Assessment',
  },
}

export function MultiChildCurriculumPortal({
  parentId,
  academicYear = new Date().getFullYear(),
}: MultiChildCurriculumPortalProps) {
  const [children, setChildren] = useState<ChildEnrollmentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState<string>('')

  useEffect(() => {
    loadChildrenEnrollments()
  }, [parentId, academicYear])

  const loadChildrenEnrollments = async () => {
    try {
      setIsLoading(true)
      const enrollments = await getParentChildrenEnrollments(parentId, academicYear)
      setChildren(enrollments)
      if (enrollments.length > 0) {
        setSelectedChild(enrollments[0].student.id)
      }
    } catch (error) {
      console.error('Error loading children enrollments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading your children's information...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (children.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-900">
            <AlertCircle className="h-5 w-5" />
            No Children Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-800">
            No children linked to your account. Please contact the school administrator.
          </p>
        </CardContent>
      </Card>
    )
  }

  const currentChild = children.find((c) => c.student.id === selectedChild)

  return (
    <div className="space-y-4">
      {/* Child Selection Cards */}
      {children.length > 1 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold">Your Children</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {children.map((child) => {
              const isSelected = selectedChild === child.student.id
              const curriculumInfo =
                child.enrollment && CURRICULUM_INFO[child.enrollment.curriculum_type as keyof typeof CURRICULUM_INFO]
              return (
                <button
                  key={child.student.id}
                  onClick={() => setSelectedChild(child.student.id)}
                  className={`rounded-lg border-2 p-3 text-left transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-muted bg-card hover:border-primary/50'
                  }`}
                >
                  <p className="font-semibold">
                    {child.student.first_name} {child.student.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{child.student.grade_level}</p>
                  {child.enrollment && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {child.enrollment.curriculum_type}
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected Child Details */}
      {currentChild && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>
                  {currentChild.student.first_name} {currentChild.student.last_name}
                </CardTitle>
                <CardDescription>Grade: {currentChild.student.grade_level}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentChild.enrollment ? (
              <div className="space-y-4">
                {/* Curriculum Info Card */}
                {(() => {
                  const info = CURRICULUM_INFO[currentChild.enrollment.curriculum_type as keyof typeof CURRICULUM_INFO]
                  const Icon = info?.icon || BookOpen
                  return (
                    <div className={`rounded-lg border p-4 ${info?.color}`}>
                      <div className="flex items-start gap-3">
                        <Icon className="mt-1 h-5 w-5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{info?.name}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">{info?.description}</p>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="font-semibold">Grade Range</p>
                              <p className="text-muted-foreground">{info?.grades}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Grading Scale</p>
                              <p className="text-muted-foreground">{info?.gradingScale}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="font-semibold">Assessment Method</p>
                              <p className="text-muted-foreground">{info?.assessmentType}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* Curriculum-Specific Content Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="subjects">Subjects</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Academic Year</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-semibold">Current Year</p>
                            <p className="text-muted-foreground">{currentChild.enrollment.academic_year}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Status</p>
                            <Badge
                              variant={
                                currentChild.enrollment.status === 'active' ? 'default' : 'secondary'
                              }
                            >
                              {currentChild.enrollment.status.charAt(0).toUpperCase() +
                                currentChild.enrollment.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {currentChild.enrollment.curriculum_type === 'CBC' && (
                      <div className="rounded-lg border bg-blue-50 p-4 text-sm">
                        <h4 className="font-semibold text-blue-900">About CBC</h4>
                        <ul className="mt-2 list-inside space-y-1 text-blue-800">
                          <li>• Focus on 7 core competencies</li>
                          <li>• Continuous assessment throughout the year</li>
                          <li>• Performance graded on 1-7 scale</li>
                          <li>• Emphasis on practical skills and application</li>
                        </ul>
                      </div>
                    )}

                    {currentChild.enrollment.curriculum_type === 'IGCSE' && (
                      <div className="rounded-lg border bg-purple-50 p-4 text-sm">
                        <h4 className="font-semibold text-purple-900">About IGCSE</h4>
                        <ul className="mt-2 list-inside space-y-1 text-purple-800">
                          <li>• International Cambridge qualification</li>
                          <li>• External examinations + coursework</li>
                          <li>• Grades awarded A* to G (U for unclassified)</li>
                          <li>• Recognized by universities worldwide</li>
                        </ul>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {currentChild.enrollment.curriculum_type} Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Performance data will appear here as assessments are completed.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="subjects" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Enrolled Subjects</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Subject information will appear here based on curriculum selection.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Curriculum not yet assigned:</strong> Your child has not been assigned to a curriculum yet.
                  Please contact the school administrator.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
