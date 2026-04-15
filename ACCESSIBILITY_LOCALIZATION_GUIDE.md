# VietFlood Accessibility & Localization Guide

## Section 18: Accessibility & Localization

Comprehensive guide for making VietFlood accessible to users with disabilities and supporting multiple languages.

---

## 18.1 Screen Reader Labels & Accessibility

### WCAG 2.1 Compliance Overview

**Levels:**
- **Level A** (basic): Minimum standard
- **Level AA** (standard): Recommended for most apps
- **Level AAA** (enhanced): Advanced accessibility

**VietFlood Target: Level AA compliance**

### Adding Screen Reader Labels

**Using accessible props in React Native:**

```typescript
// Button with accessibility label
import { AccessibilityInfo } from 'react-native'

<TouchableOpacity
  accessibilityLabel="Create new report"
  accessibilityHint="Double tap to start creating a new disaster report"
  accessibilityRole="button"
  onPress={() => navigation.navigate('CreateReport')}
>
  <Icon name="plus" size={24} />
</TouchableOpacity>
```

**TextInput accessibility:**

```typescript
<TextInput
  accessibilityLabel="Report title"
  accessibilityHint="Enter a brief title for your report (max 100 characters)"
  placeholder="Report title"
  placeholderTextColor="#999"
  maxLength={100}
/>
```

**Image accessibility:**

```typescript
<Image
  source={require('@/assets/weather-icon.png')}
  accessibilityLabel="Current weather: Rainy"
  accessibilityRole="image"
/>

// Or with semantics
<AccessibilityInfo>
  <Image
    source={require('@/assets/weather-icon.png')}
    accessible={true}
  />
  <Text>Rainy, 28°C</Text>
</AccessibilityInfo>
```

### Screen Reader Labels Best Practices

**Good labels:**
```typescript
// ✅ Clear, concise
"Create new report"
"Submit form"
"View operation details"
"Disabled: Requires location permission"

// ❌ Avoid
"Button"
"Click me"
"Icon"
""
```

**Hints for complex actions:**

```typescript
// Label: main action
// Hint: how to perform it
<TouchableOpacity
  accessibilityLabel="Sort reports"
  accessibilityHint="Double tap to see sorting options: date, location, or status"
  accessibilityRole="menuitem"
>
  <Text>Sort</Text>
</TouchableOpacity>
```

### Testing with Screen Readers

#### iOS VoiceOver (Built-in)

1. **Enable VoiceOver:**
   - Settings → Accessibility → VoiceOver
   - Turn toggle ON

2. **Navigate app:**
   - Single tap: Speak element
   - Double tap: Activate
   - 3-finger swipe: Next/previous page

3. **Test checklist:**
   - Can navigate to all interactive elements
   - All labels are descriptive
   - No visual-only information (use labels instead)

#### Android TalkBack (Built-in)

1. **Enable TalkBack:**
   - Settings → Accessibility → TalkBack
   - Turn toggle ON

2. **Navigate app:**
   - Swipe right: Next element
   - Swipe left: Previous element
   - Double tap: Activate

3. **Test checklist:**
   - All buttons have labels
   - Forms announce field names before input
   - Errors described clearly

### Implementation Patterns

**Custom accessible button:**

```typescript
// components/common/AccessibleButton.tsx
interface Props {
  label: string
  hint?: string
  onPress: () => void
  disabled?: boolean
}

export function AccessibleButton({
  label,
  hint,
  onPress,
  disabled
}: Props) {
  return (
    <TouchableOpacity
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled}
    >
      <Text>{label}</Text>
    </TouchableOpacity>
  )
}

// Usage
<AccessibleButton
  label="Submit"
  hint="Submit the form"
  onPress={handleSubmit}
  disabled={isLoading}
/>
```

**Accessible form:**

```typescript
// features/auth/components/AccessibleLoginForm.tsx
export function LoginForm() {
  return (
    <View
      accessible={true}
      accessibilityLabel="Login form"
      accessibilityRole="form"
    >
      <TextInput
        accessibilityLabel="Email address"
        accessibilityHint="Enter your email address"
        placeholder="Email"
      />
      <TextInput
        accessibilityLabel="Password"
        accessibilityHint="Enter your password"
        placeholder="Password"
        secureTextEntry
      />
      <AccessibleButton
        label="Sign in"
        hint="Submit login form"
        onPress={handleLogin}
      />
    </View>
  )
}
```

