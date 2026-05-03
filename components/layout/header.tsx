'use client'

import React, { useState, useEffect } from 'react'
import { Mic, MicOff, Settings, LogOut, Volume2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage, useTranslation } from '@/context/language-context'
import { useVoiceInput, useSpeechSynthesis } from '@/hooks/use-voice-input'
import { LanguageSelector } from '@/components/language-selector'

export function Header() {
  const router = useRouter()
  const { language } = useLanguage()
  const { t } = useTranslation()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  const [userName, setUserName] = useState('User')
  
  const voiceLanguageMap: Record<string, string> = {
    'en': 'en-US',
    'ur': 'ur-PK',
    'sd': 'sd-PK',
    'ps': 'ps-AF',
    'bal': 'bal-PK',
    'skr': 'skr-PK'
  }

  const { isListening, startListening, stopListening, transcript } = useVoiceInput({
    onResult: (text) => {
      setVoiceText(text)
    },
    language: voiceLanguageMap[language] || 'en-US'
  })

  const { speak } = useSpeechSynthesis(voiceLanguageMap[language] || 'en-US')

  // Load user name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('lumi-user-name')
    if (savedName) {
      setUserName(savedName)
    }
  }, [])

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

  // Read page content aloud
  const readPageContent = () => {
    const mainContent = document.querySelector('main')?.textContent
    if (mainContent) {
      speak(mainContent.substring(0, 500))
    }
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <header className="glass-card border-b border-border/50 h-20 flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-0 md:left-56 z-40">
      {/* Left Section - Greeting */}
      <div className="hidden sm:block">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          {t('dashboard.greeting')}, {userName}
        </h2>
        <p className="text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      {/* Mobile Logo */}
      <div className="sm:hidden">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Lumi
        </h1>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Language Selector */}
        <LanguageSelector variant="compact" />

        {/* Text-to-Speech */}
        <button 
          onClick={readPageContent}
          className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-xl bg-white/80 border border-border/50 hover:border-primary/30 hover:bg-white transition-all duration-200"
          title="Read page aloud"
        >
          <Volume2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground hidden md:inline">Read</span>
        </button>

        {/* Voice Input */}
        <button 
          onClick={handleVoiceToggle}
          className={`flex items-center gap-2 px-2 md:px-3 py-2 rounded-xl border transition-all duration-200 ${
            isListening 
              ? 'bg-red-50 border-red-200 text-red-600' 
              : 'bg-white/80 border-border/50 hover:border-primary/30 hover:bg-white text-foreground'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium hidden md:inline">Stop</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium hidden md:inline">Voice</span>
            </>
          )}
        </button>

        {/* User Avatar with Dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/20 transition-all text-white font-bold flex-shrink-0"
          >
            {userName.charAt(0).toUpperCase()}
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 glass-card-elevated rounded-xl shadow-lg min-w-48 overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-border/50">
                <p className="font-medium text-foreground">{userName}</p>
                <p className="text-sm text-muted-foreground">Patient Account</p>
              </div>
              <button
                onClick={() => router.push('/dashboard/settings')}
                className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors flex items-center gap-3 text-foreground border-b border-border/50"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">{t('nav.settings')}</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">{t('nav.logout')}</span>
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
