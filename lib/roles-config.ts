import { Shield, GraduationCap, Users, Building, Heart, UserCheck, User } from "lucide-react"

export type AdminRole =
  | "system-admin"
  | "head-teacher"
  | "deputy-head-teacher"
  | "deputy-head"
  | "class-teacher"
  | "teacher"
  | "accountant"
  | "director"
  | "school-nurse"
  | "nurse"
  | "school-counselor"
  | "counselor"
  | "parent"

export interface RoleConfig {
  name: string
  icon: any
  description: string
  dashboardPath: string
  permissions: string[]
}

export const rolesConfig: Record<AdminRole, RoleConfig> = {
  "system-admin": {
    name: "System Administrator",
    icon: Shield,
    description: "Full system access and management",
    dashboardPath: "/admin/system/dashboard",
    permissions: ["all"],
  },
  "head-teacher": {
    name: "Head Teacher",
    icon: GraduationCap,
    description: "School management and oversight",
    dashboardPath: "/dashboard/head-teacher",
    permissions: ["school_management", "staff_management", "student_management"],
  },
  "deputy-head-teacher": {
    name: "Deputy Head Teacher",
    icon: GraduationCap,
    description: "Assistant school management and oversight",
    dashboardPath: "/dashboard/deputy-head-teacher",
    permissions: ["school_management", "staff_management", "student_management"],
  },
  "deputy-head": {
    name: "Deputy Head Teacher",
    icon: GraduationCap,
    description: "Assistant school management and oversight",
    dashboardPath: "/dashboard/deputy-head-teacher",
    permissions: ["school_management", "staff_management", "student_management"],
  },
  "class-teacher": {
    name: "Class Teacher",
    icon: Users,
    description: "Classroom and student management",
    dashboardPath: "/dashboard/class-teacher",
    permissions: ["class_management", "student_grades", "attendance"],
  },
  teacher: {
    name: "Class Teacher",
    icon: Users,
    description: "Classroom and student management",
    dashboardPath: "/dashboard/class-teacher",
    permissions: ["class_management", "student_grades", "attendance"],
  },
  accountant: {
    name: "Accountant",
    icon: Users,
    description: "Financial management and accounting",
    dashboardPath: "/dashboard/accountant",
    permissions: ["financial_management", "payments", "reports"],
  },
  director: {
    name: "Director",
    icon: Building,
    description: "Multi-school oversight and administration",
    dashboardPath: "/dashboard/director",
    permissions: ["multi_school_management", "reports", "analytics"],
  },
  "school-nurse": {
    name: "School Nurse",
    icon: Heart,
    description: "Student health and medical records",
    dashboardPath: "/dashboard/school-nurse",
    permissions: ["health_records", "medical_reports", "emergency_contacts"],
  },
  nurse: {
    name: "School Nurse",
    icon: Heart,
    description: "Student health and medical records",
    dashboardPath: "/dashboard/school-nurse",
    permissions: ["health_records", "medical_reports", "emergency_contacts"],
  },
  "school-counselor": {
    name: "School Counselor",
    icon: UserCheck,
    description: "Student counseling and guidance",
    dashboardPath: "/dashboard/school-counselor",
    permissions: ["counseling_records", "student_guidance", "behavioral_reports"],
  },
  counselor: {
    name: "School Counselor",
    icon: UserCheck,
    description: "Student counseling and guidance",
    dashboardPath: "/dashboard/school-counselor",
    permissions: ["counseling_records", "student_guidance", "behavioral_reports"],
  },
  parent: {
    name: "Parent/Guardian",
    icon: User,
    description: "Access to child's academic information",
    dashboardPath: "/dashboard/parent",
    permissions: ["view_child_progress", "communication", "events"],
  },
}

export const ADMIN_ROLES = rolesConfig

export const getRoleConfig = (role: AdminRole): RoleConfig => {
  return rolesConfig[role]
}

export function getAllRoles(): AdminRole[] {
  return Object.keys(rolesConfig) as AdminRole[]
}
