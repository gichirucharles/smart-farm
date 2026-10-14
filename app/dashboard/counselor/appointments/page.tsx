'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AppointmentsPage() {
  const appointments = [
    { time: '09:00 AM', student: 'Alice Kimani', duration: '45 mins' },
    { time: '10:00 AM', student: 'Brian Omondi', duration: '30 mins' },
    { time: '11:00 AM', student: 'Catherine Njeri', duration: '45 mins' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">View and manage counselor appointments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Upcoming appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments.map((apt, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">{apt.student}</p>
                  <p className="text-sm text-muted-foreground">{apt.time} - {apt.duration}</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
