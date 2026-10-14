"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, MapPin, Phone, Mail, Link2, FileText, Search, Filter, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SchoolManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")

  // Mock school data
  const schools = [
    {
      id: "sch001",
      name: "Unity Primary School",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Dar es Salaam",
      region: "Coastal",
      headTeacher: "Dr. Michael Johnson",
      studentsCount: 856,
      teachersCount: 42,
      performanceIndex: 87,
      status: "active",
      contactEmail: "info@unityprimary.edu.tz",
      contactPhone: "+255 22 123 4567",
      website: "https://unityprimary.edu.tz",
      establishedYear: 2005,
    },
    {
      id: "sch002",
      name: "Excellence Academy",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Arusha",
      region: "Northern",
      headTeacher: "Mrs. Sarah Kimathi",
      studentsCount: 1045,
      teachersCount: 56,
      performanceIndex: 92,
      status: "active",
      contactEmail: "info@excellenceacademy.edu.tz",
      contactPhone: "+255 27 456 7890",
      website: "https://excellenceacademy.edu.tz",
      establishedYear: 2008,
    },
    {
      id: "sch003",
      name: "Heritage International School",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Mwanza",
      region: "Lake",
      headTeacher: "Mr. James Omondi",
      studentsCount: 723,
      teachersCount: 38,
      performanceIndex: 85,
      status: "active",
      contactEmail: "info@heritage.edu.tz",
      contactPhone: "+255 28 345 6789",
      website: "https://heritage.edu.tz",
      establishedYear: 2010,
    },
    {
      id: "sch004",
      name: "Pioneer Secondary School",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Dodoma",
      region: "Central",
      headTeacher: "Dr. Elizabeth Mkapa",
      studentsCount: 912,
      teachersCount: 47,
      performanceIndex: 89,
      status: "active",
      contactEmail: "info@pioneersecondary.edu.tz",
      contactPhone: "+255 26 789 0123",
      website: "https://pioneersecondary.edu.tz",
      establishedYear: 2003,
    },
    {
      id: "sch005",
      name: "Greenview Primary School",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Tanga",
      region: "Northern",
      headTeacher: "Mr. Thomas Nyerere",
      studentsCount: 678,
      teachersCount: 34,
      performanceIndex: 82,
      status: "under review",
      contactEmail: "info@greenview.edu.tz",
      contactPhone: "+255 27 234 5678",
      website: "https://greenview.edu.tz",
      establishedYear: 2012,
    },
    {
      id: "sch006",
      name: "Lakeside International School",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Kigoma",
      region: "Western",
      headTeacher: "Mrs. Hannah Abubakar",
      studentsCount: 589,
      teachersCount: 31,
      performanceIndex: 84,
      status: "active",
      contactEmail: "info@lakeside.edu.tz",
      contactPhone: "+255 28 567 8901",
      website: "https://lakeside.edu.tz",
      establishedYear: 2014,
    },
  ]

  // Filter schools based on search query and region
  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.headTeacher.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRegion = selectedRegion === "all" || school.region === selectedRegion

    return matchesSearch && matchesRegion
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>School Management</CardTitle>
            <CardDescription>Manage and monitor all schools in the network</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button>Add New School</Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schools..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Coastal">Coastal</SelectItem>
              <SelectItem value="Northern">Northern</SelectItem>
              <SelectItem value="Lake">Lake</SelectItem>
              <SelectItem value="Central">Central</SelectItem>
              <SelectItem value="Western">Western</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Teachers</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={school.logo || "/placeholder.svg"} alt={school.name} />
                        <AvatarFallback>{school.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{school.name}</div>
                        <div className="text-xs text-gray-500">{school.headTeacher}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span>
                        {school.location}, {school.region}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{school.studentsCount}</TableCell>
                  <TableCell>{school.teachersCount}</TableCell>
                  <TableCell>
                    <Badge variant={school.performanceIndex >= 85 ? "default" : "outline"}>
                      {school.performanceIndex}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={school.status === "active" ? "default" : "outline"}
                      className={
                        school.status === "under review"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-400"
                          : ""
                      }
                    >
                      {school.status === "active" ? "Active" : "Under Review"}
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
                          <Mail className="mr-2 h-4 w-4" />
                          Contact School
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" />
                          {school.contactPhone}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link2 className="mr-2 h-4 w-4" />
                          Visit Website
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
