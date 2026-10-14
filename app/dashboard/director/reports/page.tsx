'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

export default function ReportsPage() {
  const reports = [
    { name: 'Academic Performance Report', date: 'Jan 2024', type: 'Academic' },
    { name: 'Financial Statement', date: 'Jan 2024', type: 'Finance' },
    { name: 'Staff Evaluation', date: 'Dec 2023', type: 'HR' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View and generate school reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>Available reports for download</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
