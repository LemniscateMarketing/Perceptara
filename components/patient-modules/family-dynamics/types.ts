export interface FamilyMember {
  name: string
  relationship: string
  age: number
  living_status: "alive" | "deceased"
  relationship_quality: "very_close" | "close" | "neutral" | "distant" | "estranged" | "conflicted"
  contact_frequency: "daily" | "weekly" | "monthly" | "rarely" | "no_contact"
  description: string
}

export interface FamilyConflict {
  participants: string
  issue: string
  duration: string
  resolution_status: "resolved" | "ongoing" | "unresolved"
  impact_on_patient: string
}

export interface ChildhoodMemory {
  age_range: string
  memory_type: "positive" | "negative" | "neutral" | "traumatic"
  description: string
  emotional_impact: string
}

export interface FamilyDynamicsData {
  family_structure: string
  family_members: FamilyMember[]
  primary_caregiver_childhood: string
  childhood_family_environment: string
  family_communication_style: string
  family_roles_patient: string[]
  family_mental_health_history: string[]
  family_cultural_background: string
  family_traditions_values: string[]
  current_living_situation: string
  family_support_level: string
  family_conflicts: FamilyConflict[]
  childhood_memories: ChildhoodMemory[]
  family_secrets_issues: string
  family_financial_situation: string
  family_education_values: string
  family_religious_spiritual: string
  family_substance_use: string[]
  family_violence_history: string
  family_therapy_history: string
}
