'use client'

import React from 'react'

interface AdherenceProgressProps {
  percentage?: number
}

export function AdherenceProgress({ percentage = 85 }: AdherenceProgressProps) {
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
            strokeDasharray={`${(percentage / 100) * 314.159} 314.159`}
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
          <p className="text-4xl font-bold text-foreground">{percentage}%</p>
        </div>
      </div>

      <p className="text-center text-foreground font-semibold mb-1">Great job!</p>
      <p className="text-center text-sm text-muted-foreground">Keep it up 🎉</p>
    </div>
  )
}
