'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Bell, Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Reminder {
  id: string
  medicine: string
  time: string
  days: string[]
  notificationType: 'Sound' | 'Silent' | 'Vibration'
  isActive: boolean
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      medicine: 'Metformin 500mg',
      time: '08:00 AM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      notificationType: 'Sound',
      isActive: true,
    },
    {
      id: '2',
      medicine: 'Aspirin 75mg',
      time: '08:00 PM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      notificationType: 'Vibration',
      isActive: true,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newReminder, setNewReminder] = useState({
    medicine: '',
    time: '08:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    notificationType: 'Sound' as const,
  })

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const handleAddReminder = () => {
    if (newReminder.medicine && newReminder.time) {
      setReminders([
        ...reminders,
        {
          id: Date.now().toString(),
          ...newReminder,
          isActive: true,
        },
      ])
      setNewReminder({ medicine: '', time: '08:00', days: days, notificationType: 'Sound' })
      setShowAddForm(false)
    }
  }

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id))
  }

  const toggleReminder = (id: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)))
  }

  const toggleDay = (day: string) => {
    setNewReminder((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }))
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Header />
        <main className="mt-16 p-8 bg-background min-h-screen">
          <div className="max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Medication Reminders</h1>
                <p className="text-muted-foreground">Set reminders to never miss your medications</p>
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Reminder
              </Button>
            </div>

            {showAddForm && (
              <div className="bg-white rounded-xl border border-border p-8 mb-8">
                <h2 className="text-xl font-bold text-foreground mb-6">Add New Reminder</h2>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Medicine</label>
                    <input
                      type="text"
                      placeholder="Select medicine"
                      value={newReminder.medicine}
                      onChange={(e) => setNewReminder({ ...newReminder, medicine: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Time</label>
                    <input
                      type="time"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-3">Repeat On Days</label>
                    <div className="flex gap-2 flex-wrap">
                      {days.map((day) => (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            newReminder.days.includes(day)
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-border text-foreground hover:bg-muted'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Notification Type</label>
                    <select
                      value={newReminder.notificationType}
                      onChange={(e) =>
                        setNewReminder({ ...newReminder, notificationType: e.target.value as 'Sound' | 'Silent' | 'Vibration' })
                      }
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground bg-background"
                    >
                      <option>Sound</option>
                      <option>Vibration</option>
                      <option>Silent</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleAddReminder} className="bg-primary hover:bg-primary/90">
                    Save Reminder
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="bg-white rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Bell className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{reminder.medicine}</h3>
                        <p className="text-sm text-muted-foreground">{reminder.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={`w-12 h-7 rounded-full transition-colors ${
                          reminder.isActive ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-white transition-transform ${
                            reminder.isActive ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Repeats on: {reminder.days.join(', ')}</p>
                    <p className="text-xs text-muted-foreground">Notification: {reminder.notificationType}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-destructive hover:text-destructive"
                      onClick={() => handleDeleteReminder(reminder.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {reminders.length === 0 && (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-semibold mb-2">No reminders set</p>
                <p className="text-muted-foreground mb-6">Create your first reminder to get started</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90">
                  Add Reminder
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
