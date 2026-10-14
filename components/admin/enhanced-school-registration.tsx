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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { addNewSchool } from "@/lib/admin-access-service"
import { Upload, X, Plus, Trash } from "lucide-react"
import Image from "next/image"

// Form schema with validation
const schoolFormSchema = z.object({
  // Basic Information
  name: z.string().min(3, { message: "School name must be at least 3 characters" }),
  motto: z.string().min(5, { message: "School motto is required and must be at least 5 characters" }),
  governmentId: z.string().min(3, { message: "Government identifier is required" }),

  // Contact Information
  address: z.string().min(5, { message: "School address is required" }),
  contactEmail: z.string().email({ message: "Please enter a valid email address" }),
  contactPhone: z.string().min(10, { message: "Please enter a valid phone number" }),
  website: z.string().optional(),

  // Leadership Information
  directorName: z.string().min(3, { message: "Director name is required" }),
  directorEmail: z.string().email({ message: "Please enter a valid email address" }),
  directorPhone: z.string().min(10, { message: "Please enter a valid phone number" }),

  headmasterName: z.string().min(3, { message: "Headmaster name is required" }),
  headmasterEmail: z.string().email({ message: "Please enter a valid email address" }),
  headmasterPhone: z.string().min(10, { message: "Please enter a valid phone number" }),

  // Additional Information
  establishedYear: z.string().min(4, { message: "Established year is required" }),
  schoolType: z.string().min(1, { message: "School type is required" }),
  additionalInfo: z.string().optional(),

  // Curriculum Selection
  curriculumOfferings: z.array(z.enum(["CBC", "IGCSE", "KCSE", "IB"])).min(1, { message: "Select at least one curriculum" }),
})

type SchoolFormValues = z.infer<typeof schoolFormSchema>

// Staff member type
interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department?: string
}

