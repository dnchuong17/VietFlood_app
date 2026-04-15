import { useEffect, useState } from "react"
import { t, setLocale, getCurrentLocale, formatDate, formatNumber, isRTL } from "@lib/i18n"

/**
 * useTranslation Hook
 * Returns translation utilities and current locale
 */
export const useTranslation = () => {
  const [locale, setLocaleState] = useState(getCurrentLocale())

  useEffect(() => {
    // Update state when locale changes
    setLocaleState(getCurrentLocale())
  }, [])

  return {
    // Translation function
    t,
    
    // Locale management
    locale,
    setLocale: (newLocale: string) => {
      setLocale(newLocale)
      setLocaleState(newLocale)
    },
    
    // Formatting utilities
    formatDate,
    formatNumber,
    isRTL,
    
    // Utility properties
    isEnglish: locale === "en",
    isVietnamese: locale === "vi",
  }
}

/**
 * useI18n Hook
 * Alias for useTranslation with shorter name
 */
export const useI18n = () => useTranslation()
