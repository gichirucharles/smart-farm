'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CalendarPage() {
  const events = [
    { date: 'Jan 25', event: 'Math Assignment Due' },
    { date: 'Jan 26', event: 'History Essay Due' },
    { date: 'Jan 27', event: 'Parent-Teacher Meeting' },
    { date: 'Feb 1', event: 'Mid-term Exams Start' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">School calendar and important dates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Important dates and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 border-b pb-2 last:border-0">
                <div className="font-semibold text-blue-600">{item.date}</div>
                <div>{item.event}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
