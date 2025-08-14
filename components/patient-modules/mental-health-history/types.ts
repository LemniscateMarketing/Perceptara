export interface MentalHealthHistoryField {
  id: string
  name: string
  type: "text" | "textarea" | "select" | "multiselect" | "list" | "boolean" | "date"
  description: string
  required: boolean
  evolvable: boolean
  variable: boolean
  sampleData: any
  clinicalPurpose: string
  placeholder?: string
  options?: string[]
}

export interface MentalHealthHistoryModule {
  id: string
  name: string
  description: string
  category: string
  version: string
  fields: MentalHealthHistoryField[]
}

export interface MentalHealthHistoryData {
  previous_therapy_experience?: string
  current_medications?: Array<{
    name: string
    dosage: string
    prescribing_doctor: string
    duration: string
    effectiveness: string
  }>
  past_medications?: Array<{
    name: string
    dosage: string
    duration: string
    reason_discontinued: string
    side_effects: string
  }>
  psychiatric_diagnoses?: Array<{
    diagnosis: string
    diagnosed_by: string
    date_diagnosed: string
    current_status: string
  }>
  hospitalization_history?: Array<{
    facility: string
    dates: string
    reason: string
    outcome: string
  }>
  family_mental_health_history?: string
  treatment_preferences?: string[]
  medication_compliance?: string
  therapy_goals?: string
  previous_therapy_outcomes?: string
  current_mental_health_providers?: Array<{
    name: string
    type: string
    frequency: string
    relationship_quality: string
  }>
}
