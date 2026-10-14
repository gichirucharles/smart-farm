"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, BarChart3 } from "lucide-react"

interface AssignmentResultsModalProps {
  isOpen: boolean
  onClose: () => void
  assignmentData: {
    id: string
    title: string
    subject: string
    class: string
    dueDate: string
    totalPoints: number
    averageScore: number
    highestScore: number
    lowestScore: number
    submissionRate: number
    results: Array<{
      studentId: string
      studentName: string
      studentAvatar?: string
      score: number
      grade: string
      submissionDate: string
      status: "submitted" | "late" | "missing"
    }>
  }
}

export function AssignmentResultsModal({ isOpen, onClose, assignmentData }: AssignmentResultsModalProps) {
  if (!assignmentData) return null

  // Calculate grade distribution
  const gradeDistribution = {
    A: assignmentData.results.filter((r) => r.grade === "A").length,
    B: assignmentData.results.filter((r) => r.grade === "B").length,
    C: assignmentData.results.filter((r) => r.grade === "C").length,
    D: assignmentData.results.filter((r) => r.grade === "D").length,
    F: assignmentData.results.filter((r) => r.grade === "F").length,
    Missing: assignmentData.results.filter((r) => r.status === "missing").length,
  }

  const totalStudents = assignmentData.results.length

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{assignmentData.title}</DialogTitle>
          <DialogDescription>
            {assignmentData.subject} | {assignmentData.class} | Due: {assignmentData.dueDate}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="results">Student Results</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {assignmentData.averageScore}/{assignmentData.totalPoints}
                  </div>
                  <Progress
                    value={(assignmentData.averageScore / assignmentData.totalPoints) * 100}
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Submission Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{assignmentData.submissionRate}%</div>
                  <Progress value={assignmentData.submissionRate} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Score Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Lowest</p>
                      <p className="text-xl font-bold">{assignmentData.lowestScore}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Highest</p>
                      <p className="text-xl font-bold">{assignmentData.highestScore}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Grade Distribution</CardTitle>
                    <CardDescription>Distribution of grades across the class</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(gradeDistribution).map(([grade, count]) => (
                    <div key={grade} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge
                            variant={
                              grade === "A" || grade === "B"
                                ? "default"
                                : grade === "C" || grade === "D"
                                  ? "outline"
                                  : "destructive"
                            }
                            className="mr-2"
                          >
                            {grade}
                          </Badge>
                          <span className="text-sm">{count} students</span>
                        </div>
                        <span className="text-sm font-medium">
                          {totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0}%
                        </span>
                      </div>
                      <Progress value={totalStudents > 0 ? (count / totalStudents) * 100 : 0} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Student Results</CardTitle>
                    <CardDescription>Individual student performance</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download Results
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Submission</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignmentData.results.map((result) => (
                      <TableRow key={result.studentId}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={result.studentAvatar || "/placeholder.svg"} alt={result.studentName} />
                              <AvatarFallback>{result.studentName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{result.studentName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {result.status !== "missing" ? `${result.score}/${assignmentData.totalPoints}` : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              result.grade === "A" || result.grade === "B"
                                ? "default"
                                : result.grade === "C" || result.grade === "D"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {result.status !== "missing" ? result.grade : "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>{result.status !== "missing" ? result.submissionDate : "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              result.status === "submitted"
                                ? "default"
                                : result.status === "late"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {result.status === "submitted" ? "On Time" : result.status === "late" ? "Late" : "Missing"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance Analytics</CardTitle>
                <CardDescription>Detailed analysis of assignment results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 border rounded-md">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Performance Distribution</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Detailed analytics charts will be displayed here, showing score distribution, comparison with
                      previous assignments, and performance trends.
                    </p>
                    <Button className="mt-4" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Detailed Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
