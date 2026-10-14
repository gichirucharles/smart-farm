"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { assignTeacherRole, removeAndReassignRole, getTeacherRoles } from "@/lib/teacher-role-service"
import { supabase } from "@/lib/supabase"
import { AlertCircle, Plus, Trash2, AlertTriangle } from "lucide-react"

interface TeacherWithRoles {
  id: string
  name: string
  email: string
  roles: any[]
}

export function RoleManagement() {
  const [teachers, setTeachers] = useState<TeacherWithRoles[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherWithRoles | null>(null)
  const [showReassignDialog, setShowReassignDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [newTeacherId, setNewTeacherId] = useState("")
  const [reassignReason, setReassignReason] = useState("")
  const [duplicateWarning, setDuplicateWarning] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)

      // Fetch teachers
      const { data: teachersData } = await supabase
        .from("users")
        .select("id, first_name, last_name, email, role")
        .in("role", ["class_teacher", "subject_teacher", "deputy_head_teacher"])

      if (teachersData) {
        const teachersWithRoles = await Promise.all(
          teachersData.map(async (teacher: any) => {
            const roles = await getTeacherRoles(teacher.id)
            return {
              id: teacher.id,
              name: `${teacher.first_name} ${teacher.last_name}`,
              email: teacher.email,
              roles: roles.data || [],
            }
          }),
        )
        setTeachers(teachersWithRoles)
      }

      // Fetch classes
      const { data: classesData } = await supabase.from("classes").select("*")
      setClasses(classesData || [])
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignRole = async (teacherId: string, role: string, classId?: string) => {
    setError(null)
    setDuplicateWarning(null)

    const result = await assignTeacherRole(teacherId, role, "", classId)

    if (result.isDuplicate) {
      setDuplicateWarning(result)
    } else if (!result.success) {
      setError(result.error)
    } else {
      loadData()
      setShowDialog(false)
    }
  }

  const handleReassignRole = async () => {
    if (!selectedRole || !newTeacherId || !reassignReason) {
      setError("Please fill in all fields")
      return
    }

    const result = await removeAndReassignRole(
      selectedTeacher!.id,
      newTeacherId,
      selectedRole.id,
      reassignReason,
      "",
      "",
    )

    if (result.success) {
      loadData()
      setShowReassignDialog(false)
      setSelectedRole(null)
      setNewTeacherId("")
      setReassignReason("")
    } else {
      setError(result.error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Teacher Role Management</CardTitle>
            <CardDescription>Assign and manage teacher roles and responsibilities</CardDescription>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Assign Role
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <Card key={teacher.id} className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{teacher.name}</h4>
                      <p className="text-sm text-gray-600">{teacher.email}</p>

                      {teacher.roles.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {teacher.roles.map((role: any) => (
                            <Badge key={role.id} variant="secondary" className="flex items-center gap-1">
                              {role.role}
                              <button
                                onClick={() => {
                                  setSelectedTeacher(teacher)
                                  setSelectedRole(role)
                                  setShowReassignDialog(true)
                                }}
                                className="ml-1 hover:text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2">No roles assigned</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assign Role Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Teacher Role</DialogTitle>
            <DialogDescription>Assign a new responsibility to a teacher</DialogDescription>
          </DialogHeader>
          {/* Dialog content would go here */}
        </DialogContent>
      </Dialog>

      {/* Reassign Role Dialog */}
      {showReassignDialog && (
        <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reassign Teacher Role</DialogTitle>
              <DialogDescription>Transfer the role from {selectedTeacher?.name} to another teacher</DialogDescription>
            </DialogHeader>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action will not save until all responsibilities are reassigned to another teacher.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="new-teacher">Assign to Teacher</Label>
                <Select value={newTeacherId} onValueChange={setNewTeacherId}>
                  <SelectTrigger id="new-teacher">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers
                      .filter((t) => t.id !== selectedTeacher?.id)
                      .map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reason">Reason for Reassignment</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Promotion, Demotion, Transfer"
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                />
              </div>

              <Button onClick={handleReassignRole} className="w-full">
                Confirm Reassignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
