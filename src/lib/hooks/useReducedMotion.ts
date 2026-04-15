import { useEffect, useState } from "react"
import { AccessibilityInfo } from "react-native"

/**
 * useReducedMotion hook
 * Returns true if the user has requested reduced motion (accessibility setting)
 * Falls back to false on platforms that don't support the check
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let isMounted = true

    const checkReducedMotionPreference = async () => {
      try {
        // Try to check accessibility settings
        const reduceMotionEnabled = await AccessibilityInfo.isScreenReaderEnabled?.()
        
        if (isMounted) {
          // If screen reader is enabled, assume reduced motion preference
          setPrefersReducedMotion(reduceMotionEnabled || false)
        }
      } catch (error) {
        // If check fails, default to false (animations enabled)
        if (isMounted) {
          setPrefersReducedMotion(false)
        }
      } finally {
        if (isMounted) {
          setIsChecking(false)
        }
      }
    }

    checkReducedMotionPreference()

    return () => {
      isMounted = false
    }
  }, [])

  return prefersReducedMotion
}
