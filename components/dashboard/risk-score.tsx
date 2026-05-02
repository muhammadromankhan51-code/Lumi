'use client'

import React from 'react'
import { AlertCircle, AlertTriangle, Shield, Zap } from 'lucide-react'

interface RiskScoreProps {
  score?: number
  summary?: string
  drugInteractions?: number
  doseAdjustments?: number
  warnings?: number
}

export function RiskScoreSection({
  score = 7.5,
  summary = 'Your prescription has some important points to note. Some medicines may interact with each other. Please follow the instructions carefully and consult your doctor if you feel unwell.',
  drugInteractions = 2,
  doseAdjustments = 1,
  warnings = 1,
}: RiskScoreProps) {
  const getRiskLevel = (score: number) => {
    if (score < 3) return { level: 'Low Risk', color: 'text-green-600' }
    if (score < 6) return { level: 'Moderate Risk', color: 'text-orange-600' }
    return { level: 'High Risk', color: 'text-red-600' }
  }

  const riskInfo = getRiskLevel(score)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* Risk Score Circle */}
      <div className="bg-white rounded-2xl border border-border p-8 flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-foreground mb-8">Prescription Risk Score</h3>

        <div className="relative w-36 h-36 flex items-center justify-center mb-4">
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="10"/>
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeDasharray={`${(score / 10) * 314.159} 314.159`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24"/>
                <stop offset="100%" stopColor="#FF6B35"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <p className="text-4xl font-bold text-foreground">{score}</p>
            <p className="text-xs text-muted-foreground">/10</p>
          </div>
        </div>

        <p className={`text-sm font-semibold ${riskInfo.color}`}>{riskInfo.level}</p>
      </div>

      {/* AI Summary and Alerts - Col Span 3 */}
      <div className="lg:col-span-3 space-y-6">
        {/* AI Summary */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-start gap-3 mb-3">
            <Zap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"/>
            <h3 className="text-base font-bold text-foreground">AI Summary (In Simple Words)</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Drug Interactions */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-semibold text-red-600">Drug Interactions</p>
            </div>
            <p className="text-2xl font-bold text-red-600 mb-1">{drugInteractions}</p>
            <p className="text-xs text-muted-foreground mb-3">interactions found</p>
            <button className="text-xs font-semibold text-red-600 hover:underline">View details</button>
          </div>

          {/* Dose Adjustment */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <p className="text-sm font-semibold text-orange-600">Dose Adjustment</p>
            </div>
            <p className="text-2xl font-bold text-orange-600 mb-1">{doseAdjustments}</p>
            <p className="text-xs text-muted-foreground mb-3">medicine may need adjustment</p>
            <button className="text-xs font-semibold text-orange-600 hover:underline">View details</button>
          </div>

          {/* Warnings */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-amber-600" />
              <p className="text-sm font-semibold text-amber-600">Warnings</p>
            </div>
            <p className="text-2xl font-bold text-amber-600 mb-1">{warnings}</p>
            <p className="text-xs text-muted-foreground mb-3">important warning</p>
            <button className="text-xs font-semibold text-amber-600 hover:underline">View details</button>
          </div>
        </div>
      </div>
    </div>
  )
}
