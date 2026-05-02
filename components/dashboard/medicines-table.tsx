'use client'

import React from 'react'
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'

interface Medicine {
  id: string
  name: string
  dosage: string
  purpose: string
  when: string
  safety: 'Safe' | 'Caution' | 'High Risk'
}

interface MedicinesTableProps {
  medicines?: Medicine[]
}

const DEFAULT_MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Metformin 500mg',
    dosage: '500mg',
    purpose: 'Helps control blood sugar',
    when: 'After breakfast',
    safety: 'Safe',
  },
  {
    id: '2',
    name: 'Amoxicillin 500mg',
    dosage: '500mg',
    purpose: 'Fights bacterial infection',
    when: 'After food, 3 times a day',
    safety: 'Caution',
  },
  {
    id: '3',
    name: 'Ibuprofen 400mg',
    dosage: '400mg',
    purpose: 'Relieves pain and fever',
    when: 'After food if needed',
    safety: 'High Risk',
  },
  {
    id: '4',
    name: 'Aspirin 75mg',
    dosage: '75mg',
    purpose: 'Helps prevent blood clots',
    when: 'After dinner',
    safety: 'Caution',
  },
]

const getSafetyBadge = (safety: string) => {
  switch (safety) {
    case 'Safe':
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-xs font-semibold text-green-700">Safe</span>
        </div>
      )
    case 'Caution':
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-semibold text-orange-700">Caution</span>
        </div>
      )
    case 'High Risk':
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-xs font-semibold text-red-700">High Risk</span>
        </div>
      )
    default:
      return null
  }
}

export function MedicinesTable({ medicines = DEFAULT_MEDICINES }: MedicinesTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-8 mb-8">
      <h3 className="text-lg font-bold text-foreground mb-6">Your Medicines</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 font-semibold text-muted-foreground text-sm">Medicine</th>
              <th className="text-left py-4 px-4 font-semibold text-muted-foreground text-sm">Purpose (In Simple Words)</th>
              <th className="text-left py-4 px-4 font-semibold text-muted-foreground text-sm">When to Take</th>
              <th className="text-left py-4 px-4 font-semibold text-muted-foreground text-sm">Safety</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine, index) => (
              <tr key={medicine.id} className={index !== medicines.length - 1 ? 'border-b border-border/50' : ''}>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"/>
                    <span className="font-medium text-foreground text-sm">{medicine.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-foreground">{medicine.purpose}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-foreground">{medicine.when}</p>
                </td>
                <td className="py-4 px-4">
                  {getSafetyBadge(medicine.safety)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-start gap-3 text-xs text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg p-4">
        <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"/>
        <span>Take medicines exactly as prescribed. Do not stop or change the dose without doctor advice.</span>
      </div>
    </div>
  )
}

