import { Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ParentsContactPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parents Contact</h1>
        <p className="text-muted-foreground">Contact information for student parents and guardians</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Parent directory</CardTitle>
          <CardDescription>Guardian records from the school database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-lg border border-dashed p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No counselor-specific guardian directory is connected. Sample contact details have been removed so they are not mistaken for real family records.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
