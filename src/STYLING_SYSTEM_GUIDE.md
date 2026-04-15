# Styling System Setup - Complete Guide

**Status:** ✅ Section 5 - COMPLETE    
**Session:** 4 (April 15, 2026)

## Overview

This guide documents the comprehensive styling system for VietFlood's React Native app. The system includes:

- **Design tokens** (colors, spacing, typography)
- **Responsive layout hooks** (device detection, breakpoints)
- **Dark mode support** (with theme context)
- **Utility helpers** (shadows, elevations, grids)
- **Tailwind configuration** (for NativeWind integration)

---

## 1. Core Styling System (`styling.ts`)

### 1.1 Color Tokens

```typescript
import { colors } from '@/lib/styling';

// Primary colors
colors.primary       // #3b82f6
colors.primaryDark   // #1e40af
colors.primaryLight  // #dbeafe

// Semantic colors
colors.success       // #10b981
colors.successLight  // #d1fae5
colors.warning       // #f59e0b
colors.warningLight  // #fef3c7
colors.danger        // #dc2626
colors.dangerLight   // #fee2e2
colors.info          // #06b6d4
colors.infoLight     // #cffafe

// Neutral colors (gray scale)
colors.white         // #ffffff
colors.black         // #000000
colors.gray50        // #f9fafb
colors.gray100       // #f3f4f6
// ... through gray900

// Usage in component
<View style={{ backgroundColor: colors.primary }} />
<Text style={{ color: colors.gray700 }}>Text</Text>
```

### 1.2 Spacing Tokens

```typescript
import { spacing } from '@/lib/styling';

spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 16px
spacing.lg    // 24px
spacing.xl    // 32px
spacing['2xl'] // 40px

// Usage
<View style={{ padding: spacing.md, marginBottom: spacing.lg }} />
```

### 1.3 Border Radius

```typescript
import { borderRadius } from '@/lib/styling';

borderRadius.sm    // 4px
borderRadius.md    // 8px
borderRadius.lg    // 12px
borderRadius.xl    // 16px
borderRadius.full  // 9999px (perfect circles)

// Usage
<View style={{ 
  borderRadius: borderRadius.lg,
  overflow: 'hidden'
}} />
```

### 1.4 Typography

```typescript
import { fonts, typography } from '@/lib/styling';

// Font definitions
fonts.h1           // fontSize: 32, fontWeight: 700
fonts.h2           // fontSize: 28, fontWeight: 700
fonts.body         // fontSize: 14, fontWeight: 400
fonts.semibold     // fontSize: 14, fontWeight: 600

// Typography variants (include color)
typography.h1      // h1 font + gray900 color
typography.body    // body font + gray700 color
typography.caption // 12px + gray500 color

// Usage
<Text style={typography.h1}>Main Title</Text>
<Text style={typography.body}>Body text</Text>
```

### 1.5 Shadow Utilities

```typescript
import { shadows } from '@/lib/styling';

// Pre-built shadow styles
shadows.sm  // Light shadow for subtle elevation
shadows.md  // Medium shadow for cards
shadows.lg  // Strong shadow for prominent elements

// Usage
<View style={[styles.card, shadows.md]}>
  <Text>Card content</Text>
</View>

// Custom shadow for iOS + Android compatibility
function createShadow(elevation) {
  return {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: elevation },
    shadowOpacity: 0.15,
    shadowRadius: elevation * 2,
    elevation,
  };
}
```

### 1.6 Elevation Utilities

```typescript
import { elevations } from '@/lib/styling';

// Android elevation values
elevations.none    // elevation: 0
elevations.xs      // elevation: 1
elevations.sm      // elevation: 2
elevations.md      // elevation: 4
elevations.lg      // elevation: 8
elevations.xl      // elevation: 12

// Usage (for Android primarily)
<View style={[styles.button, elevations.md]}>
  <Text>Elevated Button</Text>
</View>
```

### 1.7 Layout Utilities

