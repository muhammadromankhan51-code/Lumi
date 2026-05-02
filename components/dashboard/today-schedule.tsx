'use client'

import React from 'react'
import { Sun, Moon, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface ScheduleItem {
  time: string
  medication: string
  status: 'Taken' | 'Due' | 'Missed'
  icon: 'sun' | 'moon'
}

interface TodayScheduleProps {
  items?: ScheduleItem[]
}

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { time: '8:00 AM', medication: 'Metformin 500mg', status: 'Taken', icon: 'sun' },
  { time: '1:00 PM', medication: 'Amoxicillin 500mg', status: 'Due', icon: 'sun' },
  { time: '8:00 PM', medication: 'Aspirin 75mg', status: 'Due', icon: 'moon' },
]

export function TodaySchedule({ items = DEFAULT_SCHEDULE }: TodayScheduleProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-foreground">Today&apos;s Schedule</h3>
        <button className="text-primary text-xs font-semibold hover:underline">View all</button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="flex-shrink-0">
              {item.icon === 'sun' ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-slate-700" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{item.time}</p>
              <p className="text-sm font-medium text-foreground">{item.medication}</p>
            </div>
            <div className="flex-shrink-0">
              {item.status === 'Taken' && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">Taken</span>
                </div>
              )}
              {item.status === 'Due' && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-700">Due</span>
                </div>
              )}
              {item.status === 'Missed' && (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-100 rounded-full">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-semibold text-red-700">Missed</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
