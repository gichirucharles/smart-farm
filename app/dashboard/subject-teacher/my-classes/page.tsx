'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen } from 'lucide-react'

const myClasses = [
  { id: '1', name: 'Form 1 - Mathematics', level: 'Form 1', students: 32, subject: 'Mathematics' },
  { id: '2', name: 'Form 2 - Mathematics', level: 'Form 2', students: 28, subject: 'Mathematics' },
  { id: '3', name: 'Form 3 - Mathematics', level: 'Form 3', students: 30, subject: 'Mathematics' },
  { id: '4', name: 'Form 4 - Mathematics', level: 'Form 4', students: 25, subject: 'Mathematics' },
]

export default function MyClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
        <p className="text-gray-600 mt-2">View all classes where you teach</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myClasses.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    {cls.name}
                  </CardTitle>
                  <CardDescription>{cls.subject}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Grade Level:</span>
                <Badge variant="outline">{cls.level}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Students:</span>
                <span className="font-semibold">{cls.students}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
