'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck } from 'lucide-react'

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600 mt-2">Track student attendance across classes</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Attendance Records
          </CardTitle>
          <CardDescription>View and manage attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Attendance tracking interface</p>
        </CardContent>
      </Card>
    </div>
  )
}
