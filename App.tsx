import React from 'react';
import "./global.css"
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './src/core/Navigation/AppNavigation';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/core/Notification/ToastConfig';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigation />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
