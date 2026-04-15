/**
 * i18n configuration for multi-language support
 * Supports English and Vietnamese (extensible for more languages)
 */

import i18n from 'i18n-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'
import en from './locales/en.json'
import vi from './locales/vi.json'

// Configure translations
i18n.translations = { en, vi }

// Set default locale
const deviceLocale = getLocales()[0]?.languageCode || 'en'
i18n.locale = deviceLocale

// Set fallback
i18n.fallbacks['vi'] = 'en'
i18n.fallbacks['fr'] = 'en'

/**
 * Get current language from storage or device default
 */
export async function getCurrentLanguage(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem('app_language')
    if (stored && Object.keys(i18n.translations).includes(stored)) {
      return stored
    }
  } catch (err) {
    console.warn('Failed to retrieve stored language')
  }

  return deviceLocale
}

/**
 * Set language and persist to storage
 */
export async function setLanguage(language: string): Promise<void> {
  if (!Object.keys(i18n.translations).includes(language)) {
    console.warn(`Language ${language} not available`)
    return
  }

  i18n.locale = language
  await AsyncStorage.setItem('app_language', language)
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): Array<{ code: string; name: string }> {
  return [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Tiếng Việt' }
  ]
}

/**
 * Translate with fallback
 */
export function t(key: string, options?: Record<string, any>): string {
  try {
    return i18n.t(key, options)
  } catch (err) {
    console.warn(`Translation key not found: ${key}`)
    return key
  }
}

export { i18n }
export default i18n
