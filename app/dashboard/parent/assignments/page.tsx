"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle } from "lucide-react"

const mockAssignments = {
  child: "Alice Doe",
  class: "Grade 7A",
  pending: [
    {
      id: 1,
      subject: "Mathematics",
      title: "Algebra - Quadratic Equations",
      dueDate: "2024-01-20",
      daysLeft: 5,
      status: "In Progress",
      progress: 60,
      description: "Complete exercises 1-15 from chapter 5",
    },
    {
      id: 2,
      subject: "English",
      title: "Essay - The Great Gatsby",
      dueDate: "2024-01-18",
      daysLeft: 3,
      status: "Not Started",
      progress: 0,
      description: "Write a 500-word analytical essay",
    },
    {
      id: 3,
      subject: "Science",
      title: "Biology Lab Report",
      dueDate: "2024-01-25",
      daysLeft: 10,
      status: "In Progress",
      progress: 40,
      description: "Document findings from the photosynthesis experiment",
    },
  ],
  completed: [
    {
      id: 4,
      subject: "History",
      title: "Research Project - World War II",
      dueDate: "2024-01-12",
      submittedDate: "2024-01-11",
      grade: "A",
      description: "Presentation on key events of WWII",
    },
    {
      id: 5,
      subject: "Geography",
      title: "Map Assignment - African Countries",
      dueDate: "2024-01-10",
      submittedDate: "2024-01-09",
      grade: "A-",
      description: "Label and color code African countries",
    },
  ],
}

const getStatusColor = (status: string) => {
  if (status === "In Progress") return "bg-blue-100 text-blue-800"
  if (status === "Not Started") return "bg-red-100 text-red-800"
  return "bg-green-100 text-green-800"
}

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Assignments</h1>
        <p className="text-muted-foreground">Track {mockAssignments.child}'s assignments and submissions</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending ({mockAssignments.pending.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({mockAssignments.completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {mockAssignments.pending.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <CardDescription>{assignment.subject}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(assignment.status)}>{assignment.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{assignment.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-semibold">{assignment.progress}%</span>
                  </div>
                  <Progress value={assignment.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                  <div
                    className={`text-sm font-semibold ${assignment.daysLeft <= 2 ? "text-red-600" : "text-amber-600"}`}
                  >
                    {assignment.daysLeft} days left
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {mockAssignments.completed.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <CardDescription>{assignment.subject}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Grade: {assignment.grade}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{assignment.description}</p>
                <div className="flex items-center gap-4 text-sm pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Submitted: {assignment.submittedDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
