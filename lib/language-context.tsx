"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export const supportedLanguages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
]

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  translate: (text: string, targetLang?: string) => Promise<string>
  isTranslating: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(supportedLanguages[0])
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem("civitas-language")
    if (savedLang) {
      const lang = supportedLanguages.find((l) => l.code === savedLang)
      if (lang) setCurrentLanguage(lang)
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split("-")[0]
      const detectedLang = supportedLanguages.find((l) => l.code === browserLang)
      if (detectedLang) setCurrentLanguage(detectedLang)
    }
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem("civitas-language", language.code)
  }

  const translate = async (text: string, targetLang?: string): Promise<string> => {
    setIsTranslating(true)
    try {
      // Simulate translation API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock translation responses for demo
      const translations: Record<string, Record<string, string>> = {
        "RENTAL AGREEMENT": {
          es: "CONTRATO DE ALQUILER",
          fr: "CONTRAT DE LOCATION",
          de: "MIETVERTRAG",
          it: "CONTRATTO DI AFFITTO",
          pt: "CONTRATO DE ALUGUEL",
          zh: "租赁协议",
          ja: "賃貸契約",
          ko: "임대 계약",
          ar: "اتفاقية الإيجار",
          hi: "किराया समझौता",
          ru: "ДОГОВОР АРЕНДЫ",
        },
        "This Rental Agreement": {
          es: "Este Contrato de Alquiler",
          fr: "Ce Contrat de Location",
          de: "Dieser Mietvertrag",
          it: "Questo Contratto di Affitto",
          pt: "Este Contrato de Aluguel",
          zh: "本租赁协议",
          ja: "この賃貸契約",
          ko: "이 임대 계약",
          ar: "هذه اتفاقية الإيجار",
          hi: "यह किराया समझौता",
          ru: "Данный договор аренды",
        },
      }

      const target = targetLang || currentLanguage.code
      if (target === "en") return text

      // Find exact match or return a generic translation
      const exactMatch = translations[text]?.[target]
      if (exactMatch) return exactMatch

      // Return a simulated translation for demo
      return `[${target.toUpperCase()}] ${text}`
    } catch (error) {
      console.error("Translation error:", error)
      return text
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translate, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
