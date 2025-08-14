export interface BehavioralPatternsField {
  id: string
  name: string
  description: string
  type: "text" | "textarea" | "select" | "multiselect" | "list"
  variable: string
  placeholder?: string
  options?: string[]
  sampleData: any
  required: boolean
  evolvable: boolean
  clinicalPurpose: string
  evolution?: {
    enabled: boolean
    type: "improvement" | "deterioration" | "bidirectional"
    amount: { mode: "manual" | "ai_driven"; value: number }
    probability: { mode: "manual" | "ai_driven"; value: number }
    timing: { unit: "session" | "week" | "month"; frequency: number }
  }
}

export interface BehavioralPatternsModule {
  id: string
  name: string
  description: string
  category: string
  fields: BehavioralPatternsField[]
}

export interface BehavioralPatternsData {
  communication_style: string
  conflict_resolution: string
  decision_making_pattern: string
  social_interaction_style: string
  avoidance_behaviors: Array<{
    behavior: string
    trigger: string
    frequency: string
  }>
  self_care_routines: Array<{
    activity: string
    frequency: string
    consistency: string
  }>
  coping_mechanisms: Array<{
    mechanism: string
    effectiveness: string
    healthy: boolean
  }>
  stress_response_pattern: string
  primary_triggers: string[]
  hobbies_interests: Array<{
    activity: string
    engagement_level: string
    social_aspect: string
  }>
}
