"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { registerParentForStudent, sendParentWelcomeEmail, getStudentParents } from "@/lib/parent-management-service"
import { Mail, Phone, AlertCircle, CheckCircle } from "lucide-react"

interface StudentInfo {
  id: string
  firstName: string
  lastName: string
  grade: string
  schoolName: string
}

interface ParentRegistrationProps {
  student: StudentInfo
  onSuccess?: () => void
}

export function ParentRegistration({ student, onSuccess }: ParentRegistrationProps) {
  const [parentCount, setParentCount] = useState(0)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    relationship: "mother",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [defaultPassword, setDefaultPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [registeredParents, setRegisteredParents] = useState<any[]>([])

  // Load existing parents on mount
  const loadParents = async () => {
    const result = await getStudentParents(student.id)
    if (result.success) {
      setRegisteredParents(result.parents || [])
      setParentCount(result.parents?.length || 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      if (parentCount >= 2) {
        setError("This student already has 2 parents/guardians. Remove one before adding another.")
        setIsLoading(false)
        return
      }

      // Validate inputs
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setError("Please fill in all required fields")
        setIsLoading(false)
        return
      }

      const result = await registerParentForStudent({
        studentId: student.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        relationship: formData.relationship,
        schoolId: "", // Will be set from context
      })

      if (result.success) {
        setDefaultPassword(result.defaultPassword || "")
        setSuccess(`Parent registered! Default password: ${result.defaultPassword}`)

        // Send welcome email
        await sendParentWelcomeEmail({
          parentUserId: result.parent.id,
          studentId: student.id,
          schoolName: student.schoolName,
          studentName: `${student.firstName} ${student.lastName}`,
          studentGrade: student.grade,
          parentName: formData.firstName,
        })

        // Reset form
        setFormData({ firstName: "", lastName: "", email: "", phone: "", relationship: "mother" })

        // Reload parents
        await loadParents()

        // Call success callback
        if (onSuccess) onSuccess()

        // Show notification about password
        toast({
          title: "Parent Registered",
          description: `Default password: ${result.defaultPassword}. Parent will be prompted to change it on first login.`,
        })
      } else {
        setError(result.error || "Failed to register parent")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const canAddMore = parentCount < 2

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Parent/Guardian Management</CardTitle>
        <CardDescription>
          Register and manage parents/guardians for {student.firstName} {student.lastName}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Parents Display */}
        {registeredParents.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Registered Parents/Guardians ({registeredParents.length}/2)</h3>
            {registeredParents.map((parent: any, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {parent.users?.first_name} {parent.users?.last_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {parent.users?.email} | {parent.users?.phone}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">Relationship: {parent.relationship}</p>
                </div>
                {parent.is_primary && (
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Primary</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Parent Form */}
        {canAddMore && (
          <>
            <div className="border-t pt-6">
              <h3 className="font-semibold text-sm mb-4">Add Parent/Guardian ({parentCount + 1}/2)</h3>

              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800 space-y-2">
                    <div>{success}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-white p-2 rounded border border-green-200 text-xs font-mono">
                        {defaultPassword}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(defaultPassword)
                          toast({ title: "Copied to clipboard" })
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-green-700 mt-2">
                      Share this password with the parent. They will be required to change it on first login.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="First name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="parent@example.com"
                        className="pl-10"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0712345678"
                        className="pl-10"
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship to Student *</Label>
                  <Select
                    value={formData.relationship}
                    onValueChange={(val) => setFormData({ ...formData, relationship: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                      <SelectItem value="aunt">Aunt</SelectItem>
                      <SelectItem value="uncle">Uncle</SelectItem>
                      <SelectItem value="grandparent">Grandparent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-blue-800 text-sm">
                    Default Password Info: A default password will be generated from the last 3 digits of the phone
                    number. The parent will be required to create a new password on first login.
                  </AlertDescription>
                </Alert>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Registering..." : `Register Parent/Guardian ${parentCount + 1}/2`}
                </Button>
              </form>
            </div>
          </>
        )}

        {!canAddMore && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-orange-800">
              Maximum 2 parents/guardians per student. Remove one to add another.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
