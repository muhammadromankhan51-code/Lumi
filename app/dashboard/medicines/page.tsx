'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Pill, Plus, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  notes?: string
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Metformin 500mg',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2024-01-15',
      notes: 'For blood sugar control',
    },
    {
      id: '2',
      name: 'Amoxicillin 500mg',
      dosage: '500mg',
      frequency: 'Three times daily',
      startDate: '2024-04-20',
      endDate: '2024-05-04',
      notes: 'Antibiotic for infection',
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    notes: '',
  })

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.dosage) {
      setMedicines([
        ...medicines,
        {
          id: Date.now().toString(),
          ...newMedicine,
        },
      ])
      setNewMedicine({ name: '', dosage: '', frequency: '', startDate: '', notes: '' })
      setShowAddForm(false)
    }
  }

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id))
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
                <h1 className="text-3xl font-bold text-foreground mb-2">My Medicines</h1>
                <p className="text-muted-foreground">Manage your current medications and track interactions</p>
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
            </div>

            {showAddForm && (
              <div className="bg-white rounded-xl border border-border p-8 mb-8">
                <h2 className="text-xl font-bold text-foreground mb-6">Add New Medicine</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Medicine Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Aspirin"
                      value={newMedicine.name}
                      onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g., 500mg"
                      value={newMedicine.dosage}
                      onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Frequency</label>
                    <input
                      type="text"
                      placeholder="e.g., Twice daily"
                      value={newMedicine.frequency}
                      onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newMedicine.startDate}
                      onChange={(e) => setNewMedicine({ ...newMedicine, startDate: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
                    <textarea
                      placeholder="Add any notes about this medicine"
                      value={newMedicine.notes}
                      onChange={(e) => setNewMedicine({ ...newMedicine, notes: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleAddMedicine} className="bg-primary hover:bg-primary/90">
                    Save Medicine
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {medicines.map((medicine) => (
                <div key={medicine.id} className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Pill className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{medicine.name}</h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Dosage</p>
                            <p className="text-sm font-medium text-foreground">{medicine.dosage}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Frequency</p>
                            <p className="text-sm font-medium text-foreground">{medicine.frequency}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Start Date</p>
                            <p className="text-sm font-medium text-foreground">{new Date(medicine.startDate).toLocaleDateString()}</p>
                          </div>
                          {medicine.endDate && (
                            <div>
                              <p className="text-xs text-muted-foreground">End Date</p>
                              <p className="text-sm font-medium text-foreground">{new Date(medicine.endDate).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                        {medicine.notes && (
                          <p className="text-sm text-muted-foreground mt-3">{medicine.notes}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMedicine(medicine.id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {medicines.length === 0 && (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-semibold mb-2">No medicines added yet</p>
                <p className="text-muted-foreground mb-6">Add your first medicine to get started</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90">
                  Add Medicine
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
