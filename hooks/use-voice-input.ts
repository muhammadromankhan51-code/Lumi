import { useCallback, useState, useRef, useEffect } from 'react'

interface UseVoiceInputOptions {
  onResult?: (text: string) => void
  onInterim?: (text: string) => void
  onError?: (error: string) => void
  language?: string
  continuous?: boolean
}

export function useVoiceInput({
  onResult,
  onInterim,
  onError,
  language = 'en-US',
  continuous = false,
}: UseVoiceInputOptions) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    setIsSupported(supported)
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      onError?.('Speech Recognition not supported in this browser')
      setIsSupported(false)
      return
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.continuous = continuous
    recognition.interimResults = true
    recognition.lang = language
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript)
        onResult?.(finalTranscript)
      } else if (interimTranscript) {
        setTranscript(interimTranscript)
        onInterim?.(interimTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      let errorMessage = 'Speech recognition error'
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.'
          break
        case 'aborted':
          errorMessage = 'Speech recognition aborted'
          break
        case 'audio-capture':
          errorMessage = 'No microphone detected'
          break
        case 'not-allowed':
          errorMessage = 'Microphone permission denied'
          break
        case 'network':
          errorMessage = 'Network error during speech recognition'
          break
        default:
          errorMessage = `Speech recognition error: ${event.error}`
      }
      
      onError?.(errorMessage)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
    }

    try {
      recognition.start()
    } catch (err) {
      onError?.('Failed to start speech recognition')
      setIsListening(false)
    }
  }, [language, onResult, onInterim, onError, continuous])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])

  const abortListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }
    setIsListening(false)
    setTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    abortListening,
    isSupported,
  }
}

interface UseSpeechSynthesisOptions {
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
}

export function useSpeechSynthesis(language: string = 'en-US', options?: UseSpeechSynthesisOptions) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const supported = 'speechSynthesis' in window
    setIsSupported(supported)
    
    if (supported) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
      }
      
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speak = useCallback((text: string, customVoice?: SpeechSynthesisVoice) => {
    if (!('speechSynthesis' in window)) {
      options?.onError?.('Speech synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    // Find best matching voice
    if (customVoice) {
      utterance.voice = customVoice
    } else {
      const matchingVoice = voices.find(v => v.lang.startsWith(language.split('-')[0]))
      if (matchingVoice) {
        utterance.voice = matchingVoice
      }
    }

    utterance.lang = language
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      setIsSpeaking(true)
      options?.onStart?.()
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      options?.onEnd?.()
    }

    utterance.onerror = (event) => {
      setIsSpeaking(false)
      options?.onError?.(event.error)
    }

    window.speechSynthesis.speak(utterance)
  }, [language, voices, options])

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const pause = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause()
    }
  }, [])

  const resume = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume()
    }
  }, [])

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported,
    voices,
  }
}

// Voice language mapping for Pakistan languages
export const voiceLanguageMap: Record<string, string> = {
  'en': 'en-US',
  'ur': 'ur-PK',
  'sd': 'sd-PK', // May fallback to ur-PK
  'ps': 'ps-AF', // Pashto
  'bal': 'fa-IR', // Balochi - using Farsi as closest available
  'skr': 'ur-PK', // Saraiki - using Urdu as closest available
}

export function getVoiceLanguage(langCode: string): string {
  return voiceLanguageMap[langCode] || 'en-US'
}
