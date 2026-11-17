import { NextResponse } from "next/server"
import { clearSessionCookie, hasSameOrigin } from "@/lib/auth-session"

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
  }
  const response = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } })
  clearSessionCookie(response)
  return response
}
