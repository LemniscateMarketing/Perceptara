"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Volume2,
  Mic,
  Settings,
  Play,
  Square,
  Zap,
  Globe,
  Crown,
  CheckCircle,
  RefreshCw,
  Loader2,
  Sparkles,
  Rocket,
  Clock,
} from "lucide-react"
import { voiceManager, type VoiceConfig, type Voice } from "@/lib/voice-manager"

interface ApiConfig {
  providerId: string
  providerName: string
  apiKey: string
  selectedModel: string
  isActive: boolean
  lastTested: Date | null
  status: "untested" | "valid" | "invalid" | "testing"
  createdAt: Date
}

export default function VoiceSettings() {
  const [config, setConfig] = useState<VoiceConfig>({
    provider: "web-speech",
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    openaiModel: "tts-1-hd",
  })
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([])
  const [isTestPlaying, setIsTestPlaying] = useState(false)
  const [supportedProviders, setSupportedProviders] = useState<string[]>([])
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([])
  const [isLoadingVoices, setIsLoadingVoices] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastApiConfigsRef = useRef<string>("")

  // Monitor localStorage changes for real-time API detection
  useEffect(() => {
    const checkApiChanges = () => {
      try {
        const currentConfigs = localStorage.getItem("api-configurations-v2") || ""
        if (currentConfigs !== lastApiConfigsRef.current) {
          lastApiConfigsRef.current = currentConfigs
          loadApiConfigurations()
        }
      } catch (error) {
        console.error("Error checking API changes:", error)
      }
    }

    // Check immediately and then every 1 second
    checkApiChanges()
    intervalRef.current = setInterval(checkApiChanges, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Load initial settings
  useEffect(() => {
    const initialize = async () => {
      setIsInitializing(true)
      await loadApiConfigurations()
      loadVoiceSettings()
      setIsInitializing(false)
    }
    initialize()
  }, [])

  // Reload voices when provider or model changes
  useEffect(() => {
    if (!isInitializing && config.provider) {
      loadVoices()
    }
  }, [config.provider, config.openaiModel, supportedProviders, isInitializing])

  const loadApiConfigurations = useCallback(async () => {
    try {
      const savedConfigs = localStorage.getItem("api-configurations-v2")
      if (savedConfigs) {
        const parsed = JSON.parse(savedConfigs)
        const configs = parsed.map((config: any) => ({
          ...config,
          createdAt: new Date(config.createdAt),
          lastTested: config.lastTested ? new Date(config.lastTested) : null,
        }))

        setApiConfigs(configs)

        // Configure voice manager with available API keys
        const configuredProviders: string[] = ["web-speech"] // Always include web-speech

        configs.forEach((config: ApiConfig) => {
          if (config.isActive && config.status === "valid") {
            switch (config.providerId) {
              case "openai":
                voiceManager.configureOpenAI(config.apiKey)
                configuredProviders.push("openai")
                console.log("✅ OpenAI TTS configured from API settings")
                break
              case "elevenlabs":
                voiceManager.configureElevenLabs(config.apiKey)
                configuredProviders.push("elevenlabs")
                console.log("✅ ElevenLabs TTS configured from API settings")
                break
            }
          }
        })

        // Update supported providers
        setSupportedProviders(configuredProviders)
      } else {
        setSupportedProviders(["web-speech"])
      }
    } catch (error) {
      console.error("Failed to load API configurations:", error)
      setSupportedProviders(["web-speech"])
    }
  }, [])

  const loadVoiceSettings = () => {
    try {
      const savedConfig = localStorage.getItem("voice-config")
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig)
        setConfig(parsed)
        voiceManager.setConfig(parsed)
      }
    } catch (error) {
      console.error("Failed to load voice settings:", error)
    }
  }

  const loadVoices = async () => {
    if (!config.provider) return

    setIsLoadingVoices(true)
    try {
      // Small delay to ensure voice manager is properly configured
      await new Promise((resolve) => setTimeout(resolve, 200))

      const voices = await voiceManager.getAvailableVoices()
      setAvailableVoices(voices)

      // If current voice is not in the new voice list, reset it
      if (config.voice && !voices.find((v) => v.id === config.voice)) {
        const newConfig = { ...config, voice: voices.length > 0 ? voices[0].id : undefined }
        setConfig(newConfig)
        voiceManager.setConfig(newConfig)
      }
    } catch (error) {
      console.error("Failed to load voices:", error)
      setAvailableVoices([])
    } finally {
      setIsLoadingVoices(false)
    }
  }

  const saveConfig = () => {
    try {
      localStorage.setItem("voice-config", JSON.stringify(config))
      voiceManager.setConfig(config)
      console.log("✅ Voice settings saved")
    } catch (error) {
      console.error("Failed to save voice settings:", error)
    }
  }

  const testVoice = async () => {
    if (isTestPlaying) {
      voiceManager.stopSpeaking()
      setIsTestPlaying(false)
      return
    }

    setIsTestPlaying(true)
    try {
      const modelName = config.openaiModel || "tts-1-hd"
      const testTexts = {
        "tts-1":
          "Hello, I'm your AI patient using the fast TTS-1 model. I've been feeling overwhelmed lately and I'm hoping therapy can help me work through these feelings.",
        "tts-1-hd":
          "Hello, I'm your AI patient using the high-definition TTS-1 HD model. I've been feeling overwhelmed lately and I'm hoping therapy can help me work through these feelings with crystal-clear audio quality.",
        "gpt-4o-mini-tts":
          "Hello, I'm your AI patient using the latest GPT-4o Mini TTS model. I've been feeling overwhelmed lately and I'm hoping therapy can help me work through these feelings with the newest voice technology.",
      }

      const testText =
        config.provider === "openai"
          ? testTexts[modelName as keyof typeof testTexts] || testTexts["tts-1-hd"]
          : "Hello, I'm your AI patient. I've been feeling overwhelmed lately and I'm hoping therapy can help me work through these feelings."

      await voiceManager.speak(testText, config)
    } catch (error) {
      console.error("Voice test failed:", error)
    } finally {
      setIsTestPlaying(false)
    }
  }

  const updateConfig = (updates: Partial<VoiceConfig>) => {
    const newConfig = { ...config, ...updates }

    // If provider changed, reset voice selection
    if (updates.provider && updates.provider !== config.provider) {
      newConfig.voice = undefined
    }

    setConfig(newConfig)
    voiceManager.setConfig(newConfig)
  }

  const handleProviderSelect = (providerId: string) => {
    if (!supportedProviders.includes(providerId)) {
      console.log(`Provider ${providerId} not supported`)
      return
    }

    console.log(`Switching to provider: ${providerId}`)
    updateConfig({ provider: providerId as any })
  }

  const refreshApiConnections = () => {
    loadApiConfigurations()
    setTimeout(() => {
      loadVoices()
    }, 500)
  }

  const getProviderInfo = (provider: string) => {
    switch (provider) {
      case "web-speech":
        return {
          name: "Web Speech API",
          description: "Built-in browser voices (free)",
          icon: Globe,
          badge: "Free",
          badgeVariant: "green" as const,
        }
      case "elevenlabs":
        return {
          name: "ElevenLabs",
          description: "Ultra-realistic AI voices",
          icon: Crown,
          badge: "Premium",
          badgeVariant: "therapeutic" as const,
        }
      case "openai":
        return {
          name: "OpenAI TTS",
          description: "High-quality neural voices",
          icon: Zap,
          badge: "Pro",
          badgeVariant: "sage" as const,
        }
      default:
        return {
          name: provider,
          description: "Unknown provider",
          icon: Settings,
          badge: "Unknown",
          badgeVariant: "outline" as const,
        }
    }
  }

  const getProviderStatus = (providerId: string) => {
    if (providerId === "web-speech") {
      return { isSupported: true, status: "Built-in", statusColor: "green" }
    }

    const isSupported = supportedProviders.includes(providerId)
    const apiConfig = apiConfigs.find((config) => config.providerId === providerId)

    if (!apiConfig) {
      return { isSupported: false, status: "Not configured", statusColor: "warm" }
    }

    if (!apiConfig.isActive || apiConfig.status !== "valid") {
      return { isSupported: false, status: "API key invalid", statusColor: "outline" }
    }

    return { isSupported: true, status: "Ready", statusColor: "green" }
  }

  const getModelIcon = (modelId: string) => {
    switch (modelId) {
      case "tts-1":
        return Clock
      case "tts-1-hd":
        return Sparkles
      case "gpt-4o-mini-tts":
        return Rocket
      default:
        return Settings
    }
  }

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-sage-600" />
        <span className="ml-2 text-sage-600">Loading voice settings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* API Integration Status */}
      <Card className="bg-therapeutic-beige/20 border-warm-200 rounded-organic-xl">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sage-900 mb-2">API Integration Active</h3>
                <p className="text-sm text-sage-700 leading-relaxed">
                  Voice providers are automatically activated when you configure their API keys in the API settings.
                  {supportedProviders.length > 1 && (
                    <span className="block mt-1 font-medium">
                      {supportedProviders.length} provider(s) available for voice.
                    </span>
                  )}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {supportedProviders.map((provider) => (
                    <Badge key={provider} variant="green" className="text-xs">
                      {getProviderInfo(provider).name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshApiConnections}
              className="text-sage-600 border-sage-200 hover:bg-sage-50 rounded-organic-md bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Provider Selection */}
      <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-sage-900 flex items-center">
            <Volume2 className="h-5 w-5 mr-3 text-sage-600" />
            Voice Provider
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["web-speech", "openai", "elevenlabs"].map((provider) => {
              const info = getProviderInfo(provider)
              const status = getProviderStatus(provider)
              const IconComponent = info.icon
              const isSelected = config.provider === provider
              const isSupported = status.isSupported

              return (
                <Card
                  key={provider}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected ? "ring-2 ring-sage-300 bg-sage-50" : "hover:bg-sage-50"
                  } ${!isSupported ? "opacity-60 cursor-not-allowed" : ""}`}
                  onClick={() => isSupported && handleProviderSelect(provider)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-sage-100 rounded-organic-lg">
                        <IconComponent className="h-5 w-5 text-sage-600" />
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant={info.badgeVariant} className="text-xs">
                          {info.badge}
                        </Badge>
                        <Badge variant={status.statusColor as any} className="text-xs">
                          {status.status}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-medium text-sage-900 mb-1">{info.name}</h3>
                    <p className="text-sm text-sage-600">{info.description}</p>
                    {!isSupported && provider !== "web-speech" && (
                      <p className="text-xs text-warm-600 mt-2">Configure in API settings to enable</p>
                    )}
                    {isSelected && (
                      <div className="mt-3 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-sage-600 rounded-full"></div>
                        <span className="text-xs text-sage-600 font-medium">Active</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Voice Configuration */}
      <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-sage-900">Voice Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="voice" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-sage-50 rounded-organic-lg">
              <TabsTrigger value="voice" className="rounded-organic-md">
                Voice Selection
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-organic-md">
                Audio Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="voice" className="space-y-4 mt-6">
              {/* Current Provider Info */}
              <div className="p-3 bg-sage-50 rounded-organic-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-sage-600 rounded-full"></div>
                  <span className="text-sm font-medium text-sage-700">
                    Using {getProviderInfo(config.provider).name}
                  </span>
                  {config.provider === "openai" && (
                    <Badge variant="therapeutic" className="text-xs">
                      {config.openaiModel === "gpt-4o-mini-tts" && <Rocket className="h-2 w-2 mr-1" />}
                      {config.openaiModel === "tts-1-hd" && <Sparkles className="h-2 w-2 mr-1" />}
                      {config.openaiModel === "tts-1" && <Clock className="h-2 w-2 mr-1" />}
                      {config.openaiModel
                        ?.replace("tts-1-hd", "HD")
                        .replace("tts-1", "Fast")
                        .replace("gpt-4o-mini-tts", "GPT-4o Mini")}
                    </Badge>
                  )}
                  {config.provider === "elevenlabs" && (
                    <Badge variant="therapeutic" className="text-xs">
                      Ultra-Realistic
                    </Badge>
                  )}
                </div>
              </div>

              {/* Model Selection for OpenAI */}
              {config.provider === "openai" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-sage-700">OpenAI TTS Model</label>
                  <div className="grid grid-cols-1 gap-3">
                    {voiceManager.getAvailableModels().map((model) => {
                      const IconComponent = getModelIcon(model.id)
                      const isSelected = config.openaiModel === model.id

                      return (
                        <Card
                          key={model.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected ? "ring-2 ring-sage-300 bg-sage-50" : "hover:bg-sage-50"
                          }`}
                          onClick={() => updateConfig({ openaiModel: model.id as any })}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-1.5 bg-sage-100 rounded-organic-md">
                                  <IconComponent className="h-4 w-4 text-sage-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-sage-900 text-sm">{model.name}</h4>
                                  <p className="text-xs text-sage-600">{model.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={model.badgeVariant as any} className="text-xs">
                                  {model.badge}
                                </Badge>
                                {isSelected && <div className="w-2 h-2 bg-sage-600 rounded-full"></div>}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                  <div className="p-3 bg-therapeutic-beige/20 rounded-organic-lg">
                    <p className="text-xs text-sage-600 leading-relaxed">
                      <strong>💡 Tip:</strong> Try all three models to hear the differences! GPT-4o Mini TTS is the
                      newest and may offer improved naturalness.
                    </p>
                  </div>
                </div>
              )}

              {/* Voice Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-sage-700">Patient Voice</label>
                <Select
                  value={config.voice || ""}
                  onValueChange={(value) => updateConfig({ voice: value })}
                  disabled={isLoadingVoices}
                >
                  <SelectTrigger className="border-sage-200 rounded-organic-lg bg-white/80">
                    <SelectValue placeholder={isLoadingVoices ? "Loading voices..." : "Select a voice..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{voice.name}</span>
                          <div className="flex items-center space-x-2 ml-4">
                            {voice.gender && (
                              <Badge variant="outline" className="text-xs">
                                {voice.gender}
                              </Badge>
                            )}
                            <Badge variant="sage" className="text-xs">
                              {voice.provider}
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isLoadingVoices && (
                  <div className="flex items-center space-x-2 text-xs text-sage-500">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Loading {getProviderInfo(config.provider).name} voices...</span>
                  </div>
                )}
                {availableVoices.length === 0 && !isLoadingVoices && (
                  <p className="text-xs text-sage-500">No voices available for selected provider</p>
                )}
              </div>

              {/* Voice Test */}
              <div className="flex items-center space-x-3 p-4 bg-sage-50 rounded-organic-lg">
                <Button
                  onClick={testVoice}
                  disabled={availableVoices.length === 0 || !config.voice}
                  className={`${
                    isTestPlaying ? "bg-red-600 hover:bg-red-700" : "bg-sage-600 hover:bg-sage-700"
                  } text-white rounded-organic-lg`}
                >
                  {isTestPlaying ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Test
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Test Voice
                    </>
                  )}
                </Button>
                <div className="flex-1">
                  <p className="text-sm text-sage-700 font-medium">
                    Voice Preview
                    {config.provider === "openai" && (
                      <Badge variant="therapeutic" className="text-xs ml-2">
                        {config.openaiModel === "gpt-4o-mini-tts" && <Rocket className="h-2 w-2 mr-1" />}
                        {config.openaiModel === "tts-1-hd" && <Sparkles className="h-2 w-2 mr-1" />}
                        {config.openaiModel === "tts-1" && <Clock className="h-2 w-2 mr-1" />}
                        {config.openaiModel
                          ?.replace("tts-1-hd", "HD")
                          .replace("tts-1", "Fast")
                          .replace("gpt-4o-mini-tts", "Latest")}
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-sage-600">Test how the patient will sound during sessions</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-6">
              {/* Speech Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-sage-700">Speech Rate</label>
                  <span className="text-sm text-sage-600">{config.rate?.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[config.rate || 0.9]}
                  onValueChange={([value]) => updateConfig({ rate: value })}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-sage-500">
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
              </div>

              {/* Pitch (Web Speech only) */}
              {config.provider === "web-speech" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-sage-700">Pitch</label>
                    <span className="text-sm text-sage-600">{config.pitch?.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[config.pitch || 1.0]}
                    onValueChange={([value]) => updateConfig({ pitch: value })}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-sage-500">
                    <span>Lower</span>
                    <span>Higher</span>
                  </div>
                </div>
              )}

              {/* Volume */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-sage-700">Volume</label>
                  <span className="text-sm text-sage-600">{Math.round((config.volume || 0.8) * 100)}%</span>
                </div>
                <Slider
                  value={[config.volume || 0.8]}
                  onValueChange={([value]) => updateConfig({ volume: value })}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-sage-500">
                  <span>Quiet</span>
                  <span>Loud</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-sage-100">
            <Button onClick={saveConfig} className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-lg">
              Save Voice Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Speech Recognition Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-sage-900 flex items-center">
            <Mic className="h-5 w-5 mr-3 text-sage-600" />
            Speech Recognition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-sage-50 rounded-organic-lg">
            <div>
              <h4 className="font-medium text-sage-900">Voice Input</h4>
              <p className="text-sm text-sage-600">
                {voiceManager.isSpeechRecognitionSupported()
                  ? "Speak your responses instead of typing"
                  : "Speech recognition not supported in this browser"}
              </p>
            </div>
            <Badge variant={voiceManager.isSpeechRecognitionSupported() ? "green" : "outline"} className="text-xs">
              {voiceManager.isSpeechRecognitionSupported() ? "Supported" : "Not Available"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Future: Realtime Models Info */}
      <Card className="bg-gradient-to-r from-therapeutic-beige/10 to-sage-50/30 border-sage-200 rounded-organic-xl">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-start space-x-3">
            <Rocket className="h-5 w-5 text-sage-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-sage-900 mb-2">🚀 Coming Soon: Realtime Voice</h3>
              <p className="text-sm text-sage-700 leading-relaxed">
                OpenAI's new <strong>GPT-4o Realtime</strong> models will enable live streaming conversations where the
                AI speaks as it thinks, creating incredibly natural dialogue flow.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="sage" className="text-xs">
                  GPT-4o Realtime
                </Badge>
                <Badge variant="therapeutic" className="text-xs">
                  GPT-4o mini Realtime
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Live Streaming
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