---

## 18.2 Touch Target Size & Layout

### Minimum Touch Target

**WCAG 2.1 Level AAA: 44×44 points**
- 1 point ≈ 1 pixel at standard DPI
- Ensures touchable regardless of device DPI

### Implementation

```typescript
// ✅ Good: 44×44 button
<TouchableOpacity
  style={{ width: 44, height: 44, borderRadius: 22 }}
  onPress={handlePress}
>
  <Icon name="add" size={24} />
</TouchableOpacity>

// ❌ Bad: 30×30 (too small)
<TouchableOpacity
  style={{ width: 30, height: 30 }}
  onPress={handlePress}
>
  <Icon name="add" size={16} />
</TouchableOpacity>
```

### Padding Strategy

If visual design requires small icon, add invisible padding:

```typescript
<TouchableOpacity
  style={{
    padding: 10, // Makes total size 44×44
    justifyContent: 'center',
    alignItems: 'center'
  }}
  onPress={handlePress}
>
  <Icon name="add" size={24} />
</TouchableOpacity>
```

### Spacing Between Touch Targets

**Recommend: 8 points minimum between targets**

```typescript
<View style={{ flexDirection: 'row', gap: 8 }}>
  <Button label="Cancel" onPress={() => {}} />
  <Button label="Delete" onPress={() => {}} />
  <Button label="Save" onPress={() => {}} />
</View>

// Or using margin
<Button label="Cancel" style={{ marginRight: 8 }} />
<Button label="Delete" style={{ marginRight: 8 }} />
<Button label="Save" />
```

---

## 18.3 VoiceOver & TalkBack Testing

### Automated Testing

**Using Detox testing framework:**

```typescript
// e2e/accessibility.e2e.js
describe('Accessibility Tests', () => {
  beforeAll(async () => {
    await device.launchApp()
  })

  it('should have accessible login button', async () => {
    // Check button is labeled
    await expect(element(
      by.label('Sign in')
    )).toBeVisible()
  })

  it('should have minimum touch target size', async () => {
    // Verify button size
    const metrics = await element(
      by.id('signInButton')
    ).getAttributes()
    
    expect(metrics.width).toBeGreaterThanOrEqual(44)
    expect(metrics.height).toBeGreaterThanOrEqual(44)
  })
})
```

### Manual VoiceOver Testing Protocol

**Test Cases (iOS with VoiceOver):**

| Test | Steps | Expected Result |
|------|-------|-----------------|
| **Login Screen** | 1. Enable VoiceOver<br>2. Launch app<br>3. Navigate to all elements | All elements announced with clear labels |
| **Form Input** | 1. Navigate to email field<br>2. Triple-tap to enter edit mode<br>3. Type email address | Field label announced, typing echoed |
| **Button Action** | 1. Navigate to login button<br>2. Double-tap to activate<br>3. Wait for navigation | Screen transitions announced |
| **Error Message** | 1. Submit invalid email<br>2. Check error display | Error message announced immediately |
| **Map Navigation** | 1. Navigate to home map<br>2. Use swipe gestures<br>3. Check content description | Map regions described, markers announced |

### Manual TalkBack Testing Protocol

**Test Cases (Android with TalkBack):**

| Test | Steps | Expected Result |
|------|-------|-----------------|
| **Button Labels** | 1. Enable TalkBack<br>2. Swipe right to navigate<br>3. Check each button | All buttons have descriptive labels |
| **Form Fields** | 1. Swipe to each text field<br>2. Double-tap to input<br>3. Type text | Field label announced, input accepted |
| **Tab Navigation** | 1. Swipe to navigate tabs<br>2. Double-tap active tab<br>3. Verify content changes | Tab change announced, new content described |
| **Alerts/Dialogs** | 1. Trigger alert dialog<br>2. Check announcement<br>3. Navigate options | Alert title announced, options navigable |

---

## 18.4 i18n Setup for Multi-Language Support

### i18n-js Library Setup

**Install:**
```bash
npm install i18n-js
```

**Initialize:**

```typescript
// lib/i18n/index.ts
import i18n from 'i18n-js'

// Import translations
import en from './locales/en.json'
import vi from './locales/vi.json'

i18n.translations = { en, vi }

// Set device language as default
import { getLocales } from 'expo-localization'
const deviceLanguage = getLocales()[0].languageCode
i18n.locale = deviceLanguage || 'en'

// Fallback
i18n.fallbacks['vi'] = 'en'

export { i18n }
```

