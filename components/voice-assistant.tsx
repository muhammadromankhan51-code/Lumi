'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Mic, MicOff, Volume2, VolumeX, X, Send } from 'lucide-react'
import { useVoiceInput, useSpeechSynthesis, getVoiceLanguage } from '@/hooks/use-voice-input'
import { useLanguage } from '@/context/language-context'
import { LumiMascot } from '@/components/lumi-mascot'
import { Button } from '@/components/ui/button'

interface VoiceAssistantProps {
  onCommand?: (text: string) => void
  className?: string
}

export function VoiceAssistant({ onCommand, className = '' }: VoiceAssistantProps) {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const voiceLang = getVoiceLanguage(language)

  const {
    isListening,
    startListening,
    stopListening,
    isSupported: voiceInputSupported
  } = useVoiceInput({
    language: voiceLang,
    onResult: (text) => {
      setTranscript(text)
      handleVoiceCommand(text)
    },
    onInterim: (text) => {
      setTranscript(text)
    },
    onError: (err) => {
      setError(err)
      setTimeout(() => setError(''), 3000)
    }
  })

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: speechSupported
  } = useSpeechSynthesis(voiceLang)

  const handleVoiceCommand = useCallback(async (text: string) => {
    if (!text.trim()) return
    
    setIsProcessing(true)
    setResponse('')

    try {
      // Send to AI for processing
      const res = await fetch('/api/analyze-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language })
      })

      if (res.ok) {
        const data = await res.json()
        const aiResponse = data.analysis || 'I processed your request.'
        setResponse(aiResponse)
        
        // Speak the response
        if (speechSupported) {
          speak(aiResponse.substring(0, 500))
        }
        
        onCommand?.(text)
      }
    } catch (err) {
      setError('Failed to process voice command')
    } finally {
      setIsProcessing(false)
    }
  }, [language, onCommand, speak, speechSupported])

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      setTranscript('')
      setResponse('')
      setError('')
      startListening()
    }
  }

  const getMascotState = () => {
    if (isProcessing) return 'thinking'
    if (isListening) return 'speaking'
    if (isSpeaking) return 'speaking'
    return 'idle'
  }

  if (!voiceInputSupported && !speechSupported) {
    return null
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/30 flex items-center justify-center hover:scale-105 transition-transform z-50 ${className} ${isOpen ? 'hidden' : ''}`}
        aria-label="Open voice assistant"
      >
        <Mic className="w-6 h-6" />
      </button>

      {/* Voice Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-border/50 z-50 animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LumiMascot size="sm" state={getMascotState()} />
              <div>
                <h3 className="font-semibold text-white">Lumi Voice</h3>
                <p className="text-xs text-white/80">
                  {isListening ? t('chat.speaking') : isProcessing ? t('chat.thinking') : 'Ready to help'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false)
                stopListening()
                stopSpeaking()
              }}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-80 overflow-y-auto">
            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Transcript */}
            {transcript && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">You said:</p>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-foreground">{transcript}</p>
                </div>
              </div>
            )}

            {/* Response */}
            {response && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Lumi:</p>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-foreground text-sm leading-relaxed">{response.substring(0, 300)}{response.length > 300 ? '...' : ''}</p>
                </div>
              </div>
            )}

            {/* Placeholder when empty */}
            {!transcript && !response && !isListening && (
              <div className="text-center py-8">
                <LumiMascot size="lg" state="waving" showGreeting greetingText="Tap mic to speak!" />
              </div>
            )}

            {/* Listening indicator */}
            {isListening && !transcript && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-8 bg-primary rounded-full animate-pulse" />
                    <div className="w-2 h-12 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-6 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-10 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <div className="w-2 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-border/50 flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Speak
                </>
              )}
            </button>

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
              >
                <VolumeX className="w-5 h-5 text-foreground" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
