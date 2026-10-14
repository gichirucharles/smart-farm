"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Search, Filter, MoreHorizontal, Mail, UserPlus, Download, Edit, Trash, UserCog } from "lucide-react"

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

export function DirectorStaffManagement() {
  const [activeTab, setActiveTab] = useState("all-staff")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)

  // Mock staff data
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
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
      position: "Deputy Head",
      department: "Administration",
      email: "david.wilson@school.edu",
      phone: "+255 567 890 123",
      status: "active",
      joinDate: "2019-08-15",
      performance: 91,
      classes: [],
      subjects: ["Administration"],
    },
    {
      id: "staff6",
      name: "Jennifer Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Accountant",
      department: "Finance",
      email: "jennifer.lee@school.edu",
      phone: "+255 678 901 234",
      status: "active",
      joinDate: "2022-01-10",
      performance: 86,
      classes: [],
      subjects: ["Finance"],
    },
  ])

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
      (activeTab === "teachers" && staff.position.includes("Teacher")) ||
      (activeTab === "administration" && staff.department === "Administration") ||
      (activeTab === "support" && !staff.position.includes("Teacher") && staff.department !== "Administration")

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

  // Handle edit staff
  const handleEditStaff = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setIsEditStaffOpen(true)
  }

  // Handle delete staff
  const handleDeleteStaff = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setIsDeleteConfirmOpen(true)
  }

  // Confirm delete staff
  const confirmDeleteStaff = () => {
    if (selectedStaff) {
      setStaffMembers(staffMembers.filter((staff) => staff.id !== selectedStaff.id))
      toast({
        title: "Staff Removed",
        description: `${selectedStaff.name} has been removed from the system.`,
      })
      setIsDeleteConfirmOpen(false)
      setSelectedStaff(null)
    }
  }

  // Save edited staff
  const saveEditedStaff = () => {
    if (selectedStaff) {
      setStaffMembers(staffMembers.map((staff) => (staff.id === selectedStaff.id ? selectedStaff : staff)))
      toast({
        title: "Staff Updated",
        description: `${selectedStaff.name}'s information has been updated.`,
      })
      setIsEditStaffOpen(false)
      setSelectedStaff(null)
    }
  }

  // Add new staff
  const addNewStaff = () => {
    const newStaff: StaffMember = {
      id: `staff${staffMembers.length + 1}`,
      name: "New Staff Member",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Teacher",
      department: "General",
      email: "new.staff@school.edu",
      phone: "+255 123 456 789",
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      performance: 80,
      classes: [],
      subjects: [],
    }

    setStaffMembers([...staffMembers, newStaff])
    setSelectedStaff(newStaff)
    setIsAddStaffOpen(false)
    setIsEditStaffOpen(true)

    toast({
      title: "Staff Added",
      description: "New staff member has been added. Please complete their information.",
    })
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
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-staff" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all-staff">All Staff</TabsTrigger>
                <TabsTrigger value="teachers">Teachers</TabsTrigger>
                <TabsTrigger value="administration">Administration</TabsTrigger>
                <TabsTrigger value="support">Support Staff</TabsTrigger>
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
                    <SelectItem value="Finance">Finance</SelectItem>
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
                        <TableCell>
                          <Badge
                            variant={
                              staff.status === "active"
                                ? "default"
                                : staff.status === "on-leave"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {staff.status === "active"
                              ? "Active"
                              : staff.status === "on-leave"
                                ? "On Leave"
                                : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className={
                                staff.performance >= 90
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : staff.performance >= 80
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                              }
                            >
                              {staff.performance}%
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {staff.classes.length > 0 ? (
                              <>
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
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">None assigned</span>
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
                              <DropdownMenuItem onClick={() => handleEditStaff(staff)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Staff
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserCog className="h-4 w-4 mr-2" />
                                Assign Classes
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteStaff(staff)}>
                                <Trash className="h-4 w-4 mr-2" />
                                Remove Staff
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
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="secretary">Secretary</SelectItem>
                    <SelectItem value="librarian">Librarian</SelectItem>
                    <SelectItem value="it-admin">IT Administrator</SelectItem>
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
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Social Studies">Social Studies</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Library">Library</SelectItem>
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
            <Button onClick={addNewStaff}>Add Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditStaffOpen} onOpenChange={setIsEditStaffOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update the details of {selectedStaff?.name}</DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedStaff.name}
                    onChange={(e) => setSelectedStaff({ ...selectedStaff, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <Select
                    value={selectedStaff.position}
                    onValueChange={(value) => setSelectedStaff({ ...selectedStaff, position: value })}
                  >
                    <SelectTrigger id="edit-position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Head Teacher">Head Teacher</SelectItem>
                      <SelectItem value="Deputy Head">Deputy Head</SelectItem>
                      <SelectItem value="Senior Teacher">Senior Teacher</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Accountant">Accountant</SelectItem>
                      <SelectItem value="Secretary">Secretary</SelectItem>
                      <SelectItem value="Librarian">Librarian</SelectItem>
                      <SelectItem value="IT Administrator">IT Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedStaff.email}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={selectedStaff.phone}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Select
                    value={selectedStaff.department}
                    onValueChange={(value) => setSelectedStaff({ ...selectedStaff, department: value })}
                  >
                    <SelectTrigger id="edit-department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Social Studies">Social Studies</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Library">Library</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={selectedStaff.status}
                    onValueChange={(value: "active" | "on-leave" | "inactive") =>
                      setSelectedStaff({ ...selectedStaff, status: value })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditStaffOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedStaff}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Staff Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedStaff?.name} from the system? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteStaff}>
              Remove Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
