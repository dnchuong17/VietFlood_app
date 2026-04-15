import React from "react"
import { View, ViewProps } from "react-native"

export interface CardProps extends ViewProps {
  children: React.ReactNode
  variant?: "default" | "elevated" | "outlined"
  className?: string
}

const variantStyles: Record<string, string> = {
  default: "bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700",
  elevated: "bg-white dark:bg-gray-900 rounded-lg shadow-md shadow-black/10 dark:shadow-black/30",
  outlined: "bg-transparent border-2 border-blue-600 dark:border-blue-400 rounded-lg",
}

/**
 * Card Component
 *
 * A container component for grouping related content.
 * Supports three variants: default (bordered), elevated (shadowed), and outlined.
 */
export const Card: React.FC<CardProps> = ({
  variant = "default",
  children,
  className = "",
  ...viewProps
}) => {
  const variantStyle = variantStyles[variant]

  return (
    <View
      className={`p-4 ${variantStyle} ${className}`}
      {...viewProps}
    >
      {children}
    </View>
  )
}

export default Card
