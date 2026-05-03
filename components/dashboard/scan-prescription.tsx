'use client'

import React, { useState, useRef } from 'react'
import { Camera, Upload, Mic, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useMedications, Medicine } from '@/context/medications-context'

interface AnalysisResult {
  success: boolean
  rawText: string
  analysis: string
}

export function ScanPrescriptionSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addMedicines, hasMedicines } = useMedications()

  const parseMedicinesFromAnalysis = (analysis: string): Omit<Medicine, 'id'>[] => {
    const medicines: Omit<Medicine, 'id'>[] = []
    
    // Try to extract medication information from the AI analysis
    const lines = analysis.split('\n')
    let currentMedicine: Partial<Omit<Medicine, 'id'>> = {}
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase()
      
      // Look for medication names (usually bold or at start of sections)
      if (lowerLine.includes('medication') || lowerLine.includes('medicine') || lowerLine.includes('drug')) {
        // Try to extract from patterns like "1. Metformin 500mg" or "- Amoxicillin"
        const nameMatch = line.match(/(?:\d+\.\s*|\-\s*|\*\s*)([A-Za-z]+(?:\s+\d+\s*mg)?)/i)
        if (nameMatch) {
          if (currentMedicine.name) {
            medicines.push({
              name: currentMedicine.name,
              dosage: currentMedicine.dosage || 'As prescribed',
              purpose: currentMedicine.purpose || 'See prescription',
              when: currentMedicine.when || 'As directed',
              safety: currentMedicine.safety || 'Caution'
            })
          }
          currentMedicine = { name: nameMatch[1] }
        }
      }
      
      // Extract dosage
      const dosageMatch = line.match(/(\d+\s*(?:mg|ml|mcg|g|tablet|capsule)s?)/i)
      if (dosageMatch && currentMedicine.name) {
        currentMedicine.dosage = dosageMatch[1]
      }
      
      // Extract frequency/timing
      if (lowerLine.includes('daily') || lowerLine.includes('twice') || lowerLine.includes('morning') || 
          lowerLine.includes('evening') || lowerLine.includes('night') || lowerLine.includes('breakfast') ||
          lowerLine.includes('lunch') || lowerLine.includes('dinner')) {
        if (currentMedicine.name) {
          currentMedicine.when = line.replace(/^[\-\*\d\.\s]+/, '').trim()
        }
      }
      
      // Extract purpose
      if (lowerLine.includes('for') || lowerLine.includes('treats') || lowerLine.includes('used to') || 
          lowerLine.includes('purpose') || lowerLine.includes('helps')) {
        if (currentMedicine.name) {
          currentMedicine.purpose = line.replace(/^[\-\*\d\.\s]+/, '').trim()
        }
      }
      
      // Extract safety level
      if (lowerLine.includes('high risk') || lowerLine.includes('dangerous')) {
        currentMedicine.safety = 'High Risk'
      } else if (lowerLine.includes('caution') || lowerLine.includes('warning') || lowerLine.includes('interaction')) {
        currentMedicine.safety = 'Caution'
      } else if (lowerLine.includes('safe') || lowerLine.includes('low risk')) {
        currentMedicine.safety = 'Safe'
      }
    }
    
    // Add the last medicine if exists
    if (currentMedicine.name) {
      medicines.push({
        name: currentMedicine.name,
        dosage: currentMedicine.dosage || 'As prescribed',
        purpose: currentMedicine.purpose || 'See prescription',
        when: currentMedicine.when || 'As directed',
        safety: currentMedicine.safety || 'Caution'
      })
    }
    
    // If parsing didn't work well, try a simpler approach
    if (medicines.length === 0) {
      // Look for common medicine name patterns
      const medicinePatterns = analysis.match(/([A-Z][a-z]+(?:in|ol|ide|ate|one|ine|tan|pril|sartan)?)\s+(\d+\s*(?:mg|ml|mcg|g))/gi)
      if (medicinePatterns) {
        medicinePatterns.forEach(match => {
          const parts = match.split(/\s+/)
          medicines.push({
            name: parts[0],
            dosage: parts.slice(1).join(' '),
            purpose: 'As prescribed by doctor',
            when: 'Follow prescription instructions',
            safety: 'Caution'
          })
        })
      }
    }
    
    return medicines
  }

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setAnalysisResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/ocr/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze prescription')
      }

      const data: AnalysisResult = await response.json()
      setAnalysisResult(data)

      if (data.analysis && !data.analysis.includes('API key')) {
        // Try to parse medicines from the analysis
        const parsedMedicines = parseMedicinesFromAnalysis(data.analysis)
        
        if (parsedMedicines.length > 0) {
          addMedicines(parsedMedicines)
          setSuccess(`Successfully analyzed prescription and found ${parsedMedicines.length} medication(s).`)
        } else {
          // If parsing failed, add a placeholder to show the analysis worked
          setSuccess('Prescription analyzed. Please review the details below and add medications manually if needed.')
        }
      } else if (data.rawText) {
        setSuccess('Text extracted from prescription. AI analysis may require API configuration.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the prescription')
      console.error('[v0] OCR analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCameraCapture = async () => {
    try {
      // Check if we're on mobile and can use camera
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        // Create a file input that only accepts camera input
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.capture = 'environment'
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (file) {
            handleFileUpload(file)
          }
        }
        input.click()
      } else {
        setError('Camera not available on this device')
      }
    } catch (error) {
      setError('Camera access denied')
      console.error('[v0] Camera error:', error)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-8 mb-8">
      {/* Header with Illustration */}
      <div className="flex items-start gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Scan Prescription</h2>
          <p className="text-sm text-muted-foreground">Upload or capture your prescription<br/>and get AI-powered analysis.</p>
        </div>
        {/* Placeholder Illustration */}
        <div className="flex-shrink-0">
          <svg className="w-48 h-40" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Clipboard illustration */}
            <rect x="60" y="20" width="80" height="100" rx="8" fill="#E8D9F8" stroke="#A78BDC" strokeWidth="2"/>
            <rect x="70" y="35" width="60" height="10" rx="2" fill="#A78BDC"/>
            <rect x="70" y="50" width="50" height="4" rx="2" fill="#A78BDC" opacity="0.6"/>
            <rect x="70" y="58" width="55" height="4" rx="2" fill="#A78BDC" opacity="0.6"/>
            <circle cx="110" cy="90" r="18" fill="#6B63B5"/>
            <circle cx="110" cy="90" r="14" fill="#7B72CC"/>
            <path d="M108 85V95M103 90H113" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4">
        {/* Scan via Camera */}
        <button
          onClick={handleCameraCapture}
          disabled={isLoading}
          className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 border border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors disabled:opacity-50"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            {isLoading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground text-sm">Scan via Camera</p>
            <p className="text-xs text-muted-foreground">Use camera to scan<br/>prescription</p>
          </div>
        </button>

        {/* Upload Image */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-150 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors disabled:opacity-50"
        >
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            {isLoading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Upload className="w-6 h-6 text-white" />}
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground text-sm">Upload Image</p>
            <p className="text-xs text-muted-foreground">Upload prescription<br/>image</p>
          </div>
        </button>

        {/* Voice Input */}
        <button
          disabled={isLoading}
          className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150 border border-purple-200 rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors disabled:opacity-50"
        >
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground text-sm">Voice Input</p>
            <p className="text-xs text-muted-foreground">Speak prescription<br/>details</p>
          </div>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file)
        }}
        className="hidden"
      />

      {isLoading && (
        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground bg-primary/5 rounded-lg p-4">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span>Analyzing prescription with AI...</span>
        </div>
      )}

      {/* Analysis Result */}
      {analysisResult && analysisResult.analysis && (
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">AI Analysis</h4>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-60 overflow-y-auto">
            {analysisResult.analysis}
          </div>
        </div>
      )}

      {hasMedicines && (
        <div className="mt-4 flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-lg p-3">
          <CheckCircle className="w-4 h-4" />
          <span>Medications have been added to your list. Scroll down to view your medicines and schedule.</span>
        </div>
      )}
    </div>
  )
}
