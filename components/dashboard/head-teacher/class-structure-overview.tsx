"use client"

import useSWR from "swr"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ClassStructureResponse {
  settings?: {
    academicYear?: string
    classStructure?: Array<{ id: string; grade: string; streams: string[]; subjects: string[] }>
  }
}

const fetcher = async (url: string): Promise<ClassStructureResponse> => {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error ?? "Unable to load class structure")
  return body
}

export function ClassStructureOverview() {
  const { data, error, isLoading } = useSWR<ClassStructureResponse>("/api/school-settings", fetcher)
  const classes = data?.settings?.classStructure ?? []

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Class Management</h1>
        <p className="text-muted-foreground">Grade structure and subject offerings maintained by the head teacher.</p>
        {data?.settings?.academicYear && <Badge variant="outline">{data.settings.academicYear}</Badge>}
      </header>
      {error && <Alert variant="destructive"><AlertDescription>{error.message}</AlertDescription></Alert>}
      <Card>
        <CardHeader>
          <CardTitle>Grades, streams, and subjects</CardTitle>
          <CardDescription>{isLoading ? "Loading school structure…" : `${classes.length} grade levels`}</CardDescription>
        </CardHeader>
        <CardContent>
          {classes.length ? <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Grade or level</TableHead><TableHead>Streams</TableHead><TableHead>Subjects</TableHead></TableRow></TableHeader>
              <TableBody>{classes.map((item) => <TableRow key={item.id}>
                <TableCell className="font-medium">{item.grade || "Unnamed grade"}</TableCell>
                <TableCell>{item.streams.length ? item.streams.join(", ") : "—"}</TableCell>
                <TableCell><div className="flex flex-wrap gap-1.5">{item.subjects.map((subject) => <Badge key={subject} variant="secondary">{subject}</Badge>)}</div></TableCell>
              </TableRow>)}</TableBody>
            </Table>
          </div> : !isLoading && !error ? <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No class structure has been recorded. The head teacher can add grades, streams, and subjects in School Settings.</p> : null}
        </CardContent>
      </Card>
    </section>
  )
}
