"use client"

import { AdminLayout } from "@/components/admin-layout"
import { PromptManagement } from "@/components/prompt-management"

export default function PromptsPage() {
  return (
    <AdminLayout title="Prompt Management">
      <PromptManagement />
    </AdminLayout>
  )
}
