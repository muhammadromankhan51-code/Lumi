'use client'

import React, { useState, useRef } from 'react'
import { Camera, Upload, Mic, AlertCircle } from 'lucide-react'

interface ScanPrescriptionProps {
  onAnalyze?: (text: string) => void
}

export function ScanPrescriptionSection({ onAnalyze }: ScanPrescriptionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    setError(null)

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

      const data = await response.json()
      onAnalyze?.(data.text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('[v0] OCR analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      console.log('[v0] Camera stream started')
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
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
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
            <Camera className="w-6 h-6 text-white" />
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
            <Upload className="w-6 h-6 text-white" />
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
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Analyzing prescription...
        </div>
      )}
    </div>
  )
}