### Translation File Structure

```
src/lib/i18n/
├── locales/
│   ├── en.json
│   ├── vi.json
│   └── fr.json (future)
└── index.ts
```

**English translations (en.json):**

```json
{
  "auth": {
    "email": "Email address",
    "password": "Password",
    "login": "Sign in",
    "register": "Create account",
    "errors": {
      "invalidEmail": "Please enter a valid email",
      "passwordTooShort": "Password must be at least 8 characters"
    }
  },
  "home": {
    "title": "VietFlood Dashboard",
    "weather": {
      "temperature": "Temperature",
      "windSpeed": "Wind speed",
      "rainfall": "Rainfall"
    }
  },
  "common": {
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "confirm": "Confirm",
    "close": "Close"
  }
}
```

**Vietnamese translations (vi.json):**

```json
{
  "auth": {
    "email": "Địa chỉ email",
    "password": "Mật khẩu",
    "login": "Đăng nhập",
    "register": "Tạo tài khoản",
    "errors": {
      "invalidEmail": "Vui lòng nhập email hợp lệ",
      "passwordTooShort": "Mật khẩu phải có ít nhất 8 ký tự"
    }
  },
  "home": {
    "title": "Bảng điều khiển VietFlood",
    "weather": {
      "temperature": "Nhiệt độ",
      "windSpeed": "Tốc độ gió",
      "rainfall": "Lượng mưa"
    }
  },
  "common": {
    "cancel": "Hủy",
    "save": "Lưu",
    "delete": "Xóa",
    "confirm": "Xác nhận",
    "close": "Đóng"
  }
}
```

### Using Translations

**In components:**

```typescript
import { i18n } from '@/lib/i18n'

export function LoginScreen() {
  return (
    <View>
      <TextInput
        placeholder={i18n.t('auth.email')}
      />
      <TextInput
        placeholder={i18n.t('auth.password')}
        secureTextEntry
      />
      <Button
        title={i18n.t('auth.login')}
        onPress={handleLogin}
      />
    </View>
  )
}
```

**Dynamic interpolation:**

```typescript
// In vi.json
{
  "messages": {
    "welcome": "Xin chào {{name}}, chào mừng đến VietFlood"
  }
}

// In component
const greeting = i18n.t('messages.welcome', { name: 'Nguyễn' })
// Output: "Xin chào Nguyễn, chào mừng đến VietFlood"
```

**Pluralization:**

```typescript
// In vi.json
{
  "reports": "{{count}} báo cáo|{{count}} báo cáo"
}

// In component
i18n.t('reports', { count: 1 }) // "1 báo cáo"
i18n.t('reports', { count: 5 }) // "5 báo cáo"
```

---

## 18.5 UI String Translation & Language Toggle

### Language Preference Storage

```typescript
// lib/storage/language.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

const LANGUAGE_KEY = 'app_language'

export async function getLanguage(): Promise<string> {
  const stored = await AsyncStorage.getItem(LANGUAGE_KEY)
  if (stored) return stored
  
  // Fallback to device language
  const { languageCode } = getLocales()[0]
  return languageCode || 'en'
}

export async function setLanguage(language: string) {
  await AsyncStorage.setItem(LANGUAGE_KEY, language)
  
  // Update i18n
  i18n.locale = language
  
  // Notify UI to re-render
  eventEmitter.emit('languageChanged', language)
}
```

### Language Toggle in Settings

```typescript
// features/auth/components/LanguageSelector.tsx
import { i18n } from '@/lib/i18n'
import { setLanguage } from '@/lib/storage/language'

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale)

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'fr', label: 'Français' } // Future
  ]

  const handleLanguageChange = async (code: string) => {
    await setLanguage(code)
    setCurrentLanguage(code)
  }

  return (
    <View>
      <Text>{i18n.t('common.language')}</Text>
      {languages.map(lang => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => handleLanguageChange(lang.code)}
          style={{
            backgroundColor: currentLanguage === lang.code ? '#3B82F6' : '#fff'
          }}
        >
          <Text>{lang.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
```

### Provider for Global Language Context

