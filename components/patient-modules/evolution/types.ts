export type EvolutionType = "increase" | "decrease" | "bidirectional" | "switch" | "ai_decide"

export type TimingUnit =
  | "session"
  | "during_session"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year"
  | "ai_decide"

export interface EvolutionConfig {
  enabled: boolean
  type: EvolutionType
  amount: {
    mode: "manual" | "ai_decide"
    value: number
  }
  probability: {
    mode: "manual" | "ai_decide"
    value: number
  }
  timing: {
    unit: TimingUnit
    frequency: number
  }
}

export interface EvolutionChange {
  fieldId: string
  timestamp: Date
  changeType: EvolutionType
  oldValue: any
  newValue: any
  description: string
}

export interface EvolutionHistory {
  fieldId: string
  changes: EvolutionChange[]
}
