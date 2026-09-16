"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, UserCheck, UserX, TrendingUp, TrendingDown } from "lucide-react"

interface StaffMember {
  id: string
  name: string
  role: string
  department: string
  status: "active" | "inactive"
  performance: number
  joinDate: string
}

interface StaffOverviewProps {
  staffMembers?: StaffMember[]
}

export function StaffOverview({ staffMembers = [] }: StaffOverviewProps) {
  // Mock data for demonstration
  const mockStaffMembers: StaffMember[] = [
    {
      id: "1",
      name: "John Smith",
      role: "Head Teacher",
      department: "Administration",
      status: "active",
      performance: 95,
      joinDate: "2020-01-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Class Teacher",
      department: "Primary",
      status: "active",
      performance: 88,
      joinDate: "2021-03-10",
    },
    {
      id: "3",
      name: "Michael Brown",
      role: "Class Teacher",
      department: "Secondary",
      status: "active",
      performance: 92,
      joinDate: "2019-08-20",
    },
    {
      id: "4",
      name: "Emily Davis",
      role: "School Nurse",
      department: "Health",
      status: "active",
      performance: 90,
      joinDate: "2022-01-05",
    },
    {
      id: "5",
      name: "David Wilson",
      role: "School Counselor",
      department: "Guidance",
      status: "active",
      performance: 85,
      joinDate: "2021-09-15",
    },
  ]

  const staff = staffMembers.length > 0 ? staffMembers : mockStaffMembers

  // Calculate statistics
  const totalStaff = staff.length
  const activeStaff = staff.filter((s) => s.status === "active").length
  const inactiveStaff = totalStaff - activeStaff
  const averagePerformance = staff.reduce((sum, s) => sum + s.performance, 0) / totalStaff

  // Performance distribution
  const performanceDistribution = [
    { range: "90-100%", count: staff.filter((s) => s.performance >= 90).length, color: "bg-green-500" },
    {
      range: "80-89%",
      count: staff.filter((s) => s.performance >= 80 && s.performance < 90).length,
      color: "bg-blue-500",
    },
    {
      range: "70-79%",
      count: staff.filter((s) => s.performance >= 70 && s.performance < 80).length,
      color: "bg-yellow-500",
    },
    {
      range: "60-69%",
      count: staff.filter((s) => s.performance >= 60 && s.performance < 70).length,
      color: "bg-orange-500",
    },
    { range: "Below 60%", count: staff.filter((s) => s.performance < 60).length, color: "bg-red-500" },
  ]

  const performanceDistributionData = [
    { label: "Excellent (90-100%)", value: staff.filter((s) => s.performance >= 90).length },
    { label: "Good (80-89%)", value: staff.filter((s) => s.performance >= 80 && s.performance < 90).length },
    { label: "Average (70-79%)", value: staff.filter((s) => s.performance >= 70 && s.performance < 80).length },
    { label: "Below Average (60-69%)", value: staff.filter((s) => s.performance >= 60 && s.performance < 70).length },
    { label: "Poor (Below 60%)", value: staff.filter((s) => s.performance < 60).length },
  ]

  const staffOverview = {
    totalStaff,
    activeStaff,
    inactiveStaff,
    averagePerformance,
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeStaff}</div>
            <p className="text-xs text-muted-foreground">
              {((activeStaff / totalStaff) * 100).toFixed(1)}% of total staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Staff</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveStaff}</div>
            <p className="text-xs text-muted-foreground">
              {((inactiveStaff / totalStaff) * 100).toFixed(1)}% of total staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            {averagePerformance >= 80 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${averagePerformance >= 80 ? "text-green-600" : "text-red-600"}`}>
              {averagePerformance.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Overall staff performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
          <CardDescription>Staff performance breakdown across different ranges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {performanceDistribution.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.range}</span>
                <Badge variant="secondary">{item.count} staff</Badge>
              </div>
              <Progress value={(item.count / totalStaff) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
          <CardDescription>Overview of all staff members and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{member.name}</h4>
                    <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {member.role} • {member.department}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Joined: {new Date(member.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div
                    className={`text-lg font-bold ${
                      member.performance >= 90
                        ? "text-green-600"
                        : member.performance >= 80
                          ? "text-blue-600"
                          : member.performance >= 70
                            ? "text-yellow-600"
                            : member.performance >= 60
                              ? "text-orange-600"
                              : "text-red-600"
                    }`}
                  >
                    {member.performance}%
                  </div>
                  <Progress value={member.performance} className="w-20 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Key insights about staff performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">High Performers</h4>
              <p className="text-sm text-green-700">
                {performanceDistributionData[0].value + performanceDistributionData[1].value} staff members (
                {(
                  ((performanceDistributionData[0].value + performanceDistributionData[1].value) /
                    staffOverview.totalStaff) *
                  100
                ).toFixed(1)}
                %) are performing excellently and should be recognized for their contributions.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Needs Support</h4>
              <p className="text-sm text-orange-700">
                {performanceDistributionData[3].value + performanceDistributionData[4].value} staff members (
                {(
                  ((performanceDistributionData[3].value + performanceDistributionData[4].value) /
                    staffOverview.totalStaff) *
                  100
                ).toFixed(1)}
                %) require additional support to improve performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
