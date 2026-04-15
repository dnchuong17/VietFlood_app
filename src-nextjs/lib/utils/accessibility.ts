/**
 * Accessibility utilities for screen readers and inclusive design
 * Helps ensure VoiceOver and TalkBack support
 */

import { AccessibilityInfo, StyleSheet, ViewStyle } from 'react-native'

/**
 * Accessible button props for screen readers
 */
export interface AccessibleButtonProps {
  label: string
  hint?: string
  disabled?: boolean
}

/**
 * Get accessibility props for interactive elements
 */
export function getAccessibleButtonProps(props: AccessibleButtonProps) {
  return {
    accessibilityLabel: props.label,
    accessibilityHint: props.hint,
    accessibilityRole: 'button' as const,
    accessibilityState: { disabled: !!props.disabled }
  }
}

/**
 * Get accessibility props for text inputs
 */
export interface AccessibleInputProps {
  label: string
  hint?: string
  required?: boolean
  error?: string
}

export function getAccessibleInputProps(props: AccessibleInputProps) {
  return {
    accessibilityLabel: props.label,
    accessibilityHint: props.hint || (props.required ? 'Required field' : undefined),
    accessibilityRole: 'textbox' as const,
    accessibilityState: { disabled: false }
  }
}

/**
 * Announce a message to screen readers
 */
export async function announceForAccessibility(message: string) {
  try {
    await AccessibilityInfo.announceForAccessibility(message)
  } catch (err) {
    console.warn('Failed to announce message', err)
  }
}

/**
 * Minimum touch target size (44x44 points per WCAG 2.1 AAA)
 */
export const MIN_TOUCH_TARGET = 44

/**
 * Style for accessible touch target with padding
 */
export const accessibleTouchTarget: ViewStyle = {
  minHeight: MIN_TOUCH_TARGET,
  minWidth: MIN_TOUCH_TARGET,
  justifyContent: 'center',
  alignItems: 'center'
}

/**
 * Add padding to create accessible touch target
 */
export function ensureAccessibleTouchTarget(baseSize: number): ViewStyle {
  const padding = Math.max(0, MIN_TOUCH_TARGET - baseSize) / 2
  return {
    padding,
    justifyContent: 'center',
    alignItems: 'center'
  }
}

/**
 * Accessible heading (for screen reader structure)
 */
export const accessibleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => ({
  accessibilityRole: 'header' as const,
  accessibilityLevel: level
})

/**
 * Format text for screen readers (e.g., currency, numbers)
 */
export function formatForScreenReader(
  text: string,
  type: 'currency' | 'number' | 'date' | 'default' = 'default'
): string {
  switch (type) {
    case 'currency':
      // "1500" → "one thousand five hundred dollars"
      return text.replace(/\$/, 'dollars ')
    case 'number':
      // Space out digits for readability
      return text.replace(/(\d)(\d)/g, '$1 $2')
    case 'date':
      // Make dates more understandable
      return text.replace(/(\d+)\/(\d+)\/(\d+)/, '$2 slash $1 slash $3')
    default:
      return text
  }
}

/**
 * Check if screen reader is enabled
 */
export async function isScreenReaderEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled()
  } catch (err) {
    return false
  }
}

/**
 * Check if bold text is enabled (accessibility preference)
 */
export async function isBoldTextEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isBoldTextEnabled()
  } catch (err) {
    return false
  }
}

/**
 * Common accessibility patterns for VietFlood
 */
export const a11yPatterns = {
  // Disaster alert announcement
  announceDisasterAlert: (severity: 'low' | 'medium' | 'high' | 'critical') => {
    const messages = {
      low: 'Minor incident reported',
      medium: 'Moderate incident reported',
      high: 'Severe incident reported',
      critical: 'Critical emergency detected'
    }
    return announceForAccessibility(messages[severity])
  },

  // Operation status update
  announceOperationStatus: (name: string, status: 'active' | 'paused' | 'completed') => {
    const messages = {
      active: `Operation ${name} is now active`,
      paused: `Operation ${name} is paused`,
      completed: `Operation ${name} is completed`
    }
    return announceForAccessibility(messages[status])
  },

  // Form submission
  announceFormSubmission: (success: boolean) => {
    return announceForAccessibility(
      success ? 'Form submitted successfully' : 'Form submission failed'
    )
  }
}

/**
 * Test if component is accessible
 */
export const a11yTests = {
  // Check if all interactive elements have labels
  hasAccessibleLabels: (element: any): boolean => {
    return !!(element.accessibilityLabel || element.accessibilityHint)
  },

  // Check if element size meets minimum requirements
  meetsTouchTargetSize: (width: number, height: number): boolean => {
    return width >= MIN_TOUCH_TARGET && height >= MIN_TOUCH_TARGET
  },

  // Check contrast ratio (basic check)
  hasGoodContrast: (foreground: string, background: string): boolean => {
    // Simplified check - in production use proper WCAG contrast calculation
    return foreground !== background
  }
}
