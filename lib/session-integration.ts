import { createAIClient } from "./ai-client"

export interface SessionPreparation {
  patientPersonality: {
    communicationStyle: string
    emotionalState: string
    defenseMechanisms: string[]
    therapeuticGoals: string[]
    sessionExpectations: string
  }
  sessionPlan: {
    suggestedDuration: number
    therapeuticApproaches: string[]
    keyTopicsToExplore: string[]
    potentialChallenges: string[]
    successIndicators: string[]
  }
  aiPrompts: {
    systemPrompt: string
    patientPrompt: string
    supervisorPrompt: string
  }
  studentGuidance: {
    learningObjectives: string[]
    skillsToFocus: string[]
    commonMistakes: string[]
    levelAppropriate: boolean
  }
}

export class SessionIntegrationManager {
  private aiClient: any

  constructor() {
    this.aiClient = createAIClient()
  }

  async prepareSession(
    patientData: Record<string, any>,
    studentLevel: "beginner" | "intermediate" | "advanced" = "intermediate",
  ): Promise<SessionPreparation | null> {
    if (!this.aiClient) {
      console.error("AI client not available for session preparation")
      return null
    }

    try {
      const prompt = this.buildSessionPreparationPrompt(patientData, studentLevel)

      const response = await this.aiClient.generatePatientResponse(
        {
          name: patientData.full_name || "Patient",
          age: patientData.age_and_birth?.age || 25,
          primary_concern: patientData.presenting_concern || "general",
          background: patientData.case_summary || "",
        },
        [],
        prompt,
        "session-preparation",
      )

      if (response.success) {
        return this.parseSessionPreparation(response.response, patientData, studentLevel)
      } else {
        throw new Error("Session preparation failed")
      }
    } catch (error) {
      console.error("Error preparing session:", error)
      return this.getDefaultSessionPreparation(patientData, studentLevel)
    }
  }

  async generatePatientPersonality(patientData: Record<string, any>): Promise<{
    communicationStyle: string
    emotionalPresentation: string
    behavioralTendencies: string[]
    therapeuticChallenges: string[]
    strengths: string[]
  }> {
    if (!this.aiClient) {
      return this.getDefaultPersonality()
    }

    try {
      const prompt = `Based on this patient data, create a detailed personality profile for AI simulation:

PATIENT DATA:
${JSON.stringify(patientData, null, 2)}

Generate a personality that will:
1. Be consistent with the patient's background and presenting concerns
2. Provide realistic therapeutic challenges
3. Allow for meaningful therapeutic progress
4. Be appropriate for training purposes

Respond with:
COMMUNICATION_STYLE: [How they typically communicate]
EMOTIONAL_PRESENTATION: [How they present emotionally]
BEHAVIORAL_TENDENCIES: [List of typical behaviors]
THERAPEUTIC_CHALLENGES: [What makes them challenging to work with]
STRENGTHS: [Patient strengths and resources]
RESPONSE_PATTERNS: [How they typically respond to different interventions]`

      const response = await this.aiClient.generatePatientResponse(
        {
          name: patientData.full_name || "Patient",
          age: patientData.age_and_birth?.age || 25,
          primary_concern: patientData.presenting_concern || "general",
          background: "",
        },
        [],
        prompt,
        "personality-generation",
      )

      if (response.success) {
        return this.parsePersonalityResponse(response.response)
      } else {
        throw new Error("Personality generation failed")
      }
    } catch (error) {
      console.error("Error generating personality:", error)
      return this.getDefaultPersonality()
    }
  }

