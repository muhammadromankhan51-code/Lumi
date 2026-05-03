'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Camera, Mic, MicOff, AlertCircle, Loader2, FileImage, CheckCircle2, Sparkles, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useVoiceInput } from '@/hooks/use-voice-input'
import { LumiMascot, LumiLoader } from '@/components/lumi-mascot'

export default function ScanPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const { isListening, startListening, stopListening, transcript } = useVoiceInput({
    onResult: (text) => {
      setVoiceTranscript(text)
    },
    onError: (err) => {
      setError(`Voice input error: ${err}`)
    },
    language: 'en-US'
  })

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    setError(null)

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const r = new FileReader()
        r.onload = () => {
          const result = r.result as string
          resolve(result.split(',')[1])
        }
        r.readAsDataURL(file)
      })

      const response = await fetch('/api/ocr/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze prescription')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('[v0] OCR analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (error) {
      setError('Camera access denied. Please allow camera access in your browser settings.')
      console.error('[v0] Camera error:', error)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            handleFileUpload(new File([blob], 'prescription.jpg', { type: 'image/jpeg' }))
          }
        }, 'image/jpeg', 0.9)
        // Stop camera
        if (videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop())
        }
        setShowCamera(false)
      }
    }
  }

  const handleVoiceInput = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      setVoiceTranscript('')
      startListening()
    }
  }, [isListening, startListening, stopListening])

  const handleVoiceSubmit = async () => {
    if (!voiceTranscript.trim()) return
    
    setIsLoading(true)
    setError(null)

    try {
      // Analyze voice input with AI
      const response = await fetch('/api/analyze-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: voiceTranscript }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze voice input')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const resetScan = () => {
    setResult(null)
    setError(null)
    setPreviewImage(null)
    setVoiceTranscript('')
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Header />
        <main className="mt-16 p-8 bg-background min-h-screen">
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">Scan Prescription</h1>
            <p className="text-muted-foreground mb-8">Upload, capture, or describe your prescription for AI analysis</p>

            {!result && !showCamera && (
              <div className="glass-card-elevated rounded-2xl p-8">
                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto">
                      <X className="w-4 h-4 text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {/* Scan via Camera */}
                  <button
                    onClick={handleCameraCapture}
                    disabled={isLoading}
                    className="group glass-card hover:glass-card-elevated border border-blue-100 hover:border-blue-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 disabled:opacity-50"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                      <Camera className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">Scan via Camera</p>
                      <p className="text-xs text-muted-foreground mt-1">Use camera to capture</p>
                    </div>
                  </button>

                  {/* Upload Image */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="group glass-card hover:glass-card-elevated border border-emerald-100 hover:border-emerald-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 disabled:opacity-50"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                      <FileImage className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">Upload Image</p>
                      <p className="text-xs text-muted-foreground mt-1">Select from gallery</p>
                    </div>
                  </button>

                  {/* Voice Input */}
                  <button
                    onClick={handleVoiceInput}
                    disabled={isLoading}
                    className={`group glass-card hover:glass-card-elevated border rounded-xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 disabled:opacity-50 ${
                      isListening ? 'border-red-200 bg-red-50/50' : 'border-violet-100 hover:border-violet-200'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform ${
                      isListening 
                        ? 'bg-gradient-to-br from-red-500 to-rose-500 shadow-red-500/20 animate-pulse' 
                        : 'bg-gradient-to-br from-violet-500 to-purple-500 shadow-violet-500/20'
                    }`}>
                      {isListening ? <MicOff className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white" />}
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">
                        {isListening ? 'Stop Recording' : 'Voice Input'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isListening ? 'Click to stop' : 'Speak prescription'}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Voice Transcript */}
                {(voiceTranscript || transcript) && (
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 mb-6 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                      <Mic className="w-4 h-4 text-violet-600" />
                      <span className="text-sm font-medium text-violet-700">Voice Transcript</span>
                    </div>
                    <p className="text-foreground">{voiceTranscript || transcript}</p>
                    {voiceTranscript && !isListening && (
                      <Button
                        onClick={handleVoiceSubmit}
                        className="mt-3 bg-violet-600 hover:bg-violet-700"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        Analyze with AI
                      </Button>
                    )}
                  </div>
                )}

                {/* Preview Image */}
                {previewImage && isLoading && (
                  <div className="relative rounded-xl overflow-hidden mb-6 animate-fade-in">
                    <img src={previewImage} alt="Prescription preview" className="w-full max-h-64 object-contain bg-gray-50" />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <LumiMascot size="lg" state="thinking" />
                        <p className="font-medium text-white mt-4">Analyzing prescription...</p>
                        <p className="text-sm text-white/80">Using AI to extract information</p>
                      </div>
                    </div>
                  </div>
                )}

                {isLoading && !previewImage && (
                  <div className="py-8">
                    <LumiLoader text="Processing your input" />
                  </div>
                )}

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
              </div>
            )}

            {showCamera && (
              <div className="glass-card-elevated rounded-2xl p-6 animate-fade-in">
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-xl"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                      Position the prescription in the frame
                    </div>
                  </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-4 justify-center">
                  <Button onClick={capturePhoto} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 btn-premium">
                    <Camera className="w-4 h-4 mr-2" />
                    Capture Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCamera(false)
                      if (videoRef.current?.srcObject) {
                        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop())
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {result && (
              <div className="glass-card-elevated rounded-2xl p-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Analysis Complete</h2>
                    <p className="text-sm text-muted-foreground">AI has processed your prescription</p>
                  </div>
                </div>

                {/* Raw Text */}
                {result.rawText && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Extracted Text</h3>
                    <div className="bg-muted/50 rounded-xl p-4">
                      <pre className="text-sm text-foreground whitespace-pre-wrap">{result.rawText}</pre>
                    </div>
                  </div>
                )}

                {/* AI Analysis */}
                {result.analysis && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">AI Analysis</h3>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <pre className="text-sm text-foreground whitespace-pre-wrap overflow-x-auto">{
                        typeof result.analysis === 'string' 
                          ? result.analysis 
                          : JSON.stringify(result.analysis, null, 2)
                      }</pre>
                    </div>
                  </div>
                )}

                <Button onClick={resetScan} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 btn-premium">
                  Scan Another Prescription
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
