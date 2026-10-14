'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList } from 'lucide-react'

export default function AssessmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assessment</h1>
        <p className="text-gray-600 mt-2">Create and manage assessments</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Assessment Tools
          </CardTitle>
          <CardDescription>Create assessments and track results</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Assessment management interface</p>
        </CardContent>
      </Card>
    </div>
  )
}
