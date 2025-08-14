import { createAIClient } from "./ai-client"

export interface PatientGenerationRequest {
  prompt: string
  complexity?: "beginner" | "intermediate" | "advanced"
  focusAreas?: string[]
  demographics?: {
    ageRange?: string
    gender?: string
    occupation?: string
    education?: string
  }
}

export interface GeneratedPatientData {
  basicInformation: {
    fullName: string
    age: number
    dateOfBirth: string
    gender: string
    occupation: string
    education: string
    contactInfo: any
    emergencyContacts: any[]
    presentingConcern: string
    caseId: string
    caseName: string
    caseSummary: string
  }
  behavioralPatterns: {
    dailyRoutines: string
    copingMechanisms: string[]
    socialBehaviors: string
    sleepPatterns: string
    eatingHabits: string
    exerciseHabits: string
  }
  cognitiveEmotionalPatterns: {
    thoughtPatterns: string[]
    emotionalRegulation: string
    coreBeliefs: string[]
    triggers: string[]
    personalValues: any[]
  }
  workCareer: {
    currentJob: any
    careerHistory: any[]
    workStressors: string[]
    careerGoals: string
    financialSituation: string
  }
  mentalHealthHistory: {
    previousTherapy: string
    currentMedications: any[]
    pastMedications: any[]
    psychiatricDiagnoses: any[]
    hospitalizationHistory: any[]
  }
  familyDynamics: {
    familyMembers: any[]
    familyConflicts: any[]
    childhoodMemories: any[]
    parentingStyle: string
    familyMentalHealth: string
  }
  traumaHistory?: {
    traumaEvents: any[]
    traumaResponses: any[]
    currentImpact: string
    copingStrategies: string[]
    supportSystems: string[]
  }
}

export class AIPatientGenerator {
  private aiClient: any

  constructor() {
    this.aiClient = createAIClient()
  }

  async generatePatient(request: PatientGenerationRequest): Promise<GeneratedPatientData | null> {
    if (!this.aiClient) {
      console.error("AI client not available")
      return null
    }

    try {
      const enhancedPrompt = this.buildComprehensivePrompt(request)

      const response = await this.aiClient.generatePatientResponse(
        {
          name: "Patient Generator",
          age: 0,
          primary_concern: "custom",
          background: request.prompt,
        },
        [],
        enhancedPrompt,
        "comprehensive",
      )

      if (response.success) {
        return this.parsePatientResponse(response.response, request)
      } else {
        throw new Error("AI generation failed")
      }
    } catch (error) {
      console.error("Error generating patient:", error)
      return null
    }
  }

  private buildComprehensivePrompt(request: PatientGenerationRequest): string {
    const { prompt, complexity = "intermediate", focusAreas = [], demographics = {} } = request

    return `Generate a comprehensive, realistic patient profile for therapy simulation based on this description:

"${prompt}"

REQUIREMENTS:
- Complexity Level: ${complexity}
- Focus Areas: ${focusAreas.join(", ") || "General therapy skills"}
- Demographics: ${JSON.stringify(demographics)}

Create a detailed patient that would be valuable for psychology student training. Include:

1. BASIC INFORMATION:
   - Full name (realistic, culturally appropriate)
   - Age and date of birth (consistent with demographics)
   - Gender, occupation, education level
   - Contact information and emergency contacts
   - Presenting concern (detailed, specific to focus areas)
   - Case summary for training purposes

2. BEHAVIORAL PATTERNS:
   - Daily routines and habits
   - Coping mechanisms (both healthy and unhealthy)
   - Social behaviors and interaction patterns
   - Sleep, eating, and exercise patterns
   - Specific behaviors relevant to presenting concern

3. COGNITIVE & EMOTIONAL PATTERNS:
   - Thought patterns and cognitive distortions
   - Emotional regulation strategies
   - Core beliefs and values
   - Triggers and emotional responses
   - Personal values and belief systems

4. WORK & CAREER:
   - Current job situation and history
   - Work-related stressors and challenges
   - Career goals and aspirations
   - Financial situation and its impact
   - Work-life balance issues

5. MENTAL HEALTH HISTORY:
   - Previous therapy experiences (if any)
   - Current medications and their effectiveness
   - Past medications and reasons for discontinuation
   - Psychiatric diagnoses (if applicable)
   - Hospitalization history (if relevant)
   - Current mental health providers

6. FAMILY DYNAMICS:
   - Family structure and key relationships
   - Family conflicts and dynamics
   - Childhood memories and experiences
   - Parenting style received and given
   - Family mental health history
   - Generational patterns

7. TRAUMA HISTORY (if applicable):
   - Traumatic events and their timeline
   - Current trauma responses and symptoms
   - Coping strategies developed
   - Support systems available
   - Impact on current functioning

GUIDELINES:
- Make this patient realistic and believable
- Ensure therapeutic relevance for ${complexity} level training
- Include specific details that create meaningful therapy scenarios
- Maintain consistency across all areas
- Focus on ${focusAreas.join(", ") || "general therapeutic skills"}
- Suitable for multiple therapeutic approaches

Return the data in a structured JSON format that can be easily parsed into form fields. Be specific and detailed - this will be used for actual therapy training sessions.`
  }

