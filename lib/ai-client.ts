import { PromptManager, type PromptContext } from "./prompt-manager"

interface ApiConfig {
  providerId: string
  apiKey: string
  selectedModel: string
  isActive: boolean
  lastTested: Date | null
  status: "untested" | "valid" | "invalid" | "testing"
}

interface PatientProfile {
  name: string
  age: number
  primary_concern: string
  background: string
  personality_traits?: any
}

interface SessionContext {
  lastTherapistMessage: string
  patientState: {
    mood: string
    engagement: string
    progress: string
  }
  duration: number
}

export class AIClient {
  private config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  async generatePatientResponse(
    patientProfile: PatientProfile,
    conversationHistory: any[],
    lastTherapistMessage: string,
    modality: string,
  ) {
    try {
      // Get the active patient template from Prompt Management
      const activeTemplate = PromptManager.getActiveTemplate("patient")

      let systemPrompt: string

      if (activeTemplate) {
        // Use the dynamic prompt template
        const promptContext: PromptContext = {
          patientName: patientProfile.name,
          patientAge: patientProfile.age,
          primaryConcern: patientProfile.primary_concern,
          background: patientProfile.background,
          modality: modality,
          sessionDuration: 0, // Will be updated with actual duration
          lastMessage: lastTherapistMessage,
          conversationHistory: conversationHistory,
          patientState: {
            mood: "anxious", // Default, should be dynamic
            engagement: "engaged",
            progress: "exploring",
          },
        }

        systemPrompt = PromptManager.renderPrompt(activeTemplate.id, promptContext)
        console.log(`🎭 Using dynamic patient template: ${activeTemplate.name}`)
      } else {
        // Fallback to enhanced hardcoded prompt with strong role reinforcement
        systemPrompt = `You are ${patientProfile.name}, a ${patientProfile.age}-year-old person seeking therapy for ${patientProfile.primary_concern}.

CRITICAL ROLE INSTRUCTIONS - READ CAREFULLY:
- You are THE PATIENT, NOT the therapist
- You are here to RECEIVE help, not give it
- You have problems and concerns you need help with
- You should NEVER offer therapeutic advice or guidance
- You should NEVER say things like "I'm here to support you" or "How can I help you"
- You are vulnerable, seeking help, and looking for guidance FROM the therapist
- You should NEVER act like a counselor or therapist

YOUR BACKGROUND:
- Primary concern: ${patientProfile.primary_concern}
- Background: ${patientProfile.background}
- You are struggling with these issues and need help

THE THERAPIST is using ${modality} approach with you.

RESPOND AS THE PATIENT:
- Show authentic emotions related to your concerns
- Ask for help or clarification when confused
- Share your feelings and experiences about YOUR problems
- Be vulnerable and genuine about YOUR struggles
- Stay focused on YOUR problems and feelings
- Keep responses 1-2 sentences, natural and conversational
- Express your emotions and concerns, don't provide solutions

Remember: You are the one seeking help, not providing it. You have problems to work through.`

        console.log(`⚠️ Using fallback patient prompt (no template found)`)
      }

      const response = await this.makeAPICall(
        [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: lastTherapistMessage,
          },
        ],
        200,
        0.8,
      )

      if (response.success) {
        return {
          success: true,
          response: response.content,
          emotion: this.extractEmotion(response.content),
        }
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Error generating patient response:", error)
      return {
        success: false,
        response: "I'm having trouble finding the right words right now. Could you help me understand what you mean?",
        emotion: "confused",
      }
    }
  }

