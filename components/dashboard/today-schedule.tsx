'use client'

import React from 'react'
import { Sun, Moon, Sunrise, Sunset, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react'
import { useMedications } from '@/context/medications-context'

const getTimeIcon = (icon: string) => {
  switch (icon) {
    case 'morning':
      return <Sunrise className="w-6 h-6 text-amber-500" />
    case 'afternoon':
      return <Sun className="w-6 h-6 text-yellow-500" />
    case 'evening':
      return <Sunset className="w-6 h-6 text-orange-500" />
    case 'night':
      return <Moon className="w-6 h-6 text-slate-700" />
    default:
      return <Sun className="w-6 h-6 text-yellow-500" />
  }
}

export function TodaySchedule() {
  const { schedule, hasMedicines, isLoading, markScheduleItem } = useMedications()

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!hasMedicines) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-foreground">Today&apos;s Schedule</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">No schedule yet</p>
          <p className="text-xs text-muted-foreground">Upload a prescription to see your medication schedule</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-foreground">Today&apos;s Schedule</h3>
        <button className="text-primary text-xs font-semibold hover:underline">View all</button>
      </div>

      <div className="space-y-4">
        {schedule.map((item) => (
          <div key={item.id} className="flex items-center gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="flex-shrink-0">
              {getTimeIcon(item.icon)}
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
              {(item.status === 'Due' || item.status === 'Pending') && (
                <button
                  onClick={() => markScheduleItem(item.id, 'Taken')}
                  className="flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-green-100 rounded-full transition-colors group"
                >
                  <Clock className="w-4 h-4 text-orange-600 group-hover:hidden" />
                  <CheckCircle className="w-4 h-4 text-green-600 hidden group-hover:block" />
                  <span className="text-xs font-semibold text-orange-700 group-hover:text-green-700">
                    {item.status === 'Due' ? 'Due' : 'Pending'}
                  </span>
                </button>
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
