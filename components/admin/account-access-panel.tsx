"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  type School,
  type UserCredential,
  getAllSchools,
  getUsersBySchool,
  systemAdminLoginAs,
  returnToAdminAccount,
} from "@/lib/admin-access-service"
import { Search, LogIn, ArrowLeft, SchoolIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AccountAccessPanel() {
  const router = useRouter()
  const [schools, setSchools] = useState<School[]>([])
  const [selectedSchool, setSelectedSchool] = useState<string>("")
  const [users, setUsers] = useState<UserCredential[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isImpersonating, setIsImpersonating] = useState(false)

  const handleLoginAs = (userId: string) => {
    const success = systemAdminLoginAs(userId)
    if (success) {
      setIsImpersonating(true)

      // Find the user to get their role for redirection
      const user = users.find((u) => u.id === userId)
      if (user) {
        // Redirect to appropriate dashboard based on role
        switch (user.role) {
          case "head-teacher":
            router.push("/admin/head-teacher")
            break
          case "deputy-head":
            router.push("/admin/deputy-head")
            break
          case "teacher":
            router.push("/admin/teacher")
            break
          case "class-teacher":
            router.push("/admin/class-teacher")
            break
          case "director":
            router.push("/admin/director")
            break
          case "accountant":
            router.push("/admin/accountant")
            break
          case "nurse":
            router.push("/admin/nurse")
            break
          case "counselor":
            router.push("/admin/counselor")
            break
          default:
            router.push("/admin-select")
        }
      }
    }
  }

  useEffect(() => {
    // Load schools
    const allSchools = getAllSchools()
    setSchools(allSchools)

    // Check if currently impersonating
    const impersonating = localStorage.getItem("impersonating") === "true"
    setIsImpersonating(impersonating)
  }, [router])

  useEffect(() => {
    if (selectedSchool) {
      const schoolUsers = getUsersBySchool(selectedSchool)
      setUsers(schoolUsers)
    } else {
      setUsers([])
    }
  }, [selectedSchool])

  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value)
    setSearchTerm("")
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleReturnToAdmin = () => {
    const success = returnToAdminAccount()
    if (success) {
      setIsImpersonating(false)
      router.push("/admin/system")
    }
  }

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format role for display
  const formatRole = (role: string) => {
    return role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Account Access Management</CardTitle>
        <CardDescription>Access any user account across all schools in the ShuleVerse system</CardDescription>
      </CardHeader>

      <CardContent>
        {isImpersonating ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-center">
              <div className="mr-4 text-amber-500">
                <LogIn className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-amber-800">Currently impersonating another user</h3>
                <p className="text-sm text-amber-700">
                  You are currently logged in as another user. Any actions you take will be performed as this user.
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent" onClick={handleReturnToAdmin}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to System Administrator Account
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="school">Select School</Label>
              <Select onValueChange={handleSchoolChange} value={selectedSchool}>
                <SelectTrigger id="school">
                  <SelectValue placeholder="Select a school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSchool && (
              <div className="space-y-4">
                <div className="flex items-center border rounded-md px-3 py-2">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <Input
                    placeholder="Search users by name, username, email, or role..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border-0 p-0 shadow-none focus-visible:ring-0"
                  />
                </div>

                {filteredUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{formatRole(user.role)}</Badge>
                          </TableCell>
                          <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" onClick={() => handleLoginAs(user.id)}>
                              <LogIn className="h-4 w-4 mr-1" />
                              Login As
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? (
                      <p>No users found matching your search criteria</p>
                    ) : (
                      <div className="flex flex-col items-center">
                        <SchoolIcon className="h-12 w-12 text-gray-300 mb-2" />
                        <p>No users found for this school</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      {!isImpersonating && (
        <CardFooter className="text-sm text-gray-500 border-t pt-4">
          <p>
            As a System Administrator, you have the ability to access any user account. All actions performed while
            logged in as another user will be logged for security purposes.
          </p>
        </CardFooter>
      )}
    </Card>
  )
}
