'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AssessmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessment</h1>
          <p className="text-muted-foreground">Create and manage student assessments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Assessment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Tools</CardTitle>
          <CardDescription>Create new assessments or view existing ones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">No assessments created yet. Create one to get started.</p>
        </CardContent>
      </Card>
    </div>
  )
}
