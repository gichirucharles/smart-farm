"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"

interface CounselingSessionProps {
  fullWidth?: boolean
  compact?: boolean
}

export function CounselingSession({ fullWidth, compact }: CounselingSessionProps) {
  const sessions = [
    { id: 1, student: "John Muigai", time: "9:00 AM", status: "In Progress", topic: "Academic Pressure" },
    { id: 2, student: "Sarah Omondi", time: "10:30 AM", status: "Completed", topic: "Peer Pressure" },
    { id: 3, student: "Alex Kariuki", time: "2:00 PM", status: "Scheduled", topic: "Career Guidance" },
    { id: 4, student: "Emma Wanjiru", time: "3:30 PM", status: "Scheduled", topic: "Family Issues" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500"
      case "Completed":
        return "bg-green-500"
      case "Scheduled":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Counseling Sessions</CardTitle>
        <CardDescription>Today&apos;s schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`space-y-3 ${compact ? "max-h-64 overflow-y-auto" : ""}`}>
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{session.student}</p>
                  <p className="text-xs text-muted-foreground">{session.topic}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {session.time}
                </div>
                <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
