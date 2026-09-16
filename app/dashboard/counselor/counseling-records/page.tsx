'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CounselingRecordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Counseling Records</h1>
        <p className="text-muted-foreground">Maintain confidential student counseling records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
          <CardDescription>Access and manage student counseling files</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Records are confidential and password-protected.</p>
          <Button variant="outline">View Records</Button>
        </CardContent>
      </Card>
    </div>
  )
}
