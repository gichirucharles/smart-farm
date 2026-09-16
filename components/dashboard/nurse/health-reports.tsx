"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

export function HealthReports() {
  const reports = [
    { id: 1, title: "Monthly Health Summary", date: "2024-01-31", status: "Completed" },
    { id: 2, title: "Immunization Tracking", date: "2024-02-05", status: "In Progress" },
    { id: 3, title: "Accident & Incident Report", date: "2024-02-10", status: "Pending" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Reports</CardTitle>
        <CardDescription>Recent health documentation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{report.title}</p>
                  <p className="text-xs text-muted-foreground">{report.date}</p>
                </div>
              </div>
              <Badge variant={report.status === "Completed" ? "default" : "secondary"}>{report.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
