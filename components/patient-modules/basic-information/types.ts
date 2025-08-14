import type { EvolutionConfig } from "../evolution/types"

export interface FieldDefinition {
  id: string
  name: string
  description: string
  type: "text" | "textarea" | "number" | "date" | "select" | "list" | "age_date"
  required: boolean
  evolvable: boolean
  variable: string
  sampleData: any
  placeholder?: string
  options?: string[]
  clinicalPurpose: string
  validation?: {
    min?: number
    max?: number
    message?: string
  }
  // Evolution configuration (only present if evolvable = true)
  evolutionConfig?: EvolutionConfig
}

export interface ModuleDefinition {
  id: string
  name: string
  description: string
  category: string
  version: string
  fields: FieldDefinition[]
}
