'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { toast } from '@/components/ui/use-toast'
import { Search, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import {
  assignStudentToCurriculum,
  getStudentsByCurriculum,
  getSchoolCurricula,
} from '@/lib/curriculum-enrollment-service'

interface StudentData {
  id: string
  first_name: string
  last_name: string
  current_curriculum?: string
  grade_level: string
  email?: string
}

interface StudentCurriculumAssignmentProps {
  schoolId: string
  academicYear?: number
}

export function StudentCurriculumAssignment({ schoolId, academicYear = new Date().getFullYear() }: StudentCurriculumAssignmentProps) {
  const [students, setStudents] = useState<StudentData[]>([])
  const [availableCurricula, setAvailableCurricula] = useState<string[]>([])
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [schoolId])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const curricula = await getSchoolCurricula(schoolId)
      setAvailableCurricula(curricula)
      
      if (curricula.length > 0) {
        setSelectedCurriculum(curricula[0])
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load curriculum data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStudents = students.filter((student) =>
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAssignmentChange = (studentId: string, curriculum: string) => {
    setAssignments((prev) => ({
      ...prev,
      [studentId]: curriculum,
    }))
  }

  const handleSaveAssignments = async () => {
    if (Object.keys(assignments).length === 0) {
      toast({
        title: 'No changes',
        description: 'No curriculum assignments to save',
        variant: 'default',
      })
      return
    }

    try {
      setIsSaving(true)
      const promises = Object.entries(assignments).map(([studentId, curriculum]) => {
        const student = students.find((s) => s.id === studentId)
        return assignStudentToCurriculum(
          studentId,
          schoolId,
          curriculum,
          academicYear,
          student?.grade_level || '',
          'admin', // TODO: Replace with actual user ID
        )
      })

      await Promise.all(promises)
      
      toast({
        title: 'Success',
        description: `Assigned ${Object.keys(assignments).length} student(s) to curricula`,
        variant: 'default',
      })

      setAssignments({})
      loadData()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save curriculum assignments',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (availableCurricula.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-900">
            <AlertCircle className="h-5 w-5" />
            No Curricula Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-800">
            This school has not configured any curricula offerings yet. Please configure curricula in school settings first.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Assign Students to Curricula</CardTitle>
          <CardDescription>
            Select curriculum offerings and assign students to their respective curriculum paths
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Curriculum</label>
              <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableCurricula.map((curriculum) => (
                    <SelectItem key={curriculum} value={curriculum}>
                      {curriculum}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search Students</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Name or ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Students</CardTitle>
              <CardDescription>{filteredStudents.length} student(s) found</CardDescription>
            </div>
            {Object.keys(assignments).length > 0 && (
              <Button onClick={handleSaveAssignments} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                Save {Object.keys(assignments).length} Assignment(s)
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Curriculum</TableHead>
                <TableHead>Assign To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell>{student.grade_level}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{student.email || '-'}</TableCell>
                    <TableCell>
                      {student.current_curriculum ? (
                        <Badge variant="secondary">{student.current_curriculum}</Badge>
                      ) : (
                        <Badge variant="outline">Not Assigned</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={assignments[student.id] || ''}
                        onValueChange={(value) => handleAssignmentChange(student.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCurricula.map((curriculum) => (
                            <SelectItem key={curriculum} value={curriculum}>
                              {curriculum}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {Object.keys(assignments).length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <CheckCircle2 className="h-5 w-5" />
              Changes to Save
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(assignments).map(([studentId, curriculum]) => {
                const student = students.find((s) => s.id === studentId)
                return (
                  <div key={studentId} className="text-sm text-blue-800">
                    <strong>{student?.first_name} {student?.last_name}</strong> → {curriculum}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
