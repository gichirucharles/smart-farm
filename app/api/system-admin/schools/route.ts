import { NextResponse } from "next/server"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

const SCHOOL_TYPES = new Set([
  "public_primary",
  "private_primary",
  "public_secondary",
  "private_secondary",
  "mixed",
  "special_needs",
  "technical_vocational",
])

function response(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  })
}

function isText(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor) return response({ error: "Authentication required" }, 401)
  if (actor.role !== "system_admin") return response({ error: "Access denied" }, 403)

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("schools")
      .select("id, name, school_type, government_id, registration_number, motto, logo_url, address, city, county, postal_code, phone, email, website, established_year, student_capacity, description, is_active, created_at, subscription_status")
      .order("created_at", { ascending: false })
      .limit(500)

    if (error) return response({ error: "Unable to load schools" }, 500)
    return response({ schools: data ?? [] })
  } catch {
    return response({ error: "Unable to load schools" }, 500)
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)

  const actor = await getSessionActor()
  if (!actor) return response({ error: "Authentication required" }, 401)
  if (actor.role !== "system_admin") return response({ error: "Access denied" }, 403)

  let parsedBody: unknown
  try {
    parsedBody = await request.json()
  } catch {
    return response({ error: "Invalid request body" }, 400)
  }
  if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
    return response({ error: "Invalid request body" }, 400)
  }

  const body = parsedBody as Record<string, unknown>
  const { name, schoolType, governmentId, registrationNumber, address, city, county, postalCode, phone, email, website, establishedYear, studentCapacity, motto, description } = body
  if (
    !isText(name, 160) ||
    typeof schoolType !== "string" || !SCHOOL_TYPES.has(schoolType) ||
    !isText(governmentId, 100) ||
    !isText(address, 500) ||
    !isText(city, 100) ||
    !isText(county, 100) ||
    !isText(phone, 40) ||
    typeof email !== "string" || !isText(email, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    (registrationNumber !== undefined && registrationNumber !== "" && !isText(registrationNumber, 100)) ||
    (postalCode !== undefined && postalCode !== "" && !isText(postalCode, 24)) ||
    (motto !== undefined && motto !== "" && !isText(motto, 500)) ||
    (description !== undefined && description !== "" && !isText(description, 5000)) ||
    (website !== undefined && website !== "" && !isText(website, 500))
  ) {
    return response({ error: "Check the required fields and try again." }, 400)
  }

  const schoolName = name as string
  const governmentIdValue = governmentId as string
  const addressValue = address as string
  const cityValue = city as string
  const countyValue = county as string
  const phoneValue = phone as string
  const emailValue = email as string

  let normalizedWebsite: string | null = null
  if (typeof website === "string" && website.trim()) {
    try {
      const parsed = new URL(website.trim())
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Invalid protocol")
      normalizedWebsite = parsed.toString()
    } catch {
      return response({ error: "Enter a valid website URL, including https://." }, 400)
    }
  }

  const year = establishedYear === "" || establishedYear == null ? null : Number(establishedYear)
  const capacity = studentCapacity === "" || studentCapacity == null ? null : Number(studentCapacity)
  const currentYear = new Date().getFullYear()
  if (
    (year !== null && (!Number.isInteger(year) || year < 1800 || year > currentYear)) ||
    (capacity !== null && (!Number.isSafeInteger(capacity) || capacity < 0))
  ) {
    return response({ error: "Enter a valid establishment year and non-negative student capacity." }, 400)
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("schools")
      .insert({
        name: schoolName.trim(),
        school_type: schoolType,
        government_id: governmentIdValue.trim(),
        registration_number: typeof registrationNumber === "string" && registrationNumber.trim() ? registrationNumber.trim() : null,
        address: addressValue.trim(),
        city: cityValue.trim(),
        county: countyValue.trim(),
        postal_code: typeof postalCode === "string" && postalCode.trim() ? postalCode.trim() : null,
        phone: phoneValue.trim(),
        email: emailValue.trim().toLowerCase(),
        website: normalizedWebsite,
        established_year: year,
        student_capacity: capacity,
        motto: typeof motto === "string" && motto.trim() ? motto.trim() : null,
        description: typeof description === "string" && description.trim() ? description.trim() : null,
        is_active: true,
      })
      .select("id, name, school_type, government_id, registration_number, motto, logo_url, address, city, county, postal_code, phone, email, website, established_year, student_capacity, description, is_active, created_at, subscription_status")
      .single()

    if (error?.code === "23505") return response({ error: "A school with that government ID already exists." }, 409)
    if (error || !data) return response({ error: "Unable to create school" }, 500)
    return response({ school: data }, 201)
  } catch {
    return response({ error: "Unable to create school" }, 500)
  }
}

export async function PATCH(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)

  const actor = await getSessionActor()
  if (!actor) return response({ error: "Authentication required" }, 401)
  if (actor.role !== "system_admin") return response({ error: "Access denied" }, 403)

  let parsedBody: unknown
  try {
    parsedBody = await request.json()
  } catch {
    return response({ error: "Invalid request body" }, 400)
  }
  if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
    return response({ error: "Invalid request body" }, 400)
  }
  const body = parsedBody as Record<string, unknown>
  if (typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id) || typeof body.isActive !== "boolean") {
    return response({ error: "Invalid school status update" }, 400)
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("schools")
      .update({ is_active: body.isActive, updated_at: new Date().toISOString() })
      .eq("id", body.id)
      .select("id, is_active")
      .maybeSingle()

    if (error) return response({ error: "Unable to update school status" }, 500)
    if (!data) return response({ error: "School not found" }, 404)
    return response({ school: data })
  } catch {
    return response({ error: "Unable to update school status" }, 500)
  }
}
