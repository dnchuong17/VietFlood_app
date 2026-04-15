import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { LogBox } from 'react-native';
import { AuthProvider } from './features/auth/hooks/useAuth';
import { ThemeProvider } from './lib/theme/ThemeContext';
import { RootNavigator } from './lib/navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep splash screen visible while loading resources
SplashScreen.preventAutoHideAsync();

// Suppress known warnings in development
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load custom fonts
        await Font.loadAsync({
          // Add any custom fonts here
          // Example: 'custom-font': require('./assets/fonts/CustomFont.ttf'),
        });
      } catch (error) {
        console.error('Failed to load fonts:', error);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!fontsLoaded) {
    return null; // Remaining splash screen is still shown
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
