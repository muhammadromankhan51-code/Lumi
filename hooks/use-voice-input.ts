import { useCallback, useState } from 'react'

interface UseVoiceInputOptions {
  onResult?: (text: string) => void
  onError?: (error: string) => void
  language?: string
}

export function useVoiceInput({
  onResult,
  onError,
  language = 'en-US',
}: UseVoiceInputOptions) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      onError?.('Speech Recognition not supported in this browser')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = true
    recognition.language = language

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          setTranscript(transcript)
          onResult?.(transcript)
        } else {
          interimTranscript += transcript
        }
      }

      if (interimTranscript) {
        setTranscript(interimTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      onError?.(event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }, [language, onResult, onError])

  const stopListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.abort()
    setIsListening(false)
  }, [])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  }
}

export function useSpeechSynthesis(language: string = 'en-US') {
  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech Synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.language = language
    utterance.rate = 1

    window.speechSynthesis.speak(utterance)
  }, [language])

  return { speak }
}
