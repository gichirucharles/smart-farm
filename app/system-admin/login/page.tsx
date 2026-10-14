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
import { Eye, EyeOff, Shield, ArrowLeft, AlertCircle } from "lucide-react"
import { AppLogo } from "@/components/layout/app-logo"
import { authenticateSystemAdmin } from "@/lib/auth-service"

export default function SystemAdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await authenticateSystemAdmin(formData.email, formData.password)

      if (result.success) {
        router.push("/admin/system/dashboard")
      } else {
        setError("Invalid credentials. Please check your email and password.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b8d4f0] via-[#a8c8e8] to-[#98bce0] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home - Fixed navigation */}
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
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#dc2626] to-[#ef4444] rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-[#1e3a8a]">System Administrator</CardTitle>
              <CardDescription className="text-[#1e3a8a]/70">Secure access to system management</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#1e3a8a]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-[#b8d4f0] focus:border-[#dc2626] focus:ring-[#dc2626] bg-white/80"
                  placeholder="Enter your admin email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#1e3a8a]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pr-10 border-[#b8d4f0] focus:border-[#dc2626] focus:ring-[#dc2626] bg-white/80"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1e3a8a]/60 hover:text-[#1e3a8a]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#dc2626] to-[#ef4444] hover:from-[#b91c1c] hover:to-[#dc2626] text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg"
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

            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-red-800">Restricted Access</p>
                  <p className="text-xs text-red-700 mt-1">
                    This login is for system administrators only. Unauthorized access is prohibited.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
