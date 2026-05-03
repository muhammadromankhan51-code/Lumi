'use client'

import React, { useState, useEffect } from 'react'
import { Globe, Mic, MicOff, Settings, LogOut, ChevronDown, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { languages, type LanguageCode } from '@/lib/i18n'
import { useVoiceInput, useSpeechSynthesis } from '@/hooks/use-voice-input'

export function Header() {
  const router = useRouter()
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  
  const { isListening, startListening, stopListening, transcript } = useVoiceInput({
    onResult: (text) => {
      setVoiceText(text)
    },
    language: currentLang === 'en' ? 'en-US' : currentLang === 'ur' ? 'ur-PK' : 'en-US'
  })

  const { speak } = useSpeechSynthesis(currentLang === 'ur' ? 'ur-PK' : 'en-US')

  useEffect(() => {
    const saved = localStorage.getItem('lumi-language') as LanguageCode
    if (saved && languages[saved]) {
      setCurrentLang(saved)
    }
  }, [])

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLang(lang)
    localStorage.setItem('lumi-language', lang)
    setIsLangMenuOpen(false)
    // Announce language change
    const langName = languages[lang].name
    if (lang === 'en') {
      speak(`Language changed to ${langName}`)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/signin')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      setVoiceText('')
      startListening()
    }
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false)
      setIsLangMenuOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <header className="glass-card border-b border-border/50 h-20 flex items-center justify-between px-8 fixed top-0 right-0 left-56 z-40">
      {/* Left Section - Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Hello, Ali
        </h2>
        <p className="text-sm text-muted-foreground">We&apos;re here to help you stay healthy.</p>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-border/50 hover:border-primary/30 hover:bg-white transition-all duration-200"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{languages[currentLang].name}</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isLangMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 glass-card-elevated rounded-xl shadow-lg min-w-48 overflow-hidden animate-fade-in">
              {Object.entries(languages).map(([code, { name, flag }]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code as LanguageCode)}
                  className={`w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors flex items-center justify-between ${
                    code === currentLang ? 'bg-primary/10 text-primary' : 'text-foreground'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{flag}</span>
                    <span className="font-medium">{name}</span>
                  </span>
                  {code === currentLang && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Voice Input */}
        <button 
          onClick={handleVoiceToggle}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
            isListening 
              ? 'bg-red-50 border-red-200 text-red-600' 
              : 'bg-white/80 border-border/50 hover:border-primary/30 hover:bg-white text-foreground'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Stop</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Voice</span>
            </>
          )}
        </button>

        {/* User Avatar with Dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/20 transition-all text-white font-bold flex-shrink-0"
          >
            A
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 glass-card-elevated rounded-xl shadow-lg min-w-48 overflow-hidden animate-fade-in">
              <button
                onClick={() => router.push('/dashboard/settings')}
                className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors flex items-center gap-3 text-foreground border-b border-border/50"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Voice transcript toast */}
      {(voiceText || transcript) && (
        <div className="fixed bottom-4 right-4 glass-card-elevated rounded-xl p-4 max-w-sm animate-fade-in z-50">
          <div className="flex items-center gap-2 mb-1">
            <Mic className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Voice Input</span>
          </div>
          <p className="text-sm text-muted-foreground">{voiceText || transcript}</p>
        </div>
      )}
    </header>
  )
}
