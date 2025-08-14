export interface Voice {
  id: string
  name: string
  language: string
  gender?: "male" | "female" | "neutral"
  provider: string
}

export interface VoiceConfig {
  provider: "web-speech" | "elevenlabs" | "openai"
  voice?: string
  rate?: number
  pitch?: number
  volume?: number
  elevenLabsVoiceId?: string
  openaiVoice?: string
  openaiModel?: "tts-1" | "tts-1-hd" | "gpt-4o-mini-tts"
  // NEW: Advanced voice features
  enableInterruption?: boolean
  enableEmotionDetection?: boolean
  enableVoiceCommands?: boolean
}

export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
  // NEW: Emotion detection
  detectedEmotion?: string
  emotionConfidence?: number
}

export interface VoiceCommand {
  command: string
  action: string
  confidence: number
}

class VoiceManager {
  private config: VoiceConfig = {
    provider: "web-speech",
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    openaiModel: "tts-1-hd",
    // NEW: Default advanced features to false for safety
    enableInterruption: false,
    enableEmotionDetection: false,
    enableVoiceCommands: false,
  }

  private elevenLabsApiKey = ""
  private openaiApiKey = ""
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private currentAudio: HTMLAudioElement | null = null
  private recognition: any = null
  private isListening = false

  // NEW: Advanced voice features
  private isPatientSpeaking = false
  private interruptionCallback: (() => void) | null = null
  private voiceCommandCallback: ((command: VoiceCommand) => void) | null = null
  private emotionDetectionCallback: ((emotion: string, confidence: number) => void) | null = null

