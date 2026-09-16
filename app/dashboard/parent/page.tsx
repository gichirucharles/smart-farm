"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  BookOpen,
  Calendar,
  MessageSquare,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  Mail,
  Bell,
} from "lucide-react"

// Mock data for parent dashboard
const mockChildrenData = [
  {
    id: 1,
    name: "Alice Doe",
    class: "Grade 7A",
    photo: "/placeholder.svg?height=100&width=100&text=Alice",
    attendance: 95,
    overallGrade: "A-",
    subjects: [
      { name: "Mathematics", grade: "A", score: 92 },
      { name: "English", grade: "A-", score: 88 },
      { name: "Science", grade: "B+", score: 85 },
      { name: "History", grade: "A", score: 90 },
    ],
    recentActivities: [
      { date: "2024-01-15", activity: "Math Quiz", score: "18/20" },
      { date: "2024-01-14", activity: "Science Project", score: "A" },
      { date: "2024-01-12", activity: "English Essay", score: "B+" },
    ],
    upcomingEvents: [
      { date: "2024-01-20", event: "Parent-Teacher Conference", time: "2:00 PM" },
      { date: "2024-01-25", event: "Science Fair", time: "10:00 AM" },
    ],
  },
  {
    id: 2,
    name: "Bob Doe",
    class: "Grade 5B",
    photo: "/placeholder.svg?height=100&width=100&text=Bob",
    attendance: 92,
    overallGrade: "B+",
    subjects: [
      { name: "Mathematics", grade: "B+", score: 87 },
      { name: "English", grade: "B", score: 82 },
      { name: "Science", grade: "A-", score: 89 },
      { name: "Art", grade: "A", score: 95 },
    ],
    recentActivities: [
      { date: "2024-01-15", activity: "Art Project", score: "A" },
      { date: "2024-01-13", activity: "Math Test", score: "15/20" },
      { date: "2024-01-11", activity: "Reading Assignment", score: "B" },
    ],
    upcomingEvents: [
      { date: "2024-01-22", event: "Art Exhibition", time: "3:00 PM" },
      { date: "2024-01-28", event: "Sports Day", time: "9:00 AM" },
    ],
  },
]

const mockMessagesData = [
  {
    id: 1,
    from: "Mrs. Johnson",
    subject: "Alice's Performance",
    message: "Alice performed well in the recent Math exam",
    date: "2024-01-15",
    unread: true,
  },
  {
    id: 2,
    from: "Mr. Smith",
    subject: "Class Trip Announcement",
    message: "The science class trip is scheduled for next month",
    date: "2024-01-14",
    unread: true,
  },
  {
    id: 3,
    from: "School Admin",
    subject: "Holiday Reminder",
    message: "School will be closed on Jan 20 for holidays",
    date: "2024-01-13",
    unread: false,
  },
]

const mockCalendarData = [
  { date: "2024-01-20", event: "School Holiday", type: "holiday" },
  { date: "2024-01-22", event: "Parent-Teacher Conference", type: "meeting" },
  { date: "2024-01-25", event: "Science Fair", type: "event" },
  { date: "2024-02-02", event: "Mid-term Exams Start", type: "exam" },
]

const mockNotifications = [
  {
    id: 1,
    title: "Alice's report card is ready",
    description: "Q1 report card for Alice is now available",
    date: "2024-01-16",
    read: false,
  },
  {
    id: 2,
    title: "Attendance reminder",
    description: "Attendance for this month is 95%",
    date: "2024-01-15",
    read: false,
  },
  { id: 3, title: "Assignment due soon", description: "Math assignment due in 2 days", date: "2024-01-14", read: true },
]

const mockAssignments = [
  {
    id: 1,
    subject: "Mathematics",
    title: "Algebra Practice",
    dueDate: "2024-01-20",
    status: "pending",
    description: "Complete exercises 1-20 from chapter 5",
  },
  {
    id: 2,
    subject: "English",
    title: "Essay Writing",
    dueDate: "2024-01-18",
    status: "submitted",
    description: "Write a 500-word essay on your favorite book",
  },
  {
    id: 3,
    subject: "Science",
    title: "Lab Report",
    dueDate: "2024-01-22",
    status: "pending",
    description: "Complete the photosynthesis lab report",
  },
]

