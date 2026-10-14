"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function AdminSetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSetupAdmin = async () => {
    setIsLoading(true)
    setMessage("")
    setIsSuccess(false)

    try {
      const response = await fetch("/api/setup/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        setMessage(
          "System admin user created successfully! You can now login with charlesmuiruri024@gmail.com and password Maryalvin1985@",
        )
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("Failed to setup admin user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b8d4f0] via-[#a8c8e8] to-[#98bce0] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle>System Admin Setup</CardTitle>
          <CardDescription>Initialize the system administrator account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-medium">Setup Information</p>
            <p className="text-sm text-blue-800 mt-2">
              <strong>Email:</strong> charlesmuiruri024@gmail.com
            </p>
            <p className="text-sm text-blue-800">
              <strong>Password:</strong> Maryalvin1985@
            </p>
          </div>

          {message && (
            <Alert variant={isSuccess ? "default" : "destructive"}>
              {isSuccess ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleSetupAdmin} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              "Create Admin User"
            )}
          </Button>

          <p className="text-xs text-gray-600 text-center">
            Click the button above to create the system administrator account. You can then login at /system-admin/login
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
