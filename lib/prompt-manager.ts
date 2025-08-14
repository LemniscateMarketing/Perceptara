export interface PromptTemplate {
  id: string
  name: string
  description: string
  role: "patient" | "psychologist" | "supervisor"
  category: string
  version: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  template: string
  variables: PromptVariable[]
  examples: PromptExample[]
}

export interface PromptVariable {
  name: string
  description: string
  type: "string" | "number" | "boolean" | "select"
  required: boolean
  defaultValue?: any
  options?: string[] // for select type
}

export interface PromptExample {
  title: string
  input: Record<string, any>
  expectedOutput: string
}

export interface PromptContext {
  patientName: string
  patientAge: number
  primaryConcern: string
  background: string
  modality: string
  sessionDuration: number
  lastMessage: string
  conversationHistory: any[]
  patientState: {
    mood: string
    engagement: string
    progress: string
  }
}

export class PromptManager {
  private static templates: PromptTemplate[] = []

  // Default templates
  static getDefaultTemplates(): PromptTemplate[] {
    return [
      {
        id: "patient-basic-v1",
        name: "Basic Patient Response",
        description: "Standard patient persona for therapy sessions",
        role: "patient",
        category: "general",
        version: "1.0",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        template: `You are {{patientName}}, a {{patientAge}}-year-old person seeking therapy.

CRITICAL ROLE INSTRUCTIONS:
- You are THE PATIENT, NOT the therapist
- You are here to RECEIVE help, not give it
- You have problems and concerns you need help with
- You should NEVER offer therapeutic advice or guidance
- You should NEVER say things like "As your therapist" or "I'm here to support you"
- You are vulnerable, seeking help, and looking for guidance FROM the therapist

YOUR BACKGROUND:
- Primary concern: {{primaryConcern}}
- Background: {{background}}
- Current emotional state: {{mood}}

THE THERAPIST is using {{modality}} approach with you.
The therapist just said: "{{lastMessage}}"

RESPOND AS THE PATIENT:
- Show authentic emotions related to your concerns
- Ask for help or clarification when confused
- Share your feelings and experiences
- Be vulnerable and genuine
- Stay focused on YOUR problems and feelings
- Keep responses 1-2 sentences, natural and conversational

Remember: You are seeking help, not providing it. You are the one with problems to work through.`,
        variables: [
          {
            name: "patientName",
            description: "Patient's name",
            type: "string",
            required: true,
          },
          {
            name: "patientAge",
            description: "Patient's age",
            type: "number",
            required: true,
          },
          {
            name: "primaryConcern",
            description: "Main issue patient is dealing with",
            type: "string",
            required: true,
          },
          {
            name: "background",
            description: "Patient's background story",
            type: "string",
            required: true,
          },
          {
            name: "modality",
            description: "Therapeutic approach being used",
            type: "string",
            required: true,
          },
          {
            name: "lastMessage",
            description: "Therapist's last message",
            type: "string",
            required: true,
          },
          {
            name: "mood",
            description: "Current emotional state",
            type: "select",
            required: true,
            options: ["anxious", "depressed", "hopeful", "confused", "angry", "calm", "overwhelmed"],
          },
        ],
        examples: [
          {
            title: "Anxiety Response",
            input: {
              patientName: "Sarah",
              patientAge: 28,
              primaryConcern: "work anxiety",
              lastMessage: "How are you feeling today?",
              mood: "anxious",
            },
            expectedOutput:
              "I'm feeling pretty anxious actually. Work has been really overwhelming and I can't seem to shake this constant worry.",
          },
        ],
      },
      {
        id: "psychologist-supervisor-v1",
        name: "Virtual Psychologist Supervisor",
        description: "AI psychologist providing supervision and guidance",
        role: "psychologist",
        category: "supervision",
        version: "1.0",
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        template: `You are Dr. {{psychologistName}}, an experienced clinical psychologist providing supervision.

YOUR ROLE:
- You are a licensed clinical psychologist with {{yearsExperience}} years of experience
- You specialize in {{specialization}}
- You are providing supervision and guidance to a therapist-in-training
- You observe therapy sessions and provide constructive feedback

SUPERVISION CONTEXT:
- The therapist is working with {{patientName}} ({{primaryConcern}})
- Using {{modality}} approach
- Session duration: {{sessionDuration}} minutes
- Patient's current state: {{mood}}, {{engagement}}

The therapist just said: "{{lastMessage}}"

PROVIDE SUPERVISION:
- Offer specific, constructive feedback
- Suggest techniques or approaches
- Point out what's working well
- Gently guide when needed
- Keep feedback brief and actionable (1-2 sentences)
- Be supportive and educational

Focus on helping the therapist develop their skills while ensuring good patient care.`,
        variables: [
          {
            name: "psychologistName",
            description: "Supervisor's name",
            type: "string",
            required: true,
            defaultValue: "Dr. Rachel Smith",
          },
          {
            name: "yearsExperience",
            description: "Years of clinical experience",
            type: "number",
            required: true,
            defaultValue: 15,
          },
          {
            name: "specialization",
            description: "Area of specialization",
            type: "select",
            required: true,
            options: ["CBT", "DBT", "Trauma Therapy", "Family Therapy", "Addiction Counseling"],
            defaultValue: "CBT",
          },
        ],
        examples: [],
      },
    ]
  }

