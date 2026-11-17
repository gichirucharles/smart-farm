import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getSupabaseAdmin } from "@/lib/supabase"
import { hasSameOrigin, issueSessionCookie } from "@/lib/auth-session"

const ALLOWED_ROLES = new Set([
  "system_admin",
  "director",
  "head_teacher",
  "deputy_head_teacher",
  "class_teacher",
  "subject_teacher",
  "school_nurse",
  "school_counselor",
  "accountant",
  "parent",
  "student",
])

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ success: false, error: "Invalid request origin" }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }

  const { identifier, password, role } = (body ?? {}) as Record<string, unknown>
  if (
    typeof identifier !== "string" || identifier.trim().length < 3 || identifier.length > 254 ||
    typeof password !== "string" || password.length < 1 || password.length > 256 ||
    typeof role !== "string" || !ALLOWED_ROLES.has(role)
  ) {
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 400 })
  }

  try {
    const admin = getSupabaseAdmin()
    const normalizedIdentifier = identifier.trim()
    const query = admin
      .from("users")
      .select(`id, email, phone, password_hash, role, first_name, last_name, school_id, is_first_login, schools ( id, name, registration_number, subscription_status )`)
      .eq("role", role)
    const { data: user, error } = normalizedIdentifier.includes("@")
      ? await query.ilike("email", normalizedIdentifier.toLowerCase()).maybeSingle()
      : await query.eq("phone", normalizedIdentifier.replace(/\D/g, "")).maybeSingle()

    if (error || !user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    await admin.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    const safeUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      schoolId: user.school_id,
      isFirstLogin: user.is_first_login,
      school: user.schools,
    }
    const response = NextResponse.json({
      success: true,
      user: safeUser,
      requiresPasswordChange: user.is_first_login,
    }, { headers: { "Cache-Control": "no-store" } })
    issueSessionCookie(response, user.id)
    return response
  } catch (error) {
    console.error("Staff login failed:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
