"use client"

import { useState } from "react"
import { PlusCircle, Search, Download, Edit, MoreHorizontal, MapPin, Users, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for schools
const mockSchools = [
  {
    id: 1,
    name: "Sunshine Academy",
    location: "Nairobi, Kenya",
    type: "Primary",
    status: "Active",
    students: 450,
    teachers: 32,
    established: "2010-03-15",
    lastUpdated: "2023-05-10T14:30:00",
  },
  {
    id: 2,
    name: "Greenfield School",
    location: "Mombasa, Kenya",
    type: "Secondary",
    status: "Active",
    students: 620,
    teachers: 45,
    established: "2008-01-20",
    lastUpdated: "2023-05-12T09:15:00",
  },
  {
    id: 3,
    name: "Riverside International",
    location: "Kisumu, Kenya",
    type: "Combined",
    status: "Active",
    students: 830,
    teachers: 67,
    established: "2005-09-05",
    lastUpdated: "2023-05-14T11:45:00",
  },
  {
    id: 4,
    name: "Mountain View Academy",
    location: "Nakuru, Kenya",
    type: "Primary",
    status: "Inactive",
    students: 320,
    teachers: 24,
    established: "2012-06-10",
    lastUpdated: "2023-04-20T10:30:00",
  },
  {
    id: 5,
    name: "Lakeside School",
    location: "Eldoret, Kenya",
    type: "Secondary",
    status: "Active",
    students: 540,
    teachers: 38,
    established: "2009-11-15",
    lastUpdated: "2023-05-11T16:20:00",
  },
]

export function SchoolManagement() {
  const [schools, setSchools] = useState(mockSchools)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false)
  
  // Filter schools based on search term and filters
  const filteredSchools = schools.filter(school => {
    const matchesSearch = 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType ? school.type === selectedType : true
    const matchesStatus = selectedStatus ? school.status === selectedStatus : true
    
    return matchesSearch && matchesType && matchesStatus
  })
  
  const handleDeleteSchool = (schoolId: number) => {
    setSchools(schools.filter(school => school.id !== schoolId))
  }
  
  const handleToggleStatus = (schoolId: number) => {
    setSchools(schools.map(school => 
      school.id === schoolId 
        ? {...school, status: school.status === 'Active' ? 'Inactive' : 'Active'} 
        : school
    ))
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">School Management</CardTitle>
            <CardDescription>Manage all schools in the ShuleVerse platform</CardDescription>
          </div>
          <Dialog open={isAddSchoolOpen} onOpenChange={setIsAddSchoolOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                <span>Add School</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New School</DialogTitle>
                <DialogDescription>
                  Register a new school in the ShuleVerse system.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact Details</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      School Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      School Type
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="combined">Combined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="established" className="text-right">
                      Established Date
                    </Label>
                    <Input id="established" type="date" className="col-span-3" />
                  </div>
                </TabsContent>
                <TabsContent value="contact" className="space-y-4 pt-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input id="location" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" type="email" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input id="phone" type="tel" className="col-span-3" />
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="space-y-4 pt-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="modules" className="text-right">
                      Enabled Modules
                    </Label>
                    <div className="col-span-3 flex flex-wrap gap-2">
                      <Badge>Academic</Badge>
                      <Badge>Finance</Badge>
                      <Badge>Health</Badge>
                      <Badge>Counseling</Badge>
                      <Badge variant="outline">Transport</Badge>
                      <Badge variant="outline">Library</Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsAddSchoolOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddSchoolOpen(false)}>Register School</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schools..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select onValueChange={(value) => setSelectedType(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                  <SelectItem value="Combined">Combined</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setSelectedStatus(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Teachers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Established</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.length > 0 ? (
                  filteredSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{school.location}</span>
                      </TableCell>
                      <TableCell>{school.type}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{school.students}</span>
                      </TableCell>
                      <TableCell>{school.teachers}</TableCell>
                      <TableCell>
                        <Badge variant={school.status === 'Active' ? 'default' : 'secondary'}>
                          {school.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(school.established)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Edit size={16} />
                              <span>Edit School</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className=""
                            >\
