'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { type LanguageCode, t as translate, isRTL, languages } from '@/lib/translations'

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string) => string
  isRTL: boolean
  languageInfo: typeof languages[LanguageCode]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en')
  const [mounted, setMounted] = useState(false)

  // Load saved language on mount
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('lumi-language') as LanguageCode
    if (saved && languages[saved]) {
      setLanguageState(saved)
    }
  }, [])

  // Update document attributes when language changes
  useEffect(() => {
    if (!mounted) return
    
    const rtl = isRTL(language)
    document.documentElement.dir = rtl ? 'rtl' : 'ltr'
    document.documentElement.lang = language
    
    // Add RTL class for styling
    if (rtl) {
      document.documentElement.classList.add('rtl')
    } else {
      document.documentElement.classList.remove('rtl')
    }
  }, [language, mounted])

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang)
    localStorage.setItem('lumi-language', lang)
  }, [])

  const t = useCallback((key: string) => {
    return translate(key, language)
  }, [language])

  const value = {
    language,
    setLanguage,
    t,
    isRTL: isRTL(language),
    languageInfo: languages[language]
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ ...value, language: 'en', isRTL: false, languageInfo: languages.en }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Hook for easy translation
export function useTranslation() {
  const { t, language, isRTL } = useLanguage()
  return { t, language, isRTL }
}
