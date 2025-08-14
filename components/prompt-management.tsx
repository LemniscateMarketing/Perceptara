"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Save, TestTube, Plus, Edit } from "lucide-react"
import { BarChart3 } from "lucide-react" // Declaring BarChart3 variable

// Default templates
const defaultTemplates = [
  {
    id: "patient-default",
    name: "Default Patient",
    type: "patient",
    description: "Standard patient simulation with strong role reinforcement",
    prompt: `You are a PATIENT seeking therapy, NOT a therapist or counselor.

CRITICAL ROLE INSTRUCTIONS:
- You are THE PATIENT, NOT the therapist
- You are vulnerable and seeking help
- You have problems you need to work through
- You should NEVER offer therapeutic advice
- You should NEVER say "As your therapist" or similar phrases
- You should NEVER try to help or counsel the user

PATIENT DETAILS:
- Name: {{patientName}}
- Primary Concern: {{primaryConcern}}
- Current emotional state: Seeking guidance and support

THERAPEUTIC CONTEXT:
- Modality: {{modality}}
- Session focus: Working through your personal challenges

RESPONSE GUIDELINES:
- Speak from your personal experience and emotions
- Share your struggles and concerns authentically
- Ask for help when you feel overwhelmed
- Express vulnerability and uncertainty
- React naturally to the therapist's interventions
- Stay focused on YOUR problems and feelings

Remember: You are the one receiving help, not giving it. The therapist is there to support YOU.`,
    variables: ["patientName", "primaryConcern", "modality"],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "psychologist-default",
    name: "Default Psychologist",
    type: "psychologist",
    description: "Virtual psychologist for supervision and guidance",
    prompt: `You are an experienced, licensed psychologist providing supervision and guidance.

ROLE: Clinical Supervisor & Mentor
- You are a seasoned mental health professional
- You provide guidance, not direct therapy
- You help train and develop therapeutic skills
- You offer professional insights and recommendations

SUPERVISION STYLE:
- Supportive and encouraging
- Constructive feedback focused on growth
- Evidence-based recommendations
- Professional and ethical guidance

AREAS OF EXPERTISE:
- {{modality}} therapeutic approaches
- Clinical assessment and intervention
- Professional development and training
- Ethical considerations in therapy

RESPONSE GUIDELINES:
- Provide specific, actionable feedback
- Reference therapeutic techniques and theories
- Encourage skill development and confidence
- Maintain professional boundaries
- Focus on the learning process

Your goal is to help develop competent, confident mental health professionals.`,
    variables: ["modality"],
    isActive: false,
    createdAt: new Date().toISOString(),
  },
]

export function PromptManagement() {
  const [templates, setTemplates] = useState(defaultTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [isEditing, setIsEditing] = useState(false)
  const [testInput, setTestInput] = useState("")
  const [testOutput, setTestOutput] = useState("")

  const handleSaveTemplate = () => {
    const updatedTemplates = templates.map((t) => (t.id === selectedTemplate.id ? selectedTemplate : t))
    setTemplates(updatedTemplates)
    setIsEditing(false)
  }

  const handleTestPrompt = () => {
    let processedPrompt = selectedTemplate.prompt

    // Replace variables with test values
    const testValues = {
      patientName: "Jennifer Walsh",
      primaryConcern: "Anxiety and Self-Doubt",
      modality: "Cognitive Behavioral Therapy (CBT)",
    }

    selectedTemplate.variables.forEach((variable) => {
      const value = testValues[variable as keyof typeof testValues] || `[${variable}]`
      processedPrompt = processedPrompt.replace(new RegExp(`{{${variable}}}`, "g"), value)
    })

    setTestOutput(processedPrompt)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-sage-900 mb-2">Prompt Management</h1>
        <p className="text-sage-600">Manage AI prompts and templates for different therapeutic scenarios and roles.</p>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Templates</CardTitle>
                <CardDescription>Manage your prompt templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-organic-md border cursor-pointer transition-colors ${
                      selectedTemplate.id === template.id
                        ? "border-sage-200 bg-sage-50"
                        : "border-sage-100 hover:border-sage-200"
                    }`}
                    onClick={() => {
                      setSelectedTemplate(template)
                      setIsEditing(false)
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sage-900">{template.name}</h4>
                      <Badge variant={template.type === "patient" ? "therapeutic" : "warm"}>{template.type}</Badge>
                    </div>
                    <p className="text-sm text-sage-600">{template.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-sage-500">{template.variables.length} variables</span>
                      {template.isActive && (
                        <Badge variant="green" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </CardContent>
            </Card>

            {/* Template Editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedTemplate.name}</CardTitle>
                    <CardDescription>{selectedTemplate.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                      {isEditing ? (
                        "Cancel"
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                    {isEditing && (
                      <Button size="sm" onClick={handleSaveTemplate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                          id="template-name"
                          value={selectedTemplate.name}
                          onChange={(e) =>
                            setSelectedTemplate({
                              ...selectedTemplate,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-type">Type</Label>
                        <Select
                          value={selectedTemplate.type}
                          onValueChange={(value) =>
                            setSelectedTemplate({
                              ...selectedTemplate,
                              type: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="patient">Patient</SelectItem>
                            <SelectItem value="psychologist">Psychologist</SelectItem>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="template-description">Description</Label>
                      <Input
                        id="template-description"
                        value={selectedTemplate.description}
                        onChange={(e) =>
                          setSelectedTemplate({
                            ...selectedTemplate,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="template-prompt">Prompt Template</Label>
                      <Textarea
                        id="template-prompt"
                        value={selectedTemplate.prompt}
                        onChange={(e) =>
                          setSelectedTemplate({
                            ...selectedTemplate,
                            prompt: e.target.value,
                          })
                        }
                        rows={12}
                        className="font-mono text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sage-900 mb-2">Variables</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.variables.map((variable) => (
                          <Badge key={variable} variant="outline">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sage-900 mb-2">Prompt Preview</h4>
                      <div className="bg-sage-50 p-4 rounded-organic-md">
                        <pre className="text-sm text-sage-700 whitespace-pre-wrap">{selectedTemplate.prompt}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template Testing</CardTitle>
              <CardDescription>Test your prompts with real variables to see how they render</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="test-template">Select Template</Label>
                    <Select
                      value={selectedTemplate.id}
                      onValueChange={(value) => {
                        const template = templates.find((t) => t.id === value)
                        if (template) setSelectedTemplate(template)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Available Variables</Label>
                    <div className="text-sm text-sage-600 mt-1">
                      This template uses: {selectedTemplate.variables.join(", ")}
                    </div>
                  </div>

                  <Button onClick={handleTestPrompt} className="w-full">
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Prompt
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Rendered Output</Label>
                    <div className="bg-sage-50 p-4 rounded-organic-md min-h-[300px] mt-2">
                      {testOutput ? (
                        <pre className="text-sm text-sage-700 whitespace-pre-wrap">{testOutput}</pre>
                      ) : (
                        <div className="text-sage-500 text-sm">Click "Test Prompt" to see the rendered output</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prompt Analytics</CardTitle>
              <CardDescription>Performance metrics and usage statistics (Coming Soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-sage-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard will be available in a future update</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
