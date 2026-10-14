"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Download, Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function StudentBulkRegistration() {
  const [activeTab, setActiveTab] = useState("individual")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<string[][]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Handle CSV file upload
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file type
      if (!file.name.endsWith(".csv")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        })
        return
      }

      setCsvFile(file)

      // Read and preview the CSV file
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const rows = text.split("\n").map((row) => row.split(","))
        setPreviewData(rows.slice(0, 5)) // Preview first 5 rows
      }
      reader.readAsText(file)
    }
  }

  // Clear CSV file
  const clearCsvFile = () => {
    setCsvFile(null)
    setPreviewData([])
    setUploadSuccess(false)
  }

  // Download CSV template
  const downloadCsvTemplate = () => {
    const headers = "Student Name,NEMIS ID,Grade,Stream,Parent/Guardian Name,Parent Email,Parent Phone\n"
    const sampleData =
      "John Doe,NEM12345,Grade 3,A,Jane Doe,parent@example.com,+255123456789\n" +
      "Mary Smith,NEM67890,Grade 5,B,Robert Smith,robert@example.com,+255987654321"

    const blob = new Blob([headers + sampleData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "student_upload_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded successfully",
    })
  }

  // Process bulk upload
  const processBulkUpload = () => {
    if (!csvFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Simulate processing
    setTimeout(() => {
      setIsUploading(false)
      setUploadSuccess(true)

      toast({
        title: "Upload Successful",
        description: "Students have been registered successfully",
      })
    }, 2000)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Student Registration</CardTitle>
        <CardDescription>Register students individually or upload in bulk</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Individual Registration</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-4 pt-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Required Fields</AlertTitle>
              <AlertDescription>All fields marked with * are required.</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Student Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="First name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" placeholder="Middle name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Last name" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input id="dateOfBirth" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nemisId">NEMIS ID (Grade 3+) *</Label>
                  <Input id="nemisId" placeholder="Government student ID" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Class *</Label>
                  <Select>
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="playgroup">Play Group</SelectItem>
                      <SelectItem value="nursery">Nursery</SelectItem>
                      <SelectItem value="kg1">KG 1</SelectItem>
                      <SelectItem value="kg2">KG 2</SelectItem>
                      <SelectItem value="grade1">Grade 1</SelectItem>
                      <SelectItem value="grade2">Grade 2</SelectItem>
                      <SelectItem value="grade3">Grade 3</SelectItem>
                      <SelectItem value="grade4">Grade 4</SelectItem>
                      <SelectItem value="grade5">Grade 5</SelectItem>
                      <SelectItem value="grade6">Grade 6</SelectItem>
                      <SelectItem value="grade7">Grade 7</SelectItem>
                      <SelectItem value="grade8">Grade 8</SelectItem>
                      <SelectItem value="grade9">Grade 9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream">Stream</Label>
                  <Select>
                    <SelectTrigger id="stream">
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Parent/Guardian Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                  <Input id="parentName" placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship to Student *</Label>
                  <Select>
                    <SelectTrigger id="relationship">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Legal Guardian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Email Address *</Label>
                  <Input id="parentEmail" type="email" placeholder="parent@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Phone Number *</Label>
                  <Input id="parentPhone" placeholder="+255 123 456 789" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentAddress">Residential Address *</Label>
                <Textarea id="parentAddress" placeholder="Enter full address" />
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full">Register Student</Button>
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6 pt-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Bulk Upload Instructions</AlertTitle>
              <AlertDescription>
                Download the CSV template, fill in the student details, and upload the completed file. All students must
                have the required fields completed.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col md:flex-row gap-4">
              <Button onClick={downloadCsvTemplate} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download CSV Template
              </Button>

              <div className="flex-1">
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center relative">
                  {csvFile ? (
                    <div className="w-full text-center">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="font-medium">{csvFile.name}</p>
                      <p className="text-sm text-gray-500">{(csvFile.size / 1024).toFixed(2)} KB</p>
                      <Button type="button" variant="ghost" size="sm" onClick={clearCsvFile} className="mt-2">
                        <X className="h-4 w-4 mr-2" />
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <>
                      <FileText className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <p className="text-xs text-gray-400 mt-1">CSV files only</p>
                    </>
                  )}
                  <Input
                    type="file"
                    accept=".csv"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleCsvUpload}
                  />
                </div>
              </div>
            </div>

            {previewData.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">File Preview</h3>
                <div className="border rounded-md overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {previewData[0].map((header, index) => (
                          <TableHead key={index}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.slice(1).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-sm text-gray-500">Showing preview of first {previewData.length - 1} rows</p>
              </div>
            )}

            {csvFile && (
              <Button onClick={processBulkUpload} disabled={isUploading || uploadSuccess} className="w-full">
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-pulse" />
                    Uploading...
                  </>
                ) : uploadSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Upload Complete
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Students
                  </>
                )}
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">Need help? Contact the system administrator at admin@shuleverse.com</p>
      </CardFooter>
    </Card>
  )
}
