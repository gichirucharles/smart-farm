import { Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ScheduledReports() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Counseling reports</CardTitle>
        <CardDescription>Reports and due dates from the connected system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3 rounded-lg border border-dashed p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">No counseling report schedule or generated-report records are available in the connected database.</p>
        </div>
      </CardContent>
    </Card>
  )
}
