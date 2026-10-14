"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowRight, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface SubjectTeacherClass {
  id: string
  name: string
  level: string
  stream?: string
  subjectName: string
  studentCount: number
}

export function SubjectTeacherClassSwitcher() {
  const [classes, setClasses] = useState<SubjectTeacherClass[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [currentClass, setCurrentClass] = useState<SubjectTeacherClass | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadTeacherClasses()
  }, [])

  const loadTeacherClasses = async () => {
    try {
      setIsLoading(true)
      const session = localStorage.getItem("userSession")
      if (!session) {
        setError("User session not found")
        return
      }

      const user = JSON.parse(session)
      const teacherId = user.id

      // Fetch all classes where this teacher teaches the subject
      const { data, error: fetchError } = await supabase
        .from("subject_teacher_assignments")
        .select(`
          id,
          class_id,
          subject_id,
          classes (
            id,
            name,
            level,
            stream
          ),
          subjects (
            name
          )
        `)
        .eq("teacher_id", teacherId)

      if (fetchError) throw fetchError

      // Transform and count students
      const classesData = await Promise.all(
        (data || []).map(async (assignment: any) => {
          const { count } = await supabase
            .from("students")
            .select("*", { count: "exact" })
            .eq("class_id", assignment.class_id)

          return {
            id: assignment.class_id,
            name: assignment.classes.name,
            level: assignment.classes.level,
            stream: assignment.classes.stream,
            subjectName: assignment.subjects.name,
            studentCount: count || 0,
          }
        }),
      )

      setClasses(classesData)
      if (classesData.length > 0) {
        setSelectedClassId(classesData[0].id)
        setCurrentClass(classesData[0])
      }
    } catch (error) {
      console.error("Error loading classes:", error)
      setError("Failed to load your classes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClassChange = (classId: string) => {
    const selected = classes.find((c) => c.id === classId)
    if (selected) {
      setSelectedClassId(classId)
      setCurrentClass(selected)
    }
  }

  const handleSwitchClass = () => {
    if (selectedClassId) {
      // Store current class in session
      const session = localStorage.getItem("userSession")
      if (session) {
        const user = JSON.parse(session)
        user.currentClassId = selectedClassId
        localStorage.setItem("userSession", JSON.stringify(user))
      }

      // Redirect to class dashboard
      router.push(`/dashboard/subject-teacher/${selectedClassId}`)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Subject Classes
        </CardTitle>
        <CardDescription>You teach {classes.length} subject class(es)</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {classes.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No classes assigned to you yet</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select a Class to Teach</label>
              <Select value={selectedClassId} onValueChange={handleClassChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - {cls.subjectName} ({cls.studentCount} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentClass && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-blue-900">{currentClass.name}</h3>
                      <p className="text-sm text-blue-700">{currentClass.level}</p>
                    </div>
                    {currentClass.stream && <Badge variant="secondary">{currentClass.stream}</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">Subject:</span>
                      <p className="text-blue-900">{currentClass.subjectName}</p>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Students:</span>
                      <p className="text-blue-900">{currentClass.studentCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={handleSwitchClass} className="w-full" size="lg">
              Open Class <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
