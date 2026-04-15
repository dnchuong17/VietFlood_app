/**
 * Accessibility middleware for React components
 * Provides higher-order components and utilities for WCAG compliance
 */

import React, { forwardRef } from 'react'
import {
  getAccessibleButtonProps,
  getAccessibleInputProps,
  announceForAccessibility,
  ensureAccessibleTouchTarget,
  MIN_TOUCH_TARGET,
} from '@/lib/utils/accessibility'
import { logger } from '@/lib/logging/logger'

interface WithAccessibilityOptions {
  role?: string
  label?: string
  hint?: string
  testID?: string
}

/**
 * HOC to add accessibility props to any component
 * Automatically applies accessible labels, touch targets, and announcements
 */
export function withAccessibility<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAccessibilityOptions = {}
) {
  const WrappedComponent = forwardRef<any, P>((props, ref) => {
    React.useEffect(() => {
      if (options.testID) {
        logger.debug('Accessibility', 'Component mounted with a11y props', {
          testID: options.testID,
          label: options.label,
          role: options.role,
        })
      }
    }, [])

    return (
      <Component
        ref={ref}
        {...props}
        accessibilityRole={options.role}
        accessibilityLabel={options.label}
        accessibilityHint={options.hint}
        testID={options.testID}
      />
    )
  })

  WrappedComponent.displayName = `withAccessibility(${Component.displayName || Component.name})`
  return WrappedComponent
}

/**
 * Accessible Button component wrapper
 * Ensures proper touch target size and accessibility props
 */
export const AccessibleButton = forwardRef<any, {
  onPress: () => void
  label: string
  hint?: string
  disabled?: boolean
  style?: any
  children?: React.ReactNode
}>(({ onPress, label, hint, disabled, style, children }, ref) => {
  const a11yProps = getAccessibleButtonProps({
    label,
    hint,
    disabled,
  })

  return (
    <button
      ref={ref}
      onClick={onPress}
      disabled={disabled}
      style={{
        ...style,
        minWidth: MIN_TOUCH_TARGET,
        minHeight: MIN_TOUCH_TARGET,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...a11yProps}
    >
      {children}
    </button>
  )
})

AccessibleButton.displayName = 'AccessibleButton'

/**
 * Accessible Input component wrapper
 * Ensures proper labels and accessibility props
 */
export const AccessibleInput = forwardRef<any, {
  label: string
  hint?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
  style?: any
}>(({ label, hint, value, onChangeText, placeholder, type, disabled, style }, ref) => {
  const a11yProps = getAccessibleInputProps({
    label,
    hint,
    disabled,
  })

  return (
    <input
      ref={ref}
      type={type || 'text'}
      value={value}
      onChange={(e) => onChangeText(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        ...style,
        minHeight: MIN_TOUCH_TARGET,
        padding: '8px 12px',
      }}
      aria-label={label}
      title={hint}
      {...a11yProps}
    />
  )
})

AccessibleInput.displayName = 'AccessibleInput'

/**
 * Announce important state changes for accessibility
 * Use when status updates that screen readers should announce
 */
export function announceStatusChange(
  message: string,
  type: 'info' | 'warning' | 'error' | 'success' = 'info'
) {
  announceForAccessibility(message)
  logger.info('Accessibility', `Status announced: ${type}`, { message })
}

/**
 * Create accessible list item with proper focus management
 */
export function AccessibleListItem({
  id,
  label,
  onPress,
  children,
  style,
}: {
  id: string
  label: string
  onPress: () => void
  children: React.ReactNode
  style?: any
}) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onPress()
    }
  }

  return (
    <li
      id={id}
      onClick={onPress}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      style={{
        ...style,
        minHeight: MIN_TOUCH_TARGET,
        padding: '8px 12px',
        cursor: 'pointer',
      }}
      aria-label={label}
    >
      {children}
    </li>
  )
}

/**
 * Accessible alert dialog component
 * Announces important alerts to screen readers
 */
export function AccessibleAlert({
  title,
  message,
  type = 'info',
}: {
  title: string
  message: string
  type?: 'info' | 'warning' | 'error'
}) {
  const announcement = `${type.toUpperCase()}: ${title}. ${message}`
  
  React.useEffect(() => {
    announceForAccessibility(announcement)
    logger.info('Accessibility', 'Alert announced', { title, type })
  }, [title, type, announcement])

  const roleMap = {
    info: 'status',
    warning: 'alert',
    error: 'alert',
  }

  return (
    <div
      role={roleMap[type]}
      aria-live="polite"
      aria-atomic="true"
      style={{
        padding: '12px 16px',
        borderRadius: '4px',
        backgroundColor: type === 'error' ? '#ffebee' : type === 'warning' ? '#fff3e0' : '#e8f5e9',
        color: type === 'error' ? '#c62828' : type === 'warning' ? '#e65100' : '#2e7d32',
      }}
    >
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  )
}

/**
 * Validate component accessibility
 * Use in development to check accessibility compliance
 */
export function validateAccessibility(component: React.ReactElement) {
  const checkAccessibility = () => {
    const element = component as any

    // Check for labels
    if (element.type === 'button' && !element.props['aria-label'] && !element.props.children) {
      logger.warn('Accessibility', 'Button missing label')
      return false
    }

    // Check for touch target size
    if (element.props.style) {
      const { minHeight, minWidth } = element.props.style
      if ((minHeight || 0) < MIN_TOUCH_TARGET || (minWidth || 0) < MIN_TOUCH_TARGET) {
        logger.warn('Accessibility', 'Touch target too small', {
          minHeight,
          minWidth,
          required: MIN_TOUCH_TARGET,
        })
        return false
      }
    }

    return true
  }

  if (process.env.NODE_ENV === 'development') {
    return checkAccessibility()
  }

  return true
}
