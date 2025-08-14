// Database Schema for Modular Patient Architecture

export interface ModuleField {
  id: string
  name: string
  description: string
  type: "text" | "textarea" | "select" | "multiselect" | "date" | "number" | "boolean" | "list"
  required: boolean
  evolvable: boolean // Can this field change during therapy?
  variable: string // "{{patient.name}}" for AI prompts
  sampleData?: any
  options?: string[] // For select/multiselect
  placeholder?: string
  clinicalPurpose: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    customRules?: string[]
  }
}

export interface ModuleDefinition {
  id: string // "basic_information", "attachment_styles", etc.
  name: string // "Basic Information", "Attachment Styles"
  description: string
  version: string // "1.0.0" for versioning
  category: "demographics" | "clinical" | "behavioral" | "assessment" | "custom"
  field_definitions: ModuleField[] // Array of fields in this module
  is_enabled: boolean // Can turn modules ON/OFF
  display_order: number // Order to show modules
  created_at: string
  updated_at: string
}

export interface PatientTemplate {
  id: string // "anxiety_relationship_template"
  name: string // "Anxiety & Relationship Issues Patient"
  description: string
  category: string
  complexity_level: "beginner" | "intermediate" | "advanced"
  enabled_modules: string[] // ["basic_information", "attachment_styles"]
  module_order: string[] // Order to display modules
  template_settings: Record<string, any> // Additional settings
  is_active: boolean
  created_by: string // user_id
  created_at: string
  updated_at: string
}

// THIS IS THE CORRECT DATABASE SCHEMA - MATCHES THE ACTUAL TABLE
export interface PatientCase {
  id: string // UUID primary key
  template_id?: string | null // References PatientTemplate (nullable)
  case_name: string // "Sarah - Anxiety and Relationship Issues"
  case_summary: string
  status: "draft" | "active" | "archived"
  field_data: Record<string, any> // JSONB storing all module field values
  session_count?: number
  last_session_date?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

// Helper type for template with populated modules
export interface PatientTemplateWithModules extends PatientTemplate {
  modules: ModuleDefinition[]
}

// Helper type for case with template info
export interface PatientCaseWithTemplate extends PatientCase {
  template: PatientTemplate
}
