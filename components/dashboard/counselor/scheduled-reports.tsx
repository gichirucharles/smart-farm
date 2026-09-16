"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar } from "lucide-react"

export function ScheduledReports() {
  const reports = [
    { id: 1, title: "Monthly Counseling Summary", dueDate: "2024-02-01", status: "In Progress" },
    { id: 2, title: "Student Wellness Report", dueDate: "2024-02-05", status: "Not Started" },
    { id: 3, title: "Referral Outcomes Analysis", dueDate: "2024-02-10", status: "Completed" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "Not Started":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Reports</CardTitle>
        <CardDescription>Reports due this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{report.title}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    Due: {report.dueDate}
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
