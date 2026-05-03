'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, languages, type LanguageCode, type TranslationKey } from './i18n'

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: TranslationKey) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const rtlLanguages: LanguageCode[] = ['ur', 'sd', 'ps', 'al', 'sr']

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en')

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem('lumi-language') as LanguageCode
    if (saved && languages[saved]) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
    localStorage.setItem('lumi-language', lang)
    // Update document direction for RTL languages
    document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr'
  }

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  const dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
