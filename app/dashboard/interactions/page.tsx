'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { AlertCircle, AlertTriangle, Search, Plus, X, Sparkles, Loader2, Shield, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Medicine {
  id: string
  name: string
}

interface Interaction {
  medicine1: string
  medicine2: string
  severity: 'Minor' | 'Moderate' | 'Severe'
  description: string
  recommendation: string
}

// Common drug interactions database
const drugInteractionsDB: Record<string, Record<string, { severity: 'Minor' | 'Moderate' | 'Severe'; description: string; recommendation: string }>> = {
  'aspirin': {
    'ibuprofen': { severity: 'Severe', description: 'Both are NSAIDs - combining increases risk of GI bleeding and ulcers significantly.', recommendation: 'Do not use together. Choose one NSAID or consult your doctor.' },
    'warfarin': { severity: 'Severe', description: 'Aspirin increases anticoagulant effect and bleeding risk.', recommendation: 'Avoid combination. If necessary, monitor INR closely.' },
    'metformin': { severity: 'Minor', description: 'May slightly enhance blood sugar lowering effect.', recommendation: 'Monitor blood sugar levels.' },
  },
  'ibuprofen': {
    'aspirin': { severity: 'Severe', description: 'Both are NSAIDs - combining increases risk of GI bleeding and ulcers significantly.', recommendation: 'Do not use together. Choose one NSAID or consult your doctor.' },
    'lisinopril': { severity: 'Moderate', description: 'NSAIDs can reduce the blood pressure lowering effect of ACE inhibitors.', recommendation: 'Monitor blood pressure. Consider alternative pain relief.' },
  },
  'metformin': {
    'alcohol': { severity: 'Moderate', description: 'Alcohol may increase the risk of lactic acidosis with metformin.', recommendation: 'Limit alcohol consumption while taking metformin.' },
    'aspirin': { severity: 'Minor', description: 'May slightly enhance blood sugar lowering effect.', recommendation: 'Monitor blood sugar levels.' },
  },
  'warfarin': {
    'aspirin': { severity: 'Severe', description: 'Aspirin increases anticoagulant effect and bleeding risk.', recommendation: 'Avoid combination. If necessary, monitor INR closely.' },
    'vitamin k': { severity: 'Moderate', description: 'Vitamin K can reduce warfarin effectiveness.', recommendation: 'Maintain consistent vitamin K intake.' },
  },
  'lisinopril': {
    'ibuprofen': { severity: 'Moderate', description: 'NSAIDs can reduce the blood pressure lowering effect of ACE inhibitors.', recommendation: 'Monitor blood pressure. Consider alternative pain relief.' },
    'potassium': { severity: 'Moderate', description: 'ACE inhibitors can increase potassium levels.', recommendation: 'Monitor potassium levels regularly.' },
  },
}

export default function InteractionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [newMedicine, setNewMedicine] = useState('')
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)

  const addMedicine = () => {
    if (newMedicine.trim() && medicines.length < 10) {
      setMedicines([...medicines, { id: Date.now().toString(), name: newMedicine.trim() }])
      setNewMedicine('')
    }
  }

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id))
  }

  const checkInteractions = async () => {
    if (medicines.length < 2) return
    
    setIsAnalyzing(true)
    setInteractions([])
    setAiAnalysis(null)

    // Check local database
    const foundInteractions: Interaction[] = []
    
    for (let i = 0; i < medicines.length; i++) {
      for (let j = i + 1; j < medicines.length; j++) {
        const med1 = medicines[i].name.toLowerCase()
        const med2 = medicines[j].name.toLowerCase()
        
        if (drugInteractionsDB[med1]?.[med2]) {
          const interaction = drugInteractionsDB[med1][med2]
          foundInteractions.push({
            medicine1: medicines[i].name,
            medicine2: medicines[j].name,
            ...interaction
          })
        } else if (drugInteractionsDB[med2]?.[med1]) {
          const interaction = drugInteractionsDB[med2][med1]
          foundInteractions.push({
            medicine1: medicines[i].name,
            medicine2: medicines[j].name,
            ...interaction
          })
        }
      }
    }

    setInteractions(foundInteractions)

    // Also get AI analysis
    try {
      const response = await fetch('/api/check-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines: medicines.map(m => m.name) })
      })
      
      if (response.ok) {
        const data = await response.json()
        setAiAnalysis(data.analysis)
      }
    } catch (error) {
      console.error('[v0] AI analysis error:', error)
    }

    setIsAnalyzing(false)
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'Minor':
        return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: Info }
      case 'Moderate':
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: AlertCircle }
      case 'Severe':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: AlertTriangle }
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: Info }
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Header />
        <main className="mt-16 p-8 bg-background min-h-screen">
          <div className="max-w-4xl animate-fade-in">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Drug Interactions</h1>
              <p className="text-muted-foreground">Check potential interactions between your medicines</p>
            </div>

            {/* Add Medicines */}
            <div className="glass-card-elevated rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Enter Your Medicines</h2>
              
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter medicine name..."
                    value={newMedicine}
                    onChange={(e) => setNewMedicine(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addMedicine()}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                  />
                </div>
                <Button onClick={addMedicine} disabled={!newMedicine.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              {/* Medicine Tags */}
              {medicines.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {medicines.map((med) => (
                    <div
                      key={med.id}
                      className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {med.name}
                      <button onClick={() => removeMedicine(med.id)} className="hover:bg-primary/20 rounded-full p-0.5">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button 
                onClick={checkInteractions} 
                disabled={medicines.length < 2 || isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Check Interactions
                  </>
                )}
              </Button>
              
              {medicines.length < 2 && medicines.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Add at least 2 medicines to check interactions
                </p>
              )}
            </div>

            {/* Interactions Results */}
            {interactions.length > 0 && (
              <div className="space-y-4 mb-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Found {interactions.length} Interaction{interactions.length > 1 ? 's' : ''}
                </h3>
                
                {interactions.map((interaction, index) => {
                  const styles = getSeverityStyles(interaction.severity)
                  const Icon = styles.icon
                  
                  return (
                    <div 
                      key={index} 
                      className={`${styles.bg} ${styles.border} border rounded-xl p-5`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${styles.bg}`}>
                          <Icon className={`w-5 h-5 ${styles.text}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">
                              {interaction.medicine1} + {interaction.medicine2}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.text} border ${styles.border}`}>
                              {interaction.severity}
                            </span>
                          </div>
                          <p className="text-foreground mb-2">{interaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Recommendation:</strong> {interaction.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* AI Analysis */}
            {aiAnalysis && (
              <div className="glass-card-elevated rounded-2xl p-6 mb-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-violet-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">AI Analysis</h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">{aiAnalysis}</p>
                </div>
              </div>
            )}

            {/* No Interactions Found */}
            {medicines.length >= 2 && !isAnalyzing && interactions.length === 0 && (
              <div className="glass-card-elevated rounded-2xl p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Known Interactions</h3>
                <p className="text-muted-foreground">
                  No dangerous interactions found between your medicines. However, always consult your healthcare provider.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
