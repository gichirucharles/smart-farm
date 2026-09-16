"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLogo } from "@/components/layout/app-logo"
import { AlertCircle } from "lucide-react"

export default function TestLoginPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const router = useRouter()

  const roles = [
    { id: "director", name: "Director", description: "School Director Dashboard" },
    { id: "head_teacher", name: "Head Teacher", description: "Head Teacher Dashboard" },
    { id: "class_teacher", name: "Class Teacher", description: "Class Teacher Dashboard" },
    { id: "teacher", name: "Subject Teacher", description: "Subject Teacher Dashboard (Class Teacher)" },
    { id: "school_nurse", name: "School Nurse", description: "School Nurse Dashboard" },
    { id: "school_counselor", name: "School Counselor", description: "School Counselor Dashboard" },
    { id: "parent", name: "Parent", description: "Parent Dashboard" },
    { id: "system_admin", name: "System Admin", description: "System Admin Dashboard" },
  ]

  const handleSelectRole = (roleId: string) => {
    // Create test user session
    const testUser = {
      id: `test-${roleId}`,
      email: `test.${roleId}@shuleverse.local`,
      role: roleId,
      firstName: "Test",
      lastName: roleId.replace(/_/g, " ").toUpperCase(),
      schoolId: "test-school",
      isFirstLogin: false,
      school: {
        id: "test-school",
        name: "Test School",
      },
    }

    // Store in localStorage for testing
    if (typeof window !== "undefined") {
      localStorage.setItem("userSession", JSON.stringify(testUser))
      localStorage.setItem("user", JSON.stringify(testUser))
    }

    // Navigate based on role
    const dashboardRoutes: Record<string, string> = {
      director: "/dashboard/director",
      head_teacher: "/dashboard/head-teacher",
      class_teacher: "/dashboard/class-teacher",
      teacher: "/dashboard/class-teacher",
      school_nurse: "/dashboard/nurse",
      school_counselor: "/dashboard/counselor",
      parent: "/dashboard/parent",
      system_admin: "/admin/system",
    }

    router.push(dashboardRoutes[roleId] || "/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b8d4f0] via-[#a8c8e8] to-[#98bce0] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="w-full max-w-3xl relative z-10">
        <div className="mb-8 flex justify-center">
          <AppLogo position="center" size="large" showText={true} showTagline={true} />
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border border-white/50">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">Testing Mode - Access Barriers Removed</p>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-[#1e3a8a]">Select User Role to Test</CardTitle>
              <CardDescription className="text-[#1e3a8a]/70">
                Choose any role to access that dashboard without authentication
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <Button
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start justify-start hover:bg-[#b8d4f0]/20 border-[#1e3a8a]/30"
                >
                  <div className="text-left w-full">
                    <p className="font-semibold text-[#1e3a8a]">{role.name}</p>
                    <p className="text-xs text-[#1e3a8a]/60 mt-1">{role.description}</p>
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> This test login page bypasses all authentication for testing purposes. In
                production, all access barriers will be restored with proper role-based security.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
