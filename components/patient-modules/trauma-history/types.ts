// Re-export types from basic-information for consistency
export type { FieldDefinition, ModuleDefinition } from "../basic-information/types"

export interface TraumaEvent {
  type: string
  age_when_occurred: number
  description: string
  duration: string
  perpetrator_relationship: string
  disclosure_history: string
  current_impact: string
}

export interface TraumaResponse {
  symptom: string
  frequency: string
  severity: string
  triggers: string
  coping_strategies: string
}

export interface DissociationExperience {
  type: string
  frequency: string
  triggers: string
}

export interface HypervigilanceBehavior {
  behavior: string
  frequency: string
  context: string
}

export interface AvoidancePattern {
  avoided_item: string
  description: string
}

export interface ReexperiencingSymptom {
  symptom: string
  frequency: string
  content: string
}

export interface TraumaInformedCareNeed {
  need: string
  reason: string
}

export interface ResilienceFactor {
  factor: string
  description: string
}
