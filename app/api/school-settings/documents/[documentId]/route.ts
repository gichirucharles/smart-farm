import { NextResponse } from "next/server"
import { getSessionActor, hasSameOrigin } from "@/lib/auth-session"
import { getSupabaseAdmin } from "@/lib/supabase"
import { POLICY_DOCUMENT_BUCKET } from "@/lib/school-settings"

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } })
}

export async function DELETE(request: Request) {
  if (!hasSameOrigin(request)) return response({ error: "Invalid request origin" }, 403)
  const actor = await getSessionActor()
  if (!actor?.schoolId || actor.role !== "head_teacher") {
    return response({ error: "Only the head teacher can remove policy documents" }, 403)
  }

  const documentId = decodeURIComponent(new URL(request.url).pathname.split("/").filter(Boolean).at(-1) ?? "")
  if (!/^[0-9a-f-]{36}$/i.test(documentId)) return response({ error: "Document not found" }, 404)

  const admin = getSupabaseAdmin()
  const { data: document, error: lookupError } = await admin
    .from("school_settings_documents")
    .select("object_path")
    .eq("id", documentId)
    .eq("school_id", actor.schoolId)
    .maybeSingle()

  if (lookupError || !document) return response({ error: "Document not found" }, 404)
  const { error: storageError } = await admin.storage.from(POLICY_DOCUMENT_BUCKET).remove([document.object_path])
  if (storageError) return response({ error: "Unable to remove the document" }, 500)

  const { error: deleteError } = await admin
    .from("school_settings_documents")
    .delete()
    .eq("id", documentId)
    .eq("school_id", actor.schoolId)

  if (deleteError) return response({ error: "Unable to remove the document record" }, 500)
  return response({ success: true })
}
