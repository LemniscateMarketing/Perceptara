export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: "student" | "licensed_therapist" | "supervisor" | "admin"
          license_number: string | null
          specializations: string[] | null
          institution: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: "student" | "licensed_therapist" | "supervisor" | "admin"
          license_number?: string | null
          specializations?: string[] | null
          institution?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: "student" | "licensed_therapist" | "supervisor" | "admin"
          license_number?: string | null
          specializations?: string[] | null
          institution?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          name: string
          age: number
          gender: string | null
          primary_concern: string
          background: string
          complexity_level: "beginner" | "intermediate" | "advanced"
          avatar_url: string | null
          personality_traits: any | null
          clinical_presentation: any | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          age: number
          gender?: string | null
          primary_concern: string
          background: string
          complexity_level?: "beginner" | "intermediate" | "advanced"
          avatar_url?: string | null
          personality_traits?: any | null
          clinical_presentation?: any | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number
          gender?: string | null
          primary_concern?: string
          background?: string
          complexity_level?: "beginner" | "intermediate" | "advanced"
          avatar_url?: string | null
          personality_traits?: any | null
          clinical_presentation?: any | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          patient_id: string
          modality: string
          status: "active" | "completed" | "cancelled"
          duration_seconds: number
          message_count: number
          started_at: string
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          patient_id: string
          modality: string
          status?: "active" | "completed" | "cancelled"
          duration_seconds?: number
          message_count?: number
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          patient_id?: string
          modality?: string
          status?: "active" | "completed" | "cancelled"
          duration_seconds?: number
          message_count?: number
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      session_notes: {
        Row: {
          id: string
          session_id: string
          subjective: string | null
          objective: string | null
          assessment: string | null
          plan: string | null
          session_rating: number | null
          reflection_notes: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          subjective?: string | null
          objective?: string | null
          assessment?: string | null
          plan?: string | null
          session_rating?: number | null
          reflection_notes?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          subjective?: string | null
          objective?: string | null
          assessment?: string | null
          plan?: string | null
          session_rating?: number | null
          reflection_notes?: any | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
