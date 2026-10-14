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

// System Admin Authentication
export async function authenticateSystemAdmin(email: string, password: string) {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("role", "system_admin")
      .single()

    if (error || !user) {
      return { success: false, error: "Invalid credentials" }
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" }
    }

    // Update last login
    await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    const session = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      isFirstLogin: user.is_first_login,
    }

    // Store session
    if (typeof window !== "undefined") {
      localStorage.setItem("userSession", JSON.stringify(session))
    }

    return { success: true, user: session, requiresPasswordChange: user.is_first_login }
  } catch (error) {
    console.error("System admin authentication error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

// School Staff Authentication (Director, Head Teacher, etc.)
export async function authenticateSchoolStaff(email: string, password: string, role: string) {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select(`
        *,
        schools (
          id,
          name,
          registration_number,
          subscription_status
        )
      `)
      .eq("email", email)
      .eq("role", role)
      .single()

    if (error || !user) {
      return { success: false, error: "Invalid credentials" }
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" }
    }

    // Update last login
    await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    const session = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      schoolId: user.school_id,
      isFirstLogin: user.is_first_login,
      school: user.schools,
    }

    // Store session
    if (typeof window !== "undefined") {
      localStorage.setItem("userSession", JSON.stringify(session))
    }

    return { success: true, user: session, requiresPasswordChange: user.is_first_login }
  } catch (error) {
    console.error("School staff authentication error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

// Parent Authentication (Email or Phone)
export async function authenticateParent(identifier: string, password: string) {
  try {
    // Check if identifier is email or phone
    const isEmail = identifier.includes("@")
    const query = supabase.from("users").select("*").eq("role", "parent")

    if (isEmail) {
      query.eq("email", identifier)
    } else {
      const normalizedPhone = normalizePhoneNumber(identifier)
      query.eq("phone", normalizedPhone)
    }

    const { data: user, error } = await query.single()

    if (error || !user) {
      return { success: false, error: "Invalid credentials" }
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" }
    }

    // Update last login
    await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    const session = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      schoolId: user.school_id,
      isFirstLogin: user.is_first_login,
    }

    // Store session
    if (typeof window !== "undefined") {
      localStorage.setItem("userSession", JSON.stringify(session))
    }

    return { success: true, user: session, requiresPasswordChange: user.is_first_login }
  } catch (error) {
    console.error("Parent authentication error:", error)
    return { success: false, error: "Authentication failed" }
  }
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
