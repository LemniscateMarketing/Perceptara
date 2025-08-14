"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export interface SimplePatientCase {
  id: string
  template_id?: string | null
  case_name: string
  case_summary: string | null
  field_data: Record<string, any>
  status: string
  created_at: string
  updated_at: string
}

export async function createSimplePatientCase(caseData: {
  case_name: string
  case_summary: string
  case_reference: string // This should be mapped to id
  field_data: Record<string, any>
}): Promise<SimplePatientCase | null> {
  const supabase = createServerSupabaseClient()

  console.log("🔍 Creating simple patient case with data:", {
    case_name: caseData.case_name,
    case_summary: caseData.case_summary?.substring(0, 100) + "...",
    case_reference: caseData.case_reference, // This is our generated case ID
    field_data_size: JSON.stringify(caseData.field_data).length,
    field_data_keys: Object.keys(caseData.field_data || {}),
  })

  // Map case_reference to id for database insertion - only include fields that exist in the table
  const insertData = {
    id: caseData.case_reference, // Use case_reference as the database id
    case_name: caseData.case_name,
    case_summary: caseData.case_summary,
    field_data: caseData.field_data,
    status: "active",
  }

  console.log("📤 Inserting data with id:", insertData.id)

  const { data, error } = await supabase.from("patient_cases").insert(insertData).select().single()

  if (error) {
    console.error("❌ Error creating simple patient case:", error)
    console.error("❌ Full error details:", JSON.stringify(error, null, 2))
    console.error("❌ Data being inserted:", JSON.stringify(insertData, null, 2))
    return null
  }

  console.log("✅ Simple patient case created successfully with id:", data.id)
  return data
}

export async function getSimplePatientCases(): Promise<SimplePatientCase[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("patient_cases").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching simple patient cases:", error)
    return []
  }

  return data || []
}

export async function getSimplePatientCaseById(id: string): Promise<SimplePatientCase | null> {
  const supabase = createServerSupabaseClient()

  console.log("🔍 Searching for patient case with id:", id)

  const { data, error } = await supabase.from("patient_cases").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching simple patient case by id:", error)
    return null
  }

  console.log("✅ Found patient case:", data?.id)
  return data
}

export async function updateSimplePatientCase(id: string, updates: Partial<SimplePatientCase>): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  console.log("🔄 Updating patient case with id:", id)

  const { error } = await supabase
    .from("patient_cases")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error updating simple patient case:", error)
    return false
  }

  console.log("✅ Patient case updated successfully")
  return true
}

export async function deleteSimplePatientCase(id: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  console.log("🗑️ Deleting patient case with id:", id)

  const { error } = await supabase.from("patient_cases").delete().eq("id", id)

  if (error) {
    console.error("Error deleting simple patient case:", error)
    return false
  }

  console.log("✅ Patient case deleted successfully")
  return true
}

// Advanced JSONB querying functions
export async function searchPatientsByField(fieldPath: string, value: any): Promise<SimplePatientCase[]> {
  const supabase = createServerSupabaseClient()

  console.log(`🔍 Searching patients where ${fieldPath} = ${value}`)

  const { data, error } = await supabase
    .from("patient_cases")
    .select("*")
    .contains("field_data", { [fieldPath]: value })

  if (error) {
    console.error("Error searching patients by field:", error)
    return []
  }

  return data || []
}

export async function getPatientsByAge(minAge: number, maxAge?: number): Promise<SimplePatientCase[]> {
  const supabase = createServerSupabaseClient()

  let query = supabase.from("patient_cases").select("*").gte("field_data->age_and_birth->age", minAge)

  if (maxAge) {
    query = query.lte("field_data->age_and_birth->age", maxAge)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error searching patients by age:", error)
    return []
  }

  return data || []
}

export async function getPatientsByGender(gender: string): Promise<SimplePatientCase[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("patient_cases").select("*").eq("field_data->gender", gender)

  if (error) {
    console.error("Error searching patients by gender:", error)
    return []
  }

  return data || []
}

// Helper function to extract common fields from field_data
export function extractPatientSummary(patientCase: SimplePatientCase) {
  const fieldData = patientCase.field_data || {}

  return {
    id: patientCase.id,
    case_name: patientCase.case_name,
    full_name: fieldData.full_name || "Unknown",
    age: fieldData.age_and_birth?.age || "Unknown",
    gender: fieldData.gender || "Unknown",
    presenting_concern: fieldData.presenting_concern || "Not specified",
    status: patientCase.status,
    created_at: patientCase.created_at,
    total_fields: Object.keys(fieldData).length,
    modules_used: fieldData._modules_used || [],
  }
}
