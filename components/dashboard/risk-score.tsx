'use client'

import React from 'react'
import { AlertCircle, AlertTriangle, Shield, Sparkles } from 'lucide-react'
import { useMedications } from '@/context/medications-context'

interface RiskScoreProps {
  score?: number
  summary?: string
  drugInteractions?: number
  doseAdjustments?: number
  warnings?: number
}

export function RiskScoreSection({
  score,
  summary,
  drugInteractions,
  doseAdjustments,
  warnings,
}: RiskScoreProps) {
  const { hasMedicines, medicines, isLoading } = useMedications()

  // If no medicines uploaded and no explicit props passed, don't render
  if (!hasMedicines && score === undefined) {
    return null
  }

  if (isLoading) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="glass-card-elevated rounded-2xl p-6">
          <div className="h-24 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  // Calculate dynamic values based on medicines if not provided
  const calculatedScore = score ?? (medicines.length > 0 ? 
    Math.min(10, medicines.filter(m => m.safety === 'High Risk').length * 3 + 
              medicines.filter(m => m.safety === 'Caution').length * 1.5 + 2) : 0)
  
  const calculatedInteractions = drugInteractions ?? medicines.filter(m => m.safety === 'High Risk').length
  const calculatedAdjustments = doseAdjustments ?? medicines.filter(m => m.safety === 'Caution').length
  const calculatedWarnings = warnings ?? Math.max(1, Math.floor(medicines.length / 2))
  
  const calculatedSummary = summary ?? (medicines.length > 0 ? 
    `Your prescription contains ${medicines.length} medication${medicines.length > 1 ? 's' : ''}. ${
      calculatedInteractions > 0 ? 'Some medicines may interact with each other. ' : ''
    }Please follow the instructions carefully and consult your doctor if you feel unwell.` : 
    'No medications to analyze.')

  const getRiskLevel = (s: number) => {
    if (s < 3) return { level: 'Low Risk', color: 'text-emerald-600', bg: 'from-emerald-500 to-teal-500' }
    if (s < 6) return { level: 'Moderate', color: 'text-amber-600', bg: 'from-amber-500 to-orange-500' }
    return { level: 'High Risk', color: 'text-red-500', bg: 'from-red-500 to-rose-500' }
  }

  const riskInfo = getRiskLevel(calculatedScore)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (calculatedScore / 10) * circumference

  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Prescription Analysis
      </h2>
      
      <div className="glass-card-elevated rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Risk Score Circle - Compact */}
          <div className="flex items-center gap-6 lg:border-r lg:border-border/50 lg:pr-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8"
                  className="text-muted/30"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#riskGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{calculatedScore.toFixed(1)}</span>
                <span className="text-[10px] text-muted-foreground font-medium">/10</span>
              </div>
            </div>
            <div>
              <p className={`text-sm font-semibold ${riskInfo.color}`}>{riskInfo.level}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Risk Score</p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">AI Summary</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{calculatedSummary}</p>
          </div>
        </div>

        {/* Alert Cards - Compact Row */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50/80 border border-red-100">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-red-600">{calculatedInteractions}</p>
              <p className="text-[11px] text-red-600/70 font-medium">Interactions</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/80 border border-amber-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-amber-600">{calculatedAdjustments}</p>
              <p className="text-[11px] text-amber-600/70 font-medium">Adjustments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/80 border border-blue-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-blue-600">{calculatedWarnings}</p>
              <p className="text-[11px] text-blue-600/70 font-medium">Warnings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
