"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { addNewSchool } from "@/lib/admin-access-service"
import { Upload, X } from "lucide-react"
import Image from "next/image"

// Form schema with validation
const schoolFormSchema = z.object({
  name: z.string().min(3, { message: "School name must be at least 3 characters" }),
  motto: z.string().min(5, { message: "School motto is required and must be at least 5 characters" }),
  address: z.string().min(5, { message: "School address is required" }),
  contactEmail: z.string().email({ message: "Please enter a valid email address" }),
  contactPhone: z.string().min(10, { message: "Please enter a valid phone number" }),
})

type SchoolFormValues = z.infer<typeof schoolFormSchema>

export function SchoolRegistration() {
  const router = useRouter()
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: "",
      motto: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
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
          description: `${data.name} has been successfully registered`,
        })

        // Reset form
        form.reset()
        clearLogo()

        // Redirect to schools list
        router.push("/admin/system/schools")
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Register New School</CardTitle>
        <CardDescription>Add a new school to the ShuleVerse platform. All fields are required.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering School..." : "Register School"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-gray-500">All fields including logo and motto are required for registration.</p>
      </CardFooter>
    </Card>
  )
}
