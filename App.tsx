import React, { useEffect } from 'react';
import "./global.css";
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppState } from 'react-native';
import AppNavigation from './src/core/Navigation/AppNavigation';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/core/Notification/ToastConfig';
import { registerForPushNotificationsAsync, scheduleRetentionReminder,  cancelRetentionReminder} from './src/core/Notification/useNotifications';
import NoNetworkOverlay from './src/core/Navigation/NoNetworkOverlay';

export default function App() {
 useEffect(() => {
    const setupApp = async () => {
      await registerForPushNotificationsAsync();
      await ScreenOrientation.unlockAsync();
      await cancelRetentionReminder();
    };

    setupApp();

    const subscription = AppState.addEventListener('change', async (nextAppState) => {
       console.log('AppState changed to:', nextAppState);
      if (nextAppState === 'background') {
        // ✅ App went to background — schedule it
        console.log('📅 Scheduling retention reminder...');
        await scheduleRetentionReminder();
      }

      if (nextAppState === 'active') {
        // ✅ User came back — cancel it
        console.log('🚫 Cancelling retention reminder...');
        await cancelRetentionReminder();
      }
    });

    return () => subscription?.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigation />
        <Toast config={toastConfig} />
        <NoNetworkOverlay />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}