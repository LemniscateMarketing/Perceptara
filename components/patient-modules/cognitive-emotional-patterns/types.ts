export interface CognitiveEmotionalPatternsField {
  id: string
  name: string
  type: "text" | "textarea" | "select" | "multiselect" | "list" | "object"
  description: string
  required: boolean
  evolvable: boolean
  placeholder?: string
  options?: string[]
  sampleData: any
  variable: string
  clinicalPurpose: string
  evolution?: {
    enabled: boolean
    type: "improvement" | "deterioration" | "bidirectional"
    amount: { mode: "manual" | "ai_driven"; value: number }
    probability: { mode: "manual" | "ai_driven"; value: number }
    timing: { unit: "session" | "week" | "month"; frequency: number }
  }
}

export interface CognitiveEmotionalPatternsModule {
  id: string
  name: string
  description: string
  category: string
  version?: string
  fields: CognitiveEmotionalPatternsField[]
}

export interface CognitiveEmotionalPatternsData {
  core_beliefs: Array<{
    belief: string
    category: "self" | "others" | "world" | "future"
    strength: "weak" | "moderate" | "strong" | "very_strong"
    origin?: string
  }>
  core_fears: string[]
  thought_patterns: string[]
  self_concept: {
    identity_description: string
    strengths_perceived: string[]
    weaknesses_perceived: string[]
    roles_important: string[]
  }
  emotional_regulation_style: string
  primary_emotions: string[]
  emotional_triggers: Array<{
    trigger: string
    emotion: string
    intensity: "mild" | "moderate" | "strong" | "overwhelming"
    context?: string
  }>
  self_esteem_pattern: {
    baseline_level: "very_low" | "low" | "moderate" | "high" | "very_high"
    stability: "very_unstable" | "unstable" | "somewhat_stable" | "stable" | "very_stable"
    conditional_factors: string[]
    sources_of_validation: string[]
  }
  internal_dialogue: string
  cognitive_distortions: string[]
}
