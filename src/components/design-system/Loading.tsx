import React from "react"
import { ActivityIndicator, View, ViewProps } from "react-native"

export type LoadingSize = "small" | "large"

export interface LoadingProps extends ViewProps {
  size?: LoadingSize
  color?: string
  className?: string
  full?: boolean
}

const sizeMap: Record<LoadingSize, number> = {
  small: 32,
  large: 64,
}

/**
 * Loading Component
 *
 * A spinner component for indicating loading states.
 * Supports small and large sizes with customizable color.
 */
export const Loading: React.FC<LoadingProps> = ({
  size = "large",
  color = "#3B82F6", // blue-500
  className = "",
  full = false,
  ...viewProps
}) => {
  const containerClass = full ? "flex-1 justify-center items-center" : "justify-center items-center p-4"

  return (
    <View
      className={`${containerClass} ${className}`}
      {...viewProps}
    >
      <ActivityIndicator
        size={sizeMap[size]}
        color={color}
      />
    </View>
  )
}

export default Loading
