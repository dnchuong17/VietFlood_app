import React from "react"
import { Text, TextInput as RNTextInput, TextInputProps as RNTextInputProps, View } from "react-native"

export interface InputProps extends RNTextInputProps {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  className?: string
}

/**
 * Input Component
 *
 * A styled text input with support for labels, error states, and validation feedback.
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = "",
  editable = true,
  ...inputProps
}) => {
  const hasError = !!error
  const borderColor = hasError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  const bgColor = editable ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-700"

  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}

      <RNTextInput
        editable={editable}
        className={`px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-base ${
          hasError ? "border-red-500 border-2" : ""
        } ${bgColor} ${className}`}
        placeholderTextColor="#9CA3AF"
        {...inputProps}
      />

      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
      {helperText && !error && (
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helperText}</Text>
      )}
    </View>
  )
}

export default Input
