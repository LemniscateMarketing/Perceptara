"use server"

import { createServerClient } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Session = Database["public"]["Tables"]["sessions"]["Row"]
type SessionInsert = Database["public"]["Tables"]["sessions"]["Insert"]

export async function createSession(session: SessionInsert): Promise<Session | null> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("sessions").insert(session).select().single()

    if (error) {
      console.error("Error creating session:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Database connection error:", error)
    return null
  }
}

export async function getSessionsByUser(userId: string): Promise<Session[]> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("sessions")
      .select(`
        *,
        patients (
          id,
          name,
          avatar_url
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching sessions:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Database connection error:", error)
    return []
  }
}

export async function updateSession(sessionId: string, updates: Partial<SessionInsert>): Promise<Session | null> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("sessions").update(updates).eq("id", sessionId).select().single()

    if (error) {
      console.error("Error updating session:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Database connection error:", error)
    return null
  }
}
