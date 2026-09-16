"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, School, Users, BookOpen, Heart, Brain, Calculator, UserCog, Shield, Zap } from "lucide-react"
import { AppLogo } from "@/components/layout/app-logo"

const roles = [
  {
    id: "head-teacher",
    name: "Head Teacher",
    description: "School leadership and administration",
    icon: School,
    color: "from-[#1e40af] to-[#2563eb]",
  },
  {
    id: "deputy-head",
    name: "Deputy Head Teacher",
    description: "Assistant school administration",
    icon: UserCog,
    color: "from-[#7c3aed] to-[#8b5cf6]",
  },
  {
    id: "class-teacher",
    name: "Class Teacher",
    description: "Classroom management and instruction",
    icon: Users,
    color: "from-[#059669] to-[#10b981]",
  },
  {
    id: "teacher",
    name: "Subject Teacher",
    description: "Subject-specific instruction",
    icon: BookOpen,
    color: "from-[#0891b2] to-[#06b6d4]",
  },
  {
    id: "director",
    name: "Director",
    description: "Multi-school oversight and management",
    icon: Shield,
    color: "from-[#dc2626] to-[#ef4444]",
  },
  {
    id: "accountant",
    name: "School Accountant",
    description: "Financial management and reporting",
    icon: Calculator,
    color: "from-[#f59e0b] to-[#fbbf24]",
  },
  {
    id: "nurse",
    name: "School Nurse",
    description: "Student health and medical care",
    icon: Heart,
    color: "from-[#ec4899] to-[#f472b6]",
  },
  {
    id: "counselor",
    name: "School Counselor",
    description: "Student guidance and support",
    icon: Brain,
    color: "from-[#8b5cf6] to-[#a78bfa]",
  },
]

export default function AdminSelectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b8d4f0] via-[#a8c8e8] to-[#98bce0]">
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-[#1e3a8a]/80 hover:text-[#1e3a8a] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Button asChild size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold">
            <Link href="/test-login" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Test Mode
            </Link>
          </Button>
          <AppLogo position="center" size="medium" showText={true} />
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">School Administration Portal</h1>
          <p className="text-xl text-[#1e3a8a]/70 max-w-2xl mx-auto">
            Select your role to access the appropriate dashboard and management tools
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {roles.map((role) => (
            <Card
              key={role.id}
              className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <CardHeader className="text-center pb-4">
                <div
                  className={`mx-auto w-16 h-16 bg-gradient-to-br ${role.color} rounded-full flex items-center justify-center mb-4 shadow-lg`}
                >
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-[#1e3a8a] text-lg">{role.name}</CardTitle>
                <CardDescription className="text-[#1e3a8a]/70 text-sm">{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  asChild
                  className={`w-full bg-gradient-to-r ${role.color} hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-white font-medium`}
                >
                  <Link href={`/login/${role.id}`}>Access Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Admin Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 max-w-md mx-auto shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-[#dc2626] to-[#ef4444] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">System Administrator</h3>
            <p className="text-[#1e3a8a]/70 text-sm mb-6">
              Restricted access for system-level management and configuration
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-[#dc2626] to-[#ef4444] hover:from-[#b91c1c] hover:to-[#dc2626] text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Link href="/system-admin/login">System Admin Login</Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-[#1e3a8a]/70 text-sm">
            Need help accessing your account? Contact your school's IT administrator
          </p>
        </div>
      </div>
    </div>
  )
}
