"use client"

import { useState } from "react"
import { Download, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { downloadCsv } from "@/lib/download-csv"

const reports = [
  {
    id: "academic-performance",
    name: "Academic Performance Report",
    period: "Academic performance snapshot",
    category: "Academic",
    filename: "academic-performance-report.csv",
    rows: [
      ["Metric", "Value"],
      ["Average performance", "82.4%"],
      ["Passing rate", "93.2%"],
      ["Total students", 4803],
      ["Exams taken", 28762],
      [],
      ["School", "Average score", "Previous score", "Students", "Passing rate"],
      ["Excellence Academy", "92.7%", "91.3%", 1045, "98.2%"],
      ["Pioneer Secondary", "89.3%", "87.5%", 912, "97.1%"],
      ["Unity Primary", "84.8%", "77.6%", 856, "95.8%"],
      ["Heritage International", "84.2%", "83.9%", 723, "93.7%"],
      ["Lakeside International", "78.9%", "77.1%", 589, "91.2%"],
      ["Greenview Primary", "74.5%", "72.8%", 678, "84.4%"],
    ],
  },
  {
    id: "financial-statement",
    name: "Financial Statement",
    period: "Financial snapshot (KES)",
    category: "Finance",
    filename: "financial-statement.csv",
    rows: [
      ["Metric", "Amount (KES)"],
      ["Total revenue", 2570000],
      ["Total expenses", 1940000],
      ["Net balance", 630000],
      ["Outstanding fees", 345000],
      [],
      ["School", "Revenue (KES)", "Expenses (KES)", "Balance (KES)"],
      ["Unity Primary", 410000, 325000, 85000],
      ["Excellence Academy", 520000, 390000, 130000],
      ["Heritage International", 350000, 275000, 75000],
      ["Pioneer Secondary", 480000, 355000, 125000],
      ["Greenview Primary", 290000, 240000, 50000],
      ["Lakeside International", 320000, 260000, 60000],
    ],
  },
  {
    id: "staff-evaluation",
    name: "Staff Evaluation",
    period: "Current review period",
    category: "HR",
    filename: "staff-evaluation.csv",
    rows: [
      ["Staff member", "Role", "Department", "Performance", "Status"],
      ["John Smith", "Head Teacher", "Administration", "95%", "Active"],
      ["Sarah Johnson", "Class Teacher", "Primary", "88%", "Active"],
      ["Michael Brown", "Class Teacher", "Secondary", "92%", "Active"],
      ["Emily Davis", "School Nurse", "Health", "90%", "Active"],
      ["David Wilson", "School Counselor", "Guidance", "85%", "Active"],
    ],
  },
] as const

export function ReportDownloads() {
  const [statusMessage, setStatusMessage] = useState("")

  const handleDownload = (report: (typeof reports)[number]) => {
    const rows = [
      ["Report", report.name],
      ["Period", report.period],
      ["Exported", new Date().toLocaleDateString("en-KE")],
      ["Source", "Current dashboard sample data"],
      [],
      ...report.rows,
    ]

    downloadCsv(report.filename, rows)
    setStatusMessage(`${report.name} CSV downloaded.`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Reports</CardTitle>
        <CardDescription>
          Download CSV summaries from the dashboard&apos;s current sample data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {reports.map((report) => (
          <div key={report.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <FileText aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="font-medium">{report.name}</p>
                <p className="text-sm text-muted-foreground">{report.period}</p>
              </div>
              <Badge variant="secondary">{report.category}</Badge>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => handleDownload(report)}>
              <Download data-icon="inline-start" />
              Download CSV
            </Button>
          </div>
        ))}
        {statusMessage && (
          <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
            {statusMessage}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
