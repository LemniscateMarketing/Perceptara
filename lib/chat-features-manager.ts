"use client"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Types
export interface ChatFeature {
  id: string
  name: string
  description: string
  type: "boolean" | "select" | "range" | "array"
  moduleId: string
  enabled: boolean
  required: boolean
  evolvable: boolean
  clinicalPurpose?: string
  defaultValue?: any
  options?: string[]
  min?: number
  max?: number
}

export interface ChatModule {
  id: string
  name: string
  description: string
  icon: string
  color: string
  borderColor: string
  bgColor: string
  textColor: string
  category: "interaction" | "intelligence" | "supervision" | "therapeutic" | "documentation" | "interface" | "analytics"
  isCore: boolean
  enabled: boolean
  displayOrder: number
  stats: {
    totalFeatures: number
    requiredFeatures: number
    evolvableFeatures: number
  }
}

export interface ChatTemplate {
  id: string
  name: string
  description: string
  category: string
  moduleSettings: Record<string, boolean>
  featureSettings: Record<string, any>
  createdAt: string
  updatedAt: string
}

// Default modules and features
const DEFAULT_MODULES: ChatModule[] = [
  {
    id: "voice_audio",
    name: "Voice & Audio",
    description: "Voice conversation, text-to-speech, speech-to-text, and audio processing features",
    icon: "Mic",
    color: "blue",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    category: "interaction",
    isCore: true,
    enabled: true,
    displayOrder: 1,
    stats: { totalFeatures: 5, requiredFeatures: 0, evolvableFeatures: 2 },
  },
  {
    id: "ai_integration",
    name: "AI Integration",
    description: "AI-powered patient responses, personality simulation, and adaptive behavior",
    icon: "Brain",
    color: "purple",
    borderColor: "border-purple-200",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    category: "intelligence",
    isCore: true,
    enabled: true,
    displayOrder: 2,
    stats: { totalFeatures: 4, requiredFeatures: 2, evolvableFeatures: 3 },
  },
  {
    id: "supervisor_tools",
    name: "Supervisor Tools",
    description: "Live supervision, real-time guidance, and supervisor communication features",
    icon: "Eye",
    color: "green",
    borderColor: "border-green-200",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    category: "supervision",
    isCore: true,
    enabled: true,
    displayOrder: 3,
    stats: { totalFeatures: 3, requiredFeatures: 0, evolvableFeatures: 1 },
  },
  {
    id: "interaction_features",
    name: "Interaction Features",
    description: "Advanced interaction capabilities like interruption, gestures, and eye tracking",
    icon: "Zap",
    color: "orange",
    borderColor: "border-orange-200",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    category: "interaction",
    isCore: false,
    enabled: false,
    displayOrder: 4,
    stats: { totalFeatures: 3, requiredFeatures: 0, evolvableFeatures: 1 },
  },
  {
    id: "therapeutic_tools",
    name: "Therapeutic Tools",
    description: "Built-in therapeutic exercises, mindfulness tools, and resource sharing",
    icon: "Heart",
    color: "pink",
    borderColor: "border-pink-200",
    bgColor: "bg-pink-50",
    textColor: "text-pink-700",
    category: "therapeutic",
    isCore: false,
    enabled: false,
    displayOrder: 5,
    stats: { totalFeatures: 4, requiredFeatures: 0, evolvableFeatures: 1 },
  },
  {
    id: "recording_documentation",
    name: "Recording & Documentation",
    description: "Session recording, transcription, and enhanced note-taking capabilities",
    icon: "FileText",
    color: "teal",
    borderColor: "border-teal-200",
    bgColor: "bg-teal-50",
    textColor: "text-teal-700",
    category: "documentation",
    isCore: true,
    enabled: true,
    displayOrder: 6,
    stats: { totalFeatures: 3, requiredFeatures: 1, evolvableFeatures: 0 },
  },
  {
    id: "visual_interface",
    name: "Visual Interface",
    description: "UI themes, accessibility features, and distraction-free modes",
    icon: "Palette",
    color: "indigo",
    borderColor: "border-indigo-200",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700",
    category: "interface",
    isCore: true,
    enabled: true,
    displayOrder: 7,
    stats: { totalFeatures: 3, requiredFeatures: 1, evolvableFeatures: 0 },
  },
  {
    id: "analytics_tracking",
    name: "Analytics & Tracking",
    description: "Session analytics, mood tracking, engagement metrics, and progress indicators",
    icon: "BarChart3",
    color: "cyan",
    borderColor: "border-cyan-200",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-700",
    category: "analytics",
    isCore: false,
    enabled: false,
    displayOrder: 8,
    stats: { totalFeatures: 3, requiredFeatures: 0, evolvableFeatures: 2 },
  },
]