  async generateSupervisorFeedback(sessionContext: SessionContext, patientProfile: PatientProfile, modality: string) {
    try {
      // Get the active supervisor template from Prompt Management
      const activeTemplate = PromptManager.getActiveTemplate("supervisor")

      let systemPrompt: string

      if (activeTemplate) {
        // Use the dynamic prompt template
        const promptContext: PromptContext = {
          patientName: patientProfile.name,
          patientAge: patientProfile.age,
          primaryConcern: patientProfile.primary_concern,
          background: patientProfile.background,
          modality: modality,
          sessionDuration: sessionContext.duration,
          lastMessage: sessionContext.lastTherapistMessage,
          conversationHistory: [],
          patientState: sessionContext.patientState,
        }

        systemPrompt = PromptManager.renderPrompt(activeTemplate.id, promptContext)
        console.log(`🎓 Using dynamic supervisor template: ${activeTemplate.name}`)
      } else {
        // Fallback to hardcoded supervisor prompt
        systemPrompt = `You are an experienced clinical supervisor observing a therapy session using ${modality}.`
        console.log(`⚠️ Using fallback supervisor prompt (no template found)`)
      }

      const prompt = this.buildSupervisorPrompt(sessionContext, patientProfile, modality)

      const response = await this.makeAPICall(
        [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        150,
        0.7,
      )

      if (response.success) {
        return {
          success: true,
          feedback: response.content,
          type: this.determineFeedbackType(response.content),
        }
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Error generating supervisor feedback:", error)
      return {
        success: false,
        feedback: "Continue building rapport and exploring the patient's perspective.",
        type: "observation",
      }
    }
  }

  private async makeAPICall(messages: any[], maxTokens: number, temperature: number) {
    try {
      const endpoint = this.getAPIEndpoint()
      const headers = this.getAPIHeaders()
      const body = this.buildRequestBody(messages, maxTokens, temperature)

      console.log(`🚀 Making API call to ${this.config.providerId}:`, { endpoint, model: this.config.selectedModel })

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`❌ API call failed (${response.status}):`, errorData)
        return {
          success: false,
          error: `API Error ${response.status}: ${errorData.error?.message || "Unknown error"}`,
        }
      }

      const data = await response.json()
      console.log(`✅ API call successful for ${this.config.providerId}`)

      return {
        success: true,
        content: data.choices[0].message.content,
      }
    } catch (error) {
      console.error(`❌ API call exception:`, error)
      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }

  private getAPIEndpoint(): string {
    switch (this.config.providerId) {
      case "openai":
        return "https://api.openai.com/v1/chat/completions"
      case "xai":
        return "https://api.x.ai/v1/chat/completions"
      case "groq":
        return "https://api.groq.com/openai/v1/chat/completions"
      case "elevenlabs":
        return "https://api.elevenlabs.io/v1/voices"
      default:
        throw new Error(`Unsupported provider: ${this.config.providerId}`)
    }
  }

  private getAPIHeaders(): Record<string, string> {
    const baseHeaders = {
      "Content-Type": "application/json",
    }

    // Add provider-specific headers if needed
    switch (this.config.providerId) {
      case "openai":
        return { ...baseHeaders, Authorization: `Bearer ${this.config.apiKey}` }
      case "xai":
        return { ...baseHeaders, Authorization: `Bearer ${this.config.apiKey}` }
      case "groq":
        return { ...baseHeaders, Authorization: `Bearer ${this.config.apiKey}` }
      case "elevenlabs":
        return { ...baseHeaders, "xi-api-key": this.config.apiKey }
      default:
        return baseHeaders
    }
  }

  private buildRequestBody(messages: any[], maxTokens: number, temperature: number) {
    return {
      model: this.config.selectedModel,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream: false,
    }
  }

  private buildPatientPrompt(
    patientProfile: PatientProfile,
    conversationHistory: any[],
    lastTherapistMessage: string,
    modality: string,
  ): string {
    return `Patient: ${patientProfile.name}, ${patientProfile.age} years old
Primary Concern: ${patientProfile.primary_concern}
Background: ${patientProfile.background}
Therapy Approach: ${modality}

The therapist just said: "${lastTherapistMessage}"

Respond as the patient would, showing authentic emotions and reactions. Keep responses natural and conversational, around 1-2 sentences.`
  }

  private buildSupervisorPrompt(
    sessionContext: SessionContext,
    patientProfile: PatientProfile,
    modality: string,
  ): string {
    return `Supervising a ${modality} session with ${patientProfile.name} (${patientProfile.primary_concern}).
Current patient state: ${sessionContext.patientState.mood}, ${sessionContext.patientState.engagement}
Session duration: ${Math.floor(sessionContext.duration / 60)} minutes

The therapist just said: "${sessionContext.lastTherapistMessage}"

Provide brief, constructive feedback (1-2 sentences) focusing on technique, observation, encouragement, or gentle guidance.`
  }

  private extractEmotion(text: string): string {
    const emotions = ["hopeful", "reflective", "anxious", "relieved", "confused", "grateful", "frustrated", "calm"]
    // Simple emotion detection based on keywords
    if (text.includes("thank") || text.includes("grateful")) return "grateful"
    if (text.includes("confus") || text.includes("understand")) return "confused"
    if (text.includes("hope") || text.includes("better")) return "hopeful"
    if (text.includes("think") || text.includes("consider")) return "reflective"
    return emotions[Math.floor(Math.random() * emotions.length)]
  }

  private determineFeedbackType(text: string): "technique" | "observation" | "encouragement" | "caution" {
    if (text.includes("try") || text.includes("consider") || text.includes("technique")) return "technique"
    if (text.includes("notice") || text.includes("observe")) return "observation"
    if (text.includes("good") || text.includes("well") || text.includes("excellent")) return "encouragement"
    if (text.includes("careful") || text.includes("caution") || text.includes("aware")) return "caution"
    return "observation"
  }
}

export class AIClientManager {
  private static instance: AIClient | null = null

