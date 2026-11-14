'use client'

import { SchoolProfileManager } from '@/components/dashboard/director/school-profile-manager'

export default function SchoolManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">School Management</h1>
        <p className="text-muted-foreground">Configure and manage school settings in Kenya.</p>
      </header>
      <SchoolProfileManager />
    </div>
  )
}
