"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export interface ModuleSettings {
  module_id: string
  enabled: boolean
  display_order: number
  updated_at: string
  updated_by?: string
  created_at: string
}

// Get all module settings
export async function getModuleSettings(): Promise<ModuleSettings[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("module_settings").select("*").order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching module settings:", error)
    return []
  }

  return data || []
}

// Get enabled modules only
export async function getEnabledModuleSettings(): Promise<ModuleSettings[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("module_settings")
    .select("*")
    .eq("enabled", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching enabled module settings:", error)
    return []
  }

  return data || []
}

// Toggle module enabled/disabled - Fixed to handle existing records properly
export async function toggleModuleEnabled(moduleId: string, enabled: boolean, userId?: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  try {
    // First, try to get the existing record
    const { data: existing, error: fetchError } = await supabase
      .from("module_settings")
      .select("*")
      .eq("module_id", moduleId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.error("Error fetching existing module setting:", fetchError)
      return false
    }

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("module_settings")
        .update({
          enabled,
          updated_at: new Date().toISOString(),
          updated_by: userId,
        })
        .eq("module_id", moduleId)

      if (updateError) {
        console.error("Error updating module enabled:", updateError)
        return false
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase.from("module_settings").insert({
        module_id: moduleId,
        enabled,
        display_order: getDefaultDisplayOrder(moduleId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: userId,
      })

      if (insertError) {
        console.error("Error inserting module setting:", insertError)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error in toggleModuleEnabled:", error)
    return false
  }
}

// Helper function to get default display order for modules
function getDefaultDisplayOrder(moduleId: string): number {
  const defaultOrders: Record<string, number> = {
    basic_information: 1,
    behavioral_patterns: 2,
    cognitive_emotional_patterns: 3,
    work_career: 4,
    mental_health_history: 5,
    family_dynamics: 6,
    trauma_history: 7,
  }
  return defaultOrders[moduleId] || 999
}

// Update module display order
export async function updateModuleDisplayOrder(
  moduleId: string,
  displayOrder: number,
  userId?: string,
): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  try {
    // First check if record exists
    const { data: existing, error: fetchError } = await supabase
      .from("module_settings")
      .select("*")
      .eq("module_id", moduleId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching existing module setting:", fetchError)
      return false
    }

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("module_settings")
        .update({
          display_order: displayOrder,
          updated_at: new Date().toISOString(),
          updated_by: userId,
        })
        .eq("module_id", moduleId)

      if (updateError) {
        console.error("Error updating module display order:", updateError)
        return false
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase.from("module_settings").insert({
        module_id: moduleId,
        enabled: true,
        display_order: displayOrder,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: userId,
      })

      if (insertError) {
        console.error("Error inserting module setting:", insertError)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error in updateModuleDisplayOrder:", error)
    return false
  }
}

// Bulk update module settings - Fixed to handle existing records
export async function bulkUpdateModuleSettings(
  updates: Array<{ module_id: string; enabled?: boolean; display_order?: number }>,
  userId?: string,
): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  try {
    for (const update of updates) {
      // Check if record exists
      const { data: existing, error: fetchError } = await supabase
        .from("module_settings")
        .select("*")
        .eq("module_id", update.module_id)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching existing module setting:", fetchError)
        continue
      }

      const updateData: any = {
        updated_at: new Date().toISOString(),
        updated_by: userId,
      }

      if (update.enabled !== undefined) updateData.enabled = update.enabled
      if (update.display_order !== undefined) updateData.display_order = update.display_order

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("module_settings")
          .update(updateData)
          .eq("module_id", update.module_id)

        if (updateError) {
          console.error("Error updating module setting:", updateError)
          return false
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase.from("module_settings").insert({
          module_id: update.module_id,
          enabled: update.enabled ?? true,
          display_order: update.display_order ?? getDefaultDisplayOrder(update.module_id),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: userId,
        })

        if (insertError) {
          console.error("Error inserting module setting:", insertError)
          return false
        }
      }
    }

    return true
  } catch (error) {
    console.error("Error in bulkUpdateModuleSettings:", error)
    return false
  }
}

// Initialize module settings for new modules - Fixed to handle existing records
export async function initializeModuleSettings(moduleId: string, enabled = true, displayOrder = 999): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  try {
    // Check if record already exists
    const { data: existing, error: fetchError } = await supabase
      .from("module_settings")
      .select("*")
      .eq("module_id", moduleId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching existing module setting:", fetchError)
      return false
    }

    if (existing) {
      // Record already exists, no need to initialize
      return true
    }

    // Insert new record
    const { error: insertError } = await supabase.from("module_settings").insert({
      module_id: moduleId,
      enabled,
      display_order: displayOrder,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error initializing module settings:", insertError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in initializeModuleSettings:", error)
    return false
  }
}

// Reset module settings to defaults
export async function resetModuleSettingsToDefaults(moduleId: string, userId?: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  try {
    // Default settings based on module ID
    const defaultSettings = {
      basic_information: { enabled: true, display_order: 1 },
      behavioral_patterns: { enabled: true, display_order: 2 },
      cognitive_emotional_patterns: { enabled: true, display_order: 3 },
      work_career: { enabled: true, display_order: 4 },
      mental_health_history: { enabled: true, display_order: 5 },
      family_dynamics: { enabled: true, display_order: 6 },
      trauma_history: { enabled: true, display_order: 7 },
    }

    const defaults = defaultSettings[moduleId as keyof typeof defaultSettings] || { enabled: true, display_order: 999 }

    // Check if record exists
    const { data: existing, error: fetchError } = await supabase
      .from("module_settings")
      .select("*")
      .eq("module_id", moduleId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching existing module setting:", fetchError)
      return false
    }

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("module_settings")
        .update({
          enabled: defaults.enabled,
          display_order: defaults.display_order,
          updated_at: new Date().toISOString(),
          updated_by: userId,
        })
        .eq("module_id", moduleId)

      if (updateError) {
        console.error("Error resetting module settings:", updateError)
        return false
      }
    } else {
      // Insert new record with defaults
      const { error: insertError } = await supabase.from("module_settings").insert({
        module_id: moduleId,
        enabled: defaults.enabled,
        display_order: defaults.display_order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: userId,
      })

      if (insertError) {
        console.error("Error inserting default module settings:", insertError)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error in resetModuleSettingsToDefaults:", error)
    return false
  }
}

// Export all module settings
export async function exportModuleSettings(): Promise<any> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("module_settings").select("*").order("display_order", { ascending: true })

  if (error) {
    console.error("Error exporting module settings:", error)
    return null
  }

  return {
    exportedAt: new Date().toISOString(),
    version: "1.0.0",
    totalModules: data?.length || 0,
    enabledModules: data?.filter((m) => m.enabled).length || 0,
    settings: data || [],
  }
}

// Import module settings - Fixed to handle existing records
export async function importModuleSettings(settingsData: any, userId?: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  if (!settingsData.settings || !Array.isArray(settingsData.settings)) {
    console.error("Invalid settings data format")
    return false
  }

  try {
    for (const setting of settingsData.settings) {
      // Check if record exists
      const { data: existing, error: fetchError } = await supabase
        .from("module_settings")
        .select("*")
        .eq("module_id", setting.module_id)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching existing module setting:", fetchError)
        continue
      }

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("module_settings")
          .update({
            enabled: setting.enabled,
            display_order: setting.display_order,
            updated_at: new Date().toISOString(),
            updated_by: userId,
          })
          .eq("module_id", setting.module_id)

        if (updateError) {
          console.error("Error updating imported module setting:", updateError)
          return false
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase.from("module_settings").insert({
          module_id: setting.module_id,
          enabled: setting.enabled,
          display_order: setting.display_order,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: userId,
        })

        if (insertError) {
          console.error("Error inserting imported module setting:", insertError)
          return false
        }
      }
    }

    return true
  } catch (error) {
    console.error("Error in importModuleSettings:", error)
    return false
  }
}
