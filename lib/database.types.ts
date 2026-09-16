export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          role: string
          first_name: string
          last_name: string
          phone: string | null
          school_id: string | null
          is_first_login: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          role: string
          first_name: string
          last_name: string
          phone?: string | null
          school_id?: string | null
          is_first_login?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          role?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          school_id?: string | null
          is_first_login?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          email: string
          registration_number: string
          director_id: string | null
          subscription_plan: string
          subscription_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          email: string
          registration_number: string
          director_id?: string | null
          subscription_plan?: string
          subscription_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          email?: string
          registration_number?: string
          director_id?: string | null
          subscription_plan?: string
          subscription_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          first_name: string
          last_name: string
          date_of_birth: string
          gender: string
          class_id: string
          school_id: string
          parent_id: string | null
          admission_number: string
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          date_of_birth: string
          gender: string
          class_id: string
          school_id: string
          parent_id?: string | null
          admission_number: string
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string
          gender?: string
          class_id?: string
          school_id?: string
          parent_id?: string | null
          admission_number?: string
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          level: string
          stream: string | null
          school_id: string
          class_teacher_id: string | null
          academic_year: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          level: string
          stream?: string | null
          school_id: string
          class_teacher_id?: string | null
          academic_year: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          level?: string
          stream?: string | null
          school_id?: string
          class_teacher_id?: string | null
          academic_year?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role:
        | "system_admin"
        | "director"
        | "head_teacher"
        | "deputy_head_teacher"
        | "class_teacher"
        | "subject_teacher"
        | "school_nurse"
        | "school_counselor"
        | "accountant"
        | "parent"
        | "student"
      subscription_plan: "basic" | "premium" | "enterprise"
      subscription_status: "active" | "inactive" | "suspended"
      gender: "male" | "female"
      term: "term_1" | "term_2" | "term_3"
      assessment_type: "cat" | "exam" | "assignment"
    }
  }
}