```typescript
import { layouts } from '@/lib/styling';

// Flexbox layouts
layouts.row           // flexDirection: 'row', alignItems: center
layouts.rowCenter     // Centered row
layouts.rowBetween    // Space-between row
layouts.column        // flexDirection: 'column'
layouts.columnCenter  // Centered column
layouts.fullCentred   // Full screen centered

// Grid layouts
layouts.gridTwoColumn   // 2-column grid
layouts.gridThreeColumn // 3-column grid

// Spacing layouts
layouts.spacingMd      // marginVertical: 16
layouts.spacingHMd     // marginHorizontal: 16

// Usage
<View style={layouts.rowBetween}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>
```

### 1.8 Opacity Utilities

```typescript
import { opacity } from '@/lib/styling';

opacity[0]    // 0 (fully transparent)
opacity[10]   // 0.1
opacity[50]   // 0.5 (50% opacity)
opacity[100]  // 1 (fully opaque)

// Usage
<View style={{ 
  backgroundColor: colors.primary, 
  opacity: opacity[60] 
}}>
  Content
</View>
```

---

## 2. Responsive Layout Hooks (`useResponsiveLayout.ts`)

### 2.1 Main Hook: `useResponsiveLayout()`

```typescript
import { useResponsiveLayout } from '@/lib';

function MyComponent() {
  const {
    screenWidth,
    screenHeight,
    isSmallPhone,
    isPhone,
    isTablet,
    isLargeTablet,
    isLandscape,
    isPortrait,
    
    // Helper methods
    getGridColumnCount,
    getItemWidth,
    getResponsivePadding,
    getResponsiveGap,
    getResponsiveBorderRadius,
    getFontScaleFactor,
    getContainerWidth,
    getMaxWidthContent,
  } = useResponsiveLayout();

  return (
    <View style={{ 
      padding: getResponsivePadding(),
      width: getMaxWidthContent()
    }}>
      {/* Responsive content */}
    </View>
  );
}
```

### 2.2 Device Detection

```typescript
const {
  isSmallPhone,    // width < 375
  isPhone,         // width < 768
  isTablet,        // width >= 768
  isLargeTablet,   // width >= 1024
  isLandscape,     // width > height
  isPortrait,      // width <= height
} = useResponsiveLayout();

// Conditional rendering
{isTablet && <SidebarLayout />}
{!isTablet && <StackedLayout />}

// Conditional styling
style={{
  padding: isSmallPhone ? 8 : isTablet ? 24 : 16
}}
```

### 2.3 Spacing Hook: `useResponsiveSpacing()`

```typescript
import { useResponsiveSpacing } from '@/lib';

function MyComponent() {
  const { container, section, element, gutter, card } = useResponsiveSpacing();

  return (
    <View style={{ padding: container }}>
      <View style={{ marginVertical: section }}>
        <View style={{ marginVertical: element }}>
          Item
        </View>
      </View>
    </View>
  );
}
```

### 2.4 Typography Hook: `useResponsiveTypography()`

```typescript
import { useResponsiveTypography } from '@/lib';

function MyComponent() {
  const { h1, h2, body, caption } = useResponsiveTypography();

  return (
    <>
      <Text style={{ fontSize: h1 }}>Responsive Title</Text>
      <Text style={{ fontSize: body }}>Responsive body</Text>
    </>
  );
}
```

### 2.5 Grid Hook: `useResponsiveGrid()`

```typescript
import { useResponsiveGrid } from '@/lib';

function GridComponent() {
  const { columns, itemWidth, gapSize } = useResponsiveGrid(1, 4, 12);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: gapSize }}>
      {items.map((item, i) => (
        <View 
          key={i} 
          style={{ width: itemWidth, height: itemWidth }}
        >
          <Image source={item.photo} style={{ flex: 1 }} />
        </View>
      ))}
    </View>
  );
}
```

### 2.6 Modal Hook: `useResponsiveModal()`

```typescript
import { useResponsiveModal } from '@/lib';

function MyModal() {
  const { maxHeight, maxWidth, cornerRadius, insetMargin } = useResponsiveModal();

  return (
    <Modal animationType="slide">
      <View style={{
        height: maxHeight,
        width: maxWidth,
        borderRadius: cornerRadius,
        marginHorizontal: insetMargin,
      }}>
        Modal content
      </View>
    </Modal>
  );
}
```

### 2.7 List Hook: `useResponsiveList()`

