"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const UserProfileHeader = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userSchoolId, setUserSchoolId] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null)
  const [impersonating, setImpersonating] = useState<boolean>(false)

  useEffect(() => {
    // Load user data from localStorage
    setUserId(localStorage.getItem("userId"))
    setUserRole(localStorage.getItem("userRole"))
    setImpersonating(localStorage.getItem("impersonating") === "true")

    // Get school info if available
    const schoolId = localStorage.getItem("userSchoolId")
    setUserSchoolId(schoolId)

    if (schoolId && typeof window !== "undefined") {
      try {
        const schoolsData = localStorage.getItem("shuleverse_schools")
        if (schoolsData) {
          const schools = JSON.parse(schoolsData)
          const school = schools.find((s: any) => s.id === schoolId)
          if (school) {
            setSchoolName(school.name)
            setSchoolLogo(school.logo)
          }
        }
      } catch (error) {
        console.error("Error loading school info:", error)
      }
    }

    // Get user name from localStorage if available
    const usersData = localStorage.getItem("shuleverse_users")
    if (usersData) {
      try {
        const users = JSON.parse(usersData)
        const user = users.find((u: any) => u.id === userId)
        if (user) {
          setUserName(user.name)
        }
      } catch (error) {
        console.error("Error loading user info:", error)
      }
    }
  }, [userId, userSchoolId])

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userSchoolId")
    localStorage.removeItem("impersonating")
    localStorage.removeItem("currentAdmin")

    // Redirect to home page
    window.location.href = "/"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={schoolLogo || "/placeholder.svg"} alt={schoolName || "User"} />
            <AvatarFallback>{userName?.slice(0, 2).toUpperCase() || "UV"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/profile" className="w-full h-full block">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings" className="w-full h-full block">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
