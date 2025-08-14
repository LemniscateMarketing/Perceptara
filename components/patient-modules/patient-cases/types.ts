export interface CaseGenerationData {
  full_name?: string
  age?: number
  gender?: string
  presenting_concern?: string
  case_name?: string
  case_summary?: string
  template_id?: string
  field_data?: Record<string, any>
}

export interface CaseGenerationFormData {
  [fieldId: string]: any
}

export interface CaseGenerationStep {
  id: string
  name: string
  completed: boolean
}

export interface CaseFormField {
  id: string
  name: string
  type: "text" | "textarea" | "select" | "number"
  required: boolean
  evolvable: boolean
  placeholder?: string
  description?: string
  options?: string[]
}
