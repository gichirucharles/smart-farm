import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"
import { canAccessModule } from "@/lib/governance-access"
import {
  DEFAULT_EDITABLE_SCHOOL_SETTINGS,
  DEFAULT_SCHOOL_PROFILE,
  DEFAULT_SCHOOL_SETTINGS,
  editableSchoolSettingsSchema,
  schoolProfileSchema,
} from "@/lib/school-settings"

const SCHOOL_FIELDS = "id, name, school_type, government_id, registration_number, motto, logo_url, address, city, county, postal_code, phone, email, website, established_year, student_capacity, description"

function noStoreJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

async function loadSchoolSettings(schoolId: string) {
  const admin = getSupabaseAdmin()
  const [{ data: school, error: schoolError }, { data: row, error: settingsError }] = await Promise.all([
    admin.from("schools").select(SCHOOL_FIELDS).eq("id", schoolId).maybeSingle(),
    admin.from("school_settings").select("settings, updated_at").eq("school_id", schoolId).maybeSingle(),
  ])

  if (schoolError || settingsError || !school) throw new Error("Unable to load school settings")
  const stored = (row?.settings ?? {}) as Record<string, unknown>
  const storedProfile = (stored.profile ?? {}) as Record<string, unknown>
  const settingsValues = { ...DEFAULT_EDITABLE_SCHOOL_SETTINGS, ...stored }
  delete (settingsValues as Record<string, unknown>).profile
  const profile = {
    ...DEFAULT_SCHOOL_PROFILE,
    schoolName: school.name ?? "",
    schoolType: school.school_type ?? "",
    governmentId: school.government_id ?? "",
    registrationNumber: school.registration_number ?? "",
    motto: school.motto ?? "",
    logoUrl: school.logo_url ?? "",
    address: school.address ?? "",
    city: school.city ?? "",
    county: school.county ?? "",
    postalCode: school.postal_code ?? "",
    phone: school.phone ?? "",
    email: school.email ?? "",
    website: school.website ?? "",
    establishedYear: school.established_year ?? "",
    studentCapacity: school.student_capacity ?? "",
    description: school.description ?? "",
    ...storedProfile,
  }

  return {
    profile,
    settings: { ...DEFAULT_SCHOOL_SETTINGS, ...settingsValues },
    updatedAt: row?.updated_at ?? null,
  }
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return noStoreJson({ error: "Authentication required" }, 401)
  if (["head_teacher", "director", "deputy_head_teacher"].includes(actor.role) && !await canAccessModule(actor.role, "school_settings", "view")) return noStoreJson({ error: "Access denied" }, 403)

  try {
    const result = await loadSchoolSettings(actor.schoolId)
    if (actor.role === "parent" || actor.role === "student") {
      return noStoreJson({ settings: {
        academicYear: result.settings.academicYear,
        terms: result.settings.terms,
        holidays: result.settings.holidays,
      } })
    }
    if (actor.role !== "head_teacher" && actor.role !== "director") {
      return noStoreJson({ settings: {
        academicYear: result.settings.academicYear,
        terms: result.settings.terms,
        holidays: result.settings.holidays,
        classStructure: result.settings.classStructure,
        timetable: result.settings.timetable,
      } })
    }
    if (actor.role === "director") {
      return noStoreJson({ ...result, settings: { ...result.settings, feeStructure: [] } })
    }
    return noStoreJson(result)
  } catch (error) {
    console.error("School settings read failed:", error)
    return noStoreJson({ error: "Unable to load school settings" }, 500)
  }
}

export async function PATCH(request: Request) {
  if (!hasSameOrigin(request)) return noStoreJson({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId) return noStoreJson({ error: "Authentication required" }, 401)
  if (actor.role !== "head_teacher") return noStoreJson({ error: "Only the head teacher can edit school settings" }, 403)
  if (!await canAccessModule(actor.role, "school_settings", "edit")) return noStoreJson({ error: "Edit access denied" }, 403)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return noStoreJson({ error: "Invalid request body" }, 400)
  }

  const parsed = z.object({
    profile: schoolProfileSchema,
    settings: editableSchoolSettingsSchema,
  }).strict().safeParse(body)
  if (!parsed.success) return noStoreJson({ error: "Some settings are invalid or exceed the allowed limits" }, 400)

  const { profile, settings } = parsed.data
  try {
    const admin = getSupabaseAdmin()
    const schoolUpdate = await admin.from("schools").update({
      name: profile.schoolName,
      government_id: profile.governmentId,
      registration_number: profile.registrationNumber,
      motto: profile.motto,
      logo_url: profile.logoUrl,
      address: profile.address,
      city: profile.city,
      county: profile.county,
      postal_code: profile.postalCode,
      phone: profile.phone,
      email: profile.email,
      website: profile.website,
      established_year: profile.establishedYear === "" ? null : profile.establishedYear,
      student_capacity: profile.studentCapacity === "" ? null : profile.studentCapacity,
      description: profile.description,
      updated_at: new Date().toISOString(),
    }).eq("id", actor.schoolId)

    if (schoolUpdate.error) throw schoolUpdate.error

    const { data: existing } = await admin
      .from("school_settings")
      .select("settings")
      .eq("school_id", actor.schoolId)
      .maybeSingle()
    const previous = (existing?.settings ?? {}) as Record<string, unknown>
    const { error: saveError } = await admin.from("school_settings").upsert({
      school_id: actor.schoolId,
      settings: {
        ...previous,
        profile,
        ...settings,
        feeStructure: previous.feeStructure ?? DEFAULT_SCHOOL_SETTINGS.feeStructure,
      },
      updated_by: actor.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: "school_id" })

    if (saveError) throw saveError
    return noStoreJson(await loadSchoolSettings(actor.schoolId))
  } catch (error) {
    console.error("School settings update failed:", error)
    return noStoreJson({ error: "Unable to save school settings" }, 500)
  }
}