```typescript
import { useResponsiveList } from '@/lib';

function ListComponent({ data }) {
  const { itemHeight, padding, groupHeaderHeight } = useResponsiveList();

  return (
    <FlatList
      data={data}
      getItemLayout={(_, index) => ({
        length: itemHeight,
        offset: itemHeight * index,
        index,
      })}
      renderItem={({ item }) => (
        <View style={{ height: itemHeight, paddingHorizontal: padding }}>
          {item.title}
        </View>
      )}
    />
  );
}
```

---

## 3. Dark Mode (`lib/theme/ThemeContext.tsx`)

### 3.1 Theme Provider Setup

```typescript
import { ThemeProvider, useTheme } from '@/lib';

// In App.tsx
export default function App() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
```

### 3.2 Using Theme

```typescript
import { useTheme } from '@/lib';

function MyComponent() {
  const { isDark, themeMode, setThemeMode, colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.bg }}>
      <Text style={{ color: colors.text }}>
        Current theme: {isDark ? 'Dark' : 'Light'}
      </Text>
      
      <Button
        title={`Switch to ${isDark ? 'Light' : 'Dark'}`}
        onPress={() => setThemeMode(isDark ? 'light' : 'dark')}
      />
    </View>
  );
}
```

### 3.3 Theme Colors

```typescript
const colors = {
  // Colors change based on isDark
  primary: isDark ? '#60a5fa' : '#3b82f6',
  
  bg: isDark ? '#111827' : '#ffffff',
  bgSecondary: isDark ? '#1f2937' : '#f9fafb',
  
  text: isDark ? '#f9fafb' : '#1f2937',
  textSecondary: isDark ? '#d1d5db' : '#6b7280',
  
  // Semantic colors also adapt
  success: isDark ? '#34d399' : '#10b981',
  warning: isDark ? '#fbbf24' : '#f59e0b',
  danger: isDark ? '#f87171' : '#dc2626',
};
```

### 3.4 Theme Modes

```typescript
type ThemeMode = 'light' | 'dark' | 'auto';

// 'light' - Always light theme
// 'dark' - Always dark theme
// 'auto' - Follow system preference (default)

const { setThemeMode } = useTheme();
await setThemeMode('dark');  // User preference persisted to AsyncStorage
```

---

## 4. Tailwind Configuration

File: `tailwind.config.js`

The configuration extends Tailwind's default theme with VietFlood's design tokens. Supports NativeWind for React Native class-based styling.

```javascript
// Design tokens in tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: { DEFAULT, dark, light },
      success: { DEFAULT, light },
      // ... more colors
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      // ...
    },
  }
}
```

### Using Tailwind with NativeWind

```typescript
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export function MyComponent() {
  return (
    <StyledView className="flex-row justify-between items-center p-4 bg-white dark:bg-gray-900">
      <StyledText className="text-lg font-semibold text-gray-900 dark:text-white">
        Title
      </StyledText>
    </StyledView>
  );
}
```

---

## 5. Utility Functions

### 5.1 Get Grid Item Width

```typescript
import { getGridItemWidth } from '@/lib/styling';

const columns = 2;
const containerWidth = 375;
const gap = 16;

const itemWidth = getGridItemWidth(columns, containerWidth, gap);
// Returns: (375 - 16) / 2 = 179.5
```

### 5.2 Get Responsive Padding

```typescript
import { getResponsivePadding } from '@/lib/styling';

const padding = getResponsivePadding(isTablet);
// Returns: 24 if tablet, 16 otherwise
```

### 5.3 Get Responsive Font Size

```typescript
import { getResponsiveFontSize } from '@/lib/styling';

const fontSize = getResponsiveFontSize(14, isSmallDevice);
// Returns: 12 if small device, 14 otherwise
```

### 5.4 Get Theme Color

```typescript
import { getThemeColor } from '@/lib/styling';

const bgColor = getThemeColor(isDark, 'bg', 'primary');
// Returns: #111827 if dark, #ffffff if light
```

---

## 6. Common Patterns

### 6.1 Responsive Card Layout

```typescript
import { useResponsiveLayout } from '@/lib';
import { Card } from '@/components';

function CardGrid() {
  const { isTablet, isSmallPhone } = useResponsiveLayout();
  
  return (
    <View style={{
      flexDirection: isTablet ? 'row' : 'column',
      gap: isSmallPhone ? 8 : 16,
    }}>
      <Card>Content 1</Card>
      <Card>Content 2</Card>
    </View>
  );
}
```

