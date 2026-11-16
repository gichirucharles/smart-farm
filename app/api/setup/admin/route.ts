import { NextResponse } from "next/server"

export function POST() {
  return NextResponse.json({ error: "Administrator setup is disabled." }, { status: 410 })
}
