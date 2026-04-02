import React from 'react';
import { View, Text, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons'; 
import { useNetInfo } from '@react-native-community/netinfo';

const NoNetworkOverlay = () => {
  // This hook automatically listens to network changes in real-time
  const netInfo = useNetInfo();

  // If connected is true or null (still checking), return nothing (hide the screen)
  if (netInfo.isConnected !== false) {
    return null;
  }

  // If connected is strictly false, render the full-screen warning
  return (
    <Modal transparent={false} animationType="fade" visible={true}>
      <SafeAreaView className="flex-1 bg-white">
        {/* Top Header */}
        <View className="px-4 py-4 border-b border-gray-100 items-center justify-center z-10 shadow-sm bg-white">
          <Text className="text-xl font-extrabold text-red-600 tracking-wide">
            NO Network
          </Text>
        </View>

        {/* Center Content */}
        <View className="flex-1 items-center justify-center px-8 bg-gray-50 pb-20">
          <View className="bg-red-100 p-6 rounded-full mb-6">
            <Feather name="wifi-off" size={64} color="#EF4444" />
          </View>
          
          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Connection Lost
          </Text>
          
          <Text className="text-base text-gray-500 text-center leading-relaxed">
            Please check your Wi-Fi or cellular data. The app will automatically resume once the connection is restored.
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default NoNetworkOverlay;