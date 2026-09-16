import { notFound } from "next/navigation"
import { RoleSignup } from "@/components/auth/role-signup"
import { type AdminRole, ADMIN_ROLES } from "@/lib/roles-config"

export function generateStaticParams() {
  return Object.keys(ADMIN_ROLES).map((role) => ({
    role,
  }))
}

export default function RoleSignupPage({ params }: { params: { role: string } }) {
  const role = params.role as AdminRole

  // Check if the role is valid
  if (!ADMIN_ROLES[role]) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <RoleSignup role={role} />
    </div>
  )
}
