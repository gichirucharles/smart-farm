"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AppLogo } from "@/components/layout/app-logo"
import { SchoolLogo } from "@/components/layout/school-logo"
import { UserProfileHeader } from "@/components/layout/user-profile-header"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

interface AppHeaderProps {
  schoolName?: string
  schoolLogo?: string
  userRole?: string
  userName?: string
  userAvatar?: string
}

export function AppHeader({
  schoolName = "Demo School",
  schoolLogo = "/placeholder.svg?height=40&width=40",
  userRole,
  userName,
  userAvatar,
}: AppHeaderProps) {
  const pathname = usePathname()
  const isSystemAdmin = pathname?.includes("/admin/system")
  const isHomePage = pathname === "/"
  const isLoginPage =
    pathname?.includes("/login") || pathname?.includes("/parent-login") || pathname?.includes("/system-admin/login")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-[#b8d4f0]/95 to-[#a8c8e8]/95 backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-[#b8d4f0]/95 supports-[backdrop-filter]:to-[#a8c8e8]/95 border-white/30">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-[#1e3a8a] hover:bg-white/20">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[400px] bg-gradient-to-b from-[#b8d4f0] to-[#a8c8e8] text-[#1e3a8a] border-white/30"
            >
              <nav className="flex flex-col gap-4 py-4">
                {isSystemAdmin ? (
                  <>
                    <Link href="/admin/system" className="text-lg font-medium hover:text-[#f59e0b] transition-colors">
                      System Dashboard
                    </Link>
                    <Link
                      href="/admin/system/schools"
                      className="text-lg font-medium hover:text-[#f59e0b] transition-colors"
                    >
                      Manage Schools
                    </Link>
                    <Link
                      href="/admin/system/users"
                      className="text-lg font-medium hover:text-[#f59e0b] transition-colors"
                    >
                      Manage Users
                    </Link>
                    <Link
                      href="/admin/system/settings"
                      className="text-lg font-medium hover:text-[#f59e0b] transition-colors"
                    >
                      System Settings
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="text-lg font-medium hover:text-[#f59e0b] transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/students" className="text-lg font-medium hover:text-[#f59e0b] transition-colors">
                      Students
                    </Link>
                    <Link href="/teachers" className="text-lg font-medium hover:text-[#f59e0b] transition-colors">
                      Teachers
                    </Link>
                    <Link href="/classes" className="text-lg font-medium hover:text-[#f59e0b] transition-colors">
                      Classes
                    </Link>
                    <Link href="/reports" className="text-lg font-medium hover:text-[#f59e0b] transition-colors">
                      Reports
                    </Link>
                    <Link href="/settings" className="text-lg font-medium hover:text-[#f59e0b] transition-colors">
                      Settings
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Left side - ShuleVerse Logo (after login) */}
          {!isHomePage && !isLoginPage && (
            <div className="flex items-center">
              <AppLogo position="left" size="small" showText={true} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Right side - School Logo (after login, for non-system admin) */}
          {!isHomePage && !isLoginPage && !isSystemAdmin && schoolName && (
            <div className="hidden md:flex items-center">
              <SchoolLogo logoUrl={schoolLogo} schoolName={schoolName} size="small" />
            </div>
          )}

          {/* User Profile */}
          {userName && <UserProfileHeader name={userName} role={userRole || "User"} avatarUrl={userAvatar} />}
        </div>
      </div>
    </header>
  )
}
