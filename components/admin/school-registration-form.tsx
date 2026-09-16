"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { School, Users, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react"

interface StaffMember {
  id: string
  name: string
  position: string
  email: string
  phone: string
}

interface SchoolData {
  // Basic Information
  schoolName: string
  schoolType: string
  governmentId: string
  registrationNumber: string
  motto: string
  logo: File | null

  // Contact Information
  address: string
  city: string
  county: string
  postalCode: string
  phone: string
  email: string
  website: string

  // Leadership
  directorName: string
  directorEmail: string
  directorPhone: string
  headmasterName: string
  headmasterEmail: string
  headmasterPhone: string

  // Staff
  staff: StaffMember[]

  // Additional Information
  establishedYear: string
  studentCapacity: string
  description: string
}

const SCHOOL_TYPES = [
  "Public Primary",
  "Private Primary",
  "Public Secondary",
  "Private Secondary",
  "Mixed (Primary & Secondary)",
  "Special Needs",
  "Technical/Vocational",
]

const STAFF_POSITIONS = [
  "Deputy Head Teacher",
  "Class Teacher",
  "Subject Teacher",
  "School Nurse",
  "School Counselor",
  "Librarian",
  "ICT Coordinator",
  "Sports Coordinator",
  "Accountant",
  "Secretary",
  "Security Guard",
  "Cleaner",
  "Cook",
]

const KENYAN_COUNTIES = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
]

