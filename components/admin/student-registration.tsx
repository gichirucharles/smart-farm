"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"
import { User, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"

// Form schema with validation
const studentFormSchema = z.object({
  // Student Information
  firstName: z.string().min(2, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: "Last name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  admissionNumber: z.string().min(1, { message: "Admission number is required" }),
  grade: z.string().min(1, { message: "Grade/Class is required" }),
  stream: z.string().optional(),

  // Parent/Guardian Information (required)
  parentFirstName: z.string().min(2, { message: "Parent/Guardian first name is required" }),
  parentLastName: z.string().min(2, { message: "Parent/Guardian last name is required" }),
  relationship: z.string().min(1, { message: "Relationship to student is required" }),
  parentPhone: z.string().min(10, { message: "Valid phone number is required" }),
  parentEmail: z.string().email({ message: "Valid email is required" }),
  parentAddress: z.string().min(5, { message: "Address is required" }),

  // Emergency Contact
  emergencyContactName: z.string().min(2, { message: "Emergency contact name is required" }),
  emergencyContactPhone: z.string().min(10, { message: "Valid emergency phone is required" }),
  emergencyContactRelationship: z.string().min(1, { message: "Relationship is required" }),

  // Additional Information
  medicalInformation: z.string().optional(),
  additionalNotes: z.string().optional(),
})

type StudentFormValues = z.infer<typeof studentFormSchema>

export function StudentRegistration() {
  const [studentPhoto, setStudentPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTab, setCurrentTab] = useState("student-info")

  // Initialize form
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      admissionNumber: "",
      grade: "",
      stream: "",

      parentFirstName: "",
      parentLastName: "",
      relationship: "",
      parentPhone: "",
      parentEmail: "",
      parentAddress: "",

      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",

      medicalInformation: "",
      additionalNotes: "",
    },
  })

  // Handle photo file selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.includes("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file for the student photo",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Photo must be less than 2MB",
          variant: "destructive",
        })
        return
      }

      setStudentPhoto(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Clear photo selection
  const clearPhoto = () => {
    setStudentPhoto(null)
    setPhotoPreview(null)
  }

  // Form submission handler
  const onSubmit = async (data: StudentFormValues) => {
    // Validate photo is provided
    if (!studentPhoto) {
      toast({
        title: "Photo Required",
        description: "Student photo is required for registration",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, we would save the data to a database
      // For this demo, we'll just show a success message

      console.log("Student data:", data)
      console.log("Student photo:", studentPhoto)

      toast({
        title: "Student Registered",
        description: `${data.firstName} ${data.lastName} has been successfully registered`,
      })

      // Reset form
      form.reset()
      clearPhoto()
      setCurrentTab("student-info")
    } catch (error) {
      console.error("Error registering student:", error)
      toast({
        title: "Registration Failed",
        description: "There was an error registering the student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if all required fields in a tab are filled
  const isTabComplete = (tab: string) => {
    const formValues = form.getValues()

    switch (tab) {
      case "student-info":
        return (
          !!formValues.firstName &&
          !!formValues.lastName &&
          !!formValues.dateOfBirth &&
          !!formValues.gender &&
          !!formValues.admissionNumber &&
          !!formValues.grade &&
          !!studentPhoto
        )
      case "parent-info":
        return (
          !!formValues.parentFirstName &&
          !!formValues.parentLastName &&
          !!formValues.relationship &&
          !!formValues.parentPhone &&
          !!formValues.parentEmail &&
          !!formValues.parentAddress
        )
      case "emergency-info":
        return (
          !!formValues.emergencyContactName &&
          !!formValues.emergencyContactPhone &&
          !!formValues.emergencyContactRelationship
        )
      default:
        return true
    }
  }

  // Navigate to next tab
  const goToNextTab = () => {
    if (currentTab === "student-info") {
      if (!studentPhoto) {
        toast({
          title: "Photo Required",
          description: "Student photo is required before proceeding",
          variant: "destructive",
        })
        return
      }
      setCurrentTab("parent-info")
    } else if (currentTab === "parent-info") {
      setCurrentTab("emergency-info")
    } else if (currentTab === "emergency-info") {
      setCurrentTab("additional-info")
    }
  }

  // Navigate to previous tab
  const goToPrevTab = () => {
    if (currentTab === "parent-info") {
      setCurrentTab("student-info")
    } else if (currentTab === "emergency-info") {
      setCurrentTab("parent-info")
    } else if (currentTab === "additional-info") {
      setCurrentTab("emergency-info")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Student Registration</CardTitle>
        <CardDescription>Register a new student. All required fields must be completed.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="student-info">Student Information</TabsTrigger>
                <TabsTrigger value="parent-info">Parent/Guardian</TabsTrigger>
                <TabsTrigger value="emergency-info">Emergency Contact</TabsTrigger>
                <TabsTrigger value="additional-info">Additional Info</TabsTrigger>
              </TabsList>

              {/* Student Information Tab */}
              <TabsContent value="student-info" className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Required</AlertTitle>
                  <AlertDescription>All fields including student photo are required.</AlertDescription>
                </Alert>

                {/* Student Photo Upload */}
                <div className="space-y-2">
                  <FormLabel>Student Photo</FormLabel>
                  <div className="flex items-center gap-4">
                    <div className="border-2 border-dashed rounded-lg p-4 w-40 h-40 flex flex-col items-center justify-center relative">
                      {photoPreview ? (
                        <>
                          <Image
                            src={photoPreview || "/placeholder.svg"}
                            alt="Student Photo Preview"
                            width={120}
                            height={120}
                            className="object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white"
                            onClick={clearPhoto}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <User className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 text-center">Upload student photo</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG (max 2MB)</p>
                        </>
                      )}

                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handlePhotoChange}
                      />
                    </div>

                    <div className="flex-1">
                      <FormDescription>
                        A clear, recent photo of the student is required for identification purposes. The photo should
                        show the student's full face against a plain background.
                      </FormDescription>
                    </div>
                  </div>
                  {!photoPreview && <p className="text-sm font-medium text-destructive">Student photo is required</p>}
                </div>

                {/* Student Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Middle name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Student Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Admission Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="admissionNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admission Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., ADM2023001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade/Class</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stream"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stream (if applicable)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select stream" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={goToNextTab}>
                    Next: Parent/Guardian Information
                  </Button>
                </div>
              </TabsContent>

              {/* Parent/Guardian Information Tab */}
              <TabsContent value="parent-info" className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Required</AlertTitle>
                  <AlertDescription>Parent/Guardian information is required for all students.</AlertDescription>
                </Alert>

                {/* Parent/Guardian Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="parentFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Parent/Guardian first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parentLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Parent/Guardian last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Relationship and Contact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship to Student</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="father">Father</SelectItem>
                            <SelectItem value="mother">Mother</SelectItem>
                            <SelectItem value="guardian">Legal Guardian</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+255 123 456 789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parentEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="parent@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Address */}
                <FormField
                  control={form.control}
                  name="parentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter full address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Back
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next: Emergency Contact
                  </Button>
                </div>
              </TabsContent>

              {/* Emergency Contact Tab */}
              <TabsContent value="emergency-info" className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Required</AlertTitle>
                  <AlertDescription>Emergency contact information is required for all students.</AlertDescription>
                </Alert>

                {/* Emergency Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+255 123 456 789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="emergencyContactRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Student</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="grandparent">Grandparent</SelectItem>
                          <SelectItem value="relative">Other Relative</SelectItem>
                          <SelectItem value="neighbor">Neighbor</SelectItem>
                          <SelectItem value="friend">Family Friend</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Back
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next: Additional Information
                  </Button>
                </div>
              </TabsContent>

              {/* Additional Information Tab */}
              <TabsContent value="additional-info" className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="medical">
                    <AccordionTrigger>Medical Information (Optional)</AccordionTrigger>
                    <AccordionContent>
                      <FormField
                        control={form.control}
                        name="medicalInformation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medical Information</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter any relevant medical information, allergies, or conditions"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Include any allergies, medical conditions, or medications that the school should be aware
                              of.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="notes">
                    <AccordionTrigger>Additional Notes (Optional)</AccordionTrigger>
                    <AccordionContent>
                      <FormField
                        control={form.control}
                        name="additionalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter any additional information" {...field} />
                            </FormControl>
                            <FormDescription>
                              Any other information that may be relevant to the student's education or care.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Registering Student..." : "Register Student"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-gray-500">Student registration requires a photo and parent/guardian information.</p>
      </CardFooter>
    </Card>
  )
}
