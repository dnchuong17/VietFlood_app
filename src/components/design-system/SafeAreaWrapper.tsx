import React from "react"
import { SafeAreaView, ViewProps } from "react-native"

export interface SafeAreaWrapperProps extends ViewProps {
  children: React.ReactNode
  className?: string
}

/**
 * SafeAreaWrapper Component
 *
 * Wraps content with SafeAreaView to respect device notches and safe areas.
 * Automatically handles padding for different device types.
 */
export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  className = "",
  ...safeAreaProps
}) => {
  return (
    <SafeAreaView
      className={`flex-1 bg-white dark:bg-black ${className}`}
      {...safeAreaProps}
    >
      {children}
    </SafeAreaView>
  )
}

export default SafeAreaWrapper
