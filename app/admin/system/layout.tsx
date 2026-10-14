"use client"

import type React from "react"

import { AppHeader } from "@/components/layout/app-header"

export default function SystemAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader isHomePage={false} />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}
