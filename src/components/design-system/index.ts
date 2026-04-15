// Design System Components - Ignite Style
// All components follow Tailwind + NativeWind patterns with responsive support

// Core Layout Components
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./Button"
export { Card, type CardProps } from "./Card"
export { Input, type InputProps } from "./Input"
export { Stack, Box, type StackProps } from "./Stack"
export { SafeAreaWrapper, type SafeAreaWrapperProps } from "./SafeAreaWrapper"
export { Loading, type LoadingProps, type LoadingSize } from "./Loading"

// Legacy component exports (for backward compatibility during migration)
export { Button as ButtonLegacy } from "../Button"
export { Card as CardLegacy } from "../Card"
export { Loading as LoadingLegacy } from "../Loading"

// Design System Constants
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const

export const COLORS = {
  primary: "#3B82F6",
  secondary: "#E5E7EB",
  destructive: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  white: "#FFFFFF",
  black: "#000000",
} as const

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const
