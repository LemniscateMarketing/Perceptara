"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Key, MessageSquare, Brain, UserCheck, TestTube, Cog } from "lucide-react"
import { useRouter } from "next/navigation"

const adminMenuItems = [
  {
    title: "System Settings",
    description: "Configure API keys, voice settings, and system preferences",
    icon: Settings,
    href: "/admin/settings",
    color: "bg-sage-100 text-sage-700",
  },
  {
    title: "Prompt Management",
    description: "Manage AI conversation templates and therapeutic prompts",
    icon: MessageSquare,
    href: "/admin/prompts",
    color: "bg-therapeutic-blue/20 text-therapeutic-blue",
  },
  {
    title: "Patient Architecture",
    description: "Configure modular patient components and psychological frameworks",
    icon: Brain,
    href: "/admin/patient-architecture",
    color: "bg-therapeutic-green/20 text-therapeutic-green",
  },
  {
    title: "Chat Architecture",
    description: "Configure chat modules and features for therapy sessions",
    icon: Cog,
    href: "/admin/chat-architecture",
    color: "bg-warm-100 text-warm-700",
  },
  {
    title: "Chat Interface",
    description: "Test and preview chat configurations in real-time",
    icon: TestTube,
    href: "/admin/chat-interface",
    color: "bg-therapeutic-lavender text-purple-800",
  },
  {
    title: "Patient Cases",
    description: "Manage individual patient case instances and training sessions",
    icon: UserCheck,
    href: "/admin/all-cases",
    color: "bg-sage-50 text-sage-700",
  },
]

export default function AdminPage() {
  const router = useRouter()

  return (
    <AdminLayout title="System Administration">
      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-light text-sage-900 mb-2">Admin Dashboard</h2>
          <p className="text-sage-600">
            Manage system settings, AI prompts, and patient configurations for the psychology training platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adminMenuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Card
                key={item.title}
                className="hover:shadow-md transition-shadow cursor-pointer border-sage-100 rounded-organic-lg"
                onClick={() => router.push(item.href)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-organic-md ${item.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg font-medium text-sage-900">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sage-600 text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                  <Button variant="ghost" className="mt-4 text-sage-700 hover:bg-sage-50 rounded-organic-md">
                    Configure →
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <Card className="border-sage-100 rounded-organic-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-sage-600" />
                <span className="text-sm text-sage-600">API Status</span>
              </div>
              <p className="text-lg font-medium text-sage-900 mt-1">Connected</p>
            </CardContent>
          </Card>

          <Card className="border-sage-100 rounded-organic-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-sage-600" />
                <span className="text-sm text-sage-600">Active Prompts</span>
              </div>
              <p className="text-lg font-medium text-sage-900 mt-1">12</p>
            </CardContent>
          </Card>

          <Card className="border-sage-100 rounded-organic-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-sage-600" />
                <span className="text-sm text-sage-600">Patient Modules</span>
              </div>
              <p className="text-lg font-medium text-sage-900 mt-1">4 Active</p>
            </CardContent>
          </Card>

          <Card className="border-sage-100 rounded-organic-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Cog className="h-4 w-4 text-sage-600" />
                <span className="text-sm text-sage-600">Chat Modules</span>
              </div>
              <p className="text-lg font-medium text-sage-900 mt-1">8 Available</p>
            </CardContent>
          </Card>

          <Card className="border-sage-100 rounded-organic-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TestTube className="h-4 w-4 text-sage-600" />
                <span className="text-sm text-sage-600">Chat Features</span>
              </div>
              <p className="text-lg font-medium text-sage-900 mt-1">18 Available</p>
            </CardContent>
          </Card>

          <Card className="border-sage-100 rounded-organic-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-sage-600" />
                <span className="text-sm text-sage-600">Patient Cases</span>
              </div>
              <p className="text-lg font-medium text-sage-900 mt-1">2 Active</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
