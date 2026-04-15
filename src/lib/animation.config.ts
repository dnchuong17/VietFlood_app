import { Animated, Easing } from "react-native"

/**
 * Animation Configuration
 * Standardized animation presets for consistent animations across the app
 */

export const ANIMATION_TIMING = {
  // Standard screen transitions
  screenPush: 300,
  screenPop: 300,
  
  // Modal animations
  modal: 250,
  modalDismiss: 250,
  
  // Quick interactions
  quick: 100,
  
  // Standard interactions
  standard: 200,
  
  // Slow animations
  slow: 500,
} as const

export const ANIMATION_EASING = {
  // Standard easing curves matching iOS/Android defaults
  default: Easing.inOut(Easing.ease),
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  cubic: Easing.bezier(0.17, 0.67, 0.83, 0.67),
  smooth: Easing.bezier(0.25, 0.1, 0.25, 1),
} as const

/**
 * Helper: Check if reduced motion is preferred
 */
export const shouldReduceMotion = (): boolean => {
  // This would typically check device accessibility settings
  // For now, return false (animations enabled)
  return false
}

/**
 * Helper: Get animation duration considering reduced motion preference
 */
export const getAnimationDuration = (duration: number): number => {
  if (shouldReduceMotion()) {
    return 0
  }
  return duration
}

/**
 * Preset animation configurations
 */
export const ANIMATION_PRESETS = {
  // Screen transition (slide from right)
  slideInRight: {
    duration: ANIMATION_TIMING.screenPush,
    easing: ANIMATION_EASING.easeOut,
  },
  
  // Screen transition (slide to right)
  slideOutRight: {
    duration: ANIMATION_TIMING.screenPop,
    easing: ANIMATION_EASING.easeIn,
  },
  
  // Modal entrance (slide up)
  slideInUp: {
    duration: ANIMATION_TIMING.modal,
    easing: ANIMATION_EASING.easeOut,
  },
  
  // Modal exit (slide down)
  slideOutDown: {
    duration: ANIMATION_TIMING.modalDismiss,
    easing: ANIMATION_EASING.easeIn,
  },
  
  // Fade in
  fadeIn: {
    duration: ANIMATION_TIMING.standard,
    easing: ANIMATION_EASING.default,
  },
  
  // Fade out
  fadeOut: {
    duration: ANIMATION_TIMING.standard,
    easing: ANIMATION_EASING.default,
  },
  
  // Quick scale effect
  scaleIn: {
    duration: ANIMATION_TIMING.quick,
    easing: ANIMATION_EASING.easeOut,
  },
  
  scaleOut: {
    duration: ANIMATION_TIMING.quick,
    easing: ANIMATION_EASING.easeIn,
  },
} as const

/**
 * Shared animation values for Reanimated
 */
export const createAnimatedValue = (initialValue: number = 0): Animated.Value => {
  return new Animated.Value(initialValue)
}

/**
 * Helper: Create interpolation config for common transitions
 */
export const createInterpolation = (
  inputRange: number[],
  outputRange: (string | number)[]
) => {
  return {
    inputRange,
    outputRange,
  }
}
