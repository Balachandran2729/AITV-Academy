import React, { useEffect } from 'react';
import "./global.css";
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './src/core/Navigation/AppNavigation';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/core/Notification/ToastConfig';
import { registerForPushNotificationsAsync, scheduleRetentionReminder } from './src/core/Notification/useNotifications';
import NoNetworkOverlay from './src/core/Navigation/NoNetworkOverlay';

export default function App() {

  // Set up notifications when the app starts
  useEffect(() => {
    const setupApp = async () => {
      // Request permission safely
      const hasPermission = await registerForPushNotificationsAsync();
      await ScreenOrientation.unlockAsync();
      
      // If the user grants permission, set/reset the 24-hour "Come back" reminder
      if (hasPermission) {
        await scheduleRetentionReminder();
      }
    };

    setupApp();
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