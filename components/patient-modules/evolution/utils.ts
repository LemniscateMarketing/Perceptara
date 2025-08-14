import type { EvolutionConfig, EvolutionChange } from "./types"

/**
 * Determines if a field should evolve based on its configuration and timing
 */
export function shouldFieldEvolve(config: EvolutionConfig, currentSession: number): boolean {
  if (!config.enabled) return false

  // Check if it's time for a potential change based on frequency
  if (currentSession % config.frequency !== 0) return false

  // Check probability
  return Math.random() * 100 < config.probability
}

/**
 * Applies evolution to a field value based on its type and configuration
 */
export function applyEvolution(
  fieldType: string,
  currentValue: any,
  config: EvolutionConfig,
): { newValue: any; description: string } {
  switch (config.type) {
    case "increase":
      return applyIncrease(fieldType, currentValue)
    case "decrease":
      return applyDecrease(fieldType, currentValue)
    case "one-way":
      return Math.random() > 0.5 ? applyIncrease(fieldType, currentValue) : applyDecrease(fieldType, currentValue)
    case "multiple":
      return applyMultipleChanges(fieldType, currentValue)
    default:
      return { newValue: currentValue, description: "No change" }
  }
}

function applyIncrease(fieldType: string, currentValue: any): { newValue: any; description: string } {
  switch (fieldType) {
    case "text":
    case "textarea":
      return { newValue: currentValue, description: "Text fields don't auto-increase" }
    case "age_date":
      const newAge = (currentValue?.age || 0) + 1
      return {
        newValue: { ...currentValue, age: newAge },
        description: `Age increased to ${newAge}`,
      }
    case "list":
      // Add a new item to the list
      const newItem = generateListItem(currentValue)
      return {
        newValue: [...(Array.isArray(currentValue) ? currentValue : []), newItem],
        description: "Added new item to list",
      }
    default:
      return { newValue: currentValue, description: "No increase logic for this field type" }
  }
}

function applyDecrease(fieldType: string, currentValue: any): { newValue: any; description: string } {
  switch (fieldType) {
    case "age_date":
      // Age shouldn't decrease in normal circumstances
      return { newValue: currentValue, description: "Age cannot decrease" }
    case "list":
      if (Array.isArray(currentValue) && currentValue.length > 0) {
        const newValue = currentValue.slice(0, -1)
        return { newValue, description: "Removed item from list" }
      }
      return { newValue: currentValue, description: "List is already empty" }
    default:
      return { newValue: currentValue, description: "No decrease logic for this field type" }
  }
}

function applyMultipleChanges(fieldType: string, currentValue: any): { newValue: any; description: string } {
  if (fieldType === "list" && Array.isArray(currentValue)) {
    // Randomly add and/or remove items
    const newValue = [...currentValue]
    const changes: string[] = []

    // Maybe remove an item
    if (newValue.length > 0 && Math.random() > 0.5) {
      newValue.pop()
      changes.push("removed 1 item")
    }

    // Maybe add 1-2 items
    const itemsToAdd = Math.floor(Math.random() * 3) // 0, 1, or 2 items
    for (let i = 0; i < itemsToAdd; i++) {
      newValue.push(generateListItem(currentValue))
    }
    if (itemsToAdd > 0) {
      changes.push(`added ${itemsToAdd} item(s)`)
    }

    return {
      newValue,
      description: changes.length > 0 ? changes.join(" and ") : "No changes made",
    }
  }

  return { newValue: currentValue, description: "Multiple changes not supported for this field type" }
}

function generateListItem(existingItems: any[]): any {
  if (!Array.isArray(existingItems) || existingItems.length === 0) {
    return "New item"
  }

  const firstItem = existingItems[0]
  if (typeof firstItem === "string") {
    return "New item"
  }

  if (typeof firstItem === "object") {
    // Create a similar structure with empty values
    const newItem: any = {}
    Object.keys(firstItem).forEach((key) => {
      newItem[key] = ""
    })
    return newItem
  }

  return "New item"
}

export function trackEvolutionChange(
  fieldId: string,
  oldValue: any,
  newValue: any,
  description: string,
  sessionId?: string,
): EvolutionChange {
  return {
    fieldId,
    oldValue,
    newValue,
    timestamp: new Date(),
    sessionId,
    description,
  }
}
