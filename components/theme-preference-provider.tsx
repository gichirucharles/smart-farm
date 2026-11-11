"use client"

import { useEffect, type ReactNode } from "react"

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const applyTheme = () => {
      const preference = localStorage.getItem("shuleverse-app-theme") ?? "system"
      document.documentElement.classList.toggle("dark", preference === "dark" || (preference === "system" && media.matches))
    }

    applyTheme()
    media.addEventListener("change", applyTheme)
    return () => media.removeEventListener("change", applyTheme)
  }, [])

  return children
}
