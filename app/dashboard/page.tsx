import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UserProfileHeader } from "@/components/layout/user-profile-header"
import { Briefcase, BookOpen, School, Heart, Activity, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Dashboard | ShuleVerse",
  description: "ShuleVerse School Management System Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <UserProfileHeader 
        name="Welcome User"
        role="Select Your Dashboard"
        school="ShuleVerse"
        avatarUrl="/placeholder.svg?height=40&width=40"
      />
      
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Selection</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Briefcase className="h-8 w-8 mb-2" />
              <CardTitle>Director Dashboard</CardTitle>
              <CardDescription>School management and oversight</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access school management, financial overview, academic performance, staff overview, and network settings.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/dashboard/director">
                  Access Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <School className="h-8 w-8 mb-2" />
              <CardTitle>Head Teacher Dashboard</CardTitle>
              <CardDescription>School academic management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage academic performance, staff, student records, and school operations.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/dashboard/headteacher">
                  Access Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 mb-2" />
              <CardTitle>Class Teacher Dashboard</CardTitle>
              <CardDescription>Class management and student tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage class performance, assignments, attendance, and student progress.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/dashboard/teacher">
                  Access Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <Heart className="h-8 w-8 mb-2" />
              <CardTitle>School Nurse Dashboard</CardTitle>
              <CardDescription>Student health management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track sick bay visits, student health records, medication management, scheduled checkups, and health reports.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/dashboard/nurse">
                  Access Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <Activity className="h-8 w-8 mb-2" />
            </CardHeader>
          </Card>


\