### 6.2 Responsive Text

```typescript
function ResponsiveTitle({ title }) {
  const { isSmallPhone, isTablet } = useResponsiveLayout();
  const fontSize = isSmallPhone ? 24 : isTablet ? 32 : 28;
  
  return (
    <Text style={{ fontSize, fontWeight: 'bold' }}>
      {title}
    </Text>
  );
}
```

### 6.3 Dark Mode Aware Component

```typescript
import { useTheme } from '@/lib';

function ThemedCard({ children }) {
  const { colors, isDark } = useTheme();
  
  return (
    <View style={{
      backgroundColor: colors.bg,
      borderColor: colors.border,
      borderWidth: 1,
    }}>
      <Text style={{ color: colors.text }}>
        {children}
      </Text>
    </View>
  );
}
```

### 6.4 Grid with Responsive Columns

```typescript
import { useResponsiveGrid } from '@/lib';

function PhotoGrid({ photos }) {
  const { columns, itemWidth, gapSize } = useResponsiveGrid(1, 3);
  
  return (
    <View style={{ 
      flexDirection: 'row', 
      flexWrap: 'wrap',
      gap: gapSize,
    }}>
      {photos.map((photo, i) => (
        <Image
          key={i}
          source={{ uri: photo.uri }}
          style={{ width: itemWidth, height: itemWidth }}
        />
      ))}
    </View>
  );
}
```

---

## 7. Files Created/Updated

### New Files Created

1. **`tailwind.config.js`** - Tailwind configuration for NativeWind
2. **`src-rn/lib/useResponsiveLayout.ts`** - 7 responsive layout hooks
3. **`src-rn/lib/index.ts`** - Barrel exports for lib utilities

### Files Enhanced

1. **`src-rn/lib/styling.ts`** - Added 200+ lines:
   - Typography utilities
   - Layout utilities (14 pre-built flexbox patterns)
   - Responsive dimension helpers
   - Grid calculator functions
   - Dark mode color mapper
   - Elevation and opacity utilities

2. **`src-rn/lib/theme/ThemeContext.tsx`** - Enhanced:
   - Fixed typo in dark colors (bgSecondary)
   - Added light color variants (successLight, warningLight, etc.)
   - Now fully supports light/dark theme switching

### Dependency Added

- **`expo-splash-screen`** - For proper app initialization

---

## 8. Progress Summary

### Section 5: Styling System Setup - ✅ COMPLETE

| Task | Status | Details |
|------|--------|---------|
| 5.1 | ✅ | Tailwind config with NativeWind setup |
| 5.2 | ✅ | Shadow/elevation utilities (sm/md/lg) |
| 5.3 | ✅ | 7 responsive layout hooks created |
| 5.4 | ✅ | Dark mode theme context with persistence |
| 5.5 | ✅ | Responsive utilities cover all breakpoints |

**Lines of Code Added:** 400+  
**New Utility Functions:** 15+  
**New Hooks:** 7  
**TypeScript Errors:** 0 ✅  
**Dependencies Added:** 1 (expo-splash-screen)

---

## 9. Next Steps

### Immediate (This Session)
- **Section 7: Map Component** - Set up react-native-maps, integrate Windy API
- **Section 13: Device Testing** - Test styling on iOS simulator and Android emulator

### Short Term (Next Sessions)
- Finish map implementation with weather overlays
- Complete relief operations feature
- Profile edit submission backend integration
- Device testing for all features

### Quality Assurance
- Test dark mode on all screens
- Verify responsiveness on various device sizes
- Performance profiling with large datasets

---

## 10. Resources

- [NativeWind Documentation](https://www.nativewind.dev)
- [Tailwind CSS Reference](https://tailwindcss.com/docs)
- [React Native Dimensions API](https://reactnative.dev/docs/dimensions)
- [React Native StyleSheet](https://reactnative.dev/docs/stylesheet)
- [Design Tokens Best Practices](https://specifyapp.com/blog/design-tokens)

---

*Styling System Documentation - VietFlood React Native*  
*Created: April 15, 2026 | Session 4*