  static loadTemplates(): PromptTemplate[] {
    try {
      const saved = localStorage.getItem("prompt-templates-v1")
      if (saved) {
        const parsed = JSON.parse(saved)
        this.templates = parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        }))
      } else {
        this.templates = this.getDefaultTemplates()
        this.saveTemplates()
      }
      return this.templates
    } catch (error) {
      console.error("Error loading prompt templates:", error)
      this.templates = this.getDefaultTemplates()
      return this.templates
    }
  }

  static saveTemplates(): void {
    try {
      localStorage.setItem("prompt-templates-v1", JSON.stringify(this.templates))
      console.log("✅ Prompt templates saved")
    } catch (error) {
      console.error("Error saving prompt templates:", error)
    }
  }

  static getTemplate(id: string): PromptTemplate | null {
    return this.templates.find((t) => t.id === id) || null
  }

  static getActiveTemplate(role: "patient" | "psychologist" | "supervisor"): PromptTemplate | null {
    return this.templates.find((t) => t.role === role && t.isActive) || null
  }

  static addTemplate(template: Omit<PromptTemplate, "id" | "createdAt" | "updatedAt">): string {
    const id = `${template.role}-${Date.now()}`
    const newTemplate: PromptTemplate = {
      ...template,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.templates.push(newTemplate)
    this.saveTemplates()
    return id
  }

  static updateTemplate(id: string, updates: Partial<PromptTemplate>): boolean {
    const index = this.templates.findIndex((t) => t.id === id)
    if (index === -1) return false

    this.templates[index] = {
      ...this.templates[index],
      ...updates,
      updatedAt: new Date(),
    }
    this.saveTemplates()
    return true
  }

  static deleteTemplate(id: string): boolean {
    const index = this.templates.findIndex((t) => t.id === id)
    if (index === -1) return false

    this.templates.splice(index, 1)
    this.saveTemplates()
    return true
  }

  static setActiveTemplate(role: "patient" | "psychologist" | "supervisor", id: string): boolean {
    // Deactivate all templates of this role
    this.templates.forEach((t) => {
      if (t.role === role) {
        t.isActive = false
      }
    })

    // Activate the selected template
    const template = this.templates.find((t) => t.id === id)
    if (!template) return false

    template.isActive = true
    this.saveTemplates()
    return true
  }

  static renderPrompt(templateId: string, context: PromptContext): string {
    const template = this.getTemplate(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    let rendered = template.template

    // Replace variables
    const variables = {
      patientName: context.patientName,
      patientAge: context.patientAge,
      primaryConcern: context.primaryConcern,
      background: context.background,
      modality: context.modality,
      sessionDuration: Math.floor(context.sessionDuration / 60),
      lastMessage: context.lastMessage,
      mood: context.patientState.mood,
      engagement: context.patientState.engagement,
      progress: context.patientState.progress,
    }

    // Replace {{variable}} placeholders
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g")
      rendered = rendered.replace(regex, String(value))
    })

    return rendered
  }

  static testPrompt(
    templateId: string,
    testContext: PromptContext,
  ): {
    success: boolean
    rendered: string
    errors: string[]
  } {
    try {
      const rendered = this.renderPrompt(templateId, testContext)
      const errors: string[] = []

      // Check for unreplaced variables
      const unreplacedVars = rendered.match(/{{[^}]+}}/g)
      if (unreplacedVars) {
        errors.push(`Unreplaced variables: ${unreplacedVars.join(", ")}`)
      }

      return {
        success: errors.length === 0,
        rendered,
        errors,
      }
    } catch (error) {
      return {
        success: false,
        rendered: "",
        errors: [error instanceof Error ? error.message : "Unknown error"],
      }
    }
  }
}

// Initialize templates on load
PromptManager.loadTemplates()
