export interface ChatFeatureConfig {
  id: string
  name: string
  description: string
  enabled: boolean
  settings?: Record<string, any>
}

export interface ChatTemplate {
  id: string
  name: string
  description: string
  category: "beginner" | "intermediate" | "advanced" | "specialized"
  features: {
    // Voice & Audio
    voiceChat: ChatFeatureConfig
    textToSpeech: ChatFeatureConfig
    speechToText: ChatFeatureConfig
    emotionDetection: ChatFeatureConfig
    voiceCommands: ChatFeatureConfig

    // AI Integration
    aiPatientResponses: ChatFeatureConfig
    aiPersonality: ChatFeatureConfig
    responseDelay: ChatFeatureConfig
    adaptiveBehavior: ChatFeatureConfig

    // Supervisor Tools
    liveSupervisor: ChatFeatureConfig
    supervisorNotifications: ChatFeatureConfig
    realTimeGuidance: ChatFeatureConfig

    // Interaction Features
    interruptionCapability: ChatFeatureConfig
    gestureRecognition: ChatFeatureConfig
    eyeTracking: ChatFeatureConfig

    // Therapeutic Tools
    mindfulnessExercises: ChatFeatureConfig
    breathingTools: ChatFeatureConfig
    reflectionPrompts: ChatFeatureConfig
    resourceSharing: ChatFeatureConfig

    // Recording & Documentation
    sessionRecording: ChatFeatureConfig
    autoTranscription: ChatFeatureConfig
    liveNoteTaking: ChatFeatureConfig

    // Visual Interface
    therapeuticTheme: ChatFeatureConfig
    accessibilityMode: ChatFeatureConfig
    distractionFreeMode: ChatFeatureConfig

    // Analytics
    moodTracking: ChatFeatureConfig
    engagementMetrics: ChatFeatureConfig
    progressIndicators: ChatFeatureConfig
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  isDefault: boolean
}

export interface ChatTemplateFormData {
  name: string
  description: string
  category: ChatTemplate["category"]
  features: ChatTemplate["features"]
}

export const DEFAULT_CHAT_FEATURES: ChatTemplate["features"] = {
  // Voice & Audio
  voiceChat: {
    id: "voice-chat",
    name: "Voice Chat",
    description: "Enable voice conversation with the patient",
    enabled: false,
    settings: { quality: "high", autoStart: false },
  },
  textToSpeech: {
    id: "text-to-speech",
    name: "Text-to-Speech",
    description: "Convert patient text responses to speech",
    enabled: false,
    settings: { voice: "natural", speed: 1.0, language: "en-US" },
  },
  speechToText: {
    id: "speech-to-text",
    name: "Speech-to-Text",
    description: "Convert therapist speech to text",
    enabled: false,
    settings: { accuracy: "high", realTime: true },
  },
  emotionDetection: {
    id: "emotion-detection",
    name: "Emotion Detection",
    description: "Analyze emotional tone in voice and text",
    enabled: false,
    settings: { sensitivity: "medium", visualFeedback: true },
  },
  voiceCommands: {
    id: "voice-commands",
    name: "Voice Commands",
    description: "Control session with voice commands",
    enabled: false,
    settings: { wakeWord: "therapy", commands: ["pause", "resume", "note"] },
  },

  // AI Integration
  aiPatientResponses: {
    id: "ai-patient-responses",
    name: "AI Patient Responses",
    description: "AI-generated patient responses based on profile",
    enabled: true,
    settings: { model: "gpt-4", creativity: 0.7, consistency: "high" },
  },
  aiPersonality: {
    id: "ai-personality",
    name: "AI Personality",
    description: "Consistent AI personality throughout session",
    enabled: true,
    settings: { adaptability: "medium", memoryDepth: "session" },
  },
  responseDelay: {
    id: "response-delay",
    name: "Response Delay",
    description: "Realistic thinking pauses in AI responses",
    enabled: true,
    settings: { minDelay: 1000, maxDelay: 3000, variability: "natural" },
  },
  adaptiveBehavior: {
    id: "adaptive-behavior",
    name: "Adaptive Behavior",
    description: "AI adapts behavior based on therapist approach",
    enabled: false,
    settings: { learningRate: "slow", adaptationScope: "session" },
  },

  // Supervisor Tools
  liveSupervisor: {
    id: "live-supervisor",
    name: "Live Supervisor",
    description: "Real-time supervisor guidance panel",
    enabled: false,
    settings: { visibility: "sidebar", notifications: true },
  },
  supervisorNotifications: {
    id: "supervisor-notifications",
    name: "Supervisor Notifications",
    description: "Alerts for supervisor attention",
    enabled: false,
    settings: { triggers: ["stuck", "breakthrough", "concern"], urgency: "medium" },
  },
  realTimeGuidance: {
    id: "real-time-guidance",
    name: "Real-time Guidance",
    description: "Contextual suggestions during session",
    enabled: false,
    settings: { frequency: "as-needed", intrusiveness: "low" },
  },

  // Interaction Features
  interruptionCapability: {
    id: "interruption-capability",
    name: "Interruption Capability",
    description: "Allow therapist to interrupt patient responses",
    enabled: false,
    settings: { method: "button", gracefulHandling: true },
  },
  gestureRecognition: {
    id: "gesture-recognition",
    name: "Gesture Recognition",
    description: "Recognize hand gestures for session control",
    enabled: false,
    settings: { gestures: ["pause", "continue", "note"], sensitivity: "medium" },
  },
  eyeTracking: {
    id: "eye-tracking",
    name: "Eye Tracking",
    description: "Track eye movement for engagement analysis",
    enabled: false,
    settings: { calibration: "auto", privacy: "session-only" },
  },

  // Therapeutic Tools
  mindfulnessExercises: {
    id: "mindfulness-exercises",
    name: "Mindfulness Exercises",
    description: "Built-in mindfulness and grounding exercises",
    enabled: false,
    settings: { exercises: ["breathing", "grounding", "5-4-3-2-1"], autoSuggest: false },
  },
  breathingTools: {
    id: "breathing-tools",
    name: "Breathing Tools",
    description: "Guided breathing exercises and tools",
    enabled: false,
    settings: { patterns: ["4-7-8", "box", "natural"], visualGuide: true },
  },
  reflectionPrompts: {
    id: "reflection-prompts",
    name: "Reflection Prompts",
    description: "Contextual reflection questions and prompts",
    enabled: false,
    settings: { timing: "natural-pauses", personalization: "medium" },
  },
  resourceSharing: {
    id: "resource-sharing",
    name: "Resource Sharing",
    description: "Share therapeutic resources during session",
    enabled: false,
    settings: { types: ["articles", "exercises", "videos"], delivery: "end-of-session" },
  },

  // Recording & Documentation
  sessionRecording: {
    id: "session-recording",
    name: "Session Recording",
    description: "Record session audio/video for review",
    enabled: false,
    settings: { format: "audio-only", encryption: true, retention: "30-days" },
  },
  autoTranscription: {
    id: "auto-transcription",
    name: "Auto Transcription",
    description: "Automatic transcription of session dialogue",
    enabled: false,
    settings: { accuracy: "high", speakerIdentification: true, realTime: false },
  },
  liveNoteTaking: {
    id: "live-note-taking",
    name: "Live Note Taking",
    description: "Enhanced note-taking tools during session",
    enabled: true,
    settings: { templates: true, quickNotes: true, timestamps: true },
  },

  // Visual Interface
  therapeuticTheme: {
    id: "therapeutic-theme",
    name: "Therapeutic Theme",
    description: "Calming visual theme optimized for therapy",
    enabled: true,
    settings: { colorScheme: "sage", animations: "subtle", contrast: "standard" },
  },
  accessibilityMode: {
    id: "accessibility-mode",
    name: "Accessibility Mode",
    description: "Enhanced accessibility features",
    enabled: false,
    settings: { screenReader: true, highContrast: false, largeText: false },
  },
  distractionFreeMode: {
    id: "distraction-free-mode",
    name: "Distraction-Free Mode",
    description: "Minimize UI distractions during session",
    enabled: false,
    settings: { hideNonEssential: true, focusMode: "conversation", notifications: "off" },
  },

  // Analytics
  moodTracking: {
    id: "mood-tracking",
    name: "Mood Tracking",
    description: "Track patient mood changes during session",
    enabled: false,
    settings: { method: "ai-analysis", frequency: "continuous", visualization: "post-session" },
  },
  engagementMetrics: {
    id: "engagement-metrics",
    name: "Engagement Metrics",
    description: "Measure patient engagement levels",
    enabled: false,
    settings: { indicators: ["response-time", "word-count", "tone"], realTime: false },
  },
  progressIndicators: {
    id: "progress-indicators",
    name: "Progress Indicators",
    description: "Visual indicators of session progress",
    enabled: true,
    settings: { style: "subtle", milestones: true, timeRemaining: true },
  },
}

export const PRESET_TEMPLATES: Omit<ChatTemplate, "id" | "createdAt" | "updatedAt" | "createdBy">[] = [
  {
    name: "Beginner Therapist",
    description: "Simple setup for new therapy students with basic features",
    category: "beginner",
    isDefault: true,
    features: {
      ...DEFAULT_CHAT_FEATURES,
      aiPatientResponses: { ...DEFAULT_CHAT_FEATURES.aiPatientResponses, enabled: true },
      liveNoteTaking: { ...DEFAULT_CHAT_FEATURES.liveNoteTaking, enabled: true },
      therapeuticTheme: { ...DEFAULT_CHAT_FEATURES.therapeuticTheme, enabled: true },
      progressIndicators: { ...DEFAULT_CHAT_FEATURES.progressIndicators, enabled: true },
    },
  },
  {
    name: "Voice Training",
    description: "Focus on voice-based therapy skills with audio features",
    category: "intermediate",
    isDefault: false,
    features: {
      ...DEFAULT_CHAT_FEATURES,
      voiceChat: { ...DEFAULT_CHAT_FEATURES.voiceChat, enabled: true },
      textToSpeech: { ...DEFAULT_CHAT_FEATURES.textToSpeech, enabled: true },
      speechToText: { ...DEFAULT_CHAT_FEATURES.speechToText, enabled: true },
      emotionDetection: { ...DEFAULT_CHAT_FEATURES.emotionDetection, enabled: true },
      aiPatientResponses: { ...DEFAULT_CHAT_FEATURES.aiPatientResponses, enabled: true },
      liveNoteTaking: { ...DEFAULT_CHAT_FEATURES.liveNoteTaking, enabled: true },
    },
  },
  {
    name: "Advanced Training",
    description: "Full-featured setup for experienced practitioners",
    category: "advanced",
    isDefault: false,
    features: {
      ...DEFAULT_CHAT_FEATURES,
      voiceChat: { ...DEFAULT_CHAT_FEATURES.voiceChat, enabled: true },
      textToSpeech: { ...DEFAULT_CHAT_FEATURES.textToSpeech, enabled: true },
      speechToText: { ...DEFAULT_CHAT_FEATURES.speechToText, enabled: true },
      emotionDetection: { ...DEFAULT_CHAT_FEATURES.emotionDetection, enabled: true },
      aiPatientResponses: { ...DEFAULT_CHAT_FEATURES.aiPatientResponses, enabled: true },
      liveSupervisor: { ...DEFAULT_CHAT_FEATURES.liveSupervisor, enabled: true },
      interruptionCapability: { ...DEFAULT_CHAT_FEATURES.interruptionCapability, enabled: true },
      mindfulnessExercises: { ...DEFAULT_CHAT_FEATURES.mindfulnessExercises, enabled: true },
      sessionRecording: { ...DEFAULT_CHAT_FEATURES.sessionRecording, enabled: true },
      moodTracking: { ...DEFAULT_CHAT_FEATURES.moodTracking, enabled: true },
    },
  },
  {
    name: "Research Mode",
    description: "Comprehensive data collection for research purposes",
    category: "specialized",
    isDefault: false,
    features: {
      ...DEFAULT_CHAT_FEATURES,
      aiPatientResponses: { ...DEFAULT_CHAT_FEATURES.aiPatientResponses, enabled: true },
      sessionRecording: { ...DEFAULT_CHAT_FEATURES.sessionRecording, enabled: true },
      autoTranscription: { ...DEFAULT_CHAT_FEATURES.autoTranscription, enabled: true },
      moodTracking: { ...DEFAULT_CHAT_FEATURES.moodTracking, enabled: true },
      engagementMetrics: { ...DEFAULT_CHAT_FEATURES.engagementMetrics, enabled: true },
      emotionDetection: { ...DEFAULT_CHAT_FEATURES.emotionDetection, enabled: true },
      liveNoteTaking: { ...DEFAULT_CHAT_FEATURES.liveNoteTaking, enabled: true },
    },
  },
]