  private parsePatientResponse(response: string, request: PatientGenerationRequest): GeneratedPatientData {
    // Try to extract JSON from response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return this.normalizePatientData(parsed, request)
      }
    } catch (e) {
      console.warn("Failed to parse JSON from AI response, using text parsing")
    }

    // Fallback: Parse text response
    return this.parseTextResponse(response, request)
  }

  private normalizePatientData(data: any, request: PatientGenerationRequest): GeneratedPatientData {
    // Ensure all required fields are present with proper structure
    return {
      basicInformation: {
        fullName: data.fullName || data.full_name || this.generateRandomName(),
        age: data.age || this.generateRandomAge(request.demographics?.ageRange),
        dateOfBirth: data.dateOfBirth || data.date_of_birth || this.generateDateOfBirth(data.age),
        gender: data.gender || request.demographics?.gender || "prefer not to say",
        occupation: data.occupation || request.demographics?.occupation || "Not specified",
        education: data.education || request.demographics?.education || "Not specified",
        contactInfo: data.contactInfo || data.contact_info || {},
        emergencyContacts: data.emergencyContacts || data.emergency_contacts || [],
        presentingConcern: data.presentingConcern || data.presenting_concern || request.prompt,
        caseId: `CASE-${Date.now()}`,
        caseName: data.caseName || data.case_name || `${data.fullName || "Patient"} Case`,
        caseSummary: data.caseSummary || data.case_summary || `AI-generated case: ${request.prompt}`,
      },
      behavioralPatterns: {
        dailyRoutines: data.dailyRoutines || data.daily_routines || "",
        copingMechanisms: data.copingMechanisms || data.coping_mechanisms || [],
        socialBehaviors: data.socialBehaviors || data.social_behaviors || "",
        sleepPatterns: data.sleepPatterns || data.sleep_patterns || "",
        eatingHabits: data.eatingHabits || data.eating_habits || "",
        exerciseHabits: data.exerciseHabits || data.exercise_habits || "",
      },
      cognitiveEmotionalPatterns: {
        thoughtPatterns: data.thoughtPatterns || data.thought_patterns || [],
        emotionalRegulation: data.emotionalRegulation || data.emotional_regulation || "",
        coreBeliefs: data.coreBeliefs || data.core_beliefs || [],
        triggers: data.triggers || [],
        personalValues: data.personalValues || data.personal_values || [],
      },
      workCareer: {
        currentJob: data.currentJob || data.current_job || {},
        careerHistory: data.careerHistory || data.career_history || [],
        workStressors: data.workStressors || data.work_stressors || [],
        careerGoals: data.careerGoals || data.career_goals || "",
        financialSituation: data.financialSituation || data.financial_situation || "",
      },
      mentalHealthHistory: {
        previousTherapy: data.previousTherapy || data.previous_therapy || "",
        currentMedications: data.currentMedications || data.current_medications || [],
        pastMedications: data.pastMedications || data.past_medications || [],
        psychiatricDiagnoses: data.psychiatricDiagnoses || data.psychiatric_diagnoses || [],
        hospitalizationHistory: data.hospitalizationHistory || data.hospitalization_history || [],
      },
      familyDynamics: {
        familyMembers: data.familyMembers || data.family_members || [],
        familyConflicts: data.familyConflicts || data.family_conflicts || [],
        childhoodMemories: data.childhoodMemories || data.childhood_memories || [],
        parentingStyle: data.parentingStyle || data.parenting_style || "",
        familyMentalHealth: data.familyMentalHealth || data.family_mental_health || "",
      },
      traumaHistory:
        data.traumaHistory || data.trauma_history
          ? {
              traumaEvents: data.traumaHistory?.traumaEvents || data.trauma_history?.trauma_events || [],
              traumaResponses: data.traumaHistory?.traumaResponses || data.trauma_history?.trauma_responses || [],
              currentImpact: data.traumaHistory?.currentImpact || data.trauma_history?.current_impact || "",
              copingStrategies: data.traumaHistory?.copingStrategies || data.trauma_history?.coping_strategies || [],
              supportSystems: data.traumaHistory?.supportSystems || data.trauma_history?.support_systems || [],
            }
          : undefined,
    }
  }

  private parseTextResponse(response: string, request: PatientGenerationRequest): GeneratedPatientData {
    // Extract information from text response using regex patterns
    const nameMatch = response.match(/name[:\s]+([^\n,]+)/i)
    const ageMatch = response.match(/age[:\s]+(\d+)/i)
    const genderMatch = response.match(/gender[:\s]+([^\n,]+)/i)
    const occupationMatch = response.match(/occupation[:\s]+([^\n,]+)/i)
    const concernMatch = response.match(/presenting concern[:\s]+([^\n]+)/i)

    const age = ageMatch ? Number.parseInt(ageMatch[1]) : this.generateRandomAge(request.demographics?.ageRange)

    return {
      basicInformation: {
        fullName: nameMatch ? nameMatch[1].trim() : this.generateRandomName(),
        age: age,
        dateOfBirth: this.generateDateOfBirth(age),
        gender: genderMatch ? genderMatch[1].trim().toLowerCase() : "prefer not to say",
        occupation: occupationMatch ? occupationMatch[1].trim() : "Not specified",
        education: request.demographics?.education || "Not specified",
        contactInfo: {},
        emergencyContacts: [],
        presentingConcern: concernMatch ? concernMatch[1].trim() : request.prompt,
        caseId: `CASE-${Date.now()}`,
        caseName: `${nameMatch ? nameMatch[1].trim() : "Patient"} Case`,
        caseSummary: `AI-generated case: ${request.prompt}`,
      },
      behavioralPatterns: {
        dailyRoutines: this.extractSection(response, "daily routines", "behavioral patterns"),
        copingMechanisms: this.extractListItems(response, "coping"),
        socialBehaviors: this.extractSection(response, "social", "behavior"),
        sleepPatterns: this.extractSection(response, "sleep"),
        eatingHabits: this.extractSection(response, "eating", "food"),
        exerciseHabits: this.extractSection(response, "exercise", "physical"),
      },
      cognitiveEmotionalPatterns: {
        thoughtPatterns: this.extractListItems(response, "thought", "cognitive"),
        emotionalRegulation: this.extractSection(response, "emotional regulation", "emotion"),
        coreBeliefs: this.extractListItems(response, "belief", "core"),
        triggers: this.extractListItems(response, "trigger"),
        personalValues: this.extractListItems(response, "value").map((v) => ({ value: v })),
      },
      workCareer: {
        currentJob: { title: occupationMatch ? occupationMatch[1].trim() : "Not specified" },
        careerHistory: [],
        workStressors: this.extractListItems(response, "work stress", "job stress"),
        careerGoals: this.extractSection(response, "career goal", "professional goal"),
        financialSituation: this.extractSection(response, "financial", "money"),
      },
      mentalHealthHistory: {
        previousTherapy: this.extractSection(response, "previous therapy", "past therapy"),
        currentMedications: [],
        pastMedications: [],
        psychiatricDiagnoses: [],
        hospitalizationHistory: [],
      },
      familyDynamics: {
        familyMembers: [],
        familyConflicts: [],
        childhoodMemories: [],
        parentingStyle: this.extractSection(response, "parenting", "childhood"),
        familyMentalHealth: this.extractSection(response, "family mental health", "family history"),
      },
      traumaHistory: response.toLowerCase().includes("trauma")
        ? {
            traumaEvents: [],
            traumaResponses: [],
            currentImpact: this.extractSection(response, "trauma", "traumatic"),
            copingStrategies: this.extractListItems(response, "coping"),
            supportSystems: this.extractListItems(response, "support"),
          }
        : undefined,
    }
  }

  private extractSection(text: string, ...keywords: string[]): string {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\s]+([^\n.]+)`, "i")
      const match = text.match(regex)
      if (match) return match[1].trim()
    }
    return ""
  }

  private extractListItems(text: string, ...keywords: string[]): string[] {
    const items: string[] = []
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[^.]*?([^.]+)`, "gi")
      const matches = text.match(regex)
      if (matches) {
        items.push(...matches.map((m) => m.trim()))
      }
    }
    return items.slice(0, 5) // Limit to 5 items
  }

  private generateRandomName(): string {
    const firstNames = [
      "Sarah",
      "Michael",
      "Emma",
      "David",
      "Jessica",
      "James",
      "Ashley",
      "Christopher",
      "Amanda",
      "Matthew",
    ]
    const lastNames = [
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
      "Hernandez",
    ]
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
  }

  private generateRandomAge(ageRange?: string): number {
    if (ageRange) {
      const [min, max] = ageRange.split("-").map((n) => Number.parseInt(n))
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    return Math.floor(Math.random() * 50) + 18 // Default 18-68
  }

  private generateDateOfBirth(age: number): string {
    const currentYear = new Date().getFullYear()
    const birthYear = currentYear - age
    const month = Math.floor(Math.random() * 12) + 1
    const day = Math.floor(Math.random() * 28) + 1
    return `${birthYear}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
  }
}

export const aiPatientGenerator = new AIPatientGenerator()
