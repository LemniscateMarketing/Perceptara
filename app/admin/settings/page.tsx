"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Key, Volume2, MessageSquare, Settings } from "lucide-react"
import ApiSettingsTabbed from "@/components/api-settings-tabbed"
import VoiceSettings from "@/components/voice-settings"

export default function SettingsPage() {
  return (
    <AdminLayout title="System Settings">
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="api" className="h-full flex flex-col">
          <div className="px-4 lg:px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-sage-100">
            <TabsList className="grid w-full max-w-md grid-cols-4 bg-sage-50 rounded-organic-lg">
              <TabsTrigger value="api" className="rounded-organic-md text-xs lg:text-sm">
                <Key className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">API</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="rounded-organic-md text-xs lg:text-sm">
                <Volume2 className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Voice</span>
              </TabsTrigger>
              <TabsTrigger value="prompts" className="rounded-organic-md text-xs lg:text-sm">
                <MessageSquare className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Prompts</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="rounded-organic-md text-xs lg:text-sm">
                <Settings className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">System</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="api" className="h-full m-0">
              <ApiSettingsTabbed />
            </TabsContent>

            <TabsContent value="voice" className="h-full m-0 overflow-y-auto">
              <div className="p-4 lg:p-8">
                <VoiceSettings />
              </div>
            </TabsContent>

            <TabsContent value="prompts" className="h-full m-0 overflow-y-auto">
              <div className="p-4 lg:p-8">
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-sage-900 mb-2">Prompt Management</h3>
                  <p className="text-sage-600 text-sm max-w-md mx-auto mb-6">
                    Configure AI prompts for patients, supervisors, and therapeutic scenarios.
                  </p>
                  <p className="text-sage-500 text-xs">
                    This feature will be integrated from the existing prompt management system.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="system" className="h-full m-0 overflow-y-auto">
              <div className="p-4 lg:p-8">
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-sage-900 mb-2">System Configuration</h3>
                  <p className="text-sage-600 text-sm max-w-md mx-auto">
                    General system settings, user management, and application preferences.
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
