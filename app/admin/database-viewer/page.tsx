"use client"

import { AdminLayout } from "@/components/admin-layout"
import { PatientDataViewer } from "@/components/patient-data-viewer"

export default function DatabaseViewerPage() {
  return (
    <AdminLayout title="Database Viewer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-light text-sage-900">Database Viewer</h1>
          <p className="text-sage-600 mt-1">View all patient data stored in the database with complete field details</p>
        </div>

        <PatientDataViewer />
      </div>
    </AdminLayout>
  )
}
