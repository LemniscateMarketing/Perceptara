"use server"

import { createServerClient } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type SessionNote = Database["public"]["Tables"]["session_notes"]["Row"]
type SessionNoteInsert = Database["public"]["Tables"]["session_notes"]["Insert"]

export async function createSessionNote(note: SessionNoteInsert): Promise<SessionNote | null> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("session_notes").insert(note).select().single()

    if (error) {
      console.error("Error creating session note:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Database connection error:", error)
    return null
  }
}

export async function getSessionNotes(sessionId: string): Promise<SessionNote[]> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("session_notes")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching session notes:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Database connection error:", error)
    return []
  }
}

export async function updateSessionNote(
  noteId: string,
  updates: Partial<SessionNoteInsert>,
): Promise<SessionNote | null> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("session_notes").update(updates).eq("id", noteId).select().single()

    if (error) {
      console.error("Error updating session note:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Database connection error:", error)
    return null
  }
}
