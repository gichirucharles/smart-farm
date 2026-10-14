"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { CheckCircle, XCircle, Clock } from "lucide-react"

const mockAttendanceData = {
  name: "Alice Doe",
  class: "Grade 7A",
  totalDays: 160,
  presentDays: 152,
  absentDays: 6,
  lateDays: 2,
  attendancePercentage: 95,
  monthlyData: [
    { month: "Sep", present: 18, absent: 2, late: 0 },
    { month: "Oct", present: 20, absent: 0, late: 1 },
    { month: "Nov", present: 19, absent: 1, late: 0 },
    { month: "Dec", present: 18, absent: 1, late: 1 },
    { month: "Jan", present: 20, absent: 0, late: 0 },
  ],
  recentAttendance: [
    { date: "2024-01-15", status: "Present", time: "8:05 AM" },
    { date: "2024-01-14", status: "Present", time: "8:00 AM" },
    { date: "2024-01-13", status: "Present", time: "8:02 AM" },
    { date: "2024-01-12", status: "Present", time: "8:00 AM" },
    { date: "2024-01-11", status: "Late", time: "8:15 AM" },
  ],
}

const pieData = [
  { name: "Present", value: mockAttendanceData.presentDays, color: "#10b981" },
  { name: "Absent", value: mockAttendanceData.absentDays, color: "#ef4444" },
  { name: "Late", value: mockAttendanceData.lateDays, color: "#f59e0b" },
]

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Attendance</h1>
        <p className="text-muted-foreground">View {mockAttendanceData.name}'s attendance record</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{mockAttendanceData.attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">Out of {mockAttendanceData.totalDays} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" /> Present
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{mockAttendanceData.presentDays}</div>
            <p className="text-xs text-muted-foreground mt-1">days attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" /> Absent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{mockAttendanceData.absentDays}</div>
            <p className="text-xs text-muted-foreground mt-1">days missed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" /> Late
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{mockAttendanceData.lateDays}</div>
            <p className="text-xs text-muted-foreground mt-1">times late</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockAttendanceData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" stackId="a" fill="#10b981" name="Present" />
                  <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
                  <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAttendanceData.recentAttendance.map((record, idx) => (
                <TableRow key={idx}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === "Present" ? "default" : "secondary"}>{record.status}</Badge>
                  </TableCell>
                  <TableCell>{record.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
