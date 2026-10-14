'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600 mt-2">View and manage students across all your classes</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Class Students
          </CardTitle>
          <CardDescription>142 students across 4 classes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Student list view</p>
        </CardContent>
      </Card>
    </div>
  )
}
