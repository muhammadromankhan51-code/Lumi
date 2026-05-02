'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { AlertCircle, AlertTriangle, Search } from 'lucide-react'

interface Interaction {
  id: string
  medicine1: string
  medicine2: string
  severity: 'Minor' | 'Moderate' | 'Severe'
  description: string
}

export default function InteractionsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const interactions: Interaction[] = [
    {
      id: '1',
      medicine1: 'Metformin',
      medicine2: 'Amoxicillin',
      severity: 'Moderate',
      description: 'May affect blood sugar levels. Monitor glucose closely during antibiotic use.',
    },
    {
      id: '2',
      medicine1: 'Aspirin',
      medicine2: 'Ibuprofen',
      severity: 'Severe',
      description: 'Both are NSAIDs - combining increases risk of GI bleeding and ulcers. Do not use together.',
    },
    {
      id: '3',
      medicine1: 'Metformin',
      medicine2: 'Alcohol',
      severity: 'Moderate',
      description: 'Alcohol may increase the risk of lactic acidosis. Limit alcohol consumption.',
    },
  ]

  const filteredInteractions = interactions.filter(
    (interaction) =>
      interaction.medicine1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaction.medicine2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaction.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Minor':
        return 'bg-warning/10 text-warning'
      case 'Moderate':
        return 'bg-orange-100 text-orange-700'
      case 'Severe':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted text-foreground'
    }
  }

  const getSeverityIcon = (severity: string) => {
    if (severity === 'Severe') {
      return <AlertTriangle className="w-5 h-5" />
    }
    return <AlertCircle className="w-5 h-5" />
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Header />
        <main className="mt-16 p-8 bg-background min-h-screen">
          <div className="max-w-6xl">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Drug Interactions</h1>
              <p className="text-muted-foreground mb-8">Check potential interactions between your medicines</p>
            </div>

            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search medicines or interactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-lg text-foreground placeholder-muted-foreground bg-white"
                />
              </div>
            </div>

            {filteredInteractions.length > 0 ? (
              <div className="space-y-4">
                {filteredInteractions.map((interaction) => (
                  <div key={interaction.id} className="bg-white rounded-xl border border-border p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg flex-shrink-0 ${getSeverityColor(interaction.severity)}`}>
                        {getSeverityIcon(interaction.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-foreground">
                            {interaction.medicine1} + {interaction.medicine2}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(interaction.severity)}`}>
                            {interaction.severity}
                          </span>
                        </div>
                        <p className="text-foreground">{interaction.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-semibold mb-2">No interactions found</p>
                <p className="text-muted-foreground">Good news! No dangerous interactions detected for your search.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
