import { supabase } from "./supabase"
import { generateDefaultPassword, hashPassword } from "./auth-service"

export interface ParentData {
  parentId: string
  studentIds: string[]
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: "mother" | "father" | "guardian"
  isPrimary?: boolean
}

// Register a new parent for a student (handles up to 2 parents)
export async function registerParentForStudent(data: {
  studentId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: string
  schoolId: string
}) {
  try {
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("parent_id, parent_2_id, parent_count, class_id, classes(name)")
      .eq("id", data.studentId)
      .single()

    if (studentError || !student) {
      return { success: false, error: "Student not found" }
    }

    if (student.parent_count >= 2) {
      return {
        success: false,
        error: "This student already has 2 parents/guardians registered. Please remove one before adding a new one.",
      }
    }

    // Generate default password from phone number (last 3 digits)
    const defaultPassword = generateDefaultPassword(data.phone)
    const hashedPassword = await hashPassword(defaultPassword)

    // Create parent user account
    const { data: parentUser, error: userError } = await supabase
      .from("users")
      .insert({
        email: data.email,
        phone: data.phone,
        password_hash: hashedPassword,
        role: "parent",
        first_name: data.firstName,
        last_name: data.lastName,
        school_id: data.schoolId,
        is_first_login: true,
      })
      .select()
      .single()

    if (userError) {
      if (userError.code === "23505") {
        return { success: false, error: "Email or phone number already registered" }
      }
      return { success: false, error: "Failed to create parent account" }
    }

    // Create parent-child relationship
    const { error: relationshipError } = await supabase.from("parent_child_relationships").insert({
      parent_user_id: parentUser.id,
      student_id: data.studentId,
      relationship: data.relationship,
      is_primary: student.parent_count === 0, // First parent is primary
      access_credentials: {
        default_password_used: true,
        password_changed_on: null,
        generated_date: new Date().toISOString(),
      },
    })

    if (relationshipError) {
      // Cleanup: delete the user if relationship creation fails
      await supabase.from("users").delete().eq("id", parentUser.id)
      return { success: false, error: "Failed to create parent-child relationship" }
    }

    // Update student's parent count and parent fields
    const updateData: any = { parent_count: student.parent_count + 1 }
    if (student.parent_count === 0) {
      updateData.parent_id = parentUser.id
    } else {
      updateData.parent_2_id = parentUser.id
    }

    await supabase.from("students").update(updateData).eq("id", data.studentId)

    // Log access
    await supabase.from("parent_access_logs").insert({
      parent_user_id: parentUser.id,
      student_id: data.studentId,
      action: "account_created",
      details: { relationship: data.relationship },
    })

    return {
      success: true,
      parent: parentUser,
      defaultPassword,
      studentInfo: {
        name: `${student.classes?.name || "Unknown"}`,
      },
      message: `Parent account created. Default password: ${defaultPassword}`,
    }
  } catch (error) {
    console.error("Parent registration error:", error)
    return { success: false, error: "Registration failed" }
  }
}

// Send welcome email to parent(s)
export async function sendParentWelcomeEmail(data: {
  parentUserId: string
  studentId: string
  schoolName: string
  studentName: string
  studentGrade: string
  parentName: string
}) {
  try {
    const { data: parent } = await supabase
      .from("users")
      .select("email, first_name, last_name")
      .eq("id", data.parentUserId)
      .single()

    if (!parent) {
      return { success: false, error: "Parent not found" }
    }

    const emailContent = {
      subject: `Welcome to ${data.schoolName} Parent Portal`,
      body: `
Dear Mr/Ms ${parent.last_name},

Welcome to the ${data.schoolName} Parent Portal! We are delighted to have you connected with us.

Here are your child's details:
- Name: ${data.studentName}
- Grade: ${data.studentGrade}
- School: ${data.schoolName}

Your parent account has been successfully created. You can now:
✓ View your child's academic progress
✓ Check attendance records
✓ Access grades and performance reports
✓ Communicate with teachers
✓ Receive school notifications

Your login credentials:
- Email/Phone: ${parent.email}
- Temporary Password: Will be provided separately

For security reasons, you will be required to create a new password on your first login.

If you have any issues accessing your account, please contact the school administration.

Best regards,
${data.schoolName} Administration
      `,
    }

    // Log email notification
    const { error } = await supabase.from("parent_email_notifications").insert({
      parent_user_id: data.parentUserId,
      student_id: data.studentId,
      notification_type: "welcome",
      recipient_email: parent.email,
      subject: emailContent.subject,
      body: emailContent.body,
      is_sent: true,
      sent_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Email logging error:", error)
    }

    return {
      success: true,
      email: parent.email,
      message: "Welcome email prepared for sending",
    }
  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

// Handle parent's first password change
export async function handleParentFirstLogin(userId: string, newPassword: string) {
  try {
    // Validate password
    if (newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" }
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return {
        success: false,
        error: "Password must contain uppercase, lowercase, and numbers",
      }
    }

    // Hash and update password
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

    // Update access credentials in parent_child_relationships
    const { data: relationships } = await supabase
      .from("parent_child_relationships")
      .select("id")
      .eq("parent_user_id", userId)

    if (relationships) {
      for (const rel of relationships) {
        await supabase
          .from("parent_child_relationships")
          .update({
            access_credentials: {
              default_password_used: false,
              password_changed_on: new Date().toISOString(),
            },
          })
          .eq("id", rel.id)
      }
    }

    // Log password change
    const { data: relationship } = await supabase
      .from("parent_child_relationships")
      .select("student_id")
      .eq("parent_user_id", userId)
      .single()

    if (relationship) {
      await supabase.from("parent_access_logs").insert({
        parent_user_id: userId,
        student_id: relationship.student_id,
        action: "password_changed",
        details: { changed_on_first_login: true },
      })
    }

    return {
      success: true,
      message: "Password updated successfully. Please login with your new password.",
    }
  } catch (error) {
    console.error("First login password change error:", error)
    return { success: false, error: "Failed to update password" }
  }
}

// Get all parents for a student
export async function getStudentParents(studentId: string) {
  try {
    const { data: relationships, error } = await supabase
      .from("parent_child_relationships")
      .select(
        `
        id,
        parent_user_id,
        relationship,
        is_primary,
        access_credentials,
        users:parent_user_id (
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `,
      )
      .eq("student_id", studentId)

    if (error) {
      return { success: false, error: "Failed to fetch parents" }
    }

    return { success: true, parents: relationships || [] }
  } catch (error) {
    console.error("Get student parents error:", error)
    return { success: false, error: "Failed to fetch parents" }
  }
}

// Remove a parent from student (requires reassignment of their roles)
export async function removeParentFromStudent(parentId: string, studentId: string) {
  try {
    const { error } = await supabase
      .from("parent_child_relationships")
      .delete()
      .eq("parent_user_id", parentId)
      .eq("student_id", studentId)

    if (error) {
      return { success: false, error: "Failed to remove parent" }
    }

    // Update student parent count
    const { data: student } = await supabase
      .from("students")
      .select("parent_id, parent_2_id")
      .eq("id", studentId)
      .single()

    if (student) {
      const newParentId = student.parent_id === parentId ? student.parent_2_id : student.parent_id
      await supabase
        .from("students")
        .update({
          parent_id: newParentId,
          parent_2_id: null,
          parent_count: student.parent_2_id && student.parent_id ? 1 : 0,
        })
        .eq("id", studentId)
    }

    return { success: true, message: "Parent removed successfully" }
  } catch (error) {
    console.error("Remove parent error:", error)
    return { success: false, error: "Failed to remove parent" }
  }
}
