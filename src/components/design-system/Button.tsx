import React from "react"
import { Pressable, PressableProps, Text, View } from "react-native"

export type ButtonVariant = "primary" | "secondary" | "destructive"
export type ButtonSize = "sm" | "md" | "lg"

export interface ButtonProps extends Omit<PressableProps, "style"> {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 dark:bg-blue-500",
  secondary: "bg-gray-200 dark:bg-gray-700",
  destructive: "bg-red-600 dark:bg-red-500",
}

const variantTextStyles: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-gray-900 dark:text-white",
  destructive: "text-white",
}

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: "px-3 py-2 rounded-md",
    text: "text-sm font-medium",
  },
  md: {
    container: "px-4 py-3 rounded-lg",
    text: "text-base font-medium",
  },
  lg: {
    container: "px-6 py-4 rounded-xl",
    text: "text-lg font-semibold",
  },
}

/**
 * Button Component
 *
 * A reusable button component with multiple variants and sizes.
 * Supports primary, secondary, and destructive variants with small, medium, and large sizes.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  className = "",
  ...pressableProps
}) => {
  const variantStyle = variantStyles[variant]
  const variantTextStyle = variantTextStyles[variant]
  const { container: sizeContainer, text: sizeText } = sizeStyles[size]

  const disabledStyle = disabled ? "opacity-50" : ""

  const containerClasses = `${sizeContainer} ${variantStyle} ${disabledStyle} ${className}`
  const textClasses = `${sizeText} ${variantTextStyle}`

  return (
    <Pressable
      disabled={disabled}
      className={containerClasses}
      {...pressableProps}
    >
      {typeof children === "string" ? (
        <Text className={textClasses}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  )
}

export default Button
