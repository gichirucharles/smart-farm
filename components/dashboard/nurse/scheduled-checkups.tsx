"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"

interface ScheduledCheckupsProps {
  compact?: boolean
}

export function ScheduledCheckups({ compact }: ScheduledCheckupsProps) {
  const checkups = [
    { id: 1, student: "John Muigai", time: "9:30 AM", type: "Routine Checkup", status: "Scheduled" },
    { id: 2, student: "Sarah Omondi", time: "10:00 AM", type: "Vision Test", status: "Scheduled" },
    { id: 3, student: "Alex Kariuki", time: "2:00 PM", type: "Dental Check", status: "Scheduled" },
    { id: 4, student: "Emma Wanjiru", time: "3:00 PM", type: "Follow-up", status: "Scheduled" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Checkups</CardTitle>
        <CardDescription>Today&apos;s appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`space-y-3 ${compact ? "max-h-64 overflow-y-auto" : ""}`}>
          {checkups.map((checkup) => (
            <div key={checkup.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{checkup.student}</p>
                  <p className="text-xs text-muted-foreground">{checkup.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {checkup.time}
                </div>
                <Badge variant="secondary">{checkup.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
