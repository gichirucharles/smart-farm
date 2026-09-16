"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ClipboardList,
  Cog,
  FileText,
  Home,
  LayoutDashboard,
  MessageSquare,
  PieChart,
  School,
  Settings,
  ShieldAlert,
  User,
  Users,
  Heart,
  Activity,
  Briefcase,
  Database,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
  disabled?: boolean
}

function NavItem({ href, icon, label, active, disabled }: NavItemProps) {
  return (
    <Link
      href={disabled ? "#" : href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      {icon}
      {label}
    </Link>
  )
}

interface NavGroupProps {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

function NavGroup({ label, icon, children, defaultOpen = false }: NavGroupProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full items-center justify-between p-2">
          <div className="flex items-center gap-3">
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 pt-1">{children}</CollapsibleContent>
    </Collapsible>
  )
}

export function DashboardNavigation() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-2">
      <NavItem href="/dashboard" icon={<Home className="h-4 w-4" />} label="Home" active={pathname === "/dashboard"} />

      <NavGroup
        label="Role Dashboards"
        icon={<LayoutDashboard className="h-4 w-4" />}
        defaultOpen={pathname.includes("/dashboard/")}
      >
        <div className="flex flex-col gap-1">
          <NavItem
            href="/dashboard/director"
            icon={<Briefcase className="h-4 w-4" />}
            label="Director"
            active={pathname === "/dashboard/director"}
          />
          <NavItem
            href="/dashboard/headteacher"
            icon={<School className="h-4 w-4" />}
            label="Head Teacher"
            active={pathname === "/dashboard/headteacher"}
          />
          <NavItem
            href="/dashboard/teacher"
            icon={<BookOpen className="h-4 w-4" />}
            label="Class Teacher"
            active={pathname === "/dashboard/teacher"}
          />
          <NavItem
            href="/dashboard/nurse"
            icon={<Heart className="h-4 w-4" />}
            label="School Nurse"
            active={pathname === "/dashboard/nurse"}
          />
          <NavItem
            href="/dashboard/counselor"
            icon={<Activity className="h-4 w-4" />}
            label="School Counselor"
            active={pathname === "/dashboard/counselor"}
          />
          <NavItem
            href="/admin/system/dashboard"
            icon={<Database className="h-4 w-4" />}
            label="System Admin"
            active={pathname === "/admin/system/dashboard"}
          />
        </div>
      </NavGroup>

      <NavGroup label="Academic" icon={<FileText className="h-4 w-4" />}>
        <div className="flex flex-col gap-1">
          <NavItem href="/academic/classes" icon={<Users className="h-4 w-4" />} label="Classes" />
          <NavItem href="/academic/subjects" icon={<BookOpen className="h-4 w-4" />} label="Subjects" />
          <NavItem href="/academic/exams" icon={<ClipboardList className="h-4 w-4" />} label="Examinations" />
          <NavItem href="/academic/timetable" icon={<Calendar className="h-4 w-4" />} label="Timetable" />
        </div>
      </NavGroup>

      <NavGroup label="Administration" icon={<Cog className="h-4 w-4" />}>
        <div className="flex flex-col gap-1">
          <NavItem href="/admin/students" icon={<User className="h-4 w-4" />} label="Students" />
          <NavItem href="/admin/staff" icon={<Users className="h-4 w-4" />} label="Staff" />
          <NavItem href="/admin/reports" icon={<PieChart className="h-4 w-4" />} label="Reports" />
          <NavItem href="/admin/messages" icon={<MessageSquare className="h-4 w-4" />} label="Messages" />
        </div>
      </NavGroup>

      <NavItem href="/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />

      <NavItem href="/help" icon={<ShieldAlert className="h-4 w-4" />} label="Help & Support" />
    </div>
  )
}
