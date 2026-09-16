"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  UserPlus,
  Calendar,
  Clock,
  AlertCircle,
  Activity,
  FileText,
  Plus,
  MoreHorizontal,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function SickBayVisits() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false)

  // Mock data for sick bay visits
  const sickBayVisits = [
    {
      id: "visit1",
      studentName: "Ahmed Mohamed",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "Grade 5A",
      timeIn: "2023-06-15T09:30:00",
      timeOut: "2023-06-15T10:15:00",
      complaint: "Headache",
      treatment: "Paracetamol 500mg",
      status: "discharged",
      temperature: 37.2,
      notes: "Student reported having a headache since morning. Given paracetamol and rested for 45 minutes.",
    },
    {
      id: "visit2",
      studentName: "Mary Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "Grade 3B",
      timeIn: "2023-06-15T10:45:00",
      timeOut: null,
      complaint: "Stomachache",
      treatment: "Antacid",
      status: "under-observation",
      temperature: 36.8,
      notes: "Student complained of stomachache after break time. Given antacid and currently under observation.",
    },
    {
      id: "visit3",
      studentName: "James Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "Grade 7A",
      timeIn: "2023-06-15T08:15:00",
      timeOut: "2023-06-15T08:45:00",
      complaint: "Minor cut on finger",
      treatment: "Antiseptic and bandage",
      status: "discharged",
      temperature: 36.5,
      notes: "Student had a minor cut on index finger. Wound cleaned with antiseptic and bandaged.",
    },
    {
      id: "visit4",
      studentName: "Fatima Ahmed",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "Grade 4C",
      timeIn: "2023-06-14T13:20:00",
      timeOut: "2023-06-14T14:00:00",
      complaint: "Fever",
      treatment: "Paracetamol 250mg",
      status: "discharged",
      temperature: 38.1,
      notes: "Student had fever and was given paracetamol. Parents were called and advised to monitor at home.",
    },
    {
      id: "visit5",
      studentName: "Daniel Okafor",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "Grade 6B",
      timeIn: "2023-06-15T11:10:00",
      timeOut: null,
      complaint: "Sprained ankle",
      treatment: "Ice pack and rest",
      status: "under-observation",
      temperature: 36.7,
      notes: "Student sprained ankle during PE. Applied ice pack and elevated leg. Parents have been notified.",
    },
  ]

  // Mock data for statistics
  const visitStatistics = {
    totalVisits: 127,
    todayVisits: 5,
    currentInSickBay: 2,
    commonComplaints: [
      { name: "Headache", value: 42 },
      { name: "Stomachache", value: 35 },
      { name: "Minor Injuries", value: 28 },
      { name: "Fever", value: 15 },
      { name: "Other", value: 7 },
    ],
    visitsByClass: [
      { class: "Grade 1", visits: 12 },
      { class: "Grade 2", visits: 15 },
      { class: "Grade 3", visits: 18 },
      { class: "Grade 4", visits: 22 },
      { class: "Grade 5", visits: 19 },
      { class: "Grade 6", visits: 16 },
      { class: "Grade 7", visits: 14 },
      { class: "Grade 8", visits: 11 },
    ],
    visitsByDay: [
      { day: "Monday", visits: 28 },
      { day: "Tuesday", visits: 22 },
      { day: "Wednesday", visits: 25 },
      { day: "Thursday", visits: 30 },
      { day: "Friday", visits: 22 },
    ],
  }

  // Colors for pie chart
  const COLORS = ["#4f46e5", "#22c55e", "#eab308", "#f97316", "#ef4444"]

  // Filter visits based on search query and class
  const filteredVisits = sickBayVisits.filter((visit) => {
    const matchesSearch =
      visit.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.complaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.treatment.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesClass = selectedClass === "all" || visit.class === selectedClass

    return matchesSearch && matchesClass
  })

  // Format date and time
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "-"
    const date = new Date(dateTimeString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Calculate duration between time in and time out
  const calculateDuration = (timeIn: string, timeOut: string | null) => {
    if (!timeOut) return "Still in sick bay"

    const start = new Date(timeIn).getTime()
    const end = new Date(timeOut).getTime()
    const diffMinutes = Math.round((end - start) / (1000 * 60))

    if (diffMinutes < 60) {
      return `${diffMinutes} mins`
    } else {
      const hours = Math.floor(diffMinutes / 60)
      const mins = diffMinutes % 60
      return `${hours}h ${mins}m`
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Sick Bay Visits</CardTitle>
            <CardDescription>Manage and monitor student visits to the sick bay</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setIsAddVisitOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Visit
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all-visits">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all-visits">All Visits</TabsTrigger>
            <TabsTrigger value="current">Current Patients</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="all-visits">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Visits</p>
                      <p className="text-2xl font-bold">{visitStatistics.totalVisits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-green-100 p-2">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Today's Visits</p>
                      <p className="text-2xl font-bold">{visitStatistics.todayVisits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-amber-100 p-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Currently In Sick Bay</p>
                      <p className="text-2xl font-bold">{visitStatistics.currentInSickBay}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search visits..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="Grade 3B">Grade 3B</SelectItem>
                    <SelectItem value="Grade 4C">Grade 4C</SelectItem>
                    <SelectItem value="Grade 5A">Grade 5A</SelectItem>
                    <SelectItem value="Grade 6B">Grade 6B</SelectItem>
                    <SelectItem value="Grade 7A">Grade 7A</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Time Out</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={visit.avatar || "/placeholder.svg"} alt={visit.studentName} />
                            <AvatarFallback>{visit.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{visit.studentName}</div>
                            <div className="text-xs text-muted-foreground">{visit.class}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{visit.complaint}</div>
                        <div className="text-xs">Temp: {visit.temperature}°C</div>
                      </TableCell>
                      <TableCell>{formatDateTime(visit.timeIn)}</TableCell>
                      <TableCell>{visit.timeOut ? formatDateTime(visit.timeOut) : "-"}</TableCell>
                      <TableCell>{calculateDuration(visit.timeIn, visit.timeOut)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={visit.status === "discharged" ? "outline" : "default"}
                          className={
                            visit.status === "under-observation"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-400"
                              : "bg-green-100 text-green-800 hover:bg-green-100 border-green-400"
                          }
                        >
                          {visit.status === "discharged" ? "Discharged" : "Under Observation"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Clock className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Contact Parents
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="current">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sickBayVisits
                .filter((visit) => visit.timeOut === null)
                .map((visit) => (
                  <Card key={visit.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={visit.avatar || "/placeholder.svg"} alt={visit.studentName} />
                            <AvatarFallback>{visit.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{visit.studentName}</CardTitle>
                            <CardDescription>{visit.class}</CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-400">Under Observation</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Complaint</p>
                            <p className="font-medium">{visit.complaint}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Temperature</p>
                            <p className="font-medium">{visit.temperature}°C</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Time In</p>
                            <p className="font-medium">{formatDateTime(visit.timeIn)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Treatment</p>
                            <p className="font-medium">{visit.treatment}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="text-sm">{visit.notes}</p>
                        </div>

                        <div className="flex justify-between">
                          <Button variant="outline" size="sm">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Contact Parents
                          </Button>
                          <Button size="sm">Discharge Student</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {sickBayVisits.filter((visit) => visit.timeOut === null).length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Students Currently in Sick Bay</h3>
                  <p className="text-muted-foreground">All students have been discharged.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Common Complaints</CardTitle>
                  <CardDescription>Distribution of sick bay visits by complaint type</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={visitStatistics.commonComplaints}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {visitStatistics.commonComplaints.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visits by Class</CardTitle>
                  <CardDescription>Number of sick bay visits by class</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitStatistics.visitsByClass}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="class" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="visits" name="Number of Visits" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Visits by Day</CardTitle>
                  <CardDescription>Number of sick bay visits by day of the week</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitStatistics.visitsByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="visits" name="Number of Visits" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isAddVisitOpen} onOpenChange={setIsAddVisitOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Sick Bay Visit</DialogTitle>
              <DialogDescription>Record a new student visit to the sick bay</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <Select>
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student1">Ahmed Mohamed (Grade 5A)</SelectItem>
                    <SelectItem value="student2">Mary Johnson (Grade 3B)</SelectItem>
                    <SelectItem value="student3">James Wilson (Grade 7A)</SelectItem>
                    <SelectItem value="student4">Fatima Ahmed (Grade 4C)</SelectItem>
                    <SelectItem value="student5">Daniel Okafor (Grade 6B)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complaint">Complaint</Label>
                  <Input id="complaint" placeholder="e.g. Headache" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input id="temperature" type="number" step="0.1" placeholder="37.0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment Given</Label>
                <Input id="treatment" placeholder="e.g. Paracetamol 500mg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional observations or instructions..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddVisitOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddVisitOpen(false)}>Add Visit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