  static async testConnection(providerId: string, apiKey: string, selectedModel: string) {
    console.log(`🔍 Testing connection for ${providerId} with model ${selectedModel}`)

    try {
      const endpoints = {
        openai: "https://api.openai.com/v1/models",
        xai: "https://api.x.ai/v1/models",
        groq: "https://api.groq.com/openai/v1/models",
        elevenlabs: "https://api.elevenlabs.io/v1/voices", // Add ElevenLabs endpoint
      }

      const endpoint = endpoints[providerId as keyof typeof endpoints]
      if (!endpoint) {
        throw new Error(`Unsupported provider: ${providerId}`)
      }

      // Handle ElevenLabs specific headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (providerId === "elevenlabs") {
        headers["xi-api-key"] = apiKey
      } else {
        headers["Authorization"] = `Bearer ${apiKey}`
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers,
      })

      if (response.ok) {
        console.log(`✅ ${providerId} API key is valid`)
        return { success: true, message: "API key is valid and working!" }
      } else if (response.status === 401) {
        return { success: false, message: "Invalid API key. Please check your credentials." }
      } else if (response.status === 403) {
        return { success: false, message: "API key does not have required permissions." }
      } else if (response.status === 429) {
        return { success: false, message: "Rate limit exceeded. API key is valid but quota reached." }
      } else if (response.status === 402) {
        return { success: false, message: "Payment required. Please check your billing status." }
      } else {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          message: `API error (${response.status}): ${errorData.error?.message || "Unknown error"}`,
        }
      }
    } catch (error) {
      console.error(`❌ ${providerId} connection test failed:`, error)
      return {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }

  static createClient(config: ApiConfig): AIClient | null {
    try {
      if (config.status !== "valid") {
        console.warn("Attempting to create client with invalid config")
        return null
      }

      this.instance = new AIClient(config)
      console.log(`✅ AI Client created for ${config.providerId}`)
      return this.instance
    } catch (error) {
      console.error("Error creating AI client:", error)
      return null
    }
  }

  static getInstance(): AIClient | null {
    return this.instance
  }
}

export function createAIClient(): AIClient | null {
  try {
    // Load configurations from localStorage
    const savedConfigs = localStorage.getItem("api-configurations-v2")
    if (!savedConfigs) {
      console.log("❌ No API configurations found in localStorage")
      return null
    }

    const configs: ApiConfig[] = JSON.parse(savedConfigs)
    const validConfig = configs.find((config) => config.status === "valid" && config.isActive)

    if (!validConfig) {
      console.log("❌ No valid and active API configuration found")
      console.log(
        "Available configs:",
        configs.map((c) => ({ provider: c.providerId, status: c.status, active: c.isActive })),
      )
      return null
    }

    console.log(`🎯 Found valid config for ${validConfig.providerId}`)
    return AIClientManager.createClient(validConfig)
  } catch (error) {
    console.error("❌ Error creating AI client:", error)
    return null
  }
}
