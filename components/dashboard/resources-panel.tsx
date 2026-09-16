"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Download,
  Share2,
  MoreHorizontal,
  FolderOpen,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Resource {
  id: string
  name: string
  type: "document" | "image" | "spreadsheet" | "archive" | "other"
  size: string
  uploadedBy: string
  uploadDate: string
  category: string
  shared: boolean
}

export function ResourcesPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Mock data
  const resources: Resource[] = [
    {
      id: "res1",
      name: "Curriculum Guide 2023.pdf",
      type: "document",
      size: "2.4 MB",
      uploadedBy: "John Smith",
      uploadDate: "2023-05-10",
      category: "Curriculum",
      shared: true,
    },
    {
      id: "res2",
      name: "School Calendar.xlsx",
      type: "spreadsheet",
      size: "1.2 MB",
      uploadedBy: "Sarah Johnson",
      uploadDate: "2023-05-08",
      category: "Administration",
      shared: true,
    },
    {
      id: "res3",
      name: "Science Lab Equipment.jpg",
      type: "image",
      size: "3.5 MB",
      uploadedBy: "Michael Brown",
      uploadDate: "2023-05-05",
      category: "Science",
      shared: false,
    },
    {
      id: "res4",
      name: "Student Handbook.pdf",
      type: "document",
      size: "4.1 MB",
      uploadedBy: "Emily Davis",
      uploadDate: "2023-05-01",
      category: "Administration",
      shared: true,
    },
    {
      id: "res5",
      name: "Math Worksheets.zip",
      type: "archive",
      size: "8.7 MB",
      uploadedBy: "John Smith",
      uploadDate: "2023-04-28",
      category: "Mathematics",
      shared: true,
    },
    {
      id: "res6",
      name: "Field Trip Permission Forms.pdf",
      type: "document",
      size: "1.8 MB",
      uploadedBy: "Sarah Johnson",
      uploadDate: "2023-04-25",
      category: "Administration",
      shared: false,
    },
  ]

  // Filter resources based on search query and active tab
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "shared") return matchesSearch && resource.shared
    if (activeTab === "documents") return matchesSearch && resource.type === "document"
    if (activeTab === "media") return matchesSearch && (resource.type === "image" || resource.type === "archive")

    return matchesSearch
  })

  // Get icon based on resource type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "image":
        return <FileImage className="h-5 w-5 text-green-500" />
      case "spreadsheet":
        return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
      case "archive":
        return <FileArchive className="h-5 w-5 text-amber-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Access and manage educational resources</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload Resource
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-5rem)]">
        <div className="p-3 border-t border-b">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="h-[calc(100%-4rem)]">
          <div className="px-3 pt-2 border-b">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All Resources
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex-1">
                Documents
              </TabsTrigger>
              <TabsTrigger value="media" className="flex-1">
                Media
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="h-full overflow-auto p-0 m-0">
            {filteredResources.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getResourceIcon(resource.type)}
                          <span className="font-medium">{resource.name}</span>
                          {resource.shared && (
                            <Badge variant="outline" className="ml-2">
                              Shared
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{resource.category}</TableCell>
                      <TableCell>{resource.size}</TableCell>
                      <TableCell>{resource.uploadedBy}</TableCell>
                      <TableCell>{formatDate(resource.uploadDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem>Move</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-8">
                <div>
                  <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No resources found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? "No resources match your search criteria" : "Upload resources to see them here"}
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Resource
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
