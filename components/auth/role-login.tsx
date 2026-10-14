"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"
import { rolesConfig } from "@/lib/roles-config"
import { authenticateSystemAdmin, authenticateSchoolStaff } from "@/lib/auth-service"
import { AppLogo } from "@/components/layout/app-logo"

interface RoleLoginProps {
  role: string
}

export function RoleLogin({ role }: RoleLoginProps) {
  const router = useRouter()
  const roleConfig = rolesConfig[role]

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate input
      if (!loginData.email || !loginData.password) {
        setError("Please fill in all fields")
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(loginData.email)) {
        setError("Please enter a valid email address")
        return
      }

      let result
      if (role === "system-admin") {
        result = await authenticateSystemAdmin(loginData.email, loginData.password)
      } else {
        // Convert kebab-case role to match database role names (e.g., head-teacher -> head_teacher)
        const dbRole = role.replace(/-/g, "_")
        result = await authenticateSchoolStaff(loginData.email, loginData.password, dbRole)
      }

      if (result.success) {
        // Redirect based on role
        if (role === "system-admin") {
          router.push("/admin/system/dashboard")
        } else {
          router.push(`/dashboard/${role}`)
        }
      } else {
        setError(result.error || "Invalid email or password. Please check your credentials and try again.")
      }
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!roleConfig) {
    return <div>Invalid role</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b8d4f0] via-[#a8c8e8] to-[#98bce0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-[#1e3a8a]/80 hover:text-[#1e3a8a] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Centered ShuleVerse Logo */}
        <div className="mb-8 flex justify-center">
          <AppLogo position="center" size="large" showText={true} showTagline={true} />
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border border-white/50">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-[#1e40af] to-[#2563eb] rounded-full flex items-center justify-center shadow-lg">
              <roleConfig.icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-[#1e3a8a]">Sign in as {roleConfig.name}</CardTitle>
              <CardDescription className="text-[#1e3a8a]/70">
                Access your {roleConfig.name.toLowerCase()} dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#1e3a8a]">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={loginData.email}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10 border-[#b8d4f0] focus:border-[#1e40af] focus:ring-[#1e40af] bg-white/80"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1e3a8a]/60" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#1e3a8a]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10 border-[#b8d4f0] focus:border-[#1e40af] focus:ring-[#1e40af] bg-white/80"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1e3a8a]/60" />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[#1e3a8a]/60" />
                    ) : (
                      <Eye className="h-4 w-4 text-[#1e3a8a]/60" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#1e3a8a] hover:to-[#1e40af] text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-[#1e3a8a]/70">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push(`/signup/${role}`)}
                  className="text-[#1e40af] hover:text-[#1e3a8a] font-medium"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
