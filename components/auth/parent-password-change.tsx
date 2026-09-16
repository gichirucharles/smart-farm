"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Shield } from "lucide-react"
import { changePassword, getCurrentUser } from "@/lib/auth-service"

export default function ParentPasswordChange() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const user = getCurrentUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!user) {
      setError("User session not found. Please login again.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number")
      return
    }

    setIsLoading(true)

    try {
      const result = await changePassword(user.id, newPassword)

      if (result.success) {
        setSuccess("Password changed successfully! Redirecting to login...")
        setTimeout(() => {
          router.push("/parent-login")
        }, 2000)
      } else {
        setError(result.error || "Failed to change password")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-10"></div>

      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Change Password</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              For security, please set a new password for your account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {user && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>
                  Welcome, {user.firstName} {user.lastName}
                </strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">This is your first login. Please create a secure password.</p>
            </div>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 font-medium mb-2">Password Requirements:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li className={`flex items-center ${newPassword.length >= 8 ? "text-green-600" : ""}`}>
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  At least 8 characters
                </li>
                <li className={`flex items-center ${/(?=.*[a-z])/.test(newPassword) ? "text-green-600" : ""}`}>
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${/(?=.*[a-z])/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  One lowercase letter
                </li>
                <li className={`flex items-center ${/(?=.*[A-Z])/.test(newPassword) ? "text-green-600" : ""}`}>
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${/(?=.*[A-Z])/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  One uppercase letter
                </li>
                <li className={`flex items-center ${/(?=.*\d)/.test(newPassword) ? "text-green-600" : ""}`}>
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${/(?=.*\d)/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  One number
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Changing Password...
                </div>
              ) : (
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </div>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              After changing your password, you'll need to login again with your new credentials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
