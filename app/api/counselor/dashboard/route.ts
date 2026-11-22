import { NextResponse } from "next/server"
import { getSessionActor } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

const COUNSELOR_ROLES = new Set(["counselor", "school_counselor"])

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10)
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (!COUNSELOR_ROLES.has(actor.role)) return response({ error: "Access denied" }, 403)

  try {
    const admin = getSupabaseAdmin()
    const today = dateOnly(new Date())
    const endOfWeek = new Date(`${today}T00:00:00.000Z`)
    endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 7)
    const followUpEnd = dateOnly(endOfWeek)

    const [sessionsResult, todayCountResult, followUpCountResult, totalCountResult, schoolResult] = await Promise.all([
      admin.from("counseling_sessions")
        .select("id, student_id, session_date, session_type, follow_up_required, follow_up_date")
        .eq("school_id", actor.schoolId)
        .eq("counselor_id", actor.id)
        .order("session_date", { ascending: false })
        .limit(50),
      admin.from("counseling_sessions")
        .select("id", { count: "exact", head: true })
        .eq("school_id", actor.schoolId)
        .eq("counselor_id", actor.id)
        .eq("session_date", today),
      admin.from("counseling_sessions")
        .select("id", { count: "exact", head: true })
        .eq("school_id", actor.schoolId)
        .eq("counselor_id", actor.id)
        .eq("follow_up_required", true)
        .gte("follow_up_date", today)
        .lte("follow_up_date", followUpEnd),
      admin.from("counseling_sessions")
        .select("id", { count: "exact", head: true })
        .eq("school_id", actor.schoolId)
        .eq("counselor_id", actor.id),
      admin.from("schools").select("name").eq("id", actor.schoolId).maybeSingle(),
    ])

    if (sessionsResult.error || todayCountResult.error || followUpCountResult.error || totalCountResult.error) {
      return response({ error: "Unable to load counselor dashboard data" }, 500)
    }

    const sessionRows = sessionsResult.data ?? []
    const studentIds = [...new Set(sessionRows.flatMap((session) => session.student_id ? [session.student_id] : []))]
    const studentsResult = studentIds.length
      ? await admin.from("students").select("id, first_name, last_name").eq("school_id", actor.schoolId).in("id", studentIds)
      : { data: [], error: null }
    if (studentsResult.error) return response({ error: "Unable to load counselor dashboard data" }, 500)

    const names = new Map((studentsResult.data ?? []).map((student) => [student.id, `${student.first_name} ${student.last_name}`]))
    return response({
      counselorName: `${actor.firstName} ${actor.lastName}`.trim(),
      schoolName: schoolResult.data?.name ?? "School",
      metrics: {
        sessionsToday: todayCountResult.count ?? 0,
        followUpsNext7Days: followUpCountResult.count ?? 0,
        totalSessions: totalCountResult.count ?? 0,
      },
      sessions: sessionRows.map((session) => ({
        id: session.id,
        studentName: session.student_id ? names.get(session.student_id) ?? "Student record unavailable" : "Student not linked",
        sessionDate: session.session_date,
        sessionType: session.session_type,
        followUpRequired: session.follow_up_required ?? false,
        followUpDate: session.follow_up_date,
      })),
      referrals: { available: false, count: 0 },
    })
  } catch {
    return response({ error: "Unable to load counselor dashboard data" }, 500)
  }
}
