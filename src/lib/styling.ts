import { StyleSheet, Dimensions } from 'react-native';

// Design tokens
export const colors = {
  // Primary
  primary: '#3b82f6',
  primaryDark: '#1e40af',
  primaryLight: '#dbeafe',

  // Semantic
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  info: '#06b6d4',
  infoLight: '#cffafe',

  // Neutral
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Component-specific colors
  text: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  bgPrimary: '#ffffff',
  bgSecondary: '#f9fafb',
  bgTertiary: '#f3f4f6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fonts = {
  regular: { fontSize: 14, fontWeight: '400' as const },
  medium: { fontSize: 14, fontWeight: '500' as const },
  semibold: { fontSize: 14, fontWeight: '600' as const },
  bold: { fontSize: 14, fontWeight: '700' as const },
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 28, fontWeight: '700' as const },
  h3: { fontSize: 24, fontWeight: '600' as const },
  h4: { fontSize: 20, fontWeight: '600' as const },
  h5: { fontSize: 16, fontWeight: '600' as const },
  h6: { fontSize: 14, fontWeight: '600' as const },
};

// Responsive utilities
export function useResponsive() {
  const window = Dimensions.get('window');
  const isSmallDevice = window.width < 375;
  const isTablet = window.width >= 768;
  const isLandscape = window.width > window.height;

  return {
    width: window.width,
    height: window.height,
    isSmallDevice,
    isTablet,
    isLandscape,
  };
}

// Shadow utilities
export const shadows = StyleSheet.create({
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});

// Common styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  flex: {
    flex: 1,
  },
});

// Typography utilities
export const typography = {
  h1: { ...fonts.h1, color: colors.gray900 },
  h2: { ...fonts.h2, color: colors.gray900 },
  h3: { ...fonts.h3, color: colors.gray900 },
  h4: { ...fonts.h4, color: colors.gray800 },
  h5: { ...fonts.h5, color: colors.gray800 },
  h6: { ...fonts.h6, color: colors.gray700 },
  body: { ...fonts.regular, color: colors.gray700 },
  bodyMedium: { ...fonts.medium, color: colors.gray700 },
  bodySemibold: { ...fonts.semibold, color: colors.gray700 },
  caption: { fontSize: 12, fontWeight: '400' as const, color: colors.gray500 },
  captionMedium: { fontSize: 12, fontWeight: '500' as const, color: colors.gray500 },
};

// Layout utilities for responsive design
export const layouts = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  innerContainer: {
    padding: spacing.md,
  },

  // Flexbox utilities
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowEvenly: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnBetween: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  fullCentred: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Grid-like layouts (2, 3, 4 columns)
  gridTwoColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridThreeColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Spacing utilities
  spacingXs: { marginVertical: spacing.xs },
  spacingSm: { marginVertical: spacing.sm },
  spacingMd: { marginVertical: spacing.md },
  spacingLg: { marginVertical: spacing.lg },
  spacingXl: { marginVertical: spacing.xl },

  spacingHXs: { marginHorizontal: spacing.xs },
  spacingHSm: { marginHorizontal: spacing.sm },
  spacingHMd: { marginHorizontal: spacing.md },
  spacingHLg: { marginHorizontal: spacing.lg },
  spacingHXl: { marginHorizontal: spacing.xl },
});

/**
 * Responsive dimensions hook
 * Usage: const { width, height, isSmall, isTablet, isLandscape } = useResponsiveDimensions();
 */
export function useResponsiveDimensions() {
  const { width, height } = Dimensions.get('window');

  return {
    widthPercent: (percent: number) => (width * percent) / 100,
    heightPercent: (percent: number) => (height * percent) / 100,
    width,
    height,
    isSmallDevice: width < 375,
    isSmallPhone: width < 414,
    isTablet: width >= 768,
    isLargeTablet: width > 1024,
    isLandscape: width > height,
    isPortrait: width <= height,
    aspect: width / height,
  };
}

/**
 * Grid size calculator - returns item width for N-column grid
 * Usage: const itemWidth = getGridItemWidth(2, containerWidth, spacing);
 */
export function getGridItemWidth(
  columns: number,
  containerWidth: number,
  gap: number = spacing.md
): number {
  const totalGap = (columns - 1) * gap;
  return (containerWidth - totalGap) / columns;
}

/**
 * Spacing multiplier utility
 * Usage: const padding = multiplySpacing(spacing.md, 2); // returns spacing.md * 2
 */
export function multiplySpacing(baseSpacing: number, multiplier: number): number {
  return baseSpacing * multiplier;
}

/**
 * Create responsive padding based on device size
 * Usage: const padding = getResponsivePadding(isTablet);
 */
export function getResponsivePadding(isTablet: boolean): number {
  return isTablet ? spacing.lg : spacing.md;
}

/**
 * Create responsive font size based on device size
 * Usage: const fontSize = getResponsiveFontSize(14, isSmallDevice);
 */
export function getResponsiveFontSize(baseSize: number, isSmallDevice: boolean): number {
  return isSmallDevice ? baseSize - 2 : baseSize;
}

// Dark mode color mapper for dark theme contexts
export const darkModeColors = {
  bg: {
    primary: colors.gray900,
    secondary: colors.gray800,
    tertiary: colors.gray700,
  },
  text: {
    primary: colors.white,
    secondary: colors.gray200,
    tertiary: colors.gray400,
  },
};

/**
 * Get colors for current theme mode
 * Usage: const textColor = getThemeColor(isDark, 'text', 'primary');
 */
export function getThemeColor(
  isDark: boolean,
  category: 'bg' | 'text',
  variant: 'primary' | 'secondary' | 'tertiary'
): string {
  const source = isDark ? darkModeColors : { bg: colors, text: colors };
  return (source as any)[category][variant];
}

// Comprehensive theme object for components
export const theme = {
  ...colors,
  sizes: fonts,
  border: borderRadius,
  radius: borderRadius,
};

// Alternative theme export for components using theme prop
export const themeConfig = {
  colors,
  fonts,
  typography,
  spacing,
  borderRadius,
  shadows: shadows.sm,
};


// Elevation helper for Android (shadow equivalent)
export const elevations = {
  none: { elevation: 0 },
  xs: { elevation: 1 },
  sm: { elevation: 2 },
  md: { elevation: 4 },
  lg: { elevation: 8 },
  xl: { elevation: 12 },
  '2xl': { elevation: 16 },
  '3xl': { elevation: 24 },
};

// Opacity utilities
export const opacity = {
  0: 0,
  5: 0.05,
  10: 0.1,
  20: 0.2,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  80: 0.8,
  90: 0.9,
  100: 1,
};
