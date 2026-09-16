import { supabase } from "./supabase"

export interface TeacherRole {
  id: string
  userId: string
  role: "class_teacher" | "subject_teacher" | "deputy_head_teacher"
  classId?: string
  subjectIds?: string[] // For subject teachers
  schoolId: string
  assignedAt: string
  assignedBy: string
}

export interface RoleReassignment {
  id: string
  originalUserId: string
  newUserId: string
  role: string
  reason: string
  schoolId: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

// Get all roles for a teacher
export async function getTeacherRoles(teacherId: string) {
  try {
    const { data, error } = await supabase.from("teacher_roles").select("*").eq("user_id", teacherId)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching teacher roles:", error)
    return { success: false, error: "Failed to fetch teacher roles" }
  }
}

// Check if teacher has duplicate roles
export async function checkDuplicateRoles(teacherId: string, newRole: string, classOrSubjectId?: string) {
  try {
    const { data, error } = await supabase
      .from("teacher_roles")
      .select("*")
      .eq("user_id", teacherId)
      .eq("role", newRole)

    if (error) throw error

    if (data && data.length > 0) {
      // Found duplicate role
      const existingRole = data[0]
      return {
        hasDuplicate: true,
        existingRole,
        message: `This teacher already holds the role of ${newRole}`,
      }
    }

    return { hasDuplicate: false }
  } catch (error) {
    console.error("Error checking duplicate roles:", error)
    return { hasDuplicate: false, error: "Failed to check duplicate roles" }
  }
}

// Assign role to teacher (with validation)
export async function assignTeacherRole(
  teacherId: string,
  role: string,
  schoolId: string,
  classId?: string,
  subjectIds?: string[],
  assignedBy?: string,
) {
  try {
    // Check for duplicates
    const dupCheck = await checkDuplicateRoles(teacherId, role, classId)
    if (dupCheck.hasDuplicate) {
      return {
        success: false,
        isDuplicate: true,
        existingRole: dupCheck.existingRole,
        error: dupCheck.message,
      }
    }

    // If assigning as class teacher and they already teach other classes, warn
    if (role === "class_teacher" && classId) {
      const { data: existingClassTeacher } = await supabase
        .from("classes")
        .select("*")
        .eq("class_teacher_id", teacherId)

      if (existingClassTeacher && existingClassTeacher.length > 0) {
        return {
          success: false,
          needsConfirmation: true,
          message: `This teacher is already a class teacher for ${existingClassTeacher.map((c) => c.name).join(", ")}. Are you sure you want to reassign them?`,
          existingClasses: existingClassTeacher,
        }
      }
    }

    // Assign the role
    const { data, error } = await supabase
      .from("teacher_roles")
      .insert({
        user_id: teacherId,
        role,
        class_id: classId,
        subject_ids: subjectIds,
        school_id: schoolId,
        assigned_by: assignedBy,
      })
      .select()

    if (error) throw error

    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error assigning teacher role:", error)
    return { success: false, error: "Failed to assign role" }
  }
}

// Remove teacher role and reassign to another teacher
export async function removeAndReassignRole(
  teacherId: string,
  newTeacherId: string,
  roleId: string,
  reason: string,
  schoolId: string,
  removedBy: string,
) {
  try {
    // Create reassignment record
    const { data: reassignment } = await supabase
      .from("role_reassignments")
      .insert({
        original_user_id: teacherId,
        new_user_id: newTeacherId,
        role: roleId,
        reason,
        school_id: schoolId,
        status: "pending",
      })
      .select()

    // Do not remove the role until reassignment is confirmed
    // The role removal will happen only after reassignment is approved

    return {
      success: true,
      reassignmentId: reassignment ? reassignment[0].id : null,
      message: "Reassignment request created. The role will be transferred only after responsibilities are assigned.",
    }
  } catch (error) {
    console.error("Error creating reassignment:", error)
    return { success: false, error: "Failed to create reassignment" }
  }
}

// Approve reassignment and complete the role transfer
export async function approveRoleReassignment(reassignmentId: string) {
  try {
    // Get reassignment details
    const { data: reassignment } = await supabase
      .from("role_reassignments")
      .select("*")
      .eq("id", reassignmentId)
      .single()

    if (!reassignment) {
      return { success: false, error: "Reassignment not found" }
    }

    // Update reassignment status
    await supabase.from("role_reassignments").update({ status: "approved" }).eq("id", reassignmentId)

    // Transfer role to new teacher
    const { error } = await supabase
      .from("teacher_roles")
      .update({ user_id: reassignment.new_user_id })
      .eq("user_id", reassignment.original_user_id)
      .eq("id", reassignment.role)

    if (error) throw error

    return { success: true, message: "Role reassigned successfully" }
  } catch (error) {
    console.error("Error approving reassignment:", error)
    return { success: false, error: "Failed to approve reassignment" }
  }
}
