"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Upload, Download, Users, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react"

interface Student {
  name: string
  nemisId: string
  grade: string
  stream: string
  parentName: string
  parentEmail: string
  parentPhone: string
  dateOfBirth?: string
  gender?: string
  address?: string
}

const GRADES = [
  "Play Group",
  "PP1",
  "PP2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
]

const STREAMS = ["A", "B", "C", "D"]

const GENDERS = ["Male", "Female"]

export function StudentBulkUpload() {
  const [activeTab, setActiveTab] = useState("individual")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [parsedStudents, setParsedStudents] = useState<Student[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Individual student form state
  const [individualStudent, setIndividualStudent] = useState<Student>({
    name: "",
    nemisId: "",
    grade: "",
    stream: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  })

  const updateIndividualStudent = (field: keyof Student, value: string) => {
    setIndividualStudent((prev) => ({ ...prev, [field]: value }))
  }

  const generateCSVTemplate = () => {
    const headers = [
      "Student Name",
      "NEMIS ID",
      "Grade",
      "Stream",
      "Parent/Guardian Name",
      "Parent Email",
      "Parent Phone",
      "Date of Birth (YYYY-MM-DD)",
      "Gender",
      "Address",
    ]

    const sampleData = [
      [
        "John Doe",
        "12345678901",
        "Grade 5",
        "A",
        "Jane Doe",
        "jane.doe@email.com",
        "+254700000001",
        "2015-03-15",
        "Male",
        "123 Main Street, Nairobi",
      ],
      [
        "Mary Smith",
        "12345678902",
        "Grade 4",
        "B",
        "Robert Smith",
        "robert.smith@email.com",
        "+254700000002",
        "2016-07-22",
        "Female",
        "456 Oak Avenue, Mombasa",
      ],
      [
        "Peter Johnson",
        "",
        "PP2",
        "A",
        "Sarah Johnson",
        "sarah.johnson@email.com",
        "+254700000003",
        "2019-11-08",
        "Male",
        "789 Pine Road, Kisumu",
      ],
    ]

    const csvContent = [headers, ...sampleData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "student_upload_template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded. Fill it with student data and upload.",
    })
  }

  const parseCSVFile = (file: File): Promise<Student[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string
          const lines = csv.split("\n").filter((line) => line.trim())
          const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

          const students: Student[] = []
          const parseErrors: string[] = []

          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())

            if (values.length < 7) {
              parseErrors.push(`Row ${i + 1}: Insufficient data`)
              continue
            }

            const student: Student = {
              name: values[0] || "",
              nemisId: values[1] || "",
              grade: values[2] || "",
              stream: values[3] || "",
              parentName: values[4] || "",
              parentEmail: values[5] || "",
              parentPhone: values[6] || "",
              dateOfBirth: values[7] || "",
              gender: values[8] || "",
              address: values[9] || "",
            }

            // Validation
            if (!student.name) parseErrors.push(`Row ${i + 1}: Student name is required`)
            if (!student.grade) parseErrors.push(`Row ${i + 1}: Grade is required`)
            if (!student.stream) parseErrors.push(`Row ${i + 1}: Stream is required`)
            if (!student.parentName) parseErrors.push(`Row ${i + 1}: Parent name is required`)
            if (!student.parentPhone) parseErrors.push(`Row ${i + 1}: Parent phone is required`)

            // NEMIS ID validation for Grade 3+
            const gradeNumber = Number.parseInt(student.grade.replace(/\D/g, ""))
            if (gradeNumber >= 3 && !student.nemisId) {
              parseErrors.push(`Row ${i + 1}: NEMIS ID is required for ${student.grade}`)
            }

            // Email validation
            if (student.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.parentEmail)) {
              parseErrors.push(`Row ${i + 1}: Invalid email format`)
            }

            students.push(student)
          }

          if (parseErrors.length > 0) {
            setErrors(parseErrors)
          } else {
            setErrors([])
          }

          resolve(students)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      })
      return
    }

    setUploadedFile(file)

    try {
      const students = await parseCSVFile(file)
      setParsedStudents(students)

      toast({
        title: "File Parsed Successfully",
        description: `Found ${students.length} students in the file.`,
      })
    } catch (error) {
      toast({
        title: "Parse Error",
        description: "Failed to parse CSV file. Please check the format.",
        variant: "destructive",
      })
    }
  }

  const uploadStudents = async () => {
    if (parsedStudents.length === 0) {
      toast({
        title: "No Data",
        description: "Please upload a CSV file with student data first.",
        variant: "destructive",
      })
      return
    }

    if (errors.length > 0) {
      toast({
        title: "Validation Errors",
        description: "Please fix all validation errors before uploading.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      toast({
        title: "Upload Successful!",
        description: `Successfully uploaded ${parsedStudents.length} students to the system.`,
      })

      // Reset form
      setUploadedFile(null)
      setParsedStudents([])
      setErrors([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading students. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const registerIndividualStudent = async () => {
    // Validation
    const requiredFields = ["name", "grade", "stream", "parentName", "parentPhone"]
    const missingFields = requiredFields.filter((field) => !individualStudent[field as keyof Student])

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    // NEMIS ID validation for Grade 3+
    const gradeNumber = Number.parseInt(individualStudent.grade.replace(/\D/g, ""))
    if (gradeNumber >= 3 && !individualStudent.nemisId) {
      toast({
        title: "NEMIS ID Required",
        description: "NEMIS ID is required for Grade 3 and above.",
        variant: "destructive",
      })
      return
    }

    // Email validation
    if (individualStudent.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(individualStudent.parentEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Student Registered!",
        description: `${individualStudent.name} has been successfully registered.`,
      })

      // Reset form
      setIndividualStudent({
        name: "",
        nemisId: "",
        grade: "",
        stream: "",
        parentName: "",
        parentEmail: "",
        parentPhone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred while registering the student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <CardTitle>Student Registration</CardTitle>
        </div>
        <CardDescription>Register students individually or upload multiple students using a CSV file.</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Individual Registration</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  placeholder="Enter student's full name"
                  value={individualStudent.name}
                  onChange={(e) => updateIndividualStudent("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nemisId">NEMIS ID</Label>
                <Input
                  id="nemisId"
                  placeholder="Required for Grade 3+"
                  value={individualStudent.nemisId}
                  onChange={(e) => updateIndividualStudent("nemisId", e.target.value)}
                />
                <p className="text-xs text-gray-500">Required for Grade 3 and above</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Select
                  value={individualStudent.grade}
                  onValueChange={(value) => updateIndividualStudent("grade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream">Stream *</Label>
                <Select
                  value={individualStudent.stream}
                  onValueChange={(value) => updateIndividualStudent("stream", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent>
                    {STREAMS.map((stream) => (
                      <SelectItem key={stream} value={stream}>
                        Stream {stream}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={individualStudent.dateOfBirth}
                  onChange={(e) => updateIndividualStudent("dateOfBirth", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={individualStudent.gender}
                  onValueChange={(value) => updateIndividualStudent("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Student's home address"
                  value={individualStudent.address}
                  onChange={(e) => updateIndividualStudent("address", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                <Input
                  id="parentName"
                  placeholder="Enter parent's full name"
                  value={individualStudent.parentName}
                  onChange={(e) => updateIndividualStudent("parentName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentPhone">Parent Phone *</Label>
                <Input
                  id="parentPhone"
                  placeholder="+254 700 000 000"
                  value={individualStudent.parentPhone}
                  onChange={(e) => updateIndividualStudent("parentPhone", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="parentEmail">Parent Email</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  placeholder="parent@email.com"
                  value={individualStudent.parentEmail}
                  onChange={(e) => updateIndividualStudent("parentEmail", e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={registerIndividualStudent}
              disabled={isUploading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? "Registering..." : "Register Student"}
            </Button>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 1: Download Template</h3>
                <Button onClick={generateCSVTemplate} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </div>
              <Alert>
                <FileSpreadsheet className="h-4 w-4" />
                <AlertDescription>
                  Download the CSV template, fill it with student data, and upload it back to register multiple students
                  at once.
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 2: Upload Filled CSV</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Click to upload your filled CSV file or drag and drop</p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>

              {uploadedFile && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">File uploaded: {uploadedFile.name}</span>
                  <Badge variant="secondary">{parsedStudents.length} students</Badge>
                </div>
              )}
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Validation Errors:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {errors.slice(0, 10).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {errors.length > 10 && <li>... and {errors.length - 10} more errors</li>}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {parsedStudents.length > 0 && errors.length === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 3: Review and Upload</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Ready to upload {parsedStudents.length} students</span>
                  </div>
                  <div className="text-sm text-green-700">
                    All validation checks passed. Click "Upload Students" to proceed.
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading students...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                <Button
                  onClick={uploadStudents}
                  disabled={isUploading || errors.length > 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? "Uploading..." : `Upload ${parsedStudents.length} Students`}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
