"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Download, CalendarIcon, Clock, MapPin, Users, BookOpen, GraduationCap, Trophy, Flag } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  location: string
  category: "academic" | "holiday" | "exam" | "sports" | "cultural" | "meeting"
  description: string
}

export function SchoolCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedView, setSelectedView] = useState<"month" | "list" | "upcoming">("month")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false)

  // Mock calendar events
  const events: CalendarEvent[] = [
    {
      id: "evt1",
      title: "End of Term Exams",
      date: new Date(2023, 5, 15), // June 15, 2023
      startTime: "08:00",
      endTime: "16:00",
      location: "All Classrooms",
      category: "exam",
      description: "Final examinations for all subjects for Term 2.",
    },
    {
      id: "evt2",
      title: "Parent-Teacher Meeting",
      date: new Date(2023, 5, 20), // June 20, 2023
      startTime: "14:00",
      endTime: "17:00",
      location: "School Auditorium",
      category: "meeting",
      description: "Quarterly parent-teacher meeting to discuss student progress.",
    },
    {
      id: "evt3",
      title: "Sports Day",
      date: new Date(2023, 5, 25), // June 25, 2023
      startTime: "09:00",
      endTime: "15:00",
      location: "School Grounds",
      category: "sports",
      description: "Annual sports day with various athletic competitions.",
    },
    {
      id: "evt4",
      title: "School Holiday - Independence Day",
      date: new Date(2023, 6, 7), // July 7, 2023
      startTime: "00:00",
      endTime: "23:59",
      location: "N/A",
      category: "holiday",
      description: "School closed for Independence Day celebrations.",
    },
    {
      id: "evt5",
      title: "Science Fair",
      date: new Date(2023, 6, 15), // July 15, 2023
      startTime: "10:00",
      endTime: "15:00",
      location: "School Hall",
      category: "academic",
      description: "Annual science fair showcasing student projects.",
    },
    {
      id: "evt6",
      title: "Cultural Day",
      date: new Date(2023, 6, 22), // July 22, 2023
      startTime: "13:00",
      endTime: "17:00",
      location: "School Auditorium",
      category: "cultural",
      description: "Celebration of cultural diversity with performances and exhibitions.",
    },
    {
      id: "evt7",
      title: "Staff Development Day",
      date: new Date(2023, 7, 5), // August 5, 2023
      startTime: "09:00",
      endTime: "16:00",
      location: "Conference Room",
      category: "meeting",
      description: "Professional development workshop for all teaching staff.",
    },
    {
      id: "evt8",
      title: "Mid-Term Break",
      date: new Date(2023, 7, 10), // August 10, 2023
      startTime: "00:00",
      endTime: "23:59",
      location: "N/A",
      category: "holiday",
      description: "Mid-term break for all students and staff.",
    },
  ]

  // Filter events based on selected category
  const filteredEvents =
    selectedCategory === "all" ? events : events.filter((event) => event.category === selectedCategory)

  // Filter events for the selected date
  const eventsForSelectedDate = filteredEvents.filter(
    (event) => date && event.date.toDateString() === date.toDateString(),
  )

  // Get upcoming events (next 7 days)
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)

  const upcomingEvents = filteredEvents
    .filter((event) => event.date >= today && event.date <= nextWeek)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  // Function to get event dates for the calendar
  const getEventDates = () => {
    return filteredEvents.map((event) => event.date)
  }

  // Function to get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "holiday":
        return "bg-red-50 text-red-700 border-red-200"
      case "exam":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "sports":
        return "bg-green-50 text-green-700 border-green-200"
      case "cultural":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "meeting":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Function to get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "academic":
        return <BookOpen className="h-4 w-4" />
      case "holiday":
        return <Flag className="h-4 w-4" />
      case "exam":
        return <GraduationCap className="h-4 w-4" />
      case "sports":
        return <Trophy className="h-4 w-4" />
      case "cultural":
        return <Users className="h-4 w-4" />
      case "meeting":
        return <Users className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  // Function to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsEventDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>School Calendar</CardTitle>
              <CardDescription>View and manage school events and activities</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="holiday">Holidays</SelectItem>
                  <SelectItem value="exam">Exams</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="meeting">Meetings</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedView("month")}>
                  Month
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedView("list")}>
                  List
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedView("upcoming")}>
                  Upcoming
                </Button>
              </div>

              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
            <TabsContent value="month" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className="md:col-span-5">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    highlightedDates={getEventDates()}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="rounded-md border p-4 h-full">
                    <h3 className="font-medium mb-2">{date ? formatDate(date) : "Select a date"}</h3>
                    {eventsForSelectedDate.length > 0 ? (
                      <div className="space-y-3">
                        {eventsForSelectedDate.map((event) => (
                          <div
                            key={event.id}
                            className="p-3 rounded-md border hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{event.title}</h4>
                              <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}
                              >
                                {getCategoryIcon(event.category)}
                                <span className="ml-1 capitalize">{event.category}</span>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span>
                                  {event.startTime} - {event.endTime}
                                </span>
                              </div>
                              <div className="flex items-center mt-1">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No events scheduled for this date.</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>{formatDate(event.date)}</TableCell>
                          <TableCell>
                            {event.startTime} - {event.endTime}
                          </TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}
                            >
                              {getCategoryIcon(event.category)}
                              <span className="ml-1 capitalize">{event.category}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEventClick(event)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Upcoming Events (Next 7 Days)</h3>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                {upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 rounded-md border hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{formatDate(event.date)}</p>
                          </div>
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}
                          >
                            {getCategoryIcon(event.category)}
                            <span className="ml-1 capitalize">{event.category}</span>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No upcoming events in the next 7 days</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogDescription>{formatDate(selectedEvent.date)}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedEvent.category)}`}
              >
                {getCategoryIcon(selectedEvent.category)}
                <span className="ml-1 capitalize">{selectedEvent.category}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm">{selectedEvent.description}</p>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm">
                  Edit Event
                </Button>
                <Button size="sm">Add to Calendar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
