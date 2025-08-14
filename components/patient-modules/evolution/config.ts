import type { EvolutionConfig, EvolutionType, TimingUnit } from "./types"

export const DEFAULT_EVOLUTION_CONFIG: EvolutionConfig = {
  enabled: false,
  type: "increase",
  amount: {
    mode: "manual",
    value: 1,
  },
  probability: {
    mode: "manual",
    value: 50,
  },
  timing: {
    unit: "session",
    frequency: 3,
  },
}

export const EVOLUTION_TYPES: Array<{
  value: EvolutionType
  label: string
  description: string
}> = [
  {
    value: "increase",
    label: "Increase Only",
    description: "Field can only go up (skills, experience, age)",
  },
  {
    value: "decrease",
    label: "Decrease Only",
    description: "Field can only go down (symptoms, stress levels)",
  },
  {
    value: "bidirectional",
    label: "Bidirectional",
    description: "Can go both up and down (motivation, self-esteem, focus)",
  },
  {
    value: "switch",
    label: "Switch",
    description: "Changes to completely different values (relationship status, identity, role)",
  },
  {
    value: "ai_decide",
    label: "Let AI Decide",
    description: "AI will choose the most appropriate evolution pattern",
  },
]

export const TIMING_UNITS: Array<{
  value: TimingUnit
  label: string
  description: string
}> = [
  {
    value: "session",
    label: "Session",
    description: "Every X sessions",
  },
  {
    value: "during_session",
    label: "During Session",
    description: "Every X minutes during session",
  },
  {
    value: "minute",
    label: "Minute",
    description: "Every X minutes",
  },
  {
    value: "hour",
    label: "Hour",
    description: "Every X hours",
  },
  {
    value: "day",
    label: "Day",
    description: "Every X days",
  },
  {
    value: "week",
    label: "Week",
    description: "Every X weeks",
  },
  {
    value: "month",
    label: "Month",
    description: "Every X months",
  },
  {
    value: "year",
    label: "Year",
    description: "Every X years",
  },
  {
    value: "ai_decide",
    label: "Let AI Decide",
    description: "AI will determine the optimal timing",
  },
]

export const getSmartDefaults = (fieldType: string, fieldId: string): Partial<EvolutionConfig> => {
  // Age fields typically increase
  if (fieldId.includes("age") || fieldType === "age_date") {
    return {
      type: "increase",
      amount: { mode: "manual", value: 1 },
      probability: { mode: "manual", value: 100 },
      timing: { unit: "session", frequency: 12 },
    }
  }

  // List fields often benefit from multiple changes
  if (fieldType === "list") {
    return {
      type: "bidirectional",
      amount: { mode: "manual", value: 1 },
      probability: { mode: "manual", value: 30 },
      timing: { unit: "session", frequency: 2 },
    }
  }

  return {}
}
