import { createClient } from "@supabase/supabase-js"

// Environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hqhbgaewatldgndhjjzy.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxaGJnYWV3YXRsZGduZGhqanp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDM4MzMsImV4cCI6MjA3MjcxOTgzM30.Z08DLbqSIHuyUFcqB-5H8f32rEqBpRCUU01JHQ6MjP4"
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return url.startsWith("http://") || url.startsWith("https://")
  } catch {
    return false
  }
}

// Validate environment variables
if (!isValidUrl(supabaseUrl)) {
  console.error("Invalid Supabase URL:", supabaseUrl)
  throw new Error(`Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL. Got: ${supabaseUrl}`)
}

if (!supabaseAnonKey || supabaseAnonKey.length < 10) {
  console.error("Invalid Supabase Anon Key")
  throw new Error("Invalid supabaseAnonKey: Must be a valid JWT token")
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // This app authenticates against its own users table. Keep Supabase Auth
  // disabled in the browser so the embedded preview does not require auth
  // cookies or cross-origin callback handling.
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

// Create admin client (server-side only)
export const getSupabaseAdmin = () => {
  if (!supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Database types
export interface User {
  id: string
  email: string
  phone?: string
  password_hash: string
  role:
    | "system_admin"
    | "director"
    | "head_teacher"
    | "deputy_head_teacher"
    | "class_teacher"
    | "subject_teacher"
    | "nurse"
    | "counselor"
    | "parent"
  first_name: string
  last_name: string
  school_id?: string
  is_first_login: boolean
  last_login?: string
  created_at: string
  updated_at: string
  schools?: {
    id: string
    name: string
    registration_number: string
    subscription_status?: string
  }
}

export interface School {
  id: string
  name: string
  address: string
  phone: string
  email: string
  registration_number: string
  director_id?: string
  subscription_plan: "basic" | "premium" | "enterprise"
  subscription_status: "active" | "inactive" | "suspended"
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  admission_number: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: "male" | "female"
  class_id: string
  school_id: string
  parent_email?: string
  parent_phone?: string
  parent_name?: string
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  name: string
  level: string
  stream?: string
  school_id: string
  class_teacher_id?: string
  created_at: string
  updated_at: string
}
