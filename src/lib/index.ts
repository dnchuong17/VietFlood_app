// Styling exports
export { colors, spacing, borderRadius, fonts } from './styling';
export { shadows, commonStyles, layouts, typography, elevations, opacity } from './styling';
export {
  useResponsive,
  useResponsiveDimensions,
  getGridItemWidth,
  multiplySpacing,
  getResponsivePadding,
  getResponsiveFontSize,
  getThemeColor,
  darkModeColors,
} from './styling';

// Responsive layout hooks
export {
  useResponsiveLayout,
  useResponsiveSpacing,
  useResponsiveTypography,
  useResponsiveGrid,
  useResponsiveModal,
  useResponsiveList,
  useResponsiveSafeArea,
} from './useResponsiveLayout';

// Polling & Real-time hooks
export {
  usePolling,
  useOperationPolling,
  useOperationsListPolling,
  useLiveOperationStatus,
  createPollingService,
} from './hooks';

// Theme
export { ThemeProvider, useTheme } from './theme/ThemeContext';

// API & Services
export { apiClient } from './api-client';
export { reportService, operationService } from './services';

// RBAC
export { useRoleBasedAccess } from './rbac';

// Navigation
export { RootNavigator } from './navigation/RootNavigator';

// Weather
export { weatherService } from './weather-service';