  private buildSessionPreparationPrompt(patientData: Record<string, any>, studentLevel: string): string {
    return `Prepare a comprehensive therapy session plan for this patient case:

PATIENT DATA:
${JSON.stringify(patientData, null, 2)}

STUDENT LEVEL: ${studentLevel}

Create a detailed session preparation that includes:

1. PATIENT PERSONALITY FOR AI SIMULATION:
   - Communication style and patterns
   - Emotional state and presentation
   - Defense mechanisms and coping strategies
   - Therapeutic goals and motivation level
   - Session expectations and concerns

2. SESSION PLAN:
   - Recommended session duration
   - Appropriate therapeutic approaches
   - Key topics to explore
   - Potential challenges and how to handle them
   - Success indicators for this session

3. AI PROMPTS:
   - System prompt for AI behavior
   - Patient-specific prompt for realistic responses
   - Supervisor prompt for guidance

4. STUDENT GUIDANCE:
   - Learning objectives for this case
   - Specific skills to focus on
   - Common mistakes to avoid
   - Level-appropriate expectations

Format your response clearly with section headers. Make this practical and actionable for therapy training.`
  }

  private parseSessionPreparation(
    response: string,
    patientData: Record<string, any>,
    studentLevel: string,
  ): SessionPreparation {
    // Parse the AI response into structured session preparation
    return {
      patientPersonality: {
        communicationStyle: this.extractSection(response, "communication style") || "Direct and open",
        emotionalState:
          this.extractSection(response, "emotional state", "emotional presentation") || "Anxious but motivated",
        defenseMechanisms: this.extractList(response, "defense mechanisms", "coping strategies"),
        therapeuticGoals: this.extractList(response, "therapeutic goals", "goals"),
        sessionExpectations:
          this.extractSection(response, "session expectations", "expectations") || "Hopeful for progress",
      },
      sessionPlan: {
        suggestedDuration: this.extractDuration(response) || 50,
        therapeuticApproaches: this.extractList(response, "therapeutic approaches", "approaches"),
        keyTopicsToExplore: this.extractList(response, "key topics", "topics to explore"),
        potentialChallenges: this.extractList(response, "potential challenges", "challenges"),
        successIndicators: this.extractList(response, "success indicators", "success"),
      },
      aiPrompts: {
        systemPrompt: this.generateSystemPrompt(patientData, response),
        patientPrompt: this.generatePatientPrompt(patientData, response),
        supervisorPrompt: this.generateSupervisorPrompt(patientData, studentLevel, response),
      },
      studentGuidance: {
        learningObjectives: this.extractList(response, "learning objectives", "objectives"),
        skillsToFocus: this.extractList(response, "skills to focus", "skills"),
        commonMistakes: this.extractList(response, "common mistakes", "mistakes to avoid"),
        levelAppropriate: true,
      },
    }
  }

  private parsePersonalityResponse(response: string) {
    return {
      communicationStyle: this.extractSection(response, "communication_style") || "Direct and open",
      emotionalPresentation: this.extractSection(response, "emotional_presentation") || "Anxious but motivated",
      behavioralTendencies: this.extractList(response, "behavioral_tendencies"),
      therapeuticChallenges: this.extractList(response, "therapeutic_challenges"),
      strengths: this.extractList(response, "strengths"),
    }
  }

