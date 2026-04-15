import { useWindowDimensions } from 'react-native';
import { spacing } from './styling';

/**
 * Hook for responsive layout patterns
 * Provides device dimensions and breakpoint detection
 */
export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = width < 375;
  const isPhone = width < 768;
  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;
  const isLandscape = width > height;
  const isPortrait = width <= height;

  return {
    // Dimensions
    screenWidth: width,
    screenHeight: height,
    aspect: width / height,

    // Device type
    isSmallPhone,
    isPhone,
    isTablet,
    isLargeTablet,
    isLandscape,
    isPortrait,

    // Device classification
    isMobile: isPhone,
    isLarge: isTablet,

    // Helper methods
    getGridColumnCount: () => {
      if (isSmallPhone) return 1;
      if (isPhone) return 2;
      if (isTablet) return 3;
      return 4;
    },

    getItemWidth: (columns: number) => {
      const gap = spacing.md;
      const totalGap = (columns - 1) * gap;
      return (width - spacing.md * 2 - totalGap) / columns;
    },

    getResponsivePadding: () => {
      if (isSmallPhone) return spacing.sm;
      if (isTablet) return spacing.lg;
      return spacing.md;
    },

    getResponsiveGap: () => {
      if (isSmallPhone) return spacing.sm;
      return spacing.md;
    },

    getResponsiveBorderRadius: () => {
      if (isSmallPhone) return 8;
      if (isTablet) return 12;
      return 10;
    },

    getFontScaleFactor: () => {
      if (isSmallPhone) return 0.85;
      if (isTablet) return 1.1;
      return 1;
    },

    getContainerWidth: () => {
      // Returns usable width for content
      const padding = width < 768 ? spacing.md : spacing.lg;
      return width - padding * 2;
    },

    getMaxWidthContent: () => {
      // Tablet-optimized: limit max width and center
      const maxWidth = 700;
      return isTablet ? Math.min(width - spacing.lg * 2, maxWidth) : width - spacing.md * 2;
    },
  };
}

/**
 * Hook for responsive spacing
 * Returns spacing values adjusted for device size
 */
export function useResponsiveSpacing() {
  const { isSmallPhone, isTablet } = useResponsiveLayout();

  return {
    container: isSmallPhone ? spacing.sm : isTablet ? spacing.lg : spacing.md,
    section: isSmallPhone ? spacing.md : isTablet ? spacing.xl : spacing.lg,
    element: isSmallPhone ? spacing.xs : spacing.sm,
    gutter: isSmallPhone ? spacing.sm : spacing.md,
    card: isSmallPhone ? spacing.sm : spacing.md,
  };
}

/**
 * Hook for responsive typography
 * Returns font sizes adjusted for device size
 */
export function useResponsiveTypography() {
  const { isSmallPhone, isTablet, screenWidth } = useResponsiveLayout();

  const scaleFactor = isSmallPhone ? 0.9 : isTablet ? 1.1 : 1;

  return {
    h1: Math.round(32 * scaleFactor),
    h2: Math.round(28 * scaleFactor),
    h3: Math.round(24 * scaleFactor),
    h4: Math.round(20 * scaleFactor),
    h5: Math.round(16 * scaleFactor),
    h6: Math.round(14 * scaleFactor),
    body: Math.round(14 * scaleFactor),
    bodySmall: Math.round(12 * scaleFactor),
    caption: Math.round(11 * scaleFactor),
    button: Math.round(14 * scaleFactor),
  };
}

/**
 * Hook for responsive grid layout
 * Calculates column count and item dimensions for n-column grid
 */
export function useResponsiveGrid(
  minColumns: number = 1,
  maxColumns: number = 4,
  gapSize: number = spacing.md
) {
  const { screenWidth, isSmallPhone, isPhone, isTablet, isLargeTablet } =
    useResponsiveLayout();

  let columns = minColumns;
  if (isLargeTablet) columns = maxColumns;
  else if (isTablet) columns = Math.min(3, maxColumns);
  else if (isPhone) columns = Math.min(2, maxColumns);
  else if (isSmallPhone) columns = 1;

  const containerWidth = screenWidth - spacing.md * 2;
  const totalGap = (columns - 1) * gapSize;
  const itemWidth = (containerWidth - totalGap) / columns;

  return {
    columns,
    itemWidth,
    gapSize,
    containerWidth,
    itemHeight: itemWidth, // For square grids
  };
}

/**
 * Hook for responsive bottom sheet/modal
 * Calculates dimensions for modals based on device
 */
export function useResponsiveModal() {
  const { screenHeight, screenWidth, isTablet } = useResponsiveLayout();

  return {
    maxHeight: Math.min(screenHeight * 0.9, isTablet ? 600 : screenHeight),
    maxWidth: isTablet ? Math.min(screenWidth * 0.8, 500) : screenWidth * 0.95,
    cornerRadius: isTablet ? 16 : 12,
    insetMargin: isTablet ? spacing.xl : spacing.md,
  };
}

/**
 * Hook for responsive list
 * Calculates row height and item dimensions for lists
 */
export function useResponsiveList() {
  const { isSmallPhone, isTablet } = useResponsiveLayout();

  return {
    itemHeight: isSmallPhone ? 56 : 64,
    separatorHeight: 1,
    padding: isSmallPhone ? spacing.sm : isTablet ? spacing.lg : spacing.md,
    horizontalPadding: isSmallPhone ? spacing.sm : spacing.md,
    groupHeaderHeight: isSmallPhone ? 32 : 40,
  };
}

/**
 * Hook for responsive safe area
 * Calculates safe padding for notches and status bars
 */
export function useResponsiveSafeArea() {
  const { screenHeight, screenWidth, isLandscape } = useResponsiveLayout();

  // Typical notch sizes
  const topInset = isLandscape ? 0 : 0; // System handles via SafeAreaView
  const bottomInset = isLandscape ? 0 : 0;
  const leftInset = isLandscape ? 44 : 0;
  const rightInset = isLandscape ? 44 : 0;

  return {
    top: topInset,
    bottom: bottomInset,
    left: leftInset,
    right: rightInset,
  };
}