const DEFAULT_FEATURES: ChatFeature[] = [
  // Voice & Audio Features
  {
    id: "voice-chat",
    name: "Voice Chat",
    description: "Enable voice-based conversations between therapist and patient",
    type: "boolean",
    moduleId: "voice_audio",
    enabled: false,
    required: false,
    evolvable: false,
    clinicalPurpose:
      "Allows for more natural therapeutic communication and helps students practice verbal therapy skills",
  },
  {
    id: "text-to-speech",
    name: "Text-to-Speech",
    description: "Convert patient text responses to natural speech",
    type: "select",
    moduleId: "voice_audio",
    enabled: false,
    required: false,
    evolvable: true,
    clinicalPurpose: "Provides auditory feedback and helps create more immersive therapeutic experiences",
    options: ["disabled", "natural", "expressive", "clinical"],
  },
  {
    id: "speech-to-text",
    name: "Speech-to-Text",
    description: "Convert therapist speech to text for processing",
    type: "boolean",
    moduleId: "voice_audio",
    enabled: false,
    required: false,
    evolvable: false,
    clinicalPurpose: "Enables hands-free interaction and automatic session transcription",
  },
  {
    id: "emotion-detection",
    name: "Emotion Detection",
    description: "Analyze emotional tone in voice and adjust patient responses",
    type: "boolean",
    moduleId: "voice_audio",
    enabled: false,
    required: false,
    evolvable: true,
    clinicalPurpose: "Helps students learn to recognize and respond to emotional cues in patient communication",
  },
  {
    id: "voice-commands",
    name: "Voice Commands",
    description: "Enable voice commands for session control",
    type: "array",
    moduleId: "voice_audio",
    enabled: false,
    required: false,
    evolvable: false,
    clinicalPurpose: "Allows for seamless session management without breaking therapeutic flow",
  },

  // AI Integration Features
  {
    id: "ai-patient-responses",
    name: "AI Patient Responses",
    description: "Generate realistic patient responses using AI",
    type: "boolean",
    moduleId: "ai_integration",
    enabled: true,
    required: true,
    evolvable: false,
    clinicalPurpose: "Core functionality for creating realistic patient interactions",
  },
  {
    id: "ai-personality",
    name: "AI Personality",
    description: "Consistent personality traits and behavioral patterns",
    type: "select",
    moduleId: "ai_integration",
    enabled: true,
    required: true,
    evolvable: true,
    clinicalPurpose:
      "Ensures consistent patient presentation and helps students learn to work with different personality types",
    options: ["adaptive", "consistent", "evolving", "complex"],
  },
  {
    id: "response-delay",
    name: "Response Delay",
    description: "Realistic thinking pauses before patient responses",
    type: "range",
    moduleId: "ai_integration",
    enabled: true,
    required: false,
    evolvable: true,
    clinicalPurpose: "Simulates natural conversation flow and gives students time to process responses",
    min: 0,
    max: 10,
  },
  {
    id: "adaptive-behavior",
    name: "Adaptive Behavior",
    description: "Patient behavior adapts based on therapeutic approach",
    type: "boolean",
    moduleId: "ai_integration",
    enabled: false,
    required: false,
    evolvable: true,
    clinicalPurpose:
      "Provides feedback on therapeutic effectiveness and helps students learn cause-and-effect relationships",
  },

  // Supervisor Tools Features
  {
    id: "live-supervisor",
    name: "Live Supervisor Panel",
    description: "Real-time supervisor observation and guidance",
    type: "boolean",
    moduleId: "supervisor_tools",
    enabled: false,
    required: false,
    evolvable: false,
    clinicalPurpose: "Enables real-time supervision and immediate feedback during training sessions",
  },
  {
    id: "supervisor-notifications",
    name: "Supervisor Notifications",
    description: "Alerts for supervisor attention during sessions",
    type: "array",
    moduleId: "supervisor_tools",
    enabled: false,
    required: false,
    evolvable: false,
    clinicalPurpose: "Helps supervisors identify critical moments that require intervention or discussion",
  },
  {
    id: "real-time-guidance",
    name: "Real-time Guidance",
    description: "Contextual suggestions during therapy sessions",
    type: "boolean",
    moduleId: "supervisor_tools",
    enabled: false,
    required: false,
    evolvable: true,
    clinicalPurpose: "Provides in-the-moment learning opportunities and prevents therapeutic errors",
  },

  // Additional features for other modules...
  {
    id: "interruption-capability",
    name: "Interruption Capability",
    description: "Allow therapist to interrupt patient responses",
    type: "boolean",
    moduleId: "interaction_features",
    enabled: false,
    required: false,
    evolvable: false,
    clinicalPurpose: "Teaches students when and how to appropriately interrupt in therapeutic contexts",
  },
  {
    id: "mindfulness-exercises",
    name: "Mindfulness Exercises",
    description: "Built-in guided mindfulness and grounding exercises",
    type: "array",
    moduleId: "therapeutic_tools",
    enabled: false,
    required: false,
    evolvable: false,
    clinicalPurpose: "Provides therapeutic tools for managing patient distress and teaching coping skills",
  },
  {
    id: "session-recording",
    name: "Session Recording",
    description: "Record sessions for review and analysis",
    type: "select",
    moduleId: "recording_documentation",
    enabled: false,
    required: false,
    evolvable: false,
    clinicalPurpose: "Enables post-session review and skill development through self-reflection",
    options: ["disabled", "audio-only", "full-session", "key-moments"],
  },
  {
    id: "live-note-taking",
    name: "Live Note Taking",
    description: "Real-time note-taking during sessions",
    type: "boolean",
    moduleId: "recording_documentation",
    enabled: true,
    required: true,
    evolvable: false,
    clinicalPurpose: "Essential skill for maintaining therapeutic records and session continuity",
  },
  {
    id: "therapeutic-theme",
    name: "Therapeutic Theme",
    description: "Calming, professional visual theme",
    type: "select",
    moduleId: "visual_interface",
    enabled: true,
    required: true,
    evolvable: false,
    clinicalPurpose: "Creates appropriate therapeutic environment and reduces distractions",
    options: ["sage", "warm", "clinical", "accessible"],
  },
  {
    id: "mood-tracking",
    name: "Mood Tracking",
    description: "Track patient mood changes throughout session",
    type: "select",
    moduleId: "analytics_tracking",
    enabled: false,
    required: false,
    evolvable: true,
    clinicalPurpose: "Helps students learn to monitor and respond to patient emotional states",
    options: ["disabled", "basic", "detailed", "predictive"],
  },
]

