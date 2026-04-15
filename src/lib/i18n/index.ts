import AsyncStorage from "@react-native-async-storage/async-storage"
import i18n from "i18n-js"
import en from "./locales/en.json"
import vi from "./locales/vi.json"

/**
 * i18n Configuration
 * Setup internationalization support for Vietnamese and English
 */

// Register translations
;(i18n as any).defaultLocale = "en"
;(i18n as any).locale = "en"

// Configure translations using setTranslationGetter for i18n-js v4
type TranslationsProp = Record<string, Record<string, any>>
const translations: TranslationsProp = {
  en,
  vi,
}

// Set up translation retrieval
;(i18n as any).setTranslationGetter((key: string, locale: string) => {
  if (translations[locale]) {
    return getNestedProperty(translations[locale], key)
  }
  return null
})

/**
 * Helper to get nested properties from translation object
 */
function getNestedProperty(obj: any, path: string): any {
  const keys = path.split(".")
  let value = obj
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key]
    } else {
      return null
    }
  }
  return value
}

/**
 * Get device locale preference
 */
const getDeviceLocale = (): string => {
  // Try to get from device settings
  // For now, default to English
  return "en"
}

/**
 * Initialize with device locale
 */
;(i18n as any).locale = getDeviceLocale()

/**
 * Translation function wrapper
 */
export const t = (key: string, params?: Record<string, any>): string => {
  try {
    const locale = (i18n as any).locale
    const translation = getNestedProperty(translations[locale] || translations.en, key)
    if (translation && params) {
      // Simple parameter replacement
      let result = translation
      for (const [paramKey, paramValue] of Object.entries(params)) {
        result = result.replace(`%{${paramKey}}`, paramValue.toString())
      }
      return result
    }
    return translation || key
  } catch (error) {
    console.warn(`Translation key not found: ${key}`)
    return key
  }
}

/**
 * Get current locale
 */
export const getCurrentLocale = (): string => {
  return (i18n as any).locale
}

/**
 * Set locale manually
 */
export const setLocale = (locale: string): void => {
  if (["en", "vi"].includes(locale)) {
    ;(i18n as any).locale = locale
    // Persist to storage
    AsyncStorage.setItem("@app_locale", locale).catch((err) =>
      console.warn("Failed to save locale:", err)
    )
  }
}

/**
 * Load saved locale preference
 */
export const loadSavedLocale = async (): Promise<void> => {
  try {
    const savedLocale = await AsyncStorage.getItem("@app_locale")
    if (savedLocale && ["en", "vi"].includes(savedLocale)) {
      ;(i18n as any).locale = savedLocale
    }
  } catch (error) {
    console.warn("Failed to load saved locale:", error)
  }
}

/**
 * Format date according to locale
 */
export const formatDate = (date: Date): string => {
  const locale = (i18n as any).locale

  if (locale === "vi") {
    // Vietnamese format: DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } else {
    // English format: MM/DD/YYYY
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  }
}

/**
 * Format number according to locale
 */
export const formatNumber = (num: number): string => {
  const locale = (i18n as any).locale

  if (locale === "vi") {
    // Vietnamese: use . as thousand separator
    return num.toLocaleString("vi-VN")
  } else {
    // English: use , as thousand separator
    return num.toLocaleString("en-US")
  }
}

/**
 * Check if RTL language
 */
export const isRTL = (): boolean => {
  // Vietnamese is LTR, English is LTR
  // This is here for future RTL language support
  return false
}

export default i18n

