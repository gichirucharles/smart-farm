"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClassDetailsModal } from "@/components/dashboard/class-details-modal"
import { AssignmentResultsModal } from "@/components/dashboard/assignment-results-modal"
import { CreateAssignmentModal } from "@/components/dashboard/create-assignment-modal"
import { MessagesPanel } from "@/components/dashboard/messages-panel"
import { ResourcesPanel } from "@/components/dashboard/resources-panel"
import { SchoolPerformanceOverview } from "@/components/dashboard/school-performance-overview"
import { IncidentDetailsModal } from "@/components/dashboard/incident-details-modal"
import { EventDetailsModal } from "@/components/dashboard/event-details-modal"
import { TeacherPerformanceModal } from "@/components/dashboard/teacher-performance-modal"
import { SchoolPerformanceChart } from "@/components/dashboard/school-performance-chart"

export default function DashboardFixesPage() {
  const [activeTab, setActiveTab] = useState("classes")

  // Modal states
  const [classDetailsOpen, setClassDetailsOpen] = useState(false)
  const [assignmentResultsOpen, setAssignmentResultsOpen] = useState(false)
  const [createAssignmentOpen, setCreateAssignmentOpen] = useState(false)
  const [incidentDetailsOpen, setIncidentDetailsOpen] = useState(false)
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false)
  const [teacherPerformanceOpen, setTeacherPerformanceOpen] = useState(false)

  // Mock data
  const mockClassData = {
    id: "class1",
    name: "Grade 5A",
    grade: "Grade 5",
    stream: "A",
    teacherName: "Sarah Johnson",
    teacherAvatar: "/placeholder.svg?height=40&width=40",
    studentCount: 28,
    averagePerformance: 82,
    subjects: [
      { name: "English", teacher: "Sarah Johnson", averageScore: 84 },
      { name: "Mathematics", teacher: "John Smith", averageScore: 80 },
      { name: "Science", teacher: "Michael Brown", averageScore: 83 },
      { name: "Social Studies", teacher: "Emily Davis", averageScore: 81 },
    ],
    students: [
      {
        id: "s1",
        name: "Alice Cooper",
        avatar: "/placeholder.svg?height=40&width=40",
        attendance: 95,
        overallGrade: "A",
        performance: 92,
      },
      {
        id: "s2",
        name: "Bob Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        attendance: 88,
        overallGrade: "B",
        performance: 85,
      },
      {
        id: "s3",
        name: "Charlie Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        attendance: 92,
        overallGrade: "A",
        performance: 90,
      },
      {
        id: "s4",
        name: "Diana Ross",
        avatar: "/placeholder.svg?height=40&width=40",
        attendance: 78,
        overallGrade: "C",
        performance: 75,
      },
      {
        id: "s5",
        name: "Edward Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        attendance: 85,
        overallGrade: "B",
        performance: 82,
      },
    ],
    recentAssignments: [
      { id: "a1", title: "Reading Comprehension", subject: "English", dueDate: "2023-05-15", submissionRate: 92 },
      { id: "a2", title: "Fractions Quiz", subject: "Mathematics", dueDate: "2023-05-10", submissionRate: 88 },
      { id: "a3", title: "Ecosystem Project", subject: "Science", dueDate: "2023-05-20", submissionRate: 85 },
    ],
  }

  const mockAssignmentData = {
    id: "a1",
    title: "Reading Comprehension",
    subject: "English",
    class: "Grade 5A",
    dueDate: "2023-05-15",
    totalPoints: 100,
    averageScore: 85,
    highestScore: 98,
    lowestScore: 65,
    submissionRate: 92,
    results: [
      {
        studentId: "s1",
        studentName: "Alice Cooper",
        studentAvatar: "/placeholder.svg?height=40&width=40",
        score: 95,
        grade: "A",
        submissionDate: "2023-05-14",
        status: "submitted",
      },
      {
        studentId: "s2",
        studentName: "Bob Johnson",
        studentAvatar: "/placeholder.svg?height=40&width=40",
        score: 82,
        grade: "B",
        submissionDate: "2023-05-15",
        status: "submitted",
      },
      {
        studentId: "s3",
        studentName: "Charlie Brown",
        studentAvatar: "/placeholder.svg?height=40&width=40",
        score: 90,
        grade: "A",
        submissionDate: "2023-05-13",
        status: "submitted",
      },
      {
        studentId: "s4",
        studentName: "Diana Ross",
        studentAvatar: "/placeholder.svg?height=40&width=40",
        score: 75,
        grade: "C",
        submissionDate: "2023-05-15",
        status: "late",
      },
      {
        studentId: "s5",
        studentName: "Edward Smith",
        studentAvatar: "/placeholder.svg?height=40&width=40",
        score: 0,
        grade: "F",
        submissionDate: "",
        status: "missing",
      },
    ],
  }

  const mockClasses = [
    { id: "c1", name: "Grade 5A" },
    { id: "c2", name: "Grade 5B" },
    { id: "c3", name: "Grade 6A" },
  ]

  const mockSubjects = [
    { id: "s1", name: "English" },
    { id: "s2", name: "Mathematics" },
    { id: "s3", name: "Science" },
    { id: "s4", name: "Social Studies" },
  ]

  const mockIncident = {
    id: "inc1",
    title: "Playground Incident",
    description:
      "Two students had a disagreement during recess that escalated into a verbal altercation. Teachers intervened before it became physical.",
    date: "2023-05-10T10:30:00",
    status: "pending",
    priority: "medium",
    category: "Student Behavior",
    reportedBy: {
      name: "Sarah Johnson",
      role: "Teacher",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    assignedTo: {
      name: "Michael Brown",
      role: "Head Teacher",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    updates: [
      {
        id: "u1",
        content: "Incident reported. Both students have been separated and are being spoken to individually.",
        timestamp: "2023-05-10T10:45:00",
        author: {
          name: "Sarah Johnson",
          role: "Teacher",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      },
      {
        id: "u2",
        content:
          "I've spoken with both students. They have apologized to each other and agreed to resolve conflicts peacefully in the future.",
        timestamp: "2023-05-10T11:30:00",
        author: {
          name: "Michael Brown",
          role: "Head Teacher",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      },
    ],
  }

  const mockEvent = {
    id: "evt1",
    title: "End of Term Assembly",
    description:
      "School-wide assembly to celebrate student achievements and end of term activities. Awards will be presented to outstanding students.",
    startDate: "2023-06-15T09:00:00",
    endDate: "2023-06-15T11:00:00",
    location: "School Auditorium",
    category: "Academic",
    organizer: {
      name: "Michael Brown",
      role: "Head Teacher",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    attendees: [
      {
        id: "att1",
        name: "Sarah Johnson",
        role: "Teacher",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "confirmed",
      },
      {
        id: "att2",
        name: "John Smith",
        role: "Teacher",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "confirmed",
      },
      {
        id: "att3",
        name: "Emily Davis",
        role: "Teacher",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "pending",
      },
    ],
    attachments: [
      {
        id: "file1",
        name: "Assembly Program.pdf",
        type: "pdf",
        url: "#",
      },
      {
        id: "file2",
        name: "Award Recipients.xlsx",
        type: "xlsx",
        url: "#",
      },
    ],
  }

  const mockTeacher = {
    id: "t1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    position: "Senior Teacher",
    department: "English Department",
    email: "sarah.johnson@school.edu",
    phone: "+255 123 456 789",
    joinDate: "2020-01-15",
    performance: {
      overall: 85,
      teaching: 88,
      classManagement: 82,
      studentEngagement: 86,
      professionalDevelopment: 80,
      attendance: 90,
    },
    classes: [
      { id: "c1", name: "Grade 5A", subject: "English", students: 28, averageScore: 84 },
      { id: "c2", name: "Grade 6B", subject: "English", students: 30, averageScore: 82 },
      { id: "c3", name: "Grade 7A", subject: "English", students: 26, averageScore: 85 },
    ],
    observations: [
      {
        id: "obs1",
        date: "2023-03-15",
        observer: "Michael Brown",
        rating: 4,
        strengths: ["Excellent classroom management", "Strong student engagement", "Clear and effective communication"],
        areasForImprovement: [
          "Could incorporate more technology in lessons",
          "More differentiated instruction for varying ability levels",
        ],
      },
      {
        id: "obs2",
        date: "2023-01-20",
        observer: "Emily Davis",
        rating: 4.5,
        strengths: [
          "Well-prepared lessons",
          "Positive learning environment",
          "Effective use of questioning techniques",
        ],
        areasForImprovement: ["More group activities", "Additional formative assessment strategies"],
      },
    ],
    performanceTrend: [
      { month: "Jan", score: 80 },
      { month: "Feb", score: 82 },
      { month: "Mar", score: 84 },
      { month: "Apr", score: 83 },
      { month: "May", score: 85 },
      { month: "Jun", score: 87 },
    ],
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Fixes</h1>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="incidents">Incidents & Events</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Details View</CardTitle>
              <CardDescription>Fixed view details functionality for all classes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setClassDetailsOpen(true)}>View Class Details</Button>
            </CardContent>
          </Card>

          <ClassDetailsModal
            isOpen={classDetailsOpen}
            onClose={() => setClassDetailsOpen(false)}
            classData={mockClassData}
          />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Results View</CardTitle>
              <CardDescription>Fixed view results functionality for assignments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setAssignmentResultsOpen(true)}>View Assignment Results</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Assignment Dialog</CardTitle>
              <CardDescription>Fixed scrollable dialog for assignment creation</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setCreateAssignmentOpen(true)}>Create Assignment</Button>
            </CardContent>
          </Card>

          <AssignmentResultsModal
            isOpen={assignmentResultsOpen}
            onClose={() => setAssignmentResultsOpen(false)}
            assignmentData={mockAssignmentData}
          />

          <CreateAssignmentModal
            isOpen={createAssignmentOpen}
            onClose={() => setCreateAssignmentOpen(false)}
            onSubmit={(data) => console.log("Assignment created:", data)}
            classes={mockClasses}
            subjects={mockSubjects}
          />
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages Panel</CardTitle>
              <CardDescription>Fixed message icon to show data</CardDescription>
            </CardHeader>
            <CardContent>
              <MessagesPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resources Panel</CardTitle>
              <CardDescription>Fixed resource icon to show data</CardDescription>
            </CardHeader>
            <CardContent>
              <ResourcesPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>School Performance Overview</CardTitle>
              <CardDescription>Fixed head teacher class performance overview for all grades</CardDescription>
            </CardHeader>
            <CardContent>
              <SchoolPerformanceOverview />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teacher Performance</CardTitle>
              <CardDescription>Fixed teacher performance action icon</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setTeacherPerformanceOpen(true)}>View Teacher Performance</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>School Performance Chart</CardTitle>
              <CardDescription>Fixed performance chart visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <SchoolPerformanceChart />
            </CardContent>
          </Card>

          <TeacherPerformanceModal
            isOpen={teacherPerformanceOpen}
            onClose={() => setTeacherPerformanceOpen(false)}
            teacher={mockTeacher}
          />
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>Fixed incident details icon after pending/resolved status</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIncidentDetailsOpen(true)}>View Incident Details</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Fixed event details icon</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setEventDetailsOpen(true)}>View Event Details</Button>
            </CardContent>
          </Card>

          <IncidentDetailsModal
            isOpen={incidentDetailsOpen}
            onClose={() => setIncidentDetailsOpen(false)}
            incident={mockIncident}
          />

          <EventDetailsModal isOpen={eventDetailsOpen} onClose={() => setEventDetailsOpen(false)} event={mockEvent} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
