import { createAIClient } from "./ai-client"

export interface ValidationRequest {
  fieldId: string
  fieldName: string
  fieldValue: any
  patientContext: {
    name?: string
    age?: number
    primaryConcern?: string
    otherFields?: Record<string, any>
  }
}

export interface ValidationResult {
  isValid: boolean
  score: number // 0-100
  feedback: string
  suggestions?: string[]
  severity: "info" | "warning" | "error"
}

export class AIValidationEngine {
  private aiClient: any

  constructor() {
    this.aiClient = createAIClient()
  }

  async validateField(request: ValidationRequest): Promise<ValidationResult> {
    if (!this.aiClient) {
      return this.getDefaultValidation(true, "AI validation not available")
    }

    try {
      const prompt = this.buildValidationPrompt(request)

      const response = await this.aiClient.generatePatientResponse(
        {
          name: request.patientContext.name || "Patient",
          age: request.patientContext.age || 25,
          primary_concern: request.patientContext.primaryConcern || "general",
          background: "",
        },
        [],
        prompt,
        "validation",
      )

      if (response.success) {
        return this.parseValidationResponse(response.response)
      } else {
        return this.getDefaultValidation(false, "AI validation failed")
      }
    } catch (error) {
      console.error("Error in AI validation:", error)
      return this.getDefaultValidation(false, "Validation error occurred")
    }
  }

  async validateEntireCase(patientData: Record<string, any>): Promise<{
    overallScore: number
    fieldValidations: Record<string, ValidationResult>
    recommendations: string[]
    readinessLevel: "not-ready" | "needs-work" | "good" | "excellent"
  }> {
    if (!this.aiClient) {
      return {
        overallScore: 75,
        fieldValidations: {},
        recommendations: ["AI validation not available"],
        readinessLevel: "good",
      }
    }

    try {
      const prompt = this.buildCaseValidationPrompt(patientData)

      const response = await this.aiClient.generatePatientResponse(
        {
          name: patientData.full_name || "Patient",
          age: patientData.age_and_birth?.age || 25,
          primary_concern: patientData.presenting_concern || "general",
          background: "",
        },
        [],
        prompt,
        "case-validation",
      )

      if (response.success) {
        return this.parseCaseValidationResponse(response.response)
      } else {
        throw new Error("Case validation failed")
      }
    } catch (error) {
      console.error("Error in case validation:", error)
      return {
        overallScore: 75,
        fieldValidations: {},
        recommendations: ["Case validation error occurred"],
        readinessLevel: "needs-work",
      }
    }
  }

  private buildValidationPrompt(request: ValidationRequest): string {
    const { fieldId, fieldName, fieldValue, patientContext } = request

    return `Validate this patient data field for therapy simulation training:

FIELD INFORMATION:
- Field Name: ${fieldName}
- Field ID: ${fieldId}
- Field Value: ${JSON.stringify(fieldValue)}

PATIENT CONTEXT:
- Name: ${patientContext.name || "Unknown"}
- Age: ${patientContext.age || "Unknown"}
- Primary Concern: ${patientContext.primaryConcern || "Unknown"}
- Other Context: ${JSON.stringify(patientContext.otherFields || {})}

VALIDATION CRITERIA:
1. Realism: Is this data believable and realistic?
2. Consistency: Does it align with other patient information?
3. Therapeutic Value: Will this be useful for therapy training?
4. Appropriateness: Is it suitable for educational purposes?
5. Completeness: Is there enough detail for meaningful scenarios?

Please evaluate and respond in this exact format:
VALID: [true/false]
SCORE: [0-100]
SEVERITY: [info/warning/error]
FEEDBACK: [Brief explanation of the validation result]
SUGGESTIONS: [Comma-separated list of improvement suggestions, or "none"]

Focus on providing constructive feedback that helps create better training scenarios.`
  }

  private buildCaseValidationPrompt(patientData: Record<string, any>): string {
    return `Evaluate this complete patient case for therapy simulation training:

PATIENT DATA:
${JSON.stringify(patientData, null, 2)}

EVALUATION CRITERIA:
1. Overall Realism (25 points): How believable is this patient?
2. Internal Consistency (25 points): Do all parts fit together logically?
3. Therapeutic Value (25 points): How useful for training purposes?
4. Complexity Appropriateness (25 points): Right level of challenge?

Please evaluate and respond in this exact format:
OVERALL_SCORE: [0-100]
REALISM_SCORE: [0-25]
CONSISTENCY_SCORE: [0-25]
THERAPEUTIC_VALUE: [0-25]
COMPLEXITY_SCORE: [0-25]
READINESS_LEVEL: [not-ready/needs-work/good/excellent]
RECOMMENDATIONS: [Numbered list of specific improvements]
STRENGTHS: [What works well in this case]
CONCERNS: [Major issues that need addressing]

Provide specific, actionable feedback for improving this training case.`
  }

  private parseValidationResponse(response: string): ValidationResult {
    try {
      const validMatch = response.match(/VALID:\s*(true|false)/i)
      const scoreMatch = response.match(/SCORE:\s*(\d+)/i)
      const severityMatch = response.match(/SEVERITY:\s*(info|warning|error)/i)
      const feedbackMatch = response.match(/FEEDBACK:\s*([^\n]+)/i)
      const suggestionsMatch = response.match(/SUGGESTIONS:\s*([^\n]+)/i)

      const isValid = validMatch ? validMatch[1].toLowerCase() === "true" : true
      const score = scoreMatch ? Number.parseInt(scoreMatch[1]) : 75
      const severity = (severityMatch ? severityMatch[1] : "info") as "info" | "warning" | "error"
      const feedback = feedbackMatch ? feedbackMatch[1].trim() : "Validation completed"
      const suggestions =
        suggestionsMatch && suggestionsMatch[1] !== "none" ? suggestionsMatch[1].split(",").map((s) => s.trim()) : []

      return {
        isValid,
        score,
        feedback,
        suggestions,
        severity,
      }
    } catch (error) {
      console.error("Error parsing validation response:", error)
      return this.getDefaultValidation(true, "Validation parsing error")
    }
  }

  private parseCaseValidationResponse(response: string) {
    try {
      const overallScoreMatch = response.match(/OVERALL_SCORE:\s*(\d+)/i)
      const readinessMatch = response.match(/READINESS_LEVEL:\s*(not-ready|needs-work|good|excellent)/i)
      const recommendationsMatch = response.match(/RECOMMENDATIONS:\s*([\s\S]*?)(?=STRENGTHS:|$)/i)

      const overallScore = overallScoreMatch ? Number.parseInt(overallScoreMatch[1]) : 75
      const readinessLevel = (readinessMatch ? readinessMatch[1] : "good") as
        | "not-ready"
        | "needs-work"
        | "good"
        | "excellent"

      const recommendations = recommendationsMatch
        ? recommendationsMatch[1]
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => line.trim())
        : ["Case evaluation completed"]

      return {
        overallScore,
        fieldValidations: {},
        recommendations,
        readinessLevel,
      }
    } catch (error) {
      console.error("Error parsing case validation response:", error)
      return {
        overallScore: 75,
        fieldValidations: {},
        recommendations: ["Case validation parsing error"],
        readinessLevel: "needs-work" as const,
      }
    }
  }

  private getDefaultValidation(isValid: boolean, feedback: string): ValidationResult {
    return {
      isValid,
      score: isValid ? 75 : 50,
      feedback,
      suggestions: [],
      severity: isValid ? "info" : "warning",
    }
  }
}

export const aiValidationEngine = new AIValidationEngine()
