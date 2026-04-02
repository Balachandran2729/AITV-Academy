import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';

import ProfileScreen from '../../features/Profile/screens/ProfileScreen';
import HomeScreen from '../../features/Home/screens/HomeScreens';
import CourseByIdScreen from '../../features/Home/screens/CourseByIdScreen';
import LoginScreen from '../../features/Auth/screens/LoginScreen';
import RegisterScreen from '../../features/Auth/screens/RegisterScreen';
import WebScreen from '../../features/Home/screens/WebScreen';


import SplashScreen from './SplashScreen';
import { useAuthInit } from '../../features/Auth/hooks/useAuthInit';
import { useAuthStore } from '../../features/Auth/store/authStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigation
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen as any}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen as any}
        options={{
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

// App Stack Tab Navigation
const AppTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 5,
          shadowOpacity: 0.1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={CourseStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};


const CourseStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen as any}
      />
      <Stack.Screen 
        name="CourseById" 
        component={CourseByIdScreen as any}
      />

      <Stack.Screen 
        name="Web" 
        component={WebScreen as any}
      />

    </Stack.Navigator>
  );
}

// Main Navigation Manager
const AppNavigation = () => {
  const { isInitialized, isLoading } = useAuthInit();
  const accessToken = useAuthStore((state) => state.accessToken);

  // Show splash while initializing
  if (!isInitialized || isLoading) {
    return <SplashScreen />;
  }

  // Conditional rendering: Auth Stack or App Stack based on token
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {accessToken ? (
        // User is logged in
        <Stack.Screen 
          name="AppStack" 
          component={AppTabs}
        />
      ) : (
        // User is not logged in
        <Stack.Screen 
          name="AuthStack" 
          component={AuthStack}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigation;