  constructor() {
    // Initialize speech recognition if available
    if (this.isSpeechRecognitionSupported()) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.lang = "en-US"
    }
  }

  setConfig(config: Partial<VoiceConfig>) {
    this.config = { ...this.config, ...config }
  }

  getConfig(): VoiceConfig {
    return { ...this.config }
  }

  configureElevenLabs(apiKey: string) {
    this.elevenLabsApiKey = apiKey
    console.log("🎙️ ElevenLabs configured for voice synthesis")
  }

  configureOpenAI(apiKey: string) {
    this.openaiApiKey = apiKey
    console.log("🎙️ OpenAI TTS configured for voice synthesis")
  }

  // NEW: Advanced feature configuration
  enableAdvancedFeatures(options: {
    interruption?: boolean
    emotionDetection?: boolean
    voiceCommands?: boolean
  }) {
    this.config.enableInterruption = options.interruption ?? false
    this.config.enableEmotionDetection = options.emotionDetection ?? false
    this.config.enableVoiceCommands = options.voiceCommands ?? false

    console.log("🚀 Advanced voice features configured:", {
      interruption: this.config.enableInterruption,
      emotionDetection: this.config.enableEmotionDetection,
      voiceCommands: this.config.enableVoiceCommands,
    })
  }

  // NEW: Set callbacks for advanced features
  setInterruptionCallback(callback: () => void) {
    this.interruptionCallback = callback
  }

  setVoiceCommandCallback(callback: (command: VoiceCommand) => void) {
    this.voiceCommandCallback = callback
  }

  setEmotionDetectionCallback(callback: (emotion: string, confidence: number) => void) {
    this.emotionDetectionCallback = callback
  }

  getSupportedProviders(): string[] {
    const providers = ["web-speech"]

    if (this.elevenLabsApiKey) {
      providers.push("elevenlabs")
    }

    if (this.openaiApiKey) {
      providers.push("openai")
    }

    return providers
  }

  isSpeechSynthesisSupported(): boolean {
    return "speechSynthesis" in window
  }

  isSpeechRecognitionSupported(): boolean {
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window
  }

  async getAvailableVoices(): Promise<Voice[]> {
    switch (this.config.provider) {
      case "web-speech":
        return this.getWebSpeechVoices()
      case "elevenlabs":
        return this.getElevenLabsVoices()
      case "openai":
        return this.getOpenAIVoices()
      default:
        return []
    }
  }

  private getWebSpeechVoices(): Voice[] {
    if (!this.isSpeechSynthesisSupported()) return []

    const voices = speechSynthesis.getVoices()
    return voices.map((voice) => ({
      id: voice.voiceURI,
      name: voice.name,
      language: voice.lang,
      gender: this.inferGender(voice.name),
      provider: "web-speech",
    }))
  }

  private async getElevenLabsVoices(): Promise<Voice[]> {
    if (!this.elevenLabsApiKey) return []

    try {
      const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: {
          "xi-api-key": this.elevenLabsApiKey,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch ElevenLabs voices")

      const data = await response.json()
      return data.voices.map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
        language: "en-US",
        gender: voice.labels?.gender || this.inferGender(voice.name),
        provider: "elevenlabs",
      }))
    } catch (error) {
      console.error("Failed to fetch ElevenLabs voices:", error)
      return []
    }
  }

  private getOpenAIVoices(): Voice[] {
    const modelName = this.getModelDisplayName(this.config.openaiModel || "tts-1-hd")

    return [
      { id: "alloy", name: `Alloy (${modelName})`, language: "en-US", gender: "neutral", provider: "openai" },
      { id: "echo", name: `Echo (${modelName})`, language: "en-US", gender: "male", provider: "openai" },
      { id: "fable", name: `Fable (${modelName})`, language: "en-US", gender: "neutral", provider: "openai" },
      { id: "onyx", name: `Onyx (${modelName})`, language: "en-US", gender: "male", provider: "openai" },
      { id: "nova", name: `Nova (${modelName})`, language: "en-US", gender: "female", provider: "openai" },
      { id: "shimmer", name: `Shimmer (${modelName})`, language: "en-US", gender: "female", provider: "openai" },
    ]
  }

  private getModelDisplayName(model: string): string {
    switch (model) {
      case "tts-1":
        return "Fast"
      case "tts-1-hd":
        return "HD"
      case "gpt-4o-mini-tts":
        return "GPT-4o Mini"
      default:
        return "Standard"
    }
  }

  getAvailableModels(): Array<{ id: string; name: string; description: string; badge: string; badgeVariant: string }> {
    return [
      {
        id: "tts-1",
        name: "TTS-1 (Fast)",
        description: "Optimized for speed - fastest generation",
        badge: "Fast",
        badgeVariant: "green",
      },
      {
        id: "tts-1-hd",
        name: "TTS-1 HD (Quality)",
        description: "Optimized for quality - clearer audio",
        badge: "HD",
        badgeVariant: "therapeutic",
      },
      {
        id: "gpt-4o-mini-tts",
        name: "GPT-4o Mini TTS (Latest)",
        description: "Powered by GPT-4o mini - newest model",
        badge: "Latest",
        badgeVariant: "sage",
      },
    ]
  }

  private inferGender(voiceName: string): "male" | "female" | "neutral" {
    const name = voiceName.toLowerCase()
    const femaleIndicators = [
      "female",
      "woman",
      "girl",
      "she",
      "her",
      "samantha",
      "victoria",
      "alex",
      "susan",
      "nova",
      "shimmer",
    ]
    const maleIndicators = ["male", "man", "boy", "he", "him", "daniel", "thomas", "fred", "echo", "onyx"]

    if (femaleIndicators.some((indicator) => name.includes(indicator))) return "female"
    if (maleIndicators.some((indicator) => name.includes(indicator))) return "male"
    return "neutral"
  }

  async speak(text: string, config?: Partial<VoiceConfig>): Promise<void> {
    const finalConfig = { ...this.config, ...config }

    // Stop any current speech
    this.stopSpeaking()

    // NEW: Mark that patient is speaking for interruption detection
    this.isPatientSpeaking = true

    try {
      switch (finalConfig.provider) {
        case "web-speech":
          return this.speakWithWebSpeech(text, finalConfig)
        case "elevenlabs":
          return this.speakWithElevenLabs(text, finalConfig)
        case "openai":
          return this.speakWithOpenAI(text, finalConfig)
        default:
          throw new Error(`Unsupported voice provider: ${finalConfig.provider}`)
      }
    } finally {
      this.isPatientSpeaking = false
    }
  }

  private async speakWithWebSpeech(text: string, config: VoiceConfig): Promise<void> {
    if (!this.isSpeechSynthesisSupported()) {
      throw new Error("Speech synthesis not supported")
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)

      // Configure voice
      if (config.voice) {
        const voices = speechSynthesis.getVoices()
        const selectedVoice = voices.find((voice) => voice.voiceURI === config.voice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }

      utterance.rate = config.rate || 0.9
      utterance.pitch = config.pitch || 1.0
      utterance.volume = config.volume || 0.8

      utterance.onend = () => {
        this.currentUtterance = null
        this.isPatientSpeaking = false
        resolve()
      }

      utterance.onerror = (event) => {
        this.currentUtterance = null
        this.isPatientSpeaking = false
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }

      this.currentUtterance = utterance
      speechSynthesis.speak(utterance)
    })
  }

  private async speakWithElevenLabs(text: string, config: VoiceConfig): Promise<void> {
    if (!this.elevenLabsApiKey) {
      throw new Error("ElevenLabs API key not configured")
    }

    try {
      const voiceId = config.elevenLabsVoiceId || config.voice || "EXAVITQu4vr4xnSDxMaL"

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": this.elevenLabsApiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      return new Promise((resolve, reject) => {
        const audio = new Audio(audioUrl)
        audio.volume = config.volume || 0.8
        this.currentAudio = audio

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          this.currentAudio = null
          this.isPatientSpeaking = false
          resolve()
        }

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl)
          this.currentAudio = null
          this.isPatientSpeaking = false
          reject(new Error("Audio playback failed"))
        }

        audio.play().catch(reject)
      })
    } catch (error) {
      throw new Error(`ElevenLabs speech failed: ${error}`)
    }
  }

  private async speakWithOpenAI(text: string, config: VoiceConfig): Promise<void> {
    if (!this.openaiApiKey) {
      throw new Error("OpenAI API key not configured")
    }

    try {
      const model = config.openaiModel || "tts-1-hd"

      console.log(`🎙️ Using OpenAI ${model} for speech synthesis`)

      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          input: text,
          voice: config.openaiVoice || config.voice || "nova",
          speed: config.rate || 0.9,
          response_format: "mp3",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI TTS API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      return new Promise((resolve, reject) => {
        const audio = new Audio(audioUrl)
        audio.volume = config.volume || 0.8
        audio.preload = "auto"
        this.currentAudio = audio

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          this.currentAudio = null
          this.isPatientSpeaking = false
          resolve()
        }

        audio.onerror = (e) => {
          console.error("Audio playback error:", e)
          URL.revokeObjectURL(audioUrl)
          this.currentAudio = null
          this.isPatientSpeaking = false
          reject(new Error("Audio playback failed"))
        }

        audio.oncanplaythrough = () => {
          console.log(`🎵 ${model} audio ready to play`)
        }

        audio.play().catch((error) => {
          console.error("Audio play failed:", error)
          reject(error)
        })
      })
    } catch (error) {
      console.error("OpenAI TTS error:", error)
      throw new Error(`OpenAI TTS failed: ${error}`)
    }
  }

  // NEW: Enhanced stopSpeaking with interruption support
  stopSpeaking(isInterruption = false): void {
    // Stop Web Speech API
    if (this.currentUtterance) {
      speechSynthesis.cancel()
      this.currentUtterance = null
    }

    // Stop audio playback (ElevenLabs/OpenAI)
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
    }

    this.isPatientSpeaking = false

    // NEW: Trigger interruption callback if this was an interruption
    if (isInterruption && this.interruptionCallback) {
      console.log("🛑 Voice interruption detected!")
      this.interruptionCallback()
    }
  }

  startListening(onResult: (result: SpeechRecognitionResult) => void, onError?: (error: string) => void): boolean {
    if (!this.isSpeechRecognitionSupported() || !this.recognition) {
      onError?.("Speech recognition not supported")
      return false
    }

    if (this.isListening) {
      this.stopListening()
    }

    try {
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.lang = "en-US"
      this.recognition.maxAlternatives = 1

      this.recognition.onstart = () => {
        console.log("🎤 Speech recognition started")
        this.isListening = true

        // NEW: If patient is speaking and interruption is enabled, stop patient
        if (this.isPatientSpeaking && this.config.enableInterruption) {
          console.log("🛑 Interrupting patient speech...")
          this.stopSpeaking(true)
        }
      }

      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]

          if (result && result[0] && result[0].transcript) {
            const transcript = result[0].transcript.trim()

            // NEW: Check for voice commands first
            if (this.config.enableVoiceCommands) {
              const voiceCommand = this.detectVoiceCommand(transcript)
              if (voiceCommand && this.voiceCommandCallback) {
                this.voiceCommandCallback(voiceCommand)
                continue // Don't process as regular speech
              }
            }

            // NEW: Detect emotion if enabled
            let detectedEmotion: string | undefined
            let emotionConfidence: number | undefined

            if (this.config.enableEmotionDetection) {
              const emotion = this.detectEmotionFromSpeech(transcript)
              detectedEmotion = emotion.emotion
              emotionConfidence = emotion.confidence

              if (this.emotionDetectionCallback) {
                this.emotionDetectionCallback(emotion.emotion, emotion.confidence)
              }
            }

            onResult({
              transcript,
              confidence: result[0].confidence || 0.8,
              isFinal: result.isFinal,
              detectedEmotion,
              emotionConfidence,
            })
          }
        }
      }

      this.recognition.onerror = (event: any) => {
        console.error("🎤 Speech recognition error:", event.error)
        this.isListening = false

        if (event.error !== "no-speech") {
          onError?.(event.error)
        }
      }

      this.recognition.onend = () => {
        console.log("🎤 Speech recognition ended")
        this.isListening = false
      }

      this.recognition.start()
      return true
    } catch (error) {
      console.error("🎤 Failed to start speech recognition:", error)
      onError?.("Failed to start speech recognition")
      return false
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening
  }

  // NEW: Check if patient is currently speaking (for interruption detection)
  isCurrentlySpeaking(): boolean {
    return this.isPatientSpeaking
  }

  // NEW: Voice command detection
  private detectVoiceCommand(transcript: string): VoiceCommand | null {
    const commands = [
      { patterns: ["end session", "finish session", "stop session"], action: "end_session" },
      { patterns: ["take notes", "make notes", "add notes"], action: "take_notes" },
      { patterns: ["pause", "stop talking", "be quiet"], action: "pause_patient" },
      { patterns: ["continue", "go on", "keep talking"], action: "resume_patient" },
      { patterns: ["repeat", "say that again", "what did you say"], action: "repeat_last" },
    ]

    const lowerTranscript = transcript.toLowerCase()

    for (const commandGroup of commands) {
      for (const pattern of commandGroup.patterns) {
        if (lowerTranscript.includes(pattern)) {
          return {
            command: pattern,
            action: commandGroup.action,
            confidence: 0.8, // Simple confidence for now
          }
        }
      }
    }

    return null
  }

  // NEW: Simple emotion detection from speech text
  private detectEmotionFromSpeech(transcript: string): { emotion: string; confidence: number } {
    const emotionKeywords = {
      frustrated: ["frustrated", "annoyed", "irritated", "angry", "mad"],
      concerned: ["worried", "concerned", "anxious", "nervous", "scared"],
      empathetic: ["understand", "feel for", "sorry", "empathize", "care"],
      curious: ["interesting", "wonder", "curious", "tell me more", "how"],
      supportive: ["support", "help", "here for", "together", "we can"],
      reflective: ["think", "consider", "reflect", "ponder", "realize"],
    }

    const lowerTranscript = transcript.toLowerCase()
    let bestMatch = { emotion: "neutral", confidence: 0.3 }

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      for (const keyword of keywords) {
        if (lowerTranscript.includes(keyword)) {
          const confidence = 0.6 + keyword.length / 20 // Longer keywords = higher confidence
          if (confidence > bestMatch.confidence) {
            bestMatch = { emotion, confidence: Math.min(confidence, 0.9) }
          }
        }
      }
    }

    return bestMatch
  }
}

export const voiceManager = new VoiceManager()
