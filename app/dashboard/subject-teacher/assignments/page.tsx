'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600 mt-2">Create and manage student assignments</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignment Management
          </CardTitle>
          <CardDescription>Track assignment submissions and grades</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Assignment tracking interface</p>
        </CardContent>
      </Card>
    </div>
  )
}