  private extractSection(text: string, ...keywords: string[]): string {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\s]+([^\n]+)`, "i")
      const match = text.match(regex)
      if (match) return match[1].trim()
    }
    return ""
  }

  private extractList(text: string, ...keywords: string[]): string[] {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\s]*([^]*?)(?=\n[A-Z]|$)`, "i")
      const match = text.match(regex)
      if (match) {
        return match[1]
          .split(/[-•\n]/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
          .slice(0, 5)
      }
    }
    return []
  }

  private extractDuration(text: string): number {
    const match = text.match(/(\d+)\s*minutes?/i)
    return match ? Number.parseInt(match[1]) : 50
  }

  private generateSystemPrompt(patientData: Record<string, any>, sessionResponse: string): string {
    return `You are an AI patient simulator for therapy training. 

PATIENT PROFILE:
- Name: ${patientData.full_name || "Patient"}
- Age: ${patientData.age_and_birth?.age || "Unknown"}
- Presenting Concern: ${patientData.presenting_concern || "General concerns"}

PERSONALITY TRAITS:
${this.extractSection(sessionResponse, "communication style", "personality")}

BEHAVIORAL GUIDELINES:
- Stay in character throughout the session
- Respond realistically based on the patient's background
- Show appropriate emotional responses
- Allow for therapeutic progress when appropriate
- Present challenges that are educational but not overwhelming

Remember: This is a training simulation. Be realistic but supportive of the learning process.`
  }

  private generatePatientPrompt(patientData: Record<string, any>, sessionResponse: string): string {
    return `You are ${patientData.full_name || "a patient"} in a therapy session.

BACKGROUND:
${patientData.case_summary || patientData.presenting_concern || "You are seeking therapy for personal concerns."}

YOUR CURRENT STATE:
- ${this.extractSection(sessionResponse, "emotional state") || "You are feeling anxious but hopeful"}
- ${this.extractSection(sessionResponse, "session expectations") || "You want to make progress in therapy"}

COMMUNICATION STYLE:
${this.extractSection(sessionResponse, "communication style") || "You communicate directly but may be hesitant about sensitive topics"}

RESPOND AS THIS PATIENT:
- Use first person ("I feel...", "My experience...")
- Show realistic emotions and reactions
- Be consistent with your background and personality
- Allow the therapist to guide the conversation
- Show gradual openness as trust builds`
  }

  private generateSupervisorPrompt(
    patientData: Record<string, any>,
    studentLevel: string,
    sessionResponse: string,
  ): string {
    return `You are an AI therapy supervisor providing guidance during this training session.

PATIENT CASE:
${patientData.case_summary || patientData.presenting_concern || "General therapy case"}

STUDENT LEVEL: ${studentLevel}

SUPERVISION FOCUS:
${this.extractList(sessionResponse, "skills to focus", "learning objectives").join(", ")}

PROVIDE GUIDANCE ON:
- Therapeutic technique and approach
- Timing of interventions
- Recognizing patient cues and responses
- Managing challenging moments
- Building therapeutic rapport

SUPERVISION STYLE:
- Be supportive and educational
- Offer specific, actionable feedback
- Point out both strengths and areas for improvement
- Provide level-appropriate guidance
- Encourage reflection and learning`
  }

  private getDefaultSessionPreparation(patientData: Record<string, any>, studentLevel: string): SessionPreparation {
    return {
      patientPersonality: {
        communicationStyle: "Open and direct communication",
        emotionalState: "Anxious but motivated for change",
        defenseMechanisms: ["Intellectualization", "Minimization"],
        therapeuticGoals: ["Develop coping strategies", "Improve self-awareness"],
        sessionExpectations: "Hopeful for progress and understanding",
      },
      sessionPlan: {
        suggestedDuration: 50,
        therapeuticApproaches: ["Cognitive Behavioral Therapy", "Person-Centered Therapy"],
        keyTopicsToExplore: ["Current stressors", "Coping mechanisms", "Support systems"],
        potentialChallenges: ["Initial resistance", "Emotional overwhelm"],
        successIndicators: ["Increased self-awareness", "Identification of goals"],
      },
      aiPrompts: {
        systemPrompt: "You are a patient in therapy seeking help with personal concerns.",
        patientPrompt: `You are ${patientData.full_name || "a patient"} seeking therapy.`,
        supervisorPrompt: `Provide ${studentLevel} level supervision for this therapy session.`,
      },
      studentGuidance: {
        learningObjectives: ["Build rapport", "Conduct assessment", "Identify treatment goals"],
        skillsToFocus: ["Active listening", "Empathy", "Assessment skills"],
        commonMistakes: ["Moving too fast", "Giving advice too early", "Missing emotional cues"],
        levelAppropriate: true,
      },
    }
  }

  private getDefaultPersonality() {
    return {
      communicationStyle: "Direct and open",
      emotionalPresentation: "Anxious but motivated",
      behavioralTendencies: ["Seeks reassurance", "Analytical approach"],
      therapeuticChallenges: ["Initial hesitation", "Perfectionist tendencies"],
      strengths: ["Motivated for change", "Self-reflective"],
    }
  }
}

export const sessionIntegrationManager = new SessionIntegrationManager()
