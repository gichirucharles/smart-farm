'use client'

import { ReportDownloads } from '@/components/dashboard/director/report-downloads'

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Download director reports as CSV files.</p>
      </header>
      <ReportDownloads />
    </div>
  )
}
