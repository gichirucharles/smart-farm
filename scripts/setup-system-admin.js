import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function setupSystemAdmin() {
  try {
    console.log("[v0] Starting system admin setup...")

    const email = "charlesmuiruri024@gmail.com"
    const password = "Maryalvin1985@"
    const firstName = "Charles"
    const lastName = "Muiruri"

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12)
    console.log("[v0] Password hashed successfully")

    // Check if admin already exists
    const { data: existingAdmin } = await supabase.from("users").select("*").eq("email", email).single()

    if (existingAdmin) {
      console.log("[v0] System admin already exists, updating...")
      // Update existing admin
      const { error: updateError } = await supabase
        .from("users")
        .update({
          password_hash: passwordHash,
          role: "system_admin",
          first_name: firstName,
          last_name: lastName,
          is_first_login: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingAdmin.id)

      if (updateError) {
        console.error("[v0] Error updating admin:", updateError)
        return { success: false, error: updateError.message }
      }

      console.log("[v0] System admin updated successfully")
      return { success: true, message: "System admin updated" }
    } else {
      console.log("[v0] Creating new system admin user...")
      // Create new admin
      const { data: newAdmin, error: insertError } = await supabase
        .from("users")
        .insert({
          email,
          password_hash: passwordHash,
          role: "system_admin",
          first_name: firstName,
          last_name: lastName,
          is_first_login: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (insertError) {
        console.error("[v0] Error creating admin:", insertError)
        return { success: false, error: insertError.message }
      }

      console.log("[v0] System admin created successfully")
      console.log("[v0] Admin details:", { email, firstName, lastName })
      return { success: true, message: "System admin created", data: newAdmin }
    }
  } catch (error) {
    console.error("[v0] Setup error:", error)
    return { success: false, error: error.message }
  }
}

setupSystemAdmin()
