import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"
import {
  MAX_POLICY_DOCUMENT_BYTES,
  POLICY_DOCUMENT_BUCKET,
  POLICY_DOCUMENT_MIME_TYPES,
} from "@/lib/school-settings"

const uploadDetailsSchema = z.object({
  action: z.enum(["prepare", "complete"]),
  fileName: z.string().trim().min(1).max(180),
  contentType: z.enum(POLICY_DOCUMENT_MIME_TYPES),
  fileSize: z.number().int().positive().max(MAX_POLICY_DOCUMENT_BYTES),
  objectPath: z.string().max(500).optional(),
}).strict()

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

function safeFileName(value: string) {
  return value.replace(/[\\/\u0000-\u001f\u007f]/g, "_").replace(/\.\.+/g, ".").slice(0, 180)
}

export async function GET() {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (["parent", "student", "system_admin"].includes(actor.role)) return response({ error: "Access denied" }, 403)

  const admin = getSupabaseAdmin()
  const { data: documents, error } = await admin
    .from("school_settings_documents")
    .select("id, object_path, file_name, content_type, file_size, created_at")
    .eq("school_id", actor.schoolId)
    .order("created_at", { ascending: false })

  if (error) return response({ error: "Unable to load policy documents" }, 500)
  const signedDocuments = await Promise.all((documents ?? []).map(async (document) => {
    const { data } = await admin.storage.from(POLICY_DOCUMENT_BUCKET).createSignedUrl(document.object_path, 600)
    return { ...document, signedUrl: data?.signedUrl ?? null }
  }))
  return response({ documents: signedDocuments })
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId || actor.role !== "head_teacher") {
    return response({ error: "Only the head teacher can upload policy documents" }, 403)
  }

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return response({ error: "Invalid request body" }, 400)
  }
  const parsed = uploadDetailsSchema.safeParse(rawBody)
  if (!parsed.success) return response({ error: "File details are invalid or exceed the 12 MB limit" }, 400)

  const { action, fileName, contentType, fileSize } = parsed.data
  const admin = getSupabaseAdmin()

  if (action === "prepare") {
    const path = `${actor.schoolId}/${randomUUID()}-${safeFileName(fileName)}`
    const { data, error } = await admin.storage.from(POLICY_DOCUMENT_BUCKET).createSignedUploadUrl(path, { upsert: false })
    if (error || !data) return response({ error: "Unable to prepare document upload" }, 500)
    return response({ objectPath: path, token: data.token, signedUrl: data.signedUrl })
  }

  const objectPath = parsed.data.objectPath
  const prefix = `${actor.schoolId}/`
  if (!objectPath || !objectPath.startsWith(prefix) || objectPath.includes("..")) {
    return response({ error: "Document path is invalid" }, 400)
  }

  const { data: fileInfo, error: infoError } = await admin.storage.from(POLICY_DOCUMENT_BUCKET).info(objectPath)
  if (infoError || !fileInfo || fileInfo.size !== fileSize || fileInfo.metadata?.mimetype !== contentType) {
    return response({ error: "The uploaded document could not be verified" }, 400)
  }

  const { data: document, error } = await admin.from("school_settings_documents").insert({
    school_id: actor.schoolId,
    object_path: objectPath,
    file_name: safeFileName(fileName),
    content_type: contentType,
    file_size: fileSize,
    uploaded_by: actor.id,
  }).select("id, object_path, file_name, content_type, file_size, created_at").single()

  if (error || !document) {
    await admin.storage.from(POLICY_DOCUMENT_BUCKET).remove([objectPath])
    return response({ error: "Unable to save document details" }, 500)
  }
  const { data: signed } = await admin.storage.from(POLICY_DOCUMENT_BUCKET).createSignedUrl(objectPath, 600)
  return response({ document: { ...document, signedUrl: signed?.signedUrl ?? null } }, 201)
}
