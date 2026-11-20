import { getSupabaseAdmin } from "@/lib/supabase"

export type ModuleAccess = "none" | "view" | "edit"

export async function getModuleAccess(role: string, moduleKey: string): Promise<ModuleAccess> {
  if (role === "director") return "edit"
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("role_module_permissions")
      .select("access_level")
      .eq("role", role)
      .eq("module_key", moduleKey)
      .maybeSingle()
    if (error) return "none"
    if (data?.access_level && ["none", "view", "edit"].includes(data.access_level)) return data.access_level as ModuleAccess
  } catch {
    return "none"
  }
  return role === "head_teacher" ? "edit" : "view"
}

export async function canAccessModule(role: string, moduleKey: string, required: "view" | "edit" = "view") {
  const access = await getModuleAccess(role, moduleKey)
  return required === "view" ? access !== "none" : access === "edit"
}
