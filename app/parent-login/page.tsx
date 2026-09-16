"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Phone, ArrowLeft, Users } from "lucide-react"
import { AppLogo } from "@/components/layout/app-logo"
import { authenticateParent, registerParent } from "@/lib/auth-service"

export default function ParentLoginPage() {
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  })
  const [signupData, setSignupData] = useState({
    identifier: "",
    firstName: "",
    lastName: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()

  useEffect(() => {}, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await authenticateParent(loginData.identifier, loginData.password)

      if (result.success) {
        if (result.requiresPasswordChange) {
          router.push("/auth/change-password")
        } else {
          router.push("/dashboard/parent")
        }
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const result = await registerParent(signupData)

      if (result.success) {
        setSuccess(result.message || "Account created successfully!")
        setSignupData({ identifier: "", firstName: "", lastName: "" })
        setTimeout(() => {
          setActiveTab("login")
          setSuccess("")
        }, 3000)
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const isEmail = (identifier: string) => identifier.includes("@")

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b8d4f0] via-[#a8c8e8] to-[#98bce0] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="w-full max-w-md relative z-10">
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
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#059669] to-[#10b981] rounded-full flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-[#1e3a8a]">Parent Portal</CardTitle>
              <CardDescription className="text-[#1e3a8a]/70">Access your child's academic information</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#b8d4f0]/30">
                <TabsTrigger value="login" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifier" className="text-sm font-medium text-[#1e3a8a]">
                      Email or Phone Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="identifier"
                        type="text"
                        value={loginData.identifier}
                        onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                        className="pl-10 border-[#b8d4f0] focus:border-[#059669] focus:ring-[#059669] bg-white/80"
                        placeholder="Enter email or phone number"
                        required
                      />
                      {isEmail(loginData.identifier) ? (
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1e3a8a]/60 w-4 h-4" />
                      ) : (
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1e3a8a]/60 w-4 h-4" />
                      )}
                    </div>
                    <p className="text-xs text-[#1e3a8a]/60">
                      Use the email or phone number registered with your child's school record
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-[#1e3a8a]">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pr-10 border-[#b8d4f0] focus:border-[#059669] focus:ring-[#059669] bg-white/80"
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
                    <p className="text-xs text-[#1e3a8a]/60">
                      First-time users: Your default password is SV_ followed by the last 3 digits of your phone number
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#047857] hover:to-[#059669] text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg"
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
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signupIdentifier" className="text-sm font-medium text-[#1e3a8a]">
                      Email or Phone Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="signupIdentifier"
                        type="text"
                        value={signupData.identifier}
                        onChange={(e) => setSignupData({ ...signupData, identifier: e.target.value })}
                        className="pl-10 border-[#b8d4f0] focus:border-[#059669] focus:ring-[#059669] bg-white/80"
                        placeholder="Enter email or phone number"
                        required
                      />
                      {isEmail(signupData.identifier) ? (
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1e3a8a]/60 w-4 h-4" />
                      ) : (
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1e3a8a]/60 w-4 h-4" />
                      )}
                    </div>
                    <p className="text-xs text-[#1e3a8a]/60">
                      Must match the contact information in your child's school record
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-[#1e3a8a]">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        className="border-[#b8d4f0] focus:border-[#059669] focus:ring-[#059669] bg-white/80"
                        placeholder="First name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-[#1e3a8a]">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        className="border-[#b8d4f0] focus:border-[#059669] focus:ring-[#059669] bg-white/80"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-xs text-green-800 font-medium mb-1">Default Password Info:</p>
                    <p className="text-xs text-green-700">
                      Your default password will be: <strong>SV_</strong> + last 3 digits of your phone number
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      You'll be required to change this password on first login
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#047857] hover:to-[#059669] text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#1e3a8a]/60">Need help? Contact your school's administration office</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