export function SchoolRegistrationForm() {
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [schoolData, setSchoolData] = useState<SchoolData>({
    schoolName: "",
    schoolType: "",
    governmentId: "",
    registrationNumber: "",
    motto: "",
    logo: null,
    address: "",
    city: "",
    county: "",
    postalCode: "",
    phone: "",
    email: "",
    website: "",
    directorName: "",
    directorEmail: "",
    directorPhone: "",
    headmasterName: "",
    headmasterEmail: "",
    headmasterPhone: "",
    staff: [],
    establishedYear: "",
    studentCapacity: "",
    description: "",
  })

  const updateSchoolData = (field: keyof SchoolData, value: any) => {
    setSchoolData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addStaffMember = () => {
    const newStaff: StaffMember = {
      id: `staff_${Date.now()}`,
      name: "",
      position: "",
      email: "",
      phone: "",
    }
    updateSchoolData("staff", [...schoolData.staff, newStaff])
  }

  const updateStaffMember = (id: string, field: keyof StaffMember, value: string) => {
    const updatedStaff = schoolData.staff.map((staff) => (staff.id === id ? { ...staff, [field]: value } : staff))
    updateSchoolData("staff", updatedStaff)
  }

  const removeStaffMember = (id: string) => {
    const updatedStaff = schoolData.staff.filter((staff) => staff.id !== id)
    updateSchoolData("staff", updatedStaff)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        setErrors((prev) => ({ ...prev, logo: "Logo file size must be less than 2MB" }))
        return
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, logo: "Please upload a valid image file" }))
        return
      }
      updateSchoolData("logo", file)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Basic Information validation
    if (!schoolData.schoolName.trim()) newErrors.schoolName = "School name is required"
    if (!schoolData.schoolType) newErrors.schoolType = "School type is required"
    if (!schoolData.governmentId.trim()) newErrors.governmentId = "Government ID is required"
    if (!schoolData.motto.trim()) newErrors.motto = "School motto is required"
    if (!schoolData.logo) newErrors.logo = "School logo is required"

    // Contact Information validation
    if (!schoolData.address.trim()) newErrors.address = "Address is required"
    if (!schoolData.city.trim()) newErrors.city = "City is required"
    if (!schoolData.county) newErrors.county = "County is required"
    if (!schoolData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!schoolData.email.trim()) newErrors.email = "Email is required"

    // Leadership validation
    if (!schoolData.directorName.trim()) newErrors.directorName = "Director name is required"
    if (!schoolData.directorEmail.trim()) newErrors.directorEmail = "Director email is required"
    if (!schoolData.directorPhone.trim()) newErrors.directorPhone = "Director phone is required"
    if (!schoolData.headmasterName.trim()) newErrors.headmasterName = "Headmaster name is required"
    if (!schoolData.headmasterEmail.trim()) newErrors.headmasterEmail = "Headmaster email is required"
    if (!schoolData.headmasterPhone.trim()) newErrors.headmasterPhone = "Headmaster phone is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (schoolData.email && !emailRegex.test(schoolData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (schoolData.directorEmail && !emailRegex.test(schoolData.directorEmail)) {
      newErrors.directorEmail = "Please enter a valid email address"
    }
    if (schoolData.headmasterEmail && !emailRegex.test(schoolData.headmasterEmail)) {
      newErrors.headmasterEmail = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "School Registered Successfully!",
        description: `${schoolData.schoolName} has been registered in the system.`,
      })

      // Reset form
      setSchoolData({
        schoolName: "",
        schoolType: "",
        governmentId: "",
        registrationNumber: "",
        motto: "",
        logo: null,
        address: "",
        city: "",
        county: "",
        postalCode: "",
        phone: "",
        email: "",
        website: "",
        directorName: "",
        directorEmail: "",
        directorPhone: "",
        headmasterName: "",
        headmasterEmail: "",
        headmasterPhone: "",
        staff: [],
        establishedYear: "",
        studentCapacity: "",
        description: "",
      })
      setActiveTab("basic")
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred while registering the school. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <School className="h-6 w-6 text-blue-600" />
          <CardTitle>School Registration</CardTitle>
        </div>
        <CardDescription>
          Register a new school in the ShuleVerse system. All fields marked with * are required.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name *</Label>
                <Input
                  id="schoolName"
                  placeholder="Enter school name"
                  value={schoolData.schoolName}
                  onChange={(e) => updateSchoolData("schoolName", e.target.value)}
                />
                {errors.schoolName && <p className="text-sm text-red-500">{errors.schoolName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolType">School Type *</Label>
                <Select value={schoolData.schoolType} onValueChange={(value) => updateSchoolData("schoolType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHOOL_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.schoolType && <p className="text-sm text-red-500">{errors.schoolType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="governmentId">Government ID/NEMIS Code *</Label>
                <Input
                  id="governmentId"
                  placeholder="Enter government identifier"
                  value={schoolData.governmentId}
                  onChange={(e) => updateSchoolData("governmentId", e.target.value)}
                />
                {errors.governmentId && <p className="text-sm text-red-500">{errors.governmentId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  placeholder="Enter registration number"
                  value={schoolData.registrationNumber}
                  onChange={(e) => updateSchoolData("registrationNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="motto">School Motto *</Label>
                <Input
                  id="motto"
                  placeholder="Enter school motto"
                  value={schoolData.motto}
                  onChange={(e) => updateSchoolData("motto", e.target.value)}
                />
                {errors.motto && <p className="text-sm text-red-500">{errors.motto}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="logo">School Logo *</Label>
                <div className="flex items-center gap-4">
                  <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="flex-1" />
                  {schoolData.logo && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Logo uploaded
                    </Badge>
                  )}
                </div>
                {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}
                <p className="text-xs text-gray-500">Upload school logo (max 2MB, image files only)</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Physical Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete physical address"
                  value={schoolData.address}
                  onChange={(e) => updateSchoolData("address", e.target.value)}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City/Town *</Label>
                <Input
                  id="city"
                  placeholder="Enter city or town"
                  value={schoolData.city}
                  onChange={(e) => updateSchoolData("city", e.target.value)}
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="county">County *</Label>
                <Select value={schoolData.county} onValueChange={(value) => updateSchoolData("county", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {KENYAN_COUNTIES.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.county && <p className="text-sm text-red-500">{errors.county}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="Enter postal code"
                  value={schoolData.postalCode}
                  onChange={(e) => updateSchoolData("postalCode", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+254 700 000 000"
                  value={schoolData.phone}
                  onChange={(e) => updateSchoolData("phone", e.target.value)}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="school@example.com"
                  value={schoolData.email}
                  onChange={(e) => updateSchoolData("email", e.target.value)}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  placeholder="https://www.school.com"
                  value={schoolData.website}
                  onChange={(e) => updateSchoolData("website", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leadership" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Director Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="directorName">Full Name *</Label>
                  <Input
                    id="directorName"
                    placeholder="Enter director's full name"
                    value={schoolData.directorName}
                    onChange={(e) => updateSchoolData("directorName", e.target.value)}
                  />
                  {errors.directorName && <p className="text-sm text-red-500">{errors.directorName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="directorEmail">Email Address *</Label>
                  <Input
                    id="directorEmail"
                    type="email"
                    placeholder="director@school.com"
                    value={schoolData.directorEmail}
                    onChange={(e) => updateSchoolData("directorEmail", e.target.value)}
                  />
                  {errors.directorEmail && <p className="text-sm text-red-500">{errors.directorEmail}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="directorPhone">Phone Number *</Label>
                  <Input
                    id="directorPhone"
                    placeholder="+254 700 000 000"
                    value={schoolData.directorPhone}
                    onChange={(e) => updateSchoolData("directorPhone", e.target.value)}
                  />
                  {errors.directorPhone && <p className="text-sm text-red-500">{errors.directorPhone}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Head Teacher Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headmasterName">Full Name *</Label>
                  <Input
                    id="headmasterName"
                    placeholder="Enter head teacher's full name"
                    value={schoolData.headmasterName}
                    onChange={(e) => updateSchoolData("headmasterName", e.target.value)}
                  />
                  {errors.headmasterName && <p className="text-sm text-red-500">{errors.headmasterName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headmasterEmail">Email Address *</Label>
                  <Input
                    id="headmasterEmail"
                    type="email"
                    placeholder="headteacher@school.com"
                    value={schoolData.headmasterEmail}
                    onChange={(e) => updateSchoolData("headmasterEmail", e.target.value)}
                  />
                  {errors.headmasterEmail && <p className="text-sm text-red-500">{errors.headmasterEmail}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headmasterPhone">Phone Number *</Label>
                  <Input
                    id="headmasterPhone"
                    placeholder="+254 700 000 000"
                    value={schoolData.headmasterPhone}
                    onChange={(e) => updateSchoolData("headmasterPhone", e.target.value)}
                  />
                  {errors.headmasterPhone && <p className="text-sm text-red-500">{errors.headmasterPhone}</p>}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Staff Members</h3>
              <Button onClick={addStaffMember} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </div>

            {schoolData.staff.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No staff members added yet. Click "Add Staff Member" to add school staff.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {schoolData.staff.map((staff) => (
                  <Card key={staff.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          placeholder="Enter full name"
                          value={staff.name}
                          onChange={(e) => updateStaffMember(staff.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Position</Label>
                        <Select
                          value={staff.position}
                          onValueChange={(value) => updateStaffMember(staff.id, "position", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            {STAFF_POSITIONS.map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="staff@school.com"
                          value={staff.email}
                          onChange={(e) => updateStaffMember(staff.id, "email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="+254 700 000 000"
                            value={staff.phone}
                            onChange={(e) => updateStaffMember(staff.id, "phone", e.target.value)}
                          />
                          <Button variant="outline" size="icon" onClick={() => removeStaffMember(staff.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="additional" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="establishedYear">Year Established</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  placeholder="2020"
                  value={schoolData.establishedYear}
                  onChange={(e) => updateSchoolData("establishedYear", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentCapacity">Student Capacity</Label>
                <Input
                  id="studentCapacity"
                  type="number"
                  placeholder="500"
                  value={schoolData.studentCapacity}
                  onChange={(e) => updateSchoolData("studentCapacity", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">School Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the school, its mission, vision, and values..."
                  value={schoolData.description}
                  onChange={(e) => updateSchoolData("description", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {
              const tabs = ["basic", "contact", "leadership", "staff", "additional"]
              const currentIndex = tabs.indexOf(activeTab)
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1])
              }
            }}
            disabled={activeTab === "basic"}
          >
            Previous
          </Button>

          {activeTab === "additional" ? (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Registering..." : "Register School"}
            </Button>
          ) : (
            <Button
              onClick={() => {
                const tabs = ["basic", "contact", "leadership", "staff", "additional"]
                const currentIndex = tabs.indexOf(activeTab)
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1])
                }
              }}
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
