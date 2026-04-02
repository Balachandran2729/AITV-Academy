import React, { useEffect } from 'react';
import "./global.css";
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppState } from 'react-native';
import AppNavigation from './src/core/Navigation/AppNavigation';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/core/Notification/ToastConfig';
import { 
  registerForPushNotificationsAsync, 
  scheduleRetentionReminder, 
  handleAppClosing,
  checkAndRescheduleRetentionNotification 
} from './src/core/Notification/useNotifications';
import NoNetworkOverlay from './src/core/Navigation/NoNetworkOverlay';

export default function App() {
  useEffect(() => {
    const setupApp = async () => {
      // Request permission safely
      const hasPermission = await registerForPushNotificationsAsync();
      await ScreenOrientation.unlockAsync();
      
      // Check and potentially reschedule retention notification when app opens
      await checkAndRescheduleRetentionNotification();
      
      // If the user grants permission, set/reset the 24-hour "Come back" reminder
      if (hasPermission) {
        await scheduleRetentionReminder();
      }
    };

    setupApp();

    // Handle app state changes to detect when app is going to background/close
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Note: AppState might not catch hard app termination reliably
        // The main solution is proper scheduling with unique identifiers
        handleAppClosing();
      }
    });

    return () => {
      subscription?.remove();
    };
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