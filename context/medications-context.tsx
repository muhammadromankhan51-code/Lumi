'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface Medicine {
  id: string
  name: string
  dosage: string
  purpose: string
  when: string
  safety: 'Safe' | 'Caution' | 'High Risk'
  frequency?: string
  startDate?: string
  endDate?: string
  prescribedBy?: string
  notes?: string
}

export interface ScheduleItem {
  id: string
  time: string
  medication: string
  medicineId: string
  status: 'Pending' | 'Taken' | 'Due' | 'Missed'
  icon: 'morning' | 'afternoon' | 'evening' | 'night'
}

interface MedicationsContextType {
  medicines: Medicine[]
  schedule: ScheduleItem[]
  hasMedicines: boolean
  isLoading: boolean
  adherencePercentage: number
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void
  addMedicines: (medicines: Omit<Medicine, 'id'>[]) => void
  removeMedicine: (id: string) => void
  updateMedicine: (id: string, updates: Partial<Medicine>) => void
  markScheduleItem: (id: string, status: 'Taken' | 'Missed') => void
  clearAllMedicines: () => void
  generateSchedule: () => void
}

const MedicationsContext = createContext<MedicationsContextType | undefined>(undefined)

export function MedicationsProvider({ children }: { children: React.ReactNode }) {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const storedMedicines = localStorage.getItem('lumi-medicines')
    const storedSchedule = localStorage.getItem('lumi-schedule')
    
    if (storedMedicines) {
      try {
        setMedicines(JSON.parse(storedMedicines))
      } catch (e) {
        console.error('[v0] Failed to parse stored medicines:', e)
      }
    }
    
    if (storedSchedule) {
      try {
        setSchedule(JSON.parse(storedSchedule))
      } catch (e) {
        console.error('[v0] Failed to parse stored schedule:', e)
      }
    }
    
    setIsLoading(false)
  }, [])

  // Save to localStorage when medicines change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('lumi-medicines', JSON.stringify(medicines))
    }
  }, [medicines, isLoading])

  // Save schedule to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('lumi-schedule', JSON.stringify(schedule))
    }
  }, [schedule, isLoading])

  const hasMedicines = medicines.length > 0

  // Calculate adherence percentage
  const adherencePercentage = schedule.length > 0
    ? Math.round((schedule.filter(s => s.status === 'Taken').length / schedule.length) * 100)
    : 0

  const addMedicine = useCallback((medicine: Omit<Medicine, 'id'>) => {
    const newMedicine: Medicine = {
      ...medicine,
      id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    setMedicines(prev => [...prev, newMedicine])
  }, [])

  const addMedicines = useCallback((newMedicines: Omit<Medicine, 'id'>[]) => {
    const medicinesWithIds: Medicine[] = newMedicines.map(med => ({
      ...med,
      id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }))
    setMedicines(prev => [...prev, ...medicinesWithIds])
  }, [])

  const removeMedicine = useCallback((id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id))
    setSchedule(prev => prev.filter(s => s.medicineId !== id))
  }, [])

  const updateMedicine = useCallback((id: string, updates: Partial<Medicine>) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }, [])

  const markScheduleItem = useCallback((id: string, status: 'Taken' | 'Missed') => {
    setSchedule(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }, [])

  const clearAllMedicines = useCallback(() => {
    setMedicines([])
    setSchedule([])
    localStorage.removeItem('lumi-medicines')
    localStorage.removeItem('lumi-schedule')
  }, [])

  const generateSchedule = useCallback(() => {
    const newSchedule: ScheduleItem[] = []
    const now = new Date()
    const currentHour = now.getHours()

    medicines.forEach(med => {
      const whenLower = med.when.toLowerCase()
      
      // Parse timing from "when" field
      const times: { time: string; icon: ScheduleItem['icon'] }[] = []
      
      if (whenLower.includes('morning') || whenLower.includes('breakfast') || whenLower.includes('8:00')) {
        times.push({ time: '8:00 AM', icon: 'morning' })
      }
      if (whenLower.includes('afternoon') || whenLower.includes('lunch') || whenLower.includes('1:00') || whenLower.includes('noon')) {
        times.push({ time: '1:00 PM', icon: 'afternoon' })
      }
      if (whenLower.includes('evening') || whenLower.includes('dinner') || whenLower.includes('6:00') || whenLower.includes('7:00')) {
        times.push({ time: '7:00 PM', icon: 'evening' })
      }
      if (whenLower.includes('night') || whenLower.includes('bedtime') || whenLower.includes('10:00') || whenLower.includes('9:00')) {
        times.push({ time: '10:00 PM', icon: 'night' })
      }
      if (whenLower.includes('3 times') || whenLower.includes('three times')) {
        times.push(
          { time: '8:00 AM', icon: 'morning' },
          { time: '2:00 PM', icon: 'afternoon' },
          { time: '8:00 PM', icon: 'evening' }
        )
      }
      if (whenLower.includes('twice') || whenLower.includes('2 times')) {
        times.push(
          { time: '8:00 AM', icon: 'morning' },
          { time: '8:00 PM', icon: 'evening' }
        )
      }
      
      // Default to morning if no time specified
      if (times.length === 0) {
        times.push({ time: '8:00 AM', icon: 'morning' })
      }

      times.forEach(({ time, icon }) => {
        const [hourStr] = time.split(':')
        const isPM = time.includes('PM')
        let hour = parseInt(hourStr)
        if (isPM && hour !== 12) hour += 12
        if (!isPM && hour === 12) hour = 0

        let status: ScheduleItem['status'] = 'Pending'
        if (hour < currentHour) {
          status = 'Missed' // Past time, not marked as taken
        } else if (hour === currentHour) {
          status = 'Due'
        }

        newSchedule.push({
          id: `sch-${med.id}-${time.replace(/[: ]/g, '')}`,
          time,
          medication: med.name,
          medicineId: med.id,
          status,
          icon
        })
      })
    })

    // Sort by time
    newSchedule.sort((a, b) => {
      const timeA = a.time.includes('PM') && !a.time.startsWith('12') 
        ? parseInt(a.time) + 12 
        : parseInt(a.time)
      const timeB = b.time.includes('PM') && !b.time.startsWith('12') 
        ? parseInt(b.time) + 12 
        : parseInt(b.time)
      return timeA - timeB
    })

    setSchedule(newSchedule)
  }, [medicines])

  // Regenerate schedule when medicines change
  useEffect(() => {
    if (medicines.length > 0) {
      generateSchedule()
    } else {
      setSchedule([])
    }
  }, [medicines, generateSchedule])

  return (
    <MedicationsContext.Provider value={{
      medicines,
      schedule,
      hasMedicines,
      isLoading,
      adherencePercentage,
      addMedicine,
      addMedicines,
      removeMedicine,
      updateMedicine,
      markScheduleItem,
      clearAllMedicines,
      generateSchedule
    }}>
      {children}
    </MedicationsContext.Provider>
  )
}

export function useMedications() {
  const context = useContext(MedicationsContext)
  if (!context) {
    throw new Error('useMedications must be used within a MedicationsProvider')
  }
  return context
}
