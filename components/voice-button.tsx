'use client'

import React from 'react'
import { Mic, MicOff } from 'lucide-react'
import { useVoiceInput } from '@/hooks/use-voice-input'

interface VoiceButtonProps {
  onResult: (text: string) => void
  disabled?: boolean
}

export function VoiceButton({ onResult, disabled = false }: VoiceButtonProps) {
  const { isListening, transcript, startListening, stopListening } = useVoiceInput({
    onResult,
  })

  const handleClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          isListening
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-primary text-white hover:bg-primary/90'
        } disabled:opacity-50`}
      >
        {isListening ? (
          <>
            <MicOff className="w-5 h-5" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            Start Voice Input
          </>
        )}
      </button>
      {transcript && (
        <div className="text-sm text-muted-foreground bg-accent/50 rounded-lg p-2">
          {transcript}
        </div>
      )}
    </div>
  )
}
