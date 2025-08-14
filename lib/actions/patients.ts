"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

// Import modular patient functions
import {
  getPatientCases,
  getPatientCaseById,
  createPatientCase,
  updatePatientCase,
  deletePatientCase,
} from "./modular-patients"

// Re-export modular functions with legacy names for backward compatibility
export {
  getPatientCases as getPatients,
  getPatientCaseById as getPatientById,
  createPatientCase as createPatient,
  updatePatientCase as updatePatient,
  deletePatientCase as deletePatient,
}

// Legacy patient type for backward compatibility
export type Patient = {
  id: string
  name: string
  age: number
  primaryConcern: string
  primary_concern: string
  background: string
  avatar: string
  avatar_url?: string
  personality_traits?: any
  // Add other fields that components might expect
  case_name?: string
  case_summary?: string
  field_data?: Record<string, any>
  status?: string
  session_count?: number
  created_at?: string
  updated_at?: string
}

// Convert modular patient case to legacy patient format
export function convertCaseToPatient(patientCase: any): Patient {
  const basicInfo = patientCase.field_data?.basic_information || {}
  const mentalHealth = patientCase.field_data?.mental_health_history || {}

  return {
    id: patientCase.id,
    name: basicInfo.full_name || patientCase.case_name || "Unknown Patient",
    age: basicInfo.age_and_birth?.age || 25,
    primaryConcern: mentalHealth.presenting_concern || patientCase.case_summary || "General therapy session",
    primary_concern: mentalHealth.presenting_concern || patientCase.case_summary || "General therapy session",
    background: patientCase.case_summary || "Patient seeking therapeutic support",
    avatar: basicInfo.avatar_url || "/placeholder.svg",
    avatar_url: basicInfo.avatar_url || "/placeholder.svg",
    personality_traits: patientCase.field_data?.behavioral_patterns || { traits: ["thoughtful", "seeking help"] },
    // Include original modular data
    case_name: patientCase.case_name,
    case_summary: patientCase.case_summary,
    field_data: patientCase.field_data,
    status: patientCase.status,
    session_count: patientCase.session_count,
    created_at: patientCase.created_at,
    updated_at: patientCase.updated_at,
  }
}

// Get patients in legacy format
export async function getPatientsLegacyFormat(): Promise<Patient[]> {
  try {
    const patientCases = await getPatientCases()
    return patientCases.map(convertCaseToPatient)
  } catch (error) {
    console.error("Error fetching patients in legacy format:", error)
    return []
  }
}

// Get patient by ID in legacy format
export async function getPatientByIdLegacyFormat(id: string): Promise<Patient | null> {
  try {
    const patientCase = await getPatientCaseById(id)
    if (!patientCase) return null
    return convertCaseToPatient(patientCase)
  } catch (error) {
    console.error("Error fetching patient by ID in legacy format:", error)
    return null
  }
}

// Create patient from legacy format
export async function createPatientFromLegacy(patient: Partial<Patient>): Promise<Patient | null> {
  try {
    // Convert legacy patient data to modular format
    const patientCase = {
      id: patient.id || crypto.randomUUID(),
      case_name: patient.name || "Unknown Patient",
      case_summary:
        patient.background || patient.primaryConcern || patient.primary_concern || "General therapy session",
      template_id: null, // No template for legacy conversions
      field_data: {
        basic_information: {
          full_name: patient.name,
          age_and_birth: {
            age: patient.age || 25,
            date_of_birth: patient.age
              ? new Date(new Date().getFullYear() - patient.age, 0, 1).toISOString().split("T")[0]
              : undefined,
          },
          avatar_url: patient.avatar || patient.avatar_url,
        },
        mental_health_history: {
          presenting_concern: patient.primaryConcern || patient.primary_concern,
        },
        behavioral_patterns: patient.personality_traits || { traits: ["thoughtful", "seeking help"] },
      },
      status: "active" as const,
      session_count: 0,
    }

    const result = await createPatientCase(patientCase)
    if (!result) return null

    return convertCaseToPatient(result)
  } catch (error) {
    console.error("Error creating patient from legacy format:", error)
    return null
  }
}

// Database connection test using modular system
export async function testDatabaseConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const supabase = createServerSupabaseClient()

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("patient_cases")
      .select("count")
      .limit(1)

    if (connectionError) {
      return {
        success: false,
        message: "Database connection failed",
        details: connectionError,
      }
    }

    // Test modular tables exist
    const { data: modulesTest, error: modulesError } = await supabase
      .from("module_definitions")
      .select("count")
      .limit(1)

    if (modulesError) {
      return {
        success: false,
        message: "Modular tables not found - run migration script",
        details: modulesError,
      }
    }

    // Get actual counts
    const [casesResult, templatesResult, modulesResult] = await Promise.all([
      supabase.from("patient_cases").select("id", { count: "exact" }),
      supabase.from("patient_templates").select("id", { count: "exact" }),
      supabase.from("module_definitions").select("id", { count: "exact" }),
    ])

    return {
      success: true,
      message: "Modular database system operational",
      details: {
        patient_cases: casesResult.count || 0,
        patient_templates: templatesResult.count || 0,
        module_definitions: modulesResult.count || 0,
        tables_status: "All modular tables accessible",
      },
    }
  } catch (error) {
    return {
      success: false,
      message: "Database test failed",
      details: error,
    }
  }
}
