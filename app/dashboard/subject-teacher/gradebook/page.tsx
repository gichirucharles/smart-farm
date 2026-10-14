'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

export default function GradebookPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gradebook</h1>
        <p className="text-gray-600 mt-2">Manage and view student grades</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Grade Management
          </CardTitle>
          <CardDescription>Enter and track grades for all students</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Gradebook interface</p>
        </CardContent>
      </Card>
    </div>
  )
}
