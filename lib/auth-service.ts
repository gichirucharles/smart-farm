import bcrypt from "bcryptjs"
import { supabase } from "./supabase"

// Generate default password: SV_ + last 3 digits of phone
export function generateDefaultPassword(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "") // Remove non-digits
  const lastThreeDigits = cleanPhone.slice(-3)
  return `SV_${lastThreeDigits}`
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Validate Kenyan phone number
export function validateKenyanPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, "")
  // Kenyan numbers: 254XXXXXXXXX or 07XXXXXXXX or 01XXXXXXXX
  return /^(254[17]\d{8}|0[17]\d{8})$/.test(cleanPhone)
}

// Normalize phone number to international format
export function normalizePhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "")
  if (cleanPhone.startsWith("254")) {
    return cleanPhone
  }
  if (cleanPhone.startsWith("0")) {
    return "254" + cleanPhone.slice(1)
  }
  return cleanPhone
}

async function authenticateWithServer(identifier: string, password: string, role: string) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ identifier, password, role }),
    })
    const result = await response.json()
    if (!response.ok || !result.success || !result.user) {
      return { success: false, error: result.error ?? "Invalid credentials" }
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("userSession", JSON.stringify(result.user))
    }
    return result
  } catch (error) {
    console.error("Authentication request failed:", error)
    return { success: false, error: "Authentication failed" }
  }
}

export async function authenticateSystemAdmin(email: string, password: string) {
  return authenticateWithServer(email, password, "system_admin")
}

export async function authenticateSchoolStaff(email: string, password: string, role: string) {
  return authenticateWithServer(email, password, role)
}

export async function authenticateParent(identifier: string, password: string) {
  return authenticateWithServer(identifier, password, "parent")
}

// Parent Registration (Email or Phone)
export async function registerParent(data: {
  identifier: string // email or phone
  firstName: string
  lastName: string
  schoolId?: string
}) {
  try {
    const isEmail = data.identifier.includes("@")
    let email = ""
    let phone = ""

    if (isEmail) {
      email = data.identifier
      // Check if parent exists by email in students table
      const { data: student } = await supabase
        .from("students")
        .select("parent_email, parent_phone")
        .eq("parent_email", email)
        .single()

      if (!student) {
        return { success: false, error: "No student record found with this email" }
      }
      phone = student.parent_phone || ""
    } else {
      if (!validateKenyanPhone(data.identifier)) {
        return { success: false, error: "Invalid phone number format" }
      }
      phone = normalizePhoneNumber(data.identifier)

      // Check if parent exists by phone in students table
      const { data: student } = await supabase
        .from("students")
        .select("parent_email, parent_phone")
        .eq("parent_phone", phone)
        .single()

      if (!student) {
        return { success: false, error: "No student record found with this phone number" }
      }
      email = student.parent_email || ""
    }

    // Generate default password
    const defaultPassword = generateDefaultPassword(phone)
    const hashedPassword = await hashPassword(defaultPassword)

    // Create user account
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email,
        phone,
        password_hash: hashedPassword,
        role: "parent",
        first_name: data.firstName,
        last_name: data.lastName,
        school_id: data.schoolId,
        is_first_login: true,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return { success: false, error: "Account already exists with this email/phone" }
      }
      return { success: false, error: "Registration failed" }
    }

    return {
      success: true,
      user,
      defaultPassword,
      message: `Account created successfully. Your default password is: ${defaultPassword}`,
    }
  } catch (error) {
    console.error("Parent registration error:", error)
    return { success: false, error: "Registration failed" }
  }
}

// Change Password
export async function changePassword(userId: string, newPassword: string) {
  try {
    // Validate password strength
    if (newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long" }
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return { success: false, error: "Password must contain uppercase, lowercase, and numbers" }
    }

    const hashedPassword = await hashPassword(newPassword)

    const { error } = await supabase
      .from("users")
      .update({
        password_hash: hashedPassword,
        is_first_login: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      return { success: false, error: "Failed to update password" }
    }

    // Clear session to force re-login
    if (typeof window !== "undefined") {
      localStorage.removeItem("userSession")
    }

    return { success: true, message: "Password updated successfully. Please login again." }
  } catch (error) {
    console.error("Change password error:", error)
    return { success: false, error: "Failed to update password" }
  }
}

// Get Current User
export function getCurrentUser() {
  if (typeof window === "undefined") return null

  const session = localStorage.getItem("userSession")
  if (!session) return null

  try {
    return JSON.parse(session)
  } catch {
    return null
  }
}

// Logout
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userSession")
    void fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" })
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

// Get user role
export function getUserRole(): string | null {
  const user = getCurrentUser()
  return user?.role || null
}
