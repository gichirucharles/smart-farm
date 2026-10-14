import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, Shield, BookOpen, BarChart3, MessageSquare, Zap } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b8d4f0] via-[#a8c8e8] to-[#98bce0]">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      {/* Header */}
      <header className="relative z-10 bg-white/20 backdrop-blur-md border-b border-white/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#b8d4f0] to-[#a8c8e8] rounded-lg shadow-lg flex items-center justify-center border border-white/20">
                <Image
                  src="/images/shuleverse-logo-new.png"
                  alt="ShuleVerse Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a8a]">ShuleVerse</h1>
                <p className="text-sm text-[#f59e0b]">A Universe of Learning</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/admin-select"
                className="text-[#1e3a8a]/80 hover:text-[#1e3a8a] transition-colors font-medium"
              >
                Admin Portal
              </Link>
              <Link
                href="/parent-login"
                className="text-[#1e3a8a]/80 hover:text-[#1e3a8a] transition-colors font-medium"
              >
                Parent Portal
              </Link>
              <Link
                href="/test-login"
                className="text-[#1e3a8a]/80 hover:text-[#1e3a8a] transition-colors font-medium px-3 py-1 bg-yellow-100 rounded-full text-xs font-bold"
              >
                Test Mode
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-[#1e3a8a] mb-6">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]">
                ShuleVerse
              </span>
            </h2>
            <p className="text-xl text-[#1e3a8a]/70 mb-8 max-w-2xl mx-auto">
              A comprehensive school management system that connects students, parents, teachers, and administrators in
              one unified platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#047857] hover:to-[#059669] text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/admin-select">
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Access
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#d97706] hover:to-[#f59e0b] text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/parent-login">
                  <Users className="w-5 h-5 mr-2" />
                  Parent Portal
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#d97706] hover:to-[#f59e0b] text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/test-login">
                  <Zap className="w-5 h-5 mr-2" />
                  Test All Dashboards
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-[#1e3a8a] mb-4">Comprehensive School Management</h3>
            <p className="text-[#1e3a8a]/70 max-w-2xl mx-auto">
              Everything you need to manage your school efficiently, from student records to academic performance
              tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#1e40af] to-[#2563eb] rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#1e3a8a]">Student Management</CardTitle>
                <CardDescription className="text-[#1e3a8a]/70">
                  Complete student records, enrollment, and academic tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#059669] to-[#10b981] rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#1e3a8a]">Parent Portal</CardTitle>
                <CardDescription className="text-[#1e3a8a]/70">
                  Real-time access to child's academic progress and school updates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#7c3aed] to-[#8b5cf6] rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#1e3a8a]">Academic Management</CardTitle>
                <CardDescription className="text-[#1e3a8a]/70">
                  Curriculum planning, assignments, and examination management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#1e3a8a]">Analytics & Reports</CardTitle>
                <CardDescription className="text-[#1e3a8a]/70">
                  Comprehensive reporting and data analytics for informed decisions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#dc2626] to-[#ef4444] rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#1e3a8a]">Communication</CardTitle>
                <CardDescription className="text-[#1e3a8a]/70">
                  Seamless communication between all stakeholders
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#0891b2] to-[#06b6d4] rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#1e3a8a]">Security & Privacy</CardTitle>
                <CardDescription className="text-[#1e3a8a]/70">
                  Enterprise-grade security with role-based access control
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-[#1e3a8a] mb-6">Ready to Transform Your School?</h3>
            <p className="text-[#1e3a8a]/70 mb-8 text-lg">
              Join thousands of schools already using ShuleVerse to streamline their operations and improve educational
              outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#047857] hover:to-[#059669] text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/admin-select">Get Started Today</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#d97706] hover:to-[#f59e0b] text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/parent-login">Parent Access</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-[#b8d4f0] to-[#a8c8e8] rounded-lg shadow-lg flex items-center justify-center border border-white/20">
                <Image
                  src="/images/shuleverse-logo-new.png"
                  alt="ShuleVerse Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="text-[#1e3a8a] font-semibold">ShuleVerse</span>
            </div>
            <div className="text-[#1e3a8a]/70 text-sm">© 2026 ShuleVerse. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
