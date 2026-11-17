import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { getSupabaseAdmin } from "@/lib/supabase"

const SESSION_COOKIE = "shule_verse_session"
const SESSION_TTL_SECONDS = 60 * 60 * 8

type SessionPayload = { sub: string; exp: number }

function sessionSecret() {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) throw new Error("Missing Supabase server secret")
  return secret
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url")
}

export function issueSessionCookie(response: Response, userId: string) {
  const payload = Buffer.from(JSON.stringify({
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  } satisfies SessionPayload)).toString("base64url")
  const value = `${payload}.${sign(payload)}`
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  )
}

export function clearSessionCookie(response: Response) {
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  )
}

export function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  if (!origin) return false
  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

export async function getSessionActor() {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null

  const [payload, signature, extra] = token.split(".")
  if (!payload || !signature || extra) return null

  try {
    const expected = Buffer.from(sign(payload), "base64url")
    const received = Buffer.from(signature, "base64url")
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null

    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload
    if (typeof session.sub !== "string" || typeof session.exp !== "number" || session.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }

    const { data: user, error } = await getSupabaseAdmin()
      .from("users")
      .select("id, email, role, school_id, first_name, last_name")
      .eq("id", session.sub)
      .maybeSingle()

    if (error || !user) return null
    return {
      id: user.id as string,
      email: user.email as string,
      role: user.role as string,
      schoolId: (user.school_id as string | null) ?? null,
      firstName: user.first_name as string,
      lastName: user.last_name as string,
    }
  } catch {
    return null
  }
}
