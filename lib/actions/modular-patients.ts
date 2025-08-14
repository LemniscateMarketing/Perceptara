"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

type ModuleDefinition = {
  id: string
  name: string
  description: string
  category: string
  version: string
  enabled: boolean
  fields: any[]
}

type PatientTemplate = {
  id: string
  name: string
  description: string
  modules: string[]
  created_at: string
  updated_at: string
}

// CORRECT TYPE THAT MATCHES DATABASE TABLE
type PatientCase = {
  id: string
  template_id?: string | null
  case_name: string
  case_summary: string
  field_data: Record<string, any>
  status: string
  session_count?: number
  last_session_date?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

// Module Definitions Management
export async function getModuleDefinitions(): Promise<ModuleDefinition[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("module_definitions").select("*").order("name")

  if (error) {
    console.error("Error fetching module definitions:", error)
    return []
  }

  return data || []
}

export async function getEnabledModuleDefinitions(): Promise<ModuleDefinition[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("module_definitions").select("*").eq("enabled", true).order("name")

  if (error) {
    console.error("Error fetching enabled module definitions:", error)
    return []
  }

  return data || []
}

export async function toggleModuleEnabled(moduleId: string, enabled: boolean): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from("module_definitions")
    .update({ enabled, updated_at: new Date().toISOString() })
    .eq("id", moduleId)

  if (error) {
    console.error("Error toggling module enabled:", error)
    return false
  }

  return true
}

export async function getModuleDefinitionById(moduleId: string): Promise<ModuleDefinition | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("module_definitions").select("*").eq("id", moduleId).single()

  if (error) {
    console.error("Error fetching module definition:", error)
    return null
  }

  return data
}

export async function updateModuleDefinition(moduleId: string, updates: Partial<ModuleDefinition>): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from("module_definitions")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", moduleId)

  if (error) {
    console.error("Error updating module definition:", error)
    return false
  }

  return true
}

// Patient Templates Management
export async function getPatientTemplates(): Promise<PatientTemplate[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("patient_templates").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching patient templates:", error)
    return []
  }

  return data || []
}

export async function getPatientTemplateById(templateId: string): Promise<PatientTemplate | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("patient_templates").select("*").eq("id", templateId).single()

  if (error) {
    console.error("Error fetching patient template:", error)
    return null
  }

  return data
}

export async function createPatientTemplate(
  template: Omit<PatientTemplate, "id" | "created_at" | "updated_at">,
): Promise<PatientTemplate | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("patient_templates")
    .insert({
      ...template,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating patient template:", error)
    return null
  }

  return data
}

// Patient Cases Management
export async function getPatientCases(): Promise<PatientCase[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("patient_cases").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching patient cases:", error)
    return []
  }

  return data || []
}

export async function getPatientCaseById(caseId: string): Promise<PatientCase | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("patient_cases").select("*").eq("id", caseId).single()

  if (error) {
    console.error("Error fetching patient case:", error)
    return null
  }

  return data
}

export async function createPatientCase(
  patientCase: Omit<PatientCase, "created_at" | "updated_at">,
): Promise<PatientCase | null> {
  const supabase = createServerSupabaseClient()

  console.log("🔍 Creating patient case with data:", {
    id: patientCase.id,
    case_name: patientCase.case_name,
    case_summary: patientCase.case_summary?.substring(0, 100) + "...",
    template_id: patientCase.template_id,
    status: patientCase.status,
    field_data_size: JSON.stringify(patientCase.field_data).length,
    field_data_keys: Object.keys(patientCase.field_data || {}),
  })

  // Prepare the data for insertion - MATCH EXACT DATABASE SCHEMA
  const insertData = {
    id: patientCase.id,
    template_id: patientCase.template_id,
    case_name: patientCase.case_name,
    case_summary: patientCase.case_summary,
    field_data: patientCase.field_data,
    status: patientCase.status,
    session_count: patientCase.session_count || 0,
    last_session_date: patientCase.last_session_date || null,
    notes: patientCase.notes || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  console.log("📤 Inserting data:", insertData)

  const { data, error } = await supabase.from("patient_cases").insert(insertData).select().single()

  if (error) {
    console.error("❌ Error creating patient case:", error)
    console.error("❌ Full error details:", JSON.stringify(error, null, 2))
    console.error("❌ Data being inserted:", JSON.stringify(insertData, null, 2))
    return null
  }

  console.log("✅ Patient case created successfully:", data.id)
  return data
}

export async function updatePatientCase(caseId: string, updates: Partial<PatientCase>): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from("patient_cases")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", caseId)

  if (error) {
    console.error("Error updating patient case:", error)
    return false
  }

  return true
}

export async function deletePatientCase(caseId: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("patient_cases").delete().eq("id", caseId)

  if (error) {
    console.error("Error deleting patient case:", error)
    return false
  }

  return true
}

// Utility Functions
export function generateCaseId(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `CASE-${timestamp}-${randomStr}`.toUpperCase()
}

export async function generateCaseFromTemplate(
  templateId: string,
  overrides?: Partial<PatientCase>,
): Promise<PatientCase | null> {
  const template = await getPatientTemplateById(templateId)
  if (!template) {
    console.error("Template not found:", templateId)
    return null
  }

  const caseId = generateCaseId() // This generates "CASE-timestamp-random"
  const patientCase: Omit<PatientCase, "created_at" | "updated_at"> = {
    id: caseId, // Use the generated case ID as the database ID
    template_id: null, // Set to null to avoid foreign key issues
    case_name: `${template.name} - ${caseId}`,
    case_summary: "",
    field_data: {},
    status: "draft",
    session_count: 0,
    last_session_date: null,
    notes: null,
    ...overrides,
  }

  return await createPatientCase(patientCase)
}
