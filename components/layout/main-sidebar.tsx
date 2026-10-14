"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  FileText,
  Home,
  LogIn,
  MessageSquare,
  Settings,
  UserPlus,
  Users,
  School,
  BookOpenCheck,
  Stethoscope,
  HeartHandshake,
  Calculator,
  UserCog,
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAllRoles } from "@/lib/roles-config"

interface SidebarProps {
  className?: string
}

export function MainSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    admin: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  // Role icons mapping
  const roleIcons: Record<string, React.ReactNode> = {
    "system-admin": <ShieldCheck className="h-4 w-4" />,
    "head-teacher": <School className="h-4 w-4" />,
    "deputy-head": <BookOpenCheck className="h-4 w-4" />,
    "class-teacher": <Users className="h-4 w-4" />,
    teacher: <BookOpen className="h-4 w-4" />,
    director: <UserCog className="h-4 w-4" />,
    accountant: <Calculator className="h-4 w-4" />,
    nurse: <Stethoscope className="h-4 w-4" />,
    counselor: <HeartHandshake className="h-4 w-4" />,
  }

  const roles = getAllRoles()

  return (
    <div className={cn("pb-12 w-64 bg-white border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span>ShuleVerse</span>
          </Link>
          <p className="text-xs text-gray-500">School Management System</p>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-1 px-3">
            <Link href="/" passHref>
              <Button variant={isActive("/") ? "secondary" : "ghost"} className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/parent-dashboard" passHref>
              <Button variant={isActive("/parent-dashboard") ? "secondary" : "ghost"} className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Parent Dashboard
              </Button>
            </Link>

            {/* System Admin Section */}
            <div className="pt-2">
              <Link href="/system-admin/login" passHref>
                <Button
                  variant={isActive("/system-admin/login") ? "destructive" : "outline"}
                  className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 group"
                >
                  <ShieldAlert className="mr-2 h-4 w-4 text-red-600 group-hover:text-red-700" />
                  System Admin
                </Button>
              </Link>
            </div>

            {/* Admin Roles Section */}
            <Collapsible open={openSections.admin} onOpenChange={() => toggleSection("admin")}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <div className="flex items-center">
                    <UserCog className="mr-2 h-4 w-4" />
                    Admin Roles
                  </div>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", openSections.admin ? "transform rotate-180" : "")}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pl-6">
                {roles.map((role) => (
                  <div key={role.id} className="space-y-1">
                    <div className="font-medium text-sm py-1">{role.name}</div>
                    <div className="space-y-1">
                      <Link href={`/login/${role.id}`} passHref>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <LogIn className="mr-2 h-3.5 w-3.5" />
                          Login
                        </Button>
                      </Link>
                      <Link href={`/signup/${role.id}`} passHref>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <UserPlus className="mr-2 h-3.5 w-3.5" />
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Other menu items */}
            <Link href="/calendar" passHref>
              <Button variant={isActive("/calendar") ? "secondary" : "ghost"} className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
            </Link>
            <Link href="/messages" passHref>
              <Button variant={isActive("/messages") ? "secondary" : "ghost"} className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
            <Link href="/reports" passHref>
              <Button variant={isActive("/reports") ? "secondary" : "ghost"} className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </Link>
            <Link href="/settings" passHref>
              <Button variant={isActive("/settings") ? "secondary" : "ghost"} className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
