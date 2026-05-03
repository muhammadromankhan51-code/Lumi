'use client'

import React from 'react'
import { TrendingUp } from 'lucide-react'
import { useMedications } from '@/context/medications-context'

export function AdherenceProgress() {
  const { adherencePercentage, hasMedicines, isLoading } = useMedications()

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 flex flex-col items-center">
        <div className="animate-pulse w-full">
          <div className="h-5 bg-gray-200 rounded w-40 mx-auto mb-8"></div>
          <div className="w-40 h-40 bg-gray-100 rounded-full mx-auto mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!hasMedicines) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 flex flex-col items-center">
        <h3 className="text-base font-bold text-foreground mb-8">Adherence Progress</h3>
        
        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="8"/>
          </svg>
          <div className="absolute text-center">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">No data</p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">Upload a prescription to track your adherence</p>
      </div>
    )
  }

  const getMessage = () => {
    if (adherencePercentage >= 90) return { text: 'Excellent!', subtext: 'Keep it up!' }
    if (adherencePercentage >= 70) return { text: 'Good job!', subtext: 'Stay consistent' }
    if (adherencePercentage >= 50) return { text: 'Keep going!', subtext: 'You can do better' }
    return { text: 'Needs attention', subtext: 'Try to stay on track' }
  }

  const message = getMessage()

  return (
    <div className="bg-white rounded-2xl border border-border p-8 flex flex-col items-center">
      <h3 className="text-base font-bold text-foreground mb-8">Adherence Progress</h3>

      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="8"/>
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="url(#adherenceGradient)"
            strokeWidth="8"
            strokeDasharray={`${(adherencePercentage / 100) * 314.159} 314.159`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="adherenceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981"/>
              <stop offset="100%" stopColor="#059669"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <p className="text-4xl font-bold text-foreground">{adherencePercentage}%</p>
        </div>
      </div>

      <p className="text-center text-foreground font-semibold mb-1">{message.text}</p>
      <p className="text-center text-sm text-muted-foreground">{message.subtext}</p>
    </div>
  )
}
