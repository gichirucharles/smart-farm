import { notFound } from "next/navigation"
import { RoleLogin } from "@/components/auth/role-login"
import { type AdminRole, ADMIN_ROLES } from "@/lib/roles-config"

export function generateStaticParams() {
  return Object.keys(ADMIN_ROLES).map((role) => ({
    role,
  }))
}

export default function RoleLoginPage({ params }: { params: { role: string } }) {
  const role = params.role as AdminRole

  // Check if the role is valid
  if (!ADMIN_ROLES[role]) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <RoleLogin role={role} />
    </div>
  )
}
