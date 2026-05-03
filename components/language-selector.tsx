'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import { getLanguageOptions, type LanguageCode } from '@/lib/translations'

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'inline' | 'compact'
  showNativeName?: boolean
}

export function LanguageSelector({ variant = 'dropdown', showNativeName = true }: LanguageSelectorProps) {
  const { language, setLanguage, languageInfo } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const languages = getLanguageOptions()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (lang: LanguageCode) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  if (variant === 'compact') {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm"
          aria-label="Select language"
        >
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{languageInfo.flag}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-1 right-0 z-50 bg-card border border-border rounded-xl shadow-lg min-w-[160px] py-1 animate-fade-in">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center gap-2 text-sm ${
                  lang.code === language ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="font-medium flex-1">{showNativeName ? lang.nativeName : lang.name}</span>
                {lang.code === language && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              lang.code === language
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            <span className="mr-1.5">{lang.flag}</span>
            {showNativeName ? lang.nativeName : lang.name}
          </button>
        ))}
      </div>
    )
  }

  // Default dropdown variant
  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-sm font-medium"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span>{languageInfo.flag}</span>
        <span>{showNativeName ? languageInfo.nativeName : languageInfo.name}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-card border border-border rounded-xl shadow-xl min-w-[200px] py-2 animate-fade-in">
          <div className="px-3 pb-2 mb-2 border-b border-border">
            <p className="text-xs text-muted-foreground font-medium uppercase">Select Language</p>
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3 ${
                lang.code === language ? 'bg-primary/10' : ''
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <div className="flex-1">
                <p className={`font-medium ${lang.code === language ? 'text-primary' : 'text-foreground'}`}>
                  {lang.nativeName}
                </p>
                <p className="text-xs text-muted-foreground">{lang.name}</p>
              </div>
              {lang.code === language && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
