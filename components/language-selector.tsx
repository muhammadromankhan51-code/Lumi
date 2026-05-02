'use client'

import React, { useState } from 'react'
import { languages, type LanguageCode } from '@/lib/i18n'

interface LanguageSelectorProps {
  onChange?: (lang: LanguageCode) => void
  currentLang?: LanguageCode
}

export function LanguageSelector({ onChange, currentLang = 'en' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (lang: LanguageCode) => {
    onChange?.(lang)
    setIsOpen(false)
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumi-language', lang)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors text-sm font-medium text-foreground"
      >
        <span>{languages[currentLang].flag}</span>
        <span>{languages[currentLang].name}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-card border border-border rounded-lg shadow-lg min-w-48">
          {Object.entries(languages).map(([code, { name, flag }]) => (
            <button
              key={code}
              onClick={() => handleSelect(code as LanguageCode)}
              className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${
                code === currentLang ? 'bg-primary/10 text-primary' : 'text-foreground'
              }`}
            >
              <span>{flag}</span>
              <span className="font-medium">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
