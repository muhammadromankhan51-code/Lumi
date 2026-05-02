'use client'

import React, { useState, useRef } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Camera, Upload, Mic, AlertCircle, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ScanPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCamera, setShowCamera] = useState(false)

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (error) {
      setError('Camera access denied')
      console.error('[v0] Camera error:', error)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            handleFileUpload(new File([blob], 'prescription.jpg', { type: 'image/jpeg' }))
          }
        })
        setShowCamera(false)
      }
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Header />
        <main className="mt-16 p-8 bg-background min-h-screen">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-foreground mb-2">Scan Prescription</h1>
            <p className="text-muted-foreground mb-8">Upload, capture, or describe your prescription for AI analysis</p>

            {!result && !showCamera && (
              <div className="bg-white rounded-xl border border-border p-12">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-6 mb-8">
                  {/* Scan via Camera */}
                  <button
                    onClick={handleCameraCapture}
                    disabled={isLoading}
                    className="bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 border border-primary/20 rounded-lg p-8 flex flex-col items-center justify-center gap-4 transition-colors disabled:opacity-50"
                  >
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                      <Camera className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">Scan via Camera</p>
                      <p className="text-sm text-muted-foreground">Use camera to scan prescription</p>
                    </div>
                  </button>

                  {/* Upload Image */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="bg-gradient-to-br from-success/5 to-success/10 hover:from-success/10 hover:to-success/15 border border-success/20 rounded-lg p-8 flex flex-col items-center justify-center gap-4 transition-colors disabled:opacity-50"
                  >
                    <div className="w-16 h-16 bg-success rounded-lg flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">Upload Image</p>
                      <p className="text-sm text-muted-foreground">Upload prescription image</p>
                    </div>
                  </button>

                  {/* Voice Input */}
                  <button
                    disabled={isLoading}
                    className="bg-gradient-to-br from-secondary/5 to-secondary/10 hover:from-secondary/10 hover:to-secondary/15 border border-secondary/20 rounded-lg p-8 flex flex-col items-center justify-center gap-4 transition-colors disabled:opacity-50"
                  >
                    <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                      <Mic className="w-8 h-8 text-secondary-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">Voice Input</p>
                      <p className="text-sm text-muted-foreground">Speak prescription details</p>
                    </div>
                  </button>
                </div>

                {isLoading && (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Analyzing prescription...</p>
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
              <div className="bg-white rounded-xl border border-border p-8">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg mb-4"
                />
                <canvas ref={canvasRef} className="hidden" width={640} height={480} />
                <div className="flex gap-4 justify-center">
                  <Button onClick={capturePhoto} className="bg-primary hover:bg-primary/90">
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
              <div className="bg-white rounded-xl border border-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Analysis Result</h2>
                <div className="bg-muted/50 rounded-lg p-6 mb-6">
                  <pre className="text-sm text-foreground overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
                </div>
                <Button
                  onClick={() => {
                    setResult(null)
                    setError(null)
                  }}
                  className="w-full"
                >
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
