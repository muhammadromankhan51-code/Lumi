import React from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { ScanPrescriptionSection } from '@/components/dashboard/scan-prescription'
import { RiskScoreSection } from '@/components/dashboard/risk-score'
import { MedicinesTable } from '@/components/dashboard/medicines-table'
import { ActionButtons } from '@/components/dashboard/action-buttons'
import { TodaySchedule } from '@/components/dashboard/today-schedule'
import { AdherenceProgress } from '@/components/dashboard/adherence-progress'
import { NearbyPharmacies } from '@/components/dashboard/nearby-pharmacies'

export default function DashboardPage() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-56">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="mt-16 p-8 bg-background min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Scan Prescription Section */}
              <ScanPrescriptionSection />

              {/* Risk Score Section */}
              <RiskScoreSection />

              {/* Medicines Table */}
              <MedicinesTable />

              {/* Action Buttons */}
              <ActionButtons />
            </div>

            {/* Right Column - Sidebar Widgets */}
            <div className="space-y-6">
              {/* Today's Schedule */}
              <TodaySchedule />

              {/* Adherence Progress */}
              <AdherenceProgress />

              {/* Nearby Pharmacies */}
              <NearbyPharmacies />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
