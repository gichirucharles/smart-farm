"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users } from "lucide-react"

const mockCalendarEvents = {
  child: "Alice Doe",
  class: "Grade 7A",
  events: [
    {
      id: 1,
      title: "Parent-Teacher Conference",
      date: "2024-01-20",
      startTime: "2:00 PM",
      endTime: "5:00 PM",
      location: "School Main Hall",
      type: "Meeting",
      description: "Meet with teachers to discuss student progress",
      attendees: "All Parents",
    },
    {
      id: 2,
      title: "Science Fair",
      date: "2024-01-25",
      startTime: "10:00 AM",
      endTime: "3:00 PM",
      location: "School Grounds",
      type: "Event",
      description: "Students showcase their science projects",
      attendees: "All Students & Parents",
    },
    {
      id: 3,
      title: "School Holiday - Mid-Term Break",
      date: "2024-02-12",
      endDate: "2024-02-16",
      type: "Holiday",
      description: "School will be closed for mid-term break",
      attendees: "All",
    },
    {
      id: 4,
      title: "Mathematics Olympiad",
      date: "2024-02-05",
      startTime: "9:00 AM",
      endTime: "12:00 PM",
      location: "Science Block",
      type: "Competition",
      description: "Inter-school mathematics competition",
      attendees: "Selected Students",
    },
    {
      id: 5,
      title: "Sports Day",
      date: "2024-02-18",
      startTime: "8:00 AM",
      endTime: "4:00 PM",
      location: "School Stadium",
      type: "Event",
      description: "Annual sports competitions and activities",
      attendees: "All Students",
    },
    {
      id: 6,
      title: "End of Term Exams",
      date: "2024-03-01",
      endDate: "2024-03-15",
      type: "Exam",
      description: "Final term examinations for all students",
      attendees: "All Students",
    },
  ],
}

const getEventTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    Meeting: "bg-blue-100 text-blue-800",
    Event: "bg-green-100 text-green-800",
    Holiday: "bg-red-100 text-red-800",
    Competition: "bg-purple-100 text-purple-800",
    Exam: "bg-orange-100 text-orange-800",
  }
  return colors[type] || "bg-gray-100 text-gray-800"
}

const formatEventDate = (event: any) => {
  if (event.endDate) {
    return `${event.date} - ${event.endDate}`
  }
  return event.date
}

export default function SchoolCalendarPage() {
  const upcomingEvents = mockCalendarEvents.events.filter((e) => new Date(e.date) > new Date())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">School Calendar</h1>
        <p className="text-muted-foreground">Important dates and events for {mockCalendarEvents.class}</p>
      </div>

      <div className="space-y-4">
        {mockCalendarEvents.events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </div>
                <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{formatEventDate(event)}</p>
                  </div>
                </div>

                {event.startTime && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">For</p>
                    <p className="text-sm text-muted-foreground">{event.attendees}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
