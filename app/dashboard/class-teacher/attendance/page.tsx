'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AttendancePage() {
  const data = [
    { date: 'Mon', present: 36, absent: 2 },
    { date: 'Tue', present: 37, absent: 1 },
    { date: 'Wed', present: 35, absent: 3 },
    { date: 'Thu', present: 38, absent: 0 },
    { date: 'Fri', present: 34, absent: 4 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">Track and manage class attendance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance</CardTitle>
          <CardDescription>Attendance trends for the current week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#10b981" />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
