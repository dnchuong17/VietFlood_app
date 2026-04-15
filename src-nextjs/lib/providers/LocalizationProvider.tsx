/**
 * Localization context provider
 * Manages language state and provides i18n throughout the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getCurrentLanguage, setLanguage as setLanguageUtil, getAvailableLanguages } from '@/lib/i18n'
import { logger } from '@/lib/logging/logger'

interface LocalizationContextType {
  language: string
  setLanguage: (lang: string) => Promise<void>
  availableLanguages: Array<{ code: string; name: string }>
  isLoading: boolean
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined)

/**
 * Localization provider component
 * Wrap your app with this to enable i18n
 */
export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('en')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeLanguage()
  }, [])

  const initializeLanguage = async () => {
    try {
      setIsLoading(true)
      const savedLanguage = await getCurrentLanguage()
      setLanguageState(savedLanguage)
      logger.info('Localization', 'Language initialized', { language: savedLanguage })
    } catch (err) {
      logger.error('Localization', 'Failed to initialize language', err as Error)
      setLanguageState('en')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetLanguage = async (lang: string) => {
    try {
      await setLanguageUtil(lang)
      setLanguageState(lang)
      logger.info('Localization', 'Language changed', { from: language, to: lang })
    } catch (err) {
      logger.error('Localization', 'Failed to change language', err as Error)
    }
  }

  const value: LocalizationContextType = {
    language,
    setLanguage: handleSetLanguage,
    availableLanguages: getAvailableLanguages(),
    isLoading
  }

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  )
}

/**
 * Hook to use localization context
 */
export function useLocalization() {
  const context = useContext(LocalizationContext)
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider')
  }
  return context
}

/**
 * Hook to use translation function
 */
export function useTranslation() {
  const { language } = useLocalization()
  const i18n = require('@/lib/i18n').default

  return {
    t: (key: string, options?: Record<string, any>) => i18n.t(key, options),
    language
  }
}
