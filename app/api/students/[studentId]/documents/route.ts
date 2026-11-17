import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { z } from "zod"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"

const DOCUMENT_TYPES = ["birth_certificate", "report_form", "transfer_letter", "medical_record", "profile_photo", "other"] as const
const MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const
const LEADERSHIP = new Set(["head_teacher", "director"])
const BUCKET = "student-documents"
const MAX_BYTES = 10 * 1024 * 1024

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

async function scopedStudent(studentId: string, schoolId: string) {
  return getSupabaseAdmin().from("students").select("id, school_id").eq("id", studentId).eq("school_id", schoolId).maybeSingle()
}

export async function GET(_request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const actor = await getSessionActor()
  if (!actor?.schoolId) return response({ error: "Authentication required" }, 401)
  if (!LEADERSHIP.has(actor.role)) return response({ error: "Access denied" }, 403)
  const { studentId } = await params
  const { data: student } = await scopedStudent(studentId, actor.schoolId)
  if (!student) return response({ error: "Student not found" }, 404)
  const admin = getSupabaseAdmin()
  const { data: documents, error } = await admin.from("student_documents")
    .select("id, document_type, file_name, storage_path, content_type, file_size, created_at")
    .eq("student_id", studentId).eq("school_id", actor.schoolId).order("created_at", { ascending: false })
  if (error) return response({ error: "Unable to load student documents" }, 500)
  const records = await Promise.all((documents ?? []).map(async (document) => {
    const { data } = await admin.storage.from(BUCKET).createSignedUrl(document.storage_path, 600)
    return { ...document, signedUrl: data?.signedUrl ?? null }
  }))
  return response({ documents: records })
}

export async function POST(request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId || !LEADERSHIP.has(actor.role)) return response({ error: "Access denied" }, 403)
  const { studentId } = await params
  const { data: student } = await scopedStudent(studentId, actor.schoolId)
  if (!student) return response({ error: "Student not found" }, 404)
  let raw: unknown
  try { raw = await request.json() } catch { return response({ error: "Invalid request body" }, 400) }
  const prepareSchema = z.object({
    action: z.literal("prepare"), fileName: z.string().trim().min(1).max(160), contentType: z.enum(MIME_TYPES), fileSize: z.number().int().positive().max(MAX_BYTES), documentType: z.enum(DOCUMENT_TYPES),
  }).strict()
  const completeSchema = z.object({ action: z.literal("complete"), storagePath: z.string().min(1).max(512), documentType: z.enum(DOCUMENT_TYPES), fileName: z.string().trim().min(1).max(160), contentType: z.enum(MIME_TYPES), fileSize: z.number().int().positive().max(MAX_BYTES) }).strict()
  const action = z.discriminatedUnion("action", [prepareSchema, completeSchema]).safeParse(raw)
  if (!action.success) return response({ error: "Choose a PDF, JPEG, PNG or WebP file up to 10 MB" }, 400)
  const admin = getSupabaseAdmin()

  if (action.data.action === "prepare") {
    const sanitizedName = action.data.fileName.normalize("NFKC").replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120) || "document"
    const storagePath = `${actor.schoolId}/${studentId}/${randomUUID()}-${sanitizedName}`
    const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(storagePath, { upsert: false })
    if (error || !data?.token) return response({ error: "Unable to prepare a secure upload" }, 500)
    return response({ storagePath, token: data.token })
  }

  const expectedPrefix = `${actor.schoolId}/${studentId}/`
  if (!action.data.storagePath.startsWith(expectedPrefix) || action.data.storagePath.includes("..")) return response({ error: "Invalid document location" }, 400)
  const { data: fileInfo, error: infoError } = await admin.storage.from(BUCKET).info(action.data.storagePath)
  if (infoError || !fileInfo) return response({ error: "Uploaded file was not found" }, 400)
  const metadata = fileInfo.metadata as unknown as Record<string, unknown> | null
  const uploadedSize = Number(metadata?.size ?? action.data.fileSize)
  const uploadedMimeType = typeof metadata?.mimetype === "string" ? metadata.mimetype : action.data.contentType
  if (!Number.isFinite(uploadedSize) || uploadedSize <= 0 || uploadedSize > MAX_BYTES || uploadedMimeType !== action.data.contentType) {
    await admin.storage.from(BUCKET).remove([action.data.storagePath])
    return response({ error: "The uploaded file does not match the allowed size or type" }, 400)
  }

  const { data: document, error } = await admin.from("student_documents").insert({
    student_id: studentId, school_id: actor.schoolId, document_type: action.data.documentType, file_name: action.data.fileName,
    storage_path: action.data.storagePath, content_type: action.data.contentType, file_size: action.data.fileSize, uploaded_by: actor.id,
  }).select("id").single()
  if (error || !document) {
    await admin.storage.from(BUCKET).remove([action.data.storagePath])
    return response({ error: "Unable to save the document record" }, 500)
  }
  if (action.data.documentType === "profile_photo") {
    await admin.from("students").update({ photo_url: action.data.storagePath, updated_at: new Date().toISOString() }).eq("id", studentId).eq("school_id", actor.schoolId)
  }
  return response({ id: document.id }, 201)
}
