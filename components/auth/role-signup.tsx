"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, Mail, Phone, Building } from "lucide-react"
import { rolesConfig } from "@/lib/roles-config"

interface RoleSignupProps {
  role: string
}

// Mock registered users data - in real app, this would come from database
const mockRegisteredUsers = {
  "head-teacher": [{ email: "headteacher@greenfield.edu", phone: "0712345678", school: "Greenfield Academy" }],
  "class-teacher": [
    { email: "teacher1@greenfield.edu", phone: "0723456789", school: "Greenfield Academy" },
    { email: "teacher2@sunrise.edu", phone: "0734567890", school: "Sunrise Primary" },
  ],
  director: [{ email: "director@education.gov", phone: "0745678901", school: "Ministry of Education" }],
  "school-nurse": [{ email: "nurse@greenfield.edu", phone: "0756789012", school: "Greenfield Academy" }],
  "school-counselor": [{ email: "counselor@greenfield.edu", phone: "0767890123", school: "Greenfield Academy" }],
  parent: [
    { email: "john.doe@email.com", phone: "0723252885", school: "Greenfield Academy" },
    { email: "mary.smith@email.com", phone: "0712345678", school: "Sunrise Primary" },
  ],
}

export function RoleSignup({ role }: RoleSignupProps) {
  const router = useRouter()
  const roleConfig = rolesConfig[role]

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    school: "",
    employeeId: "",
    department: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateRegistration = (email: string, phone: string) => {
    const registeredUsers = mockRegisteredUsers[role as keyof typeof mockRegisteredUsers] || []
    return registeredUsers.some((user) => user.email === email || user.phone === phone)
  }

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all required fields")
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address")
        return
      }

      // Validate phone format
      const phoneRegex = /^(\+254|0)[17]\d{8}$/
      if (!phoneRegex.test(formData.phone)) {
        setError("Please enter a valid Kenyan phone number")
        return
      }

      // Check if user is registered in the system (except for system-admin)
      if (role !== "system-admin") {
        if (!validateRegistration(formData.email, formData.phone)) {
          setError("You are not registered in our system. Please contact your school administration for registration.")
          return
        }
      }

      // Validate password
      const passwordError = validatePassword(formData.password)
      if (passwordError) {
        setError(passwordError)
        return
      }

      // Check password confirmation
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user data
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userRole", role)
      localStorage.setItem("userName", formData.fullName)
      localStorage.setItem("userEmail", formData.email)

      // Redirect based on role
      if (role === "system-admin") {
        router.push("/admin/system/dashboard")
      } else {
        router.push(`/dashboard/${role}`)
      }
    } catch (error) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!roleConfig) {
    return <div>Invalid role</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <roleConfig.icon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign up as {roleConfig.name}</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to access {roleConfig.name.toLowerCase()} features
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>Please fill in your information to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="pl-10"
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
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
                    placeholder="0712345678"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="pl-10"
                    required
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {role !== "system-admin" && (
                <div className="space-y-2">
                  <Label htmlFor="school">School/Institution</Label>
                  <div className="relative">
                    <Input
                      id="school"
                      type="text"
                      placeholder="Enter your school name"
                      value={formData.school}
                      onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))}
                      className="pl-10"
                    />
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}

              {(role === "class-teacher" ||
                role === "head-teacher" ||
                role === "school-nurse" ||
                role === "school-counselor") && (
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder="Enter your employee ID"
                    value={formData.employeeId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                  />
                </div>
              )}

              {(role === "class-teacher" || role === "school-counselor") && (
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="social-studies">Social Studies</SelectItem>
                      <SelectItem value="kiswahili">Kiswahili</SelectItem>
                      <SelectItem value="physical-education">Physical Education</SelectItem>
                      <SelectItem value="arts">Creative Arts</SelectItem>
                      <SelectItem value="guidance">Guidance & Counseling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => router.push(`/login/${role}`)}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
