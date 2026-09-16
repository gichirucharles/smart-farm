'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AcademicPerformancePage() {
  const data = [
    { grade: 'Grade 4', passRate: 85, distinction: 45 },
    { grade: 'Grade 5', passRate: 88, distinction: 50 },
    { grade: 'Grade 6', passRate: 82, distinction: 42 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Performance</h1>
        <p className="text-muted-foreground">School-wide performance metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Pass rates and distinction rates by grade</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="passRate" fill="#3b82f6" />
              <Bar dataKey="distinction" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
