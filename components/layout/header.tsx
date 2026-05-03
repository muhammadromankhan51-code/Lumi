'use client'

import React, { useState } from 'react'
import { Globe, Mic, ChevronDown, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LanguageSelector } from '@/components/language-selector'
import { VoiceButton } from '@/components/voice-button'
import type { LanguageCode } from '@/lib/i18n'

export function Header() {
  const router = useRouter()
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleVoiceResult = (text: string) => {
    console.log('Voice input:', text)
    // Handle voice commands here
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/signin')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="bg-background border-b border-border h-20 flex items-center justify-between px-8 fixed top-0 right-0 left-56 z-40">
      {/* Left Section - Greeting */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Hello, Ali 👋</h2>
        <p className="text-sm text-muted-foreground">We&apos;re here to help you stay healthy.</p>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <LanguageSelector currentLang={currentLang} onChange={setCurrentLang} />

        {/* Voice Input */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-all border border-primary/20">
            <Mic className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Voice</span>
          </button>
          <div className="absolute right-0 top-full mt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
            <div className="bg-card border border-border rounded-lg shadow-lg p-4 w-64">
              <VoiceButton onResult={handleVoiceResult} />
            </div>
          </div>
        </div>

        {/* User Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hover:shadow-lg transition-shadow text-white font-bold flex-shrink-0"
          >
            A
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-lg shadow-lg min-w-48">
              <button
                onClick={() => router.push('/dashboard/settings')}
                className="w-full text-left px-4 py-3 hover:bg-accent transition-colors flex items-center gap-3 text-foreground border-b border-border"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-destructive/5 transition-colors flex items-center gap-3 text-destructive rounded-b-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