export function EnhancedSchoolRegistration() {
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTab, setCurrentTab] = useState("basic-info")
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [newStaffMember, setNewStaffMember] = useState<Partial<StaffMember>>({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
  })
  const [selectedCurricula, setSelectedCurricula] = useState<string[]>([])

  // Initialize form
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: "",
      motto: "",
      governmentId: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      directorName: "",
      directorEmail: "",
      directorPhone: "",
      headmasterName: "",
      headmasterEmail: "",
      headmasterPhone: "",
      establishedYear: "",
      schoolType: "",
      additionalInfo: "",
      curriculumOfferings: [],
    },
  })

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.includes("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file for the school logo",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo image must be less than 2MB",
          variant: "destructive",
        })
        return
      }

      setLogoFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Clear logo selection
  const clearLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  // Add staff member
  const addStaffMember = () => {
    if (!newStaffMember.name || !newStaffMember.email || !newStaffMember.phone || !newStaffMember.position) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required staff information",
        variant: "destructive",
      })
      return
    }

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaffMember.name || "",
      email: newStaffMember.email || "",
      phone: newStaffMember.phone || "",
      position: newStaffMember.position || "",
      department: newStaffMember.department,
    }

    setStaffMembers([...staffMembers, newStaff])
    setNewStaffMember({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
    })

    toast({
      title: "Staff Added",
      description: `${newStaff.name} has been added as ${newStaff.position}`,
    })
  }

  // Remove staff member
  const removeStaffMember = (id: string) => {
    setStaffMembers(staffMembers.filter((staff) => staff.id !== id))
  }

  // Form submission handler
  const onSubmit = async (data: SchoolFormValues) => {
    // Validate logo is provided
    if (!logoFile) {
      toast({
        title: "Logo Required",
        description: "School logo is required for registration",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, we would upload the logo to a storage service
      // For this demo, we'll use a placeholder URL
      const logoUrl = logoPreview || "/images/school-logos/default.png"

      // Add the school
      const success = addNewSchool({
        name: data.name,
        motto: data.motto,
        logo: logoUrl,
        address: data.address,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
      })

      if (success) {
        toast({
          title: "School Registered",
          description: `${data.name} has been successfully registered with ${staffMembers.length} staff members`,
        })

        // Reset form
        form.reset()
        clearLogo()
        setStaffMembers([])
        setCurrentTab("basic-info")
      }
    } catch (error) {
      console.error("Error registering school:", error)
      toast({
        title: "Registration Failed",
        description: "There was an error registering the school. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Navigate to next tab
  const goToNextTab = () => {
    if (currentTab === "basic-info") {
      if (!logoFile) {
        toast({
          title: "Logo Required",
          description: "School logo is required before proceeding",
          variant: "destructive",
        })
        return
      }
      setCurrentTab("contact-info")
    } else if (currentTab === "contact-info") {
      setCurrentTab("leadership-info")
    } else if (currentTab === "leadership-info") {
      setCurrentTab("staff-management")
    } else if (currentTab === "staff-management") {
      setCurrentTab("additional-info")
    }
  }

  // Navigate to previous tab
  const goToPrevTab = () => {
    if (currentTab === "contact-info") {
      setCurrentTab("basic-info")
    } else if (currentTab === "leadership-info") {
      setCurrentTab("contact-info")
    } else if (currentTab === "staff-management") {
      setCurrentTab("leadership-info")
    } else if (currentTab === "additional-info") {
      setCurrentTab("staff-management")
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Register New School</CardTitle>
        <CardDescription>Add a new school to the ShuleVerse platform. All fields are required.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                <TabsTrigger value="contact-info">Contact</TabsTrigger>
                <TabsTrigger value="leadership-info">Leadership</TabsTrigger>
                <TabsTrigger value="staff-management">Staff</TabsTrigger>
                <TabsTrigger value="additional-info">Additional</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic-info" className="space-y-6">
                {/* School Logo Upload */}
                <div className="space-y-2">
                  <FormLabel>School Logo</FormLabel>
                  <div className="flex items-center gap-4">
                    <div className="border-2 border-dashed rounded-lg p-4 w-40 h-40 flex flex-col items-center justify-center relative">
                      {logoPreview ? (
                        <>
                          <Image
                            src={logoPreview || "/placeholder.svg"}
                            alt="School Logo Preview"
                            width={120}
                            height={120}
                            className="object-contain"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white"
                            onClick={clearLogo}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 text-center">Upload school logo</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG (max 2MB)</p>
                        </>
                      )}

                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleLogoChange}
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <FormDescription>
                        The school logo is required and will be displayed throughout the platform. Choose a clear,
                        high-quality image that represents the school's identity.
                      </FormDescription>
                    </div>
                  </div>
                  {!logoPreview && <p className="text-sm font-medium text-destructive">School logo is required</p>}
                </div>

                {/* School Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* School Motto */}
                <FormField
                  control={form.control}
                  name="motto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Motto</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school motto" {...field} />
                      </FormControl>
                      <FormDescription>
                        The school motto is required and reflects the school's values and philosophy.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Government ID */}
                <FormField
                  control={form.control}
                  name="governmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Government Identifier</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter government registration number" {...field} />
                      </FormControl>
                      <FormDescription>
                        The official government registration number or identifier for the school.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* School Type */}
                <FormField
                  control={form.control}
                  name="schoolType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Primary, Secondary, Combined" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="button" onClick={goToNextTab}>
                    Next: Contact Information
                  </Button>
                </div>
              </TabsContent>

              {/* Contact Information Tab */}
              <TabsContent value="contact-info" className="space-y-6">
                {/* School Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter school address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input placeholder="school@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+255 123 456 789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Website */}
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.schoolwebsite.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Established Year */}
                <FormField
                  control={form.control}
                  name="establishedYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Established Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2005" {...field} />
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
                    Next: Leadership Information
                  </Button>
                </div>
              </TabsContent>

              {/* Leadership Information Tab */}
              <TabsContent value="leadership-info" className="space-y-6">
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-4">Director Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="directorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Director Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter director's full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="directorEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Director Email</FormLabel>
                            <FormControl>
                              <Input placeholder="director@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="directorPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Director Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+255 123 456 789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Headmaster Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="headmasterName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Headmaster Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter headmaster's full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="headmasterEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Headmaster Email</FormLabel>
                            <FormControl>
                              <Input placeholder="headmaster@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="headmasterPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Headmaster Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+255 123 456 789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Back
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next: Staff Management
                  </Button>
                </div>
              </TabsContent>

              {/* Staff Management Tab */}
              <TabsContent value="staff-management" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Add School Staff</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <FormLabel htmlFor="staffName">Name</FormLabel>
                      <Input
                        id="staffName"
                        placeholder="Full name"
                        value={newStaffMember.name}
                        onChange={(e) => setNewStaffMember({ ...newStaffMember, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor="staffEmail">Email</FormLabel>
                      <Input
                        id="staffEmail"
                        placeholder="Email address"
                        value={newStaffMember.email}
                        onChange={(e) => setNewStaffMember({ ...newStaffMember, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor="staffPhone">Phone</FormLabel>
                      <Input
                        id="staffPhone"
                        placeholder="Phone number"
                        value={newStaffMember.phone}
                        onChange={(e) => setNewStaffMember({ ...newStaffMember, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor="staffPosition">Position</FormLabel>
                      <Input
                        id="staffPosition"
                        placeholder="e.g., Teacher, Accountant"
                        value={newStaffMember.position}
                        onChange={(e) => setNewStaffMember({ ...newStaffMember, position: e.target.value })}
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor="staffDepartment">Department (Optional)</FormLabel>
                      <Input
                        id="staffDepartment"
                        placeholder="e.g., Mathematics, Admin"
                        value={newStaffMember.department}
                        onChange={(e) => setNewStaffMember({ ...newStaffMember, department: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="button" onClick={addStaffMember} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </Button>
                </div>

                {staffMembers.length > 0 && (
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">Added Staff Members ({staffMembers.length})</h3>
                    <div className="space-y-4">
                      {staffMembers.map((staff) => (
                        <div key={staff.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{staff.name}</p>
                            <p className="text-sm text-gray-500">
                              {staff.position} {staff.department ? `(${staff.department})` : ""}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{staff.email}</span>
                              <span>{staff.phone}</span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStaffMember(staff.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional information about the school"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any other relevant information about the school that may be useful.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Registering School..." : "Register School"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-gray-500">All fields including logo and motto are required for registration.</p>
      </CardFooter>
    </Card>
  )
}
