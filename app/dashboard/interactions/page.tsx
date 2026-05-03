'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { AlertCircle, AlertTriangle, Search, Plus, X, Sparkles, Shield, Info, Database, Pill, Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LumiMascot, LumiLoader, LumiThinking } from '@/components/lumi-mascot'

interface Medicine {
  id: string
  name: string
  source?: 'local' | 'openfda' | 'pakistan'
}

interface Interaction {
  medicine1: string
  medicine2: string
  severity: 'Minor' | 'Moderate' | 'Severe'
  description: string
  recommendation: string
}

interface DrugSuggestion {
  name: string
  source: string
  genericName?: string
}

export default function InteractionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [newMedicine, setNewMedicine] = useState('')
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<DrugSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDoseCalculator, setShowDoseCalculator] = useState(false)
  const [doseForm, setDoseForm] = useState({
    drugName: '',
    adultDose: 500,
    age: 30,
    weight: 70,
    gender: 'male' as 'male' | 'female',
    creatinineClearance: undefined as number | undefined,
    childPughScore: undefined as 'A' | 'B' | 'C' | undefined,
    isPregnant: false,
    pregnancyTrimester: undefined as 1 | 2 | 3 | undefined
  })
  const [doseResult, setDoseResult] = useState<any>(null)
  const [isCalculatingDose, setIsCalculatingDose] = useState(false)

  // Search drugs as user types
  useEffect(() => {
    const searchDrugs = async () => {
      if (newMedicine.length < 2) {
        setSuggestions([])
        return
      }
      
      setIsSearching(true)
      try {
        const response = await fetch(`/api/drugs/lookup?q=${encodeURIComponent(newMedicine)}`)
        if (response.ok) {
          const data = await response.json()
          const suggestions: DrugSuggestion[] = []
          
          for (const result of data.results) {
            if (result.source === 'pakistan') {
              suggestions.push({
                name: result.data.genericName,
                source: 'Pakistan Formulary',
                genericName: result.data.genericName
              })
              result.data.localBrands?.forEach((brand: string) => {
                suggestions.push({
                  name: brand,
                  source: 'Pakistan Brand',
                  genericName: result.data.genericName
                })
              })
            } else if (result.source === 'openfda') {
              result.data.forEach((drug: any) => {
                suggestions.push({
                  name: drug.brand_name || drug.generic_name,
                  source: 'OpenFDA',
                  genericName: drug.generic_name
                })
              })
            }
          }
          
          setSuggestions(suggestions.slice(0, 8))
        }
      } catch (error) {
        console.error('[v0] Drug search error:', error)
      } finally {
        setIsSearching(false)
      }
    }
    
    const debounce = setTimeout(searchDrugs, 300)
    return () => clearTimeout(debounce)
  }, [newMedicine])

  const addMedicine = (name?: string) => {
    const medicineName = name || newMedicine.trim()
    if (medicineName && medicines.length < 10) {
      const isDuplicate = medicines.some(m => m.name.toLowerCase() === medicineName.toLowerCase())
      if (!isDuplicate) {
        setMedicines([...medicines, { id: Date.now().toString(), name: medicineName }])
      }
      setNewMedicine('')
      setSuggestions([])
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

    // Get AI analysis with OpenFDA data
    try {
      const response = await fetch('/api/check-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines: medicines.map(m => m.name) })
      })
      
      if (response.ok) {
        const data = await response.json()
        setAiAnalysis(data.analysis)
        
        // Parse AI response to extract structured interactions
        const parsedInteractions = parseAIInteractions(data.analysis, medicines)
        setInteractions(parsedInteractions)
      }
    } catch (error) {
      console.error('[v0] Interaction check error:', error)
    }

    setIsAnalyzing(false)
  }

  // Parse AI response to extract interactions
  const parseAIInteractions = (analysis: string, meds: Medicine[]): Interaction[] => {
    const foundInteractions: Interaction[] = []
    const loweredAnalysis = analysis.toLowerCase()
    
    // Check for severity keywords
    const hasSevere = loweredAnalysis.includes('severe') || loweredAnalysis.includes('dangerous') || loweredAnalysis.includes('contraindicated')
    const hasModerate = loweredAnalysis.includes('moderate') || loweredAnalysis.includes('caution') || loweredAnalysis.includes('monitor')
    
    // If analysis mentions interactions
    if (loweredAnalysis.includes('interaction') && meds.length >= 2) {
      // Create interaction entries based on keyword detection
      for (let i = 0; i < meds.length; i++) {
        for (let j = i + 1; j < meds.length; j++) {
          const med1Lower = meds[i].name.toLowerCase()
          const med2Lower = meds[j].name.toLowerCase()
          
          // Check if these specific medicines are mentioned together
          if (loweredAnalysis.includes(med1Lower) && loweredAnalysis.includes(med2Lower)) {
            let severity: 'Minor' | 'Moderate' | 'Severe' = 'Minor'
            if (hasSevere) severity = 'Severe'
            else if (hasModerate) severity = 'Moderate'
            
            foundInteractions.push({
              medicine1: meds[i].name,
              medicine2: meds[j].name,
              severity,
              description: 'Potential interaction detected by AI analysis',
              recommendation: 'See detailed AI analysis below'
            })
          }
        }
      }
    }
    
    return foundInteractions
  }

  const calculateDose = async () => {
    setIsCalculatingDose(true)
    try {
      const response = await fetch('/api/drugs/dose-adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drugName: doseForm.drugName,
          adultDose: doseForm.adultDose,
          patient: {
            age: doseForm.age,
            weight: doseForm.weight,
            gender: doseForm.gender,
            creatinineClearance: doseForm.creatinineClearance,
            childPughScore: doseForm.childPughScore,
            isPregnant: doseForm.isPregnant,
            pregnancyTrimester: doseForm.pregnancyTrimester
          },
          adjustmentType: 'comprehensive'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setDoseResult(data)
      }
    } catch (error) {
      console.error('[v0] Dose calculation error:', error)
    } finally {
      setIsCalculatingDose(false)
    }
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
          <div className="max-w-5xl animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <LumiMascot size="md" state={isAnalyzing ? 'thinking' : 'idle'} />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Drug Interactions</h1>
                <p className="text-muted-foreground">Powered by OpenFDA and Pakistan National Formulary</p>
              </div>
            </div>

            {/* Database Info Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center gap-4">
              <Database className="w-8 h-8 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">Real-time Drug Database</p>
                <p className="text-sm text-blue-700">Searches OpenFDA (US) and Pakistan National Formulary for accurate drug information</p>
              </div>
            </div>

            {/* Add Medicines */}
            <div className="glass-card-elevated rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                Enter Your Medicines
              </h2>
              
              <div className="relative mb-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search medicine name..."
                      value={newMedicine}
                      onChange={(e) => setNewMedicine(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addMedicine()}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <Button onClick={() => addMedicine()} disabled={!newMedicine.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => addMedicine(suggestion.name)}
                        className="w-full text-left px-4 py-3 hover:bg-muted/50 flex items-center justify-between border-b border-border/50 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-foreground">{suggestion.name}</p>
                          {suggestion.genericName && suggestion.genericName !== suggestion.name && (
                            <p className="text-sm text-muted-foreground">{suggestion.genericName}</p>
                          )}
                        </div>
                        <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          {suggestion.source}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Medicine Tags */}
              {medicines.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {medicines.map((med) => (
                    <div
                      key={med.id}
                      className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      <Pill className="w-3.5 h-3.5" />
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
                  <>Analyzing with AI...</>
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

            {/* Loading State */}
            {isAnalyzing && (
              <div className="py-8">
                <LumiLoader text="Analyzing drug interactions" />
              </div>
            )}

            {/* Interactions Results */}
            {interactions.length > 0 && !isAnalyzing && (
              <div className="space-y-4 mb-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Found {interactions.length} Potential Interaction{interactions.length > 1 ? 's' : ''}
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
            {aiAnalysis && !isAnalyzing && (
              <div className="glass-card-elevated rounded-2xl p-6 mb-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-violet-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">AI Analysis</h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">{aiAnalysis}</p>
                </div>
              </div>
            )}

            {/* No Interactions Found */}
            {medicines.length >= 2 && !isAnalyzing && interactions.length === 0 && aiAnalysis && (
              <div className="glass-card-elevated rounded-2xl p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Severe Interactions Detected</h3>
                <p className="text-muted-foreground">
                  Based on our analysis, these medicines appear safe to take together. However, always consult your healthcare provider.
                </p>
              </div>
            )}

            {/* Dose Calculator Section */}
            <div className="glass-card-elevated rounded-2xl p-6 mt-6">
              <button 
                onClick={() => setShowDoseCalculator(!showDoseCalculator)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Dose Adjustment Calculator</h2>
                </div>
                {showDoseCalculator ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {showDoseCalculator && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  <p className="text-sm text-muted-foreground">
                    Calculate adjusted doses for pediatric, geriatric, renal, hepatic, or pregnancy conditions
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Drug Name</label>
                      <input
                        type="text"
                        value={doseForm.drugName}
                        onChange={(e) => setDoseForm({ ...doseForm, drugName: e.target.value })}
                        placeholder="e.g., Paracetamol"
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Adult Dose (mg)</label>
                      <input
                        type="number"
                        value={doseForm.adultDose}
                        onChange={(e) => setDoseForm({ ...doseForm, adultDose: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Age (years)</label>
                      <input
                        type="number"
                        value={doseForm.age}
                        onChange={(e) => setDoseForm({ ...doseForm, age: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={doseForm.weight}
                        onChange={(e) => setDoseForm({ ...doseForm, weight: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Gender</label>
                      <select
                        value={doseForm.gender}
                        onChange={(e) => setDoseForm({ ...doseForm, gender: e.target.value as 'male' | 'female' })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">CrCl (mL/min)</label>
                      <input
                        type="number"
                        value={doseForm.creatinineClearance || ''}
                        onChange={(e) => setDoseForm({ ...doseForm, creatinineClearance: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="Optional"
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={doseForm.isPregnant}
                        onChange={(e) => setDoseForm({ ...doseForm, isPregnant: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm text-foreground">Pregnant</span>
                    </label>
                    {doseForm.isPregnant && (
                      <select
                        value={doseForm.pregnancyTrimester || ''}
                        onChange={(e) => setDoseForm({ ...doseForm, pregnancyTrimester: e.target.value ? Number(e.target.value) as 1 | 2 | 3 : undefined })}
                        className="px-3 py-1 border border-border rounded-lg text-sm"
                      >
                        <option value="">Trimester</option>
                        <option value="1">1st</option>
                        <option value="2">2nd</option>
                        <option value="3">3rd</option>
                      </select>
                    )}
                  </div>
                  
                  <Button 
                    onClick={calculateDose} 
                    disabled={isCalculatingDose || !doseForm.adultDose}
                    className="w-full"
                  >
                    {isCalculatingDose ? 'Calculating...' : 'Calculate Adjusted Dose'}
                  </Button>
                  
                  {doseResult && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-fade-in">
                      <h4 className="font-semibold text-blue-900 mb-2">Dose Adjustment Result</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Original Dose:</strong> {doseResult.originalDose}</p>
                        <p><strong>Adjusted Dose:</strong> <span className="text-lg font-bold text-blue-600">{doseResult.adjustment.adjustedDose}</span></p>
                        <p><strong>Adjustment:</strong> {doseResult.adjustment.adjustmentPercentage}% of original</p>
                        <p><strong>Reason:</strong> {doseResult.adjustment.reason}</p>
                        <p><strong>Formula:</strong> <code className="bg-blue-100 px-2 py-0.5 rounded">{doseResult.adjustment.formula}</code></p>
                        {doseResult.adjustment.warnings.length > 0 && (
                          <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded">
                            <p className="font-semibold text-amber-800">Warnings:</p>
                            <ul className="list-disc list-inside text-amber-700">
                              {doseResult.adjustment.warnings.map((w: string, i: number) => (
                                <li key={i}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