// Storage keys
const MODULES_STORAGE_KEY = "chat-architecture-modules"
const FEATURES_STORAGE_KEY = "chat-architecture-features"

// Context
interface ChatFeaturesContextType {
  modules: ChatModule[]
  features: ChatFeature[]
  templates: ChatTemplate[]
  updateModule: (moduleId: string, updates: Partial<ChatModule>) => void
  toggleModule: (moduleId: string, enabled: boolean) => void
  toggleFeature: (featureId: string, enabled: boolean) => void
  updateFeature: (featureId: string, updates: Partial<ChatFeature>) => void
  getEnabledFeatures: () => ChatFeature[]
  getFeaturesByModule: (moduleId: string) => ChatFeature[]
  applyTemplate: (template: ChatTemplate) => void
  resetToDefaults: () => void
}

const ChatFeaturesContext = createContext<ChatFeaturesContextType | undefined>(undefined)

// Provider
export function ChatFeaturesProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<ChatModule[]>(DEFAULT_MODULES)
  const [features, setFeatures] = useState<ChatFeature[]>(DEFAULT_FEATURES)
  const [templates, setTemplates] = useState<ChatTemplate[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedModules = localStorage.getItem(MODULES_STORAGE_KEY)
        const savedFeatures = localStorage.getItem(FEATURES_STORAGE_KEY)

        if (savedModules) {
          const parsedModules = JSON.parse(savedModules)
          setModules(parsedModules)
        }

        if (savedFeatures) {
          const parsedFeatures = JSON.parse(savedFeatures)
          setFeatures(parsedFeatures)
        }
      } catch (error) {
        console.error("Failed to load chat architecture settings:", error)
      } finally {
        setIsLoaded(true)
      }
    }
  }, [])

  // Save to localStorage when modules change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(modules))
      } catch (error) {
        console.error("Failed to save modules to localStorage:", error)
      }
    }
  }, [modules, isLoaded])

  // Save to localStorage when features change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(FEATURES_STORAGE_KEY, JSON.stringify(features))
      } catch (error) {
        console.error("Failed to save features to localStorage:", error)
      }
    }
  }, [features, isLoaded])

  // Update module stats when features change
  useEffect(() => {
    setModules((prevModules) =>
      prevModules.map((module) => {
        const moduleFeatures = features.filter((f) => f.moduleId === module.id)
        return {
          ...module,
          stats: {
            totalFeatures: moduleFeatures.length,
            requiredFeatures: moduleFeatures.filter((f) => f.required).length,
            evolvableFeatures: moduleFeatures.filter((f) => f.evolvable).length,
          },
        }
      }),
    )
  }, [features])

  const updateModule = (moduleId: string, updates: Partial<ChatModule>) => {
    setModules((prev) => prev.map((module) => (module.id === moduleId ? { ...module, ...updates } : module)))
  }

  const toggleModule = (moduleId: string, enabled: boolean) => {
    setModules((prev) => prev.map((module) => (module.id === moduleId ? { ...module, enabled } : module)))

    // When disabling a module, disable all its features (except required ones)
    if (!enabled) {
      setFeatures((prev) =>
        prev.map((feature) =>
          feature.moduleId === moduleId && !feature.required ? { ...feature, enabled: false } : feature,
        ),
      )
    }
  }

  const toggleFeature = (featureId: string, enabled: boolean) => {
    setFeatures((prev) => prev.map((feature) => (feature.id === featureId ? { ...feature, enabled } : feature)))
  }

  const updateFeature = (featureId: string, updates: Partial<ChatFeature>) => {
    setFeatures((prev) => prev.map((feature) => (feature.id === featureId ? { ...feature, ...updates } : feature)))
  }

  const getEnabledFeatures = () => {
    return features.filter((feature) => {
      const module = modules.find((m) => m.id === feature.moduleId)
      return module?.enabled && feature.enabled
    })
  }

  const getFeaturesByModule = (moduleId: string) => {
    return features.filter((feature) => feature.moduleId === moduleId)
  }

  const applyTemplate = (template: ChatTemplate) => {
    // Apply module settings
    Object.entries(template.moduleSettings).forEach(([moduleId, enabled]) => {
      toggleModule(moduleId, enabled)
    })

    // Apply feature settings
    Object.entries(template.featureSettings).forEach(([featureId, enabled]) => {
      toggleFeature(featureId, enabled)
    })
  }

  const resetToDefaults = () => {
    setModules(DEFAULT_MODULES)
    setFeatures(DEFAULT_FEATURES)
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(MODULES_STORAGE_KEY)
      localStorage.removeItem(FEATURES_STORAGE_KEY)
    }
  }

  return (
    <ChatFeaturesContext.Provider
      value={{
        modules,
        features,
        templates,
        updateModule,
        toggleModule,
        toggleFeature,
        updateFeature,
        getEnabledFeatures,
        getFeaturesByModule,
        applyTemplate,
        resetToDefaults,
      }}
    >
      {children}
    </ChatFeaturesContext.Provider>
  )
}

// Hook
export function useChatFeatures() {
  const context = useContext(ChatFeaturesContext)
  if (context === undefined) {
    throw new Error("useChatFeatures must be used within a ChatFeaturesProvider")
  }
  return context
}
