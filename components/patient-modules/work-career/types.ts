export interface WorkCareerField {
  id: string
  name: string
  type: "text" | "textarea" | "select" | "multiselect" | "list" | "number" | "date" | "boolean"
  description: string
  required: boolean
  evolvable: boolean
  variable: string
  sampleData: any
  clinicalPurpose: string
  placeholder?: string
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface WorkCareerModule {
  id: string
  name: string
  description: string
  category: string
  version: string
  fields: WorkCareerField[]
}

export interface WorkCareerData {
  employment_status?: string
  job_title?: string
  job_satisfaction?: string
  work_stress_sources?: string[]
  career_goals?: string
  work_life_balance?: string
  workplace_relationships?: string
  professional_challenges?: string[]
  career_history?: Array<{
    company: string
    position: string
    duration: string
    reason_for_leaving: string
  }>
  financial_stress?: string
  work_environment_preferences?: string[]
  professional_identity?: string
}
