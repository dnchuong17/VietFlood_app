import React from "react"
import { View, ViewProps } from "react-native"

export interface StackProps extends ViewProps {
  direction?: "row" | "column"
  spacing?: "xs" | "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
  className?: string
}

const spacingMap: Record<string, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
}

const directionMap: Record<string, string> = {
  row: "flex-row",
  column: "flex-col",
}

/**
 * Stack Component
 *
 * A layout component for arranging children in a row or column with consistent spacing.
 * Supports responsive spacing using Tailwind gap utilities.
 */
export const Stack: React.FC<StackProps> = ({
  direction = "column",
  spacing = "md",
  children,
  className = "",
  ...viewProps
}) => {
  const directionClass = directionMap[direction]
  const spacingClass = spacingMap[spacing]

  return (
    <View
      className={`flex ${directionClass} ${spacingClass} ${className}`}
      {...viewProps}
    >
      {children}
    </View>
  )
}

/**
 * Box Component
 *
 * A basic container component for grouping content with padding and styling.
 */
export const Box: React.FC<Omit<ViewProps, "children"> & { children?: React.ReactNode }> = ({
  children,
  className = "",
  ...viewProps
}) => {
  return (
    <View
      className={`p-4 ${className}`}
      {...viewProps}
    >
      {children}
    </View>
  )
}

export default Stack
