import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-600">
        Home Screen
      </Text>
      <Text className="text-gray-500 mt-2">
        Welcome back!
      </Text>
    </SafeAreaView>
  );
}

export default HomeScreen;