export default function ParentDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedChild, setSelectedChild] = useState(0)
  const [unreadMessageCount, setUnreadMessageCount] = useState(2)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(2)

  useEffect(() => {
    // Calculate unread message count
    const unread = mockMessagesData.filter((m) => m.unread).length
    setUnreadMessageCount(unread)

    // Calculate unread notification count
    const unreadNotif = mockNotifications.filter((n) => !n.read).length
    setUnreadNotificationCount(unreadNotif)
  }, [])

  const child = mockChildrenData[selectedChild]

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600"
    if (grade.startsWith("B")) return "text-blue-600"
    if (grade.startsWith("C")) return "text-yellow-600"
    return "text-red-600"
  }

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return "text-green-600"
    if (attendance >= 90) return "text-blue-600"
    if (attendance >= 85) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b8d4f0] via-[#a8c8e8] to-[#98bce0] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser?.name || "Guest"}</p>
          </div>
          <div className="flex gap-2">
            {mockChildrenData.map((child, index) => (
              <Button
                key={child.id}
                variant={selectedChild === index ? "default" : "outline"}
                onClick={() => setSelectedChild(index)}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                {child.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Child Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getGradeColor(child.overallGrade)}`}>{child.overallGrade}</div>
              <p className="text-xs text-muted-foreground">Current semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getAttendanceColor(child.attendance)}`}>{child.attendance}%</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{child.class}</div>
              <p className="text-xs text-muted-foreground">Current class</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <div className="relative">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                {unreadMessageCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadMessageCount}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadMessageCount}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs - Updated with all sections */}
        <Tabs defaultValue="academic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="academic">Academic Progress</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="messages">Messages ({unreadMessageCount})</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="notifications">Notifications ({unreadNotificationCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Current semester grades for {child.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {child.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{subject.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                          <span className="text-sm text-gray-500">{subject.score}%</span>
                        </div>
                      </div>
                      <Progress value={subject.score} className="w-20" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest assignments and assessments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {child.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{activity.activity}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                      <Badge variant="outline">{activity.score}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Monthly attendance tracking for {child.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{child.attendance}%</p>
                      <p className="text-sm text-gray-500">Overall attendance this semester</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">18/19 days</p>
                      <p className="text-sm text-gray-500">Days present this month</p>
                    </div>
                  </div>

                  <Progress value={child.attendance} className="w-full" />

                  <div className="grid grid-cols-7 gap-2 text-center">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <div key={day} className="text-sm font-medium text-gray-500 p-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => (
                      <div
                        key={i}
                        className={`p-2 text-sm rounded ${
                          Math.random() > 0.1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
                <CardDescription>Current and upcoming assignments for {child.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {assignment.subject}
                        </Badge>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                      </div>
                      <Badge className={assignment.status === "submitted" ? "bg-green-500" : "bg-yellow-500"}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Due: {assignment.dueDate}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communication with teachers and school staff</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockMessagesData.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg space-y-2 ${message.unread ? "bg-blue-50 border-blue-200" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{message.from}</p>
                          {message.unread && (
                            <Badge variant="default" className="bg-blue-600">
                              New
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-sm mt-1">{message.subject}</h3>
                        <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      {message.date}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>School Calendar</CardTitle>
                <CardDescription>Important dates and events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCalendarData.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.event}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                      <Badge variant="outline" className="mt-2 capitalize">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Important alerts and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg space-y-2 ${!notification.read ? "bg-yellow-50 border-yellow-200" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bell className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-gray-600">{notification.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                        </div>
                      </div>
                      {!notification.read && <Badge className="bg-yellow-500">Unread</Badge>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Extracurricular Activities</CardTitle>
                <CardDescription>Clubs, sports, and other activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Science Club</p>
                        <p className="text-sm text-gray-500">Wednesdays 3:00 PM</p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Basketball Team</p>
                        <p className="text-sm text-gray-500">Tuesdays & Thursdays 4:00 PM</p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Important dates and events for {child.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {child.upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.event}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
