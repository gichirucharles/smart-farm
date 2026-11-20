"use client"

import { useState } from "react"
import useSWR from "swr"
import { Download, FileText, LoaderCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { downloadCsv } from "@/lib/download-csv"

type SchoolReport = {
  id: string
  name: string
  county: string | null
  enrolment: number
  feesCollected: number
  attendanceRate: number | null
  meanScore: number | null
}

async function fetcher(url: string) {
  const response = await fetch(url, { cache: "no-store" })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || "Unable to load report data")
  return body as { schools: SchoolReport[] }
}

export function ReportDownloads() {
  const { data, error, isLoading, mutate } = useSWR("/api/governance", fetcher, { revalidateOnFocus: false })
  const [statusMessage, setStatusMessage] = useState("")

  function handleDownload() {
    if (!data) return
    const rows = [
      ["School", "County", "Active enrolment", "Fees collected (KES)", "Attendance · last 30 days (%)", "Mean score (%)"],
      ...data.schools.map((school) => [
        school.name,
        school.county ?? "",
        school.enrolment,
        Math.round(school.feesCollected),
        school.attendanceRate ?? "",
        school.meanScore ?? "",
      ]),
    ]
    downloadCsv(`school-network-overview-${new Date().toISOString().slice(0, 10)}.csv`, rows)
    setStatusMessage("Live school network overview CSV downloaded.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>School network overview</CardTitle>
        <CardDescription>Export live, school-level aggregates. No individual student health or counselling data is included.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <FileText aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0"><p className="font-medium">School comparison report</p><p className="text-sm text-muted-foreground">Enrolment, fees, attendance and mean assessment score</p></div>
            <Badge variant="secondary">Live data</Badge>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleDownload} disabled={!data || isLoading}>
            {isLoading ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <Download data-icon="inline-start" />}
            Download CSV
          </Button>
        </div>
        {isLoading && <p role="status" className="text-sm text-muted-foreground">Loading assigned-school aggregates…</p>}
        {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 text-sm text-destructive"><span>{error.message}</span><Button type="button" variant="outline" size="sm" onClick={() => mutate()}>Try again</Button></div>}
        {data && <p className="text-sm text-muted-foreground">{data.schools.length} assigned {data.schools.length === 1 ? "school" : "schools"} included. Values reflect the current recorded data at download time.</p>}
        {statusMessage && <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{statusMessage}</p>}
      </CardContent>
    </Card>
  )
}
