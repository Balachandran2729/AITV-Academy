import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const SplashScreen = () => {
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <MaterialCommunityIcons name="apps-box" size={80} color="#3b82f6" />
      <View className="mt-8">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    </View>
  );
};

export default SplashScreen;
