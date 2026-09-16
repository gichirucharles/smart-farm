"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  BarChart3,
  FileText,
  Heart,
  UserCheck,
  Building,
  Database,
  LogOut,
  ChevronUp,
  School,
  ClipboardList,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react"

interface User {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
  schoolId?: string
  school?: any
}

const roleNavigationConfig = {
  system_admin: {
    title: "System Administration",
    groups: [
      {
        label: "System Management",
        items: [
          { title: "Dashboard", url: "/dashboard", icon: Home },
          { title: "User Management", url: "/dashboard/system-admin/users", icon: Users },
          { title: "School Management", url: "/dashboard/system-admin/schools", icon: Building },
          { title: "System Logs", url: "/dashboard/system-admin/logs", icon: FileText },
          { title: "Backup & Restore", url: "/dashboard/system-admin/backup", icon: Database },
          { title: "System Settings", url: "/dashboard/system-admin/settings", icon: Settings },
        ],
      },
    ],
  },
  director: {
    title: "Director Dashboard",
    groups: [
      {
        label: "Overview",
        items: [
          { title: "Dashboard", url: "/dashboard/director", icon: Home },
          { title: "School Management", url: "/dashboard/director/school-management", icon: Building },
          { title: "Staff Overview", url: "/dashboard/director/staff-overview", icon: Users },
          { title: "Academic Performance", url: "/dashboard/director/academic-performance", icon: TrendingUp },
          { title: "Financial Overview", url: "/dashboard/director/financial-overview", icon: DollarSign },
        ],
      },
      {
        label: "Administration",
        items: [
          { title: "Network Settings", url: "/dashboard/director/network-settings", icon: Settings },
          { title: "Reports", url: "/dashboard/director/reports", icon: FileText },
          { title: "Messages", url: "/dashboard/director/messages", icon: MessageSquare },
        ],
      },
    ],
  },
  head_teacher: {
    title: "Head Teacher Dashboard",
    groups: [
      {
        label: "School Management",
        items: [
          { title: "Dashboard", url: "/dashboard/head-teacher", icon: Home },
          { title: "Staff Management", url: "/dashboard/head-teacher/staff", icon: Users },
          { title: "Student Management", url: "/dashboard/head-teacher/students", icon: GraduationCap },
          { title: "Academic Performance", url: "/dashboard/head-teacher/academics", icon: BarChart3 },
          { title: "Class Management", url: "/dashboard/head-teacher/classes", icon: BookOpen },
        ],
      },
      {
        label: "Administration",
        items: [
          { title: "Attendance", url: "/dashboard/head-teacher/attendance", icon: UserCheck },
          { title: "Examinations", url: "/dashboard/head-teacher/exams", icon: ClipboardList },
          { title: "Reports", url: "/dashboard/head-teacher/reports", icon: FileText },
          { title: "Calendar", url: "/dashboard/head-teacher/calendar", icon: Calendar },
          { title: "Messages", url: "/dashboard/head-teacher/messages", icon: MessageSquare },
        ],
      },
    ],
  },
  class_teacher: {
    title: "Class Teacher Dashboard",
    groups: [
      {
        label: "Classroom Management",
        items: [
          { title: "Dashboard", url: "/dashboard/class-teacher", icon: Home },
          { title: "My Classes", url: "/dashboard/class-teacher/my-classes", icon: BookOpen },
          { title: "Students", url: "/dashboard/class-teacher/students", icon: GraduationCap },
          { title: "Attendance", url: "/dashboard/class-teacher/attendance", icon: UserCheck },
          { title: "Assessment", url: "/dashboard/class-teacher/assessment", icon: ClipboardList },
        ],
      },
      {
        label: "Academic Activities",
        items: [
          { title: "Gradebook", url: "/dashboard/class-teacher/gradebook", icon: BarChart3 },
          { title: "Assignments", url: "/dashboard/class-teacher/assignments", icon: FileText },
          { title: "Calendar", url: "/dashboard/class-teacher/calendar", icon: Calendar },
          { title: "Messages", url: "/dashboard/class-teacher/messages", icon: MessageSquare },
        ],
      },
    ],
  },
  school_nurse: {
    title: "School Nurse Dashboard",
    groups: [
      {
        label: "Health Management",
        items: [
          { title: "Dashboard", url: "/dashboard/nurse", icon: Home },
          { title: "Student Health Records", url: "/dashboard/nurse/student-health-records", icon: Heart },
          { title: "Sick Bay Visits", url: "/dashboard/nurse/sick-bay-visits", icon: Activity },
          { title: "Scheduled Checkups", url: "/dashboard/nurse/scheduled-checkups", icon: Calendar },
          { title: "Health Reports", url: "/dashboard/nurse/health-reports", icon: FileText },
        ],
      },
    ],
  },
  school_counselor: {
    title: "School Counselor Dashboard",
    groups: [
      {
        label: "Counseling Services",
        items: [
          { title: "Dashboard", url: "/dashboard/counselor", icon: Home },
          { title: "Student Sessions", url: "/dashboard/counselor/student-sessions", icon: Users },
          { title: "Counseling Records", url: "/dashboard/counselor/counseling-records", icon: FileText },
          { title: "Appointments", url: "/dashboard/counselor/appointments", icon: Calendar },
          { title: "Reports", url: "/dashboard/counselor/reports", icon: BarChart3 },
          { title: "Messages", url: "/dashboard/counselor/messages", icon: MessageSquare },
          { title: "Parents Contact", url: "/dashboard/counselor/parents-contact", icon: Users },
        ],
      },
    ],
  },
  subject_teacher: {
    title: "Subject Teacher Dashboard",
    groups: [
      {
        label: "Class Management",
        items: [
          { title: "Dashboard", url: "/dashboard/subject-teacher", icon: Home },
          { title: "My Classes", url: "/dashboard/subject-teacher/my-classes", icon: BookOpen },
          { title: "Students", url: "/dashboard/subject-teacher/students", icon: GraduationCap },
          { title: "Attendance", url: "/dashboard/subject-teacher/attendance", icon: UserCheck },
          { title: "Assessment", url: "/dashboard/subject-teacher/assessment", icon: ClipboardList },
        ],
      },
      {
        label: "Academic Activities",
        items: [
          { title: "Gradebook", url: "/dashboard/subject-teacher/gradebook", icon: BarChart3 },
          { title: "Assignments", url: "/dashboard/subject-teacher/assignments", icon: FileText },
          { title: "Calendar", url: "/dashboard/subject-teacher/calendar", icon: Calendar },
          { title: "Messages", url: "/dashboard/subject-teacher/messages", icon: MessageSquare },
        ],
      },
    ],
  },
  parent: {
    title: "Parent Dashboard",
    groups: [
      {
        label: "My Child",
        items: [
          { title: "Dashboard", url: "/dashboard/parent", icon: Home },
          { title: "Academic Progress", url: "/dashboard/parent/academic-progress", icon: BarChart3 },
          { title: "Attendance", url: "/dashboard/parent/attendance", icon: UserCheck },
          { title: "Assignments", url: "/dashboard/parent/assignments", icon: FileText },
          { title: "Health Records", url: "/dashboard/parent/health-records", icon: Heart },
        ],
      },
      {
        label: "Communication",
        items: [
          { title: "Messages", url: "/dashboard/parent/messages", icon: MessageSquare },
          { title: "School Calendar", url: "/dashboard/parent/school-calendar", icon: Calendar },
          { title: "Notifications", url: "/dashboard/parent/notifications", icon: MessageSquare },
        ],
      },
    ],
  },
}

export function RoleBasedNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    // Return a default navigation for testing purposes
    return (
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <School className="h-6 w-6 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">ShuleVerse</span>
              <span className="text-xs text-gray-500">Testing Mode</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/"}>
                    <a href="/">
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  const navigationConfig = roleNavigationConfig[user.role as keyof typeof roleNavigationConfig]

  if (!navigationConfig) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#b8d4f0] to-[#a8c8e8] rounded-lg flex items-center justify-center border border-white/30">
            <School className="h-5 w-5 text-[#1e3a8a]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#1e3a8a]">ShuleVerse</span>
            <span className="text-xs text-gray-500">A Universe of Learning</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationConfig.groups.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isMessages = item.url.includes("messages")
                  const isNotifications = item.url.includes("notifications")
                  const unreadCount = isMessages ? 2 : isNotifications ? 2 : 0

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url} className="relative">
                        <a href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {unreadCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                            >
                              {unreadCount}
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg" alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{user.role.replace("_", " ")}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