```typescript
// lib/providers/LocalizationProvider.tsx
import React, { createContext, useEffect, useState } from 'react'
import { i18n } from '@/lib/i18n'
import { getLanguage } from '@/lib/storage/language'

interface LocalizationContextType {
  language: string
  setLanguage: (lang: string) => Promise<void>
}

export const LocalizationContext = createContext<LocalizationContextType>({
  language: 'en',
  setLanguage: async () => {}
})

export function LocalizationProvider({ children }) {
  const [language, setLanguageState] = useState(i18n.locale)

  useEffect(() => {
    const initLanguage = async () => {
      const stored = await getLanguage()
      i18n.locale = stored
      setLanguageState(stored)
    }
    initLanguage()
  }, [])

  const setLanguage = async (lang: string) => {
    i18n.locale = lang
    setLanguageState(lang)
    await AsyncStorage.setItem('app_language', lang)
  }

  return (
    <LocalizationContext.Provider value={{ language, setLanguage }}>
      {children}
    </LocalizationContext.Provider>
  )
}

// Hook
export function useLocalization() {
  return useContext(LocalizationContext)
}
```

---

## 18.6 RTL (Right-to-Left) Language Support (Future)

### RTL Considerations

For future Arabic/Hebrew support:

```typescript
import { I18nManager } from 'react-native'

// Detect RTL language
const isRTL = ['ar', 'he', 'ur'].includes(i18n.locale)
I18nManager.forceRTL(isRTL)
I18nManager.allowRTL(true)
```

### RTL-Safe Styling

```typescript
// Use start/end instead of left/right
<View style={{
  paddingStart: 16, // Left on LTR, right on RTL
  paddingEnd: 16,
  marginStart: 8,
  marginEnd: 8
}}>
  <Text>{content}</Text>
</View>

// Flexbox with row automatically flips
<View style={{ flexDirection: 'row' }}>
  {/* Items flip order on RTL */}
</View>
```

---

## 18 Accessibility & Localization Checklist

✅ **18.1 Screen Reader Labels**
- [x] All interactive elements have labels
- [x] Hints provided for complex actions
- [x] Form fields announce labels before input
- [x] Errors described in accessibility language
- [x] Images have descriptive alt text

✅ **18.2 Touch Target Size**
- [x] All touch targets ≥ 44×44 points
- [x] Minimum 8-point spacing between targets
- [x] Invisible padding used when needed
- [x] Buttons easily tappable with thumb

✅ **18.3 Screen Reader Testing**
- [x] VoiceOver navigation tested on iOS
- [x] TalkBack navigation tested on Android
- [x] All screens navigable with screen reader
- [x] No visual-only information
- [x] Form completion possible with screen reader

✅ **18.4 i18n Setup**
- [x] i18n-js installed and configured
- [x] En and Vi translation files created
- [x] Fallback language set (English)
- [x] Pluralization and interpolation working

✅ **18.5 Language Toggle**
- [x] Language preference stored in AsyncStorage
- [x] Language selector in settings
- [x] Current language displayed clearly
- [x] Language change updates all UI
- [x] Translation files complete (95%+ coverage)

✅ **18.6 RTL Support (Planned)**
- [ ] RTL layout structure designed
- [ ] RTL-safe styling conventions documented
- [ ] Ready for future Arabic/Hebrew support

---

## Accessibility & Localization Resources

- [Apple Accessibility](https://www.apple.com/accessibility/voiceover/)
- [Google Accessibility](https://support.google.com/accessibility/android/answer/6283677)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [i18n-js Documentation](https://github.com/fnando/i18n-js)
- [Expo Localization](https://docs.expo.dev/modules/expo-localization)

---

## Testing Accessibility

**Automated testing:**
```bash
npm run test:accessibility
# Uses Detox for accessibility checks
```

**Manual testing:**
1. Enable VoiceOver/TalkBack
2. Navigate entire app
3. Test all forms and interactions
4. Check all error messages announced
5. Verify language toggle works

---

## Translation Coverage Target

| Language | Screens | Progress | Status |
|----------|---------|----------|--------|
| English | 25+ | 100% | ✅ |
| Vietnamese | 25+ | 95% | ⏳ |
| French | 25+ | 0% | 📋 Future |

---

**Status: Section 18 Complete**
- Accessibility guidelines documented
- Localization setup complete
- English & Vietnamese translations provided
- Ready for deployment
