import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../../Auth/store/authStore';
import { showToast } from '../../../core/Notification/toastUtils';

const ProfileScreen = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    showToast.confirm(
      'Logout',
      'Are you sure you want to logout?',
      async () => {
        setIsLoggingOut(true);
        showToast.loading('Logging Out', 'Please wait...');
        try {
          await logout();
          showToast.hideLoading();
          showToast.success('Success', 'Logged out successfully');
          // Navigation will automatically switch to auth stack
        } catch (error: any) {
          showToast.hideLoading();
          showToast.error('Error', error.message || 'Failed to logout');
          setIsLoggingOut(false);
        }
      },
      () => {
        // Cancel action
      },
      {
        confirmText: 'LOGOUT',
        cancelText: 'CANCEL',
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6 border-b border-gray-200">
          <Text className="text-3xl font-bold text-gray-900">Profile</Text>
          <Text className="text-gray-500 mt-1">Manage your account</Text>
        </View>

        {/* User Info Card */}
        {user ? (
          <View className="px-6 py-6">
            <View className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
              {/* Avatar */}
              <View className="flex-row items-center mb-4">
                <View className="w-20 h-20 rounded-full bg-blue-500 justify-center items-center">
                  {user.avatar?.url ? (
                    <Image 
                      source={{ uri: user.avatar.url }} 
                      className="w-20 h-20 rounded-full"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="account"
                      size={40}
                      color="white"
                    />
                  )}
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {user.username || 'User'}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {user.email}
                  </Text>
                </View>
              </View>

              {/* User Details */}
              <View className="mt-4 space-y-3">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="badge-account"
                    size={18}
                    color="#6366f1"
                  />
                  <Text className="text-gray-700 ml-3 flex-1">
                    <Text className="font-semibold">Role: </Text>
                    {user.role || 'user'}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="login-variant"
                    size={18}
                    color="#6366f1"
                  />
                  <Text className="text-gray-700 ml-3 flex-1">
                    <Text className="font-semibold">Login Type: </Text>
                    {user.loginType || 'email'}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="email-check"
                    size={18}
                    color="#6366f1"
                  />
                  <Text className="text-gray-700 ml-3 flex-1">
                    <Text className="font-semibold">Email Verified: </Text>
                    {user.isEmailVerified ? 'Yes' : 'No'}
                  </Text>
                </View>

                {user.createdAt && (
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="calendar"
                      size={18}
                      color="#6366f1"
                    />
                    <Text className="text-gray-700 ml-3 flex-1">
                      <Text className="font-semibold">Joined: </Text>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View className="px-6 py-6 items-center">
            <MaterialCommunityIcons name="account-alert" size={48} color="#949494" />
            <Text className="text-gray-600 mt-3">No user information available</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="px-6 py-6 space-y-3">
          {/* Edit Profile Button */}
          <TouchableOpacity
            disabled={isLoggingOut}
            className="flex-row items-center justify-center py-3 px-6 rounded-lg bg-indigo-600 mb-3"
          >
            <MaterialCommunityIcons name="pencil" size={20} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              Edit Profile
            </Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            disabled={isLoggingOut}
            onPress={handleLogout}
            className={`flex-row items-center justify-center py-3 px-6 rounded-lg ${
              isLoggingOut ? 'bg-red-300' : 'bg-red-600'
            }`}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="logout" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Logout
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
