"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  FileText,
  UserPlus,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

interface StaffMember {
  id: string
  name: string
  avatar?: string
  position: string
  department: string
  email: string
  phone: string
  status: "active" | "on-leave" | "inactive"
  joinDate: string
  performance: number
  classes: string[]
  subjects: string[]
}

export function StaffManagement() {
  const [activeTab, setActiveTab] = useState("all-staff")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [isLeaveRequestOpen, setIsLeaveRequestOpen] = useState(false)

  // Mock staff data
  const staffMembers: StaffMember[] = [
    {
      id: "staff1",
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Head Teacher",
      department: "Administration",
      email: "john.smith@school.edu",
      phone: "+255 123 456 789",
      status: "active",
      joinDate: "2020-01-15",
      performance: 92,
      classes: ["Grade 5A", "Grade 6B"],
      subjects: ["Mathematics"],
    },
    {
      id: "staff2",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Senior Teacher",
      department: "English",
      email: "sarah.johnson@school.edu",
      phone: "+255 234 567 890",
      status: "active",
      joinDate: "2020-03-10",
      performance: 88,
      classes: ["Grade 5A", "Grade 6B", "Grade 7A"],
      subjects: ["English"],
    },
    {
      id: "staff3",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Teacher",
      department: "Science",
      email: "michael.brown@school.edu",
      phone: "+255 345 678 901",
      status: "on-leave",
      joinDate: "2021-02-05",
      performance: 85,
      classes: ["Grade 3A", "Grade 4B"],
      subjects: ["Science"],
    },
    {
      id: "staff4",
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Teacher",
      department: "Mathematics",
      email: "emily.davis@school.edu",
      phone: "+255 456 789 012",
      status: "active",
      joinDate: "2021-05-20",
      performance: 90,
      classes: ["Grade 1A", "Grade 2B"],
      subjects: ["Mathematics"],
    },
    {
      id: "staff5",
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Teacher",
      department: "Social Studies",
      email: "david.wilson@school.edu",
      phone: "+255 567 890 123",
      status: "inactive",
      joinDate: "2019-08-15",
      performance: 78,
      classes: ["Grade 8A", "Grade 9B"],
      subjects: ["Social Studies", "History"],
    },
    {
      id: "staff6",
      name: "Jennifer Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Teacher",
      department: "Art",
      email: "jennifer.lee@school.edu",
      phone: "+255 678 901 234",
      status: "active",
      joinDate: "2022-01-10",
      performance: 86,
      classes: ["Grade 3A", "Grade 4B", "Grade 5A"],
      subjects: ["Art"],
    },
  ]

  // Mock leave requests
  const leaveRequests = [
    {
      id: "leave1",
      staffName: "Michael Brown",
      staffAvatar: "/placeholder.svg?height=40&width=40",
      position: "Teacher",
      department: "Science",
      type: "Sick Leave",
      startDate: "2023-06-15",
      endDate: "2023-06-20",
      reason: "Medical treatment",
      status: "pending",
      submittedDate: "2023-06-10",
    },
    {
      id: "leave2",
      staffName: "Jennifer Lee",
      staffAvatar: "/placeholder.svg?height=40&width=40",
      position: "Teacher",
      department: "Art",
      type: "Annual Leave",
      startDate: "2023-07-01",
      endDate: "2023-07-15",
      reason: "Family vacation",
      status: "approved",
      submittedDate: "2023-06-05",
    },
    {
      id: "leave3",
      staffName: "David Wilson",
      staffAvatar: "/placeholder.svg?height=40&width=40",
      position: "Teacher",
      department: "Social Studies",
      type: "Personal Leave",
      startDate: "2023-06-25",
      endDate: "2023-06-27",
      reason: "Personal matters",
      status: "rejected",
      submittedDate: "2023-06-18",
    },
  ]

  // Filter staff based on search query and department
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = selectedDepartment === "all" || staff.department === selectedDepartment
    const matchesTab =
      activeTab === "all-staff" ||
      (activeTab === "active" && staff.status === "active") ||
      (activeTab === "on-leave" && staff.status === "on-leave") ||
      (activeTab === "inactive" && staff.status === "inactive")

    return matchesSearch && matchesDepartment && matchesTab
  })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "on-leave":
        return <Badge variant="outline">On Leave</Badge>
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Staff Management</CardTitle>
              <CardDescription>Manage school staff and faculty</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => setIsAddStaffOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
              <Button variant="outline" onClick={() => setIsLeaveRequestOpen(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Leave Requests
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-staff" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all-staff">All Staff</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="on-leave">On Leave</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Social Studies">Social Studies</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                              <AvatarFallback>{staff.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{staff.name}</div>
                              <div className="text-xs text-gray-500">{staff.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{staff.position}</TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>{getStatusBadge(staff.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={staff.performance} className="h-2 w-16" />
                            <span className="text-sm">{staff.performance}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {staff.classes.slice(0, 2).map((cls, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {cls}
                              </Badge>
                            ))}
                            {staff.classes.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{staff.classes.length - 2}
                              </Badge>
                            )}
                          </div>
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
                                <FileText className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" />
                                View Schedule
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Performance Review
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Deactivate
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
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Staff Dialog */}
      <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>Enter the details of the new staff member</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@school.edu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+255 123 456 789" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="head-teacher">Head Teacher</SelectItem>
                    <SelectItem value="deputy-head">Deputy Head</SelectItem>
                    <SelectItem value="senior-teacher">Senior Teacher</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="assistant-teacher">Assistant Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administration">Administration</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="social-studies">Social Studies</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="join-date">Join Date</Label>
              <Input id="join-date" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStaffOpen(false)}>
              Cancel
            </Button>
            <Button>Add Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Requests Dialog */}
      <Dialog open={isLeaveRequestOpen} onOpenChange={setIsLeaveRequestOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Staff Leave Requests</DialogTitle>
            <DialogDescription>Manage and approve staff leave requests</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={request.staffAvatar || "/placeholder.svg"} alt={request.staffName} />
                          <AvatarFallback>{request.staffName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{request.staffName}</div>
                          <div className="text-xs text-gray-500">{request.department}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.ceil(
                          (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(request.submittedDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <span>{getStatusBadge(request.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button variant="default" size="sm">
                              Approve
                            </Button>
                            <Button variant="destructive" size="sm">
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
