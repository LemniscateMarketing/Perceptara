"use client"
import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import Dashboard from "@/components/dashboard"
import ModalitySelection from "@/components/modality-selection"
import SessionInterfaceAI from "@/components/session-interface-ai"
import SessionNotes from "@/components/session-notes"
import SupervisorDebriefing from "@/components/supervisor-debriefing"
import ComprehensiveAnalysis from "@/components/comprehensive-analysis"
import DatabaseTest from "@/components/database-test"

type ViewState = "dashboard" | "modality-selection" | "session" | "notes" | "debriefing" | "analysis"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>("dashboard")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [selectedModality, setSelectedModality] = useState<string>("")
  const [sessionDuration, setSessionDuration] = useState(0)
  const [messageCount, setMessageCount] = useState(0)
  const [sessionNotes, setSessionNotes] = useState<any>(null)
  const [debriefingData, setDebriefingData] = useState<any>(null)

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient)
    setCurrentView("modality-selection")
  }

  const handleModalitySelect = (modality: string) => {
    setSelectedModality(modality)
    setCurrentView("session")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedPatient(null)
    setSelectedModality("")
    setSessionDuration(0)
    setMessageCount(0)
    setSessionNotes(null)
    setDebriefingData(null)
  }

  const handleBackToModality = () => {
    setCurrentView("modality-selection")
  }

  const handleBackToSession = () => {
    setCurrentView("session")
  }

  const handleBackToNotes = () => {
    setCurrentView("notes")
  }

  const handleBackToDebriefing = () => {
    setCurrentView("debriefing")
  }

  const handleEndSession = (duration = 0, msgCount = 0) => {
    setSessionDuration(duration)
    setMessageCount(msgCount)
    setCurrentView("notes")
  }

  const handleSaveNotes = (notes: any) => {
    setSessionNotes(notes)
    setCurrentView("debriefing")
  }

  const handleCompleteDebriefing = (data: any) => {
    setDebriefingData(data)
    setCurrentView("analysis")
  }

  const handleCompleteAnalysis = () => {
    console.log("Training session completed successfully")
    handleBackToDashboard()
  }

  const getCurrentPath = () => {
    switch (currentView) {
      case "session":
        return "/session"
      case "modality-selection":
        return "/modality"
      case "notes":
        return "/notes"
      case "debriefing":
        return "/supervision"
      case "analysis":
        return "/insights"
      default:
        return "/"
    }
  }

  switch (currentView) {
    case "dashboard":
      return (
        <AppLayout currentPath={getCurrentPath()}>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-8">
              <div className="space-y-8">
                {/* Database Test Section */}
                <div>
                  <h2 className="text-xl font-light text-sage-900 mb-4">Database Status</h2>
                  <DatabaseTest />
                </div>

                {/* Dashboard Section */}
                <div>
                  <h2 className="text-xl font-light text-sage-900 mb-4">Dashboard</h2>
                  <Dashboard onPatientSelect={handlePatientSelect} />
                </div>
              </div>
            </div>
          </div>
        </AppLayout>
      )

    case "modality-selection":
      return (
        <AppLayout currentPath={getCurrentPath()}>
          <ModalitySelection
            patient={selectedPatient}
            onBack={handleBackToDashboard}
            onStartSession={handleModalitySelect}
          />
        </AppLayout>
      )

    case "session":
      return (
        <AppLayout currentPath={getCurrentPath()}>
          <SessionInterfaceAI
            patient={selectedPatient}
            modality={selectedModality}
            onBack={handleBackToModality}
            onEndSession={handleEndSession}
          />
        </AppLayout>
      )

    case "notes":
      return (
        <AppLayout currentPath={getCurrentPath()}>
          <SessionNotes
            patient={selectedPatient}
            modality={selectedModality}
            sessionDuration={sessionDuration}
            onBack={handleBackToSession}
            onSave={handleSaveNotes}
          />
        </AppLayout>
      )

    case "debriefing":
      return (
        <AppLayout currentPath={getCurrentPath()}>
          <SupervisorDebriefing
            patient={selectedPatient}
            modality={selectedModality}
            sessionDuration={sessionDuration}
            sessionNotes={sessionNotes}
            onBack={handleBackToNotes}
            onCompleteDebriefing={handleCompleteDebriefing}
          />
        </AppLayout>
      )

    case "analysis":
      return (
        <AppLayout currentPath={getCurrentPath()}>
          <ComprehensiveAnalysis
            patient={selectedPatient}
            modality={selectedModality}
            sessionDuration={sessionDuration}
            sessionNotes={sessionNotes}
            debriefingData={debriefingData}
            onBack={handleBackToDebriefing}
            onComplete={handleCompleteAnalysis}
          />
        </AppLayout>
      )

    default:
      return (
        <AppLayout currentPath={getCurrentPath()}>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-8">
              <div className="space-y-8">
                {/* Database Test Section */}
                <div>
                  <h2 className="text-xl font-light text-sage-900 mb-4">Database Status</h2>
                  <DatabaseTest />
                </div>

                {/* Dashboard Section */}
                <div>
                  <h2 className="text-xl font-light text-sage-900 mb-4">Dashboard</h2>
                  <Dashboard onPatientSelect={handlePatientSelect} />
                </div>
              </div>
            </div>
          </div>
        </AppLayout>
      )
  }
}
