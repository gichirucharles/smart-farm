import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

const messageSchema = z.object({ studentId: z.string().uuid(), title: z.string().trim().min(1).max(160), body: z.string().trim().min(1).max(4000) }).strict()
function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

async function getLinkedStudents(admin: ReturnType<typeof getSupabaseAdmin>, schoolId: string, email: string) {
  const { data: guardians, error } = await admin.from("student_guardians").select("student_id").eq("school_id", schoolId).eq("email", email)
  if (error) throw error
  return [...new Set((guardians ?? []).map((row) => row.student_id))]
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor?.schoolId || actor.role !== "parent") return response({ error: "Parent access required" }, 403)
  try {
    const admin = getSupabaseAdmin()
    const studentIds = await getLinkedStudents(admin, actor.schoolId, actor.email)
    if (!studentIds.length) return response({ students: [], messages: [] })
    const [{ data: students, error: studentsError }, { data: entries, error: entriesError }] = await Promise.all([
      admin.from("students").select("id, first_name, last_name, student_id").eq("school_id", actor.schoolId).in("id", studentIds).eq("is_active", true),
      admin.from("class_teacher_entries").select("id, student_id, category, title, body, created_by_role, created_at").eq("school_id", actor.schoolId).in("student_id", studentIds).eq("category", "parent_message").order("created_at", { ascending: false }).limit(200),
    ])
    if (studentsError || entriesError) return response({ error: "Unable to load parent messages" }, 500)
    return response({
      students: (students ?? []).map((student) => ({ id: student.id, name: `${student.first_name} ${student.last_name}`, admissionNumber: student.student_id })),
      messages: entries ?? [],
    })
  } catch {
    return response({ error: "Unable to load parent messages" }, 500)
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId || actor.role !== "parent") return response({ error: "Parent access required" }, 403)
  let body: unknown
  try { body = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const parsed = messageSchema.safeParse(body)
  if (!parsed.success) return response({ error: "Check the message details and try again" }, 400)
  try {
    const admin = getSupabaseAdmin()
    const studentIds = await getLinkedStudents(admin, actor.schoolId, actor.email)
    if (!studentIds.includes(parsed.data.studentId)) return response({ error: "You can only message about a child linked to your account" }, 403)
    const { data: student, error: studentError } = await admin.from("students").select("grade_level, stream").eq("id", parsed.data.studentId).eq("school_id", actor.schoolId).eq("is_active", true).maybeSingle()
    if (studentError || !student) return response({ error: "Student record not found" }, 404)
    const { data: schoolClass, error: classError } = await admin.from("classes").select("id").eq("school_id", actor.schoolId).eq("grade_level", student.grade_level).eq("stream", student.stream).eq("is_active", true).limit(1).maybeSingle()
    if (classError || !schoolClass) return response({ error: "Unable to find the student’s active class" }, 404)
    const { data: saved, error } = await admin.from("class_teacher_entries").insert({
      school_id: actor.schoolId, class_id: schoolClass.id, student_id: parsed.data.studentId, category: "parent_message",
      title: parsed.data.title, body: parsed.data.body, visible_to_parent: true, created_by: actor.id, created_by_role: "parent",
    }).select("id").single()
    if (error || !saved) return response({ error: "Unable to send your message" }, 500)
    return response({ id: saved.id }, 201)
  } catch {
    return response({ error: "Unable to send your message" }, 500)
  }
}
