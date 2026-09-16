import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const email = "charlesmuiruri024@gmail.com"
    const password = "Maryalvin1985@"
    const firstName = "Charles"
    const lastName = "Muiruri"

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12)

    console.log("[v0] Setting up system admin user...")

    // Check if user exists
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", email).single()

    if (existingUser) {
      // Update existing user
      const { error: updateError } = await supabase
        .from("users")
        .update({
          password_hash: passwordHash,
          role: "system_admin",
          first_name: firstName,
          last_name: lastName,
          is_first_login: false,
        })
        .eq("id", existingUser.id)

      if (updateError) {
        console.error("[v0] Error updating admin:", updateError)
        return NextResponse.json({ success: false, error: updateError.message }, { status: 400 })
      }

      console.log("[v0] System admin updated successfully")
      return NextResponse.json({ success: true, message: "System admin user updated" })
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          email,
          password_hash: passwordHash,
          role: "system_admin",
          first_name: firstName,
          last_name: lastName,
          is_first_login: false,
        })
        .select()

      if (insertError) {
        console.error("[v0] Error creating admin:", insertError)
        return NextResponse.json({ success: false, error: insertError.message }, { status: 400 })
      }

      console.log("[v0] System admin created successfully")
      return NextResponse.json({ success: true, message: "System admin user created", data: newUser })
    }
  } catch (error) {
    console.error("[v0] Setup error:", error)
    return NextResponse.json({ success: false, error: "Setup failed" }, { status: 500 })
  }
}
