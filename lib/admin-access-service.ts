"use client"

import { toast } from "@/components/ui/use-toast"

// Types for school and user data
export interface School {
  id: string
  name: string
  logo: string
  motto: string
  address: string
  contactEmail: string
  contactPhone: string
  registrationDate: string
}

export interface UserCredential {
  id: string
  schoolId: string
  username: string
  role: string
  name: string
  email: string
  lastLogin: string
}

// Mock data store - in a real app, this would be a database
const SCHOOLS_STORAGE_KEY = "shuleverse_schools"
const USERS_STORAGE_KEY = "shuleverse_users"

// Initialize storage with mock data if empty
const initializeStorage = () => {
  if (typeof window === "undefined") return

  // Initialize schools if not exists
  if (!localStorage.getItem(SCHOOLS_STORAGE_KEY)) {
    const initialSchools: School[] = [
      {
        id: "school-1",
        name: "Sunshine Academy",
        logo: "/images/school-logos/sunshine-academy.png",
        motto: "Enlightening Minds, Empowering Futures",
        address: "123 Education Lane, Knowledge City",
        contactEmail: "info@sunshineacademy.edu",
        contactPhone: "+255 123 456 789",
        registrationDate: "2023-01-15",
      },
      {
        id: "school-2",
        name: "Horizon International School",
        logo: "/images/school-logos/horizon-international.png",
        motto: "Expanding Horizons, Building Leaders",
        address: "456 Learning Avenue, Wisdom Town",
        contactEmail: "contact@horizonschool.edu",
        contactPhone: "+255 987 654 321",
        registrationDate: "2023-03-22",
      },
    ]
    localStorage.setItem(SCHOOLS_STORAGE_KEY, JSON.stringify(initialSchools))
  }

  // Initialize users if not exists
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    const initialUsers: UserCredential[] = [
      {
        id: "user-1",
        schoolId: "school-1",
        username: "headteacher1",
        role: "head-teacher",
        name: "John Smith",
        email: "john.smith@sunshineacademy.edu",
        lastLogin: "2023-05-10T08:30:00",
      },
      {
        id: "user-2",
        schoolId: "school-1",
        username: "teacher1",
        role: "teacher",
        name: "Sarah Johnson",
        email: "sarah.johnson@sunshineacademy.edu",
        lastLogin: "2023-05-09T14:15:00",
      },
      {
        id: "user-3",
        schoolId: "school-2",
        username: "director2",
        role: "director",
        name: "Michael Brown",
        email: "michael.brown@horizonschool.edu",
        lastLogin: "2023-05-08T10:45:00",
      },
    ]
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers))
  }
}

// Get all schools
export const getAllSchools = (): School[] => {
  if (typeof window === "undefined") return []

  initializeStorage()
  const schoolsData = localStorage.getItem(SCHOOLS_STORAGE_KEY)
  return schoolsData ? JSON.parse(schoolsData) : []
}

// Get all users
export const getAllUsers = (): UserCredential[] => {
  if (typeof window === "undefined") return []

  initializeStorage()
  const usersData = localStorage.getItem(USERS_STORAGE_KEY)
  return usersData ? JSON.parse(usersData) : []
}

// Get users by school
export const getUsersBySchool = (schoolId: string): UserCredential[] => {
  const allUsers = getAllUsers()
  return allUsers.filter((user) => user.schoolId === schoolId)
}

// System admin login as another user
export const systemAdminLoginAs = (userId: string): boolean => {
  try {
    const allUsers = getAllUsers()
    const user = allUsers.find((u) => u.id === userId)

    if (!user) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      })
      return false
    }

    // Store original admin info to allow switching back
    const currentAdmin = localStorage.getItem("currentAdmin")
    if (!currentAdmin) {
      localStorage.setItem(
        "currentAdmin",
        JSON.stringify({
          id: localStorage.getItem("userId"),
          role: "system-admin",
        }),
      )
    }

    // Set the user data for the impersonated user
    localStorage.setItem("userId", user.id)
    localStorage.setItem("userRole", user.role)
    localStorage.setItem("userSchoolId", user.schoolId)
    localStorage.setItem("impersonating", "true")

    toast({
      title: "Success",
      description: `Now logged in as ${user.name} (${user.role})`,
    })

    return true
  } catch (error) {
    console.error("Error during login as:", error)
    toast({
      title: "Error",
      description: "Failed to login as selected user",
      variant: "destructive",
    })
    return false
  }
}

// Return to system admin account
export const returnToAdminAccount = (): boolean => {
  try {
    const currentAdmin = localStorage.getItem("currentAdmin")

    if (!currentAdmin) {
      toast({
        title: "Error",
        description: "No admin account to return to",
        variant: "destructive",
      })
      return false
    }

    const adminData = JSON.parse(currentAdmin)

    // Restore admin data
    localStorage.setItem("userId", adminData.id)
    localStorage.setItem("userRole", adminData.role)
    localStorage.removeItem("userSchoolId")
    localStorage.removeItem("impersonating")
    localStorage.removeItem("currentAdmin")

    toast({
      title: "Success",
      description: "Returned to system administrator account",
    })

    return true
  } catch (error) {
    console.error("Error returning to admin account:", error)
    toast({
      title: "Error",
      description: "Failed to return to admin account",
      variant: "destructive",
    })
    return false
  }
}

// Add a new school with validation
export const addNewSchool = (schoolData: Omit<School, "id" | "registrationDate">): boolean => {
  try {
    // Validate required fields
    if (!schoolData.logo || !schoolData.motto) {
      toast({
        title: "Validation Error",
        description: "School logo and motto are required",
        variant: "destructive",
      })
      return false
    }

    const schools = getAllSchools()

    // Create new school with ID and registration date
    const newSchool: School = {
      ...schoolData,
      id: `school-${Date.now()}`,
      registrationDate: new Date().toISOString().split("T")[0],
    }

    // Save to storage
    localStorage.setItem(SCHOOLS_STORAGE_KEY, JSON.stringify([...schools, newSchool]))

    toast({
      title: "Success",
      description: `${newSchool.name} has been added successfully`,
    })

    return true
  } catch (error) {
    console.error("Error adding school:", error)
    toast({
      title: "Error",
      description: "Failed to add school",
      variant: "destructive",
    })
    return false
  }
}
