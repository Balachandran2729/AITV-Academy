import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';

import { useAuthStore } from '../../Auth/store/authStore';
import { logout as logoutService } from '../../Auth/services/loginLogout';
import { showToast } from '../../../core/Notification/toastUtils';
import { changeAvatar } from '../services/changeAvatar';

const ProfileScreen = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null); // State to hold selected local image
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now()); // Force image reload with unique timestamp
  
  // Extract setUser assuming your authStore has a way to update the user data
  const { user, setUser } = useAuthStore();

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      showToast.error('Error', result.errorMessage || 'Failed to open image picker');
      return;
    }

    if (result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSaveAvatar = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    showToast.loading('Uploading', 'Saving new avatar...');

    try {
      const response = await changeAvatar(selectedImage);

      showToast.hideLoading();

      if (response.success && response.data) {
        showToast.success('Success', 'Avatar updated successfully!');
      
        if (setUser) {
           // Merge new data with existing user to preserve all fields
           setUser({ ...user, ...response.data } as any);
        }
        
        // Force image reload with a fresh timestamp
        setAvatarTimestamp(Date.now());
        
        // Clear selected image AFTER updating user to ensure avatar displays correctly
        setSelectedImage(null);
      } else {
        showToast.error('Upload Failed', response.message || 'Could not save avatar');
      }
    } catch (error: any) {
      showToast.hideLoading();
      showToast.error('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const cancelImageSelection = () => {
    setSelectedImage(null);
  };

  const handleLogout = async () => {
    showToast.confirm(
      'Logout',
      'Are you sure you want to logout?',
      async () => {
        setIsLoggingOut(true);
        showToast.loading('Logging Out', 'Please wait...');
        try {
          const response = await logoutService();
          
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('refreshToken');
          
          if (response.data?.success === false) {
            showToast.hideLoading();
            showToast.error('Error', response.data.message || 'Failed to logout');
            setIsLoggingOut(false);
            return;
          }
          
          const { clearAuth } = useAuthStore.getState();
          clearAuth();
          
          showToast.hideLoading();
          showToast.success('Success', 'Logged out successfully');
        } catch (error: any) {
          showToast.hideLoading();
          showToast.error('Error', error.message || 'Failed to logout');
          setIsLoggingOut(false);
        }
      },
      () => {}, // Cancel action
      { confirmText: 'LOGOUT', cancelText: 'CANCEL' }
    );
  };

  // Determine which image to show: locally selected one OR server avatar OR default icon
  // Add timestamp to avatar URL as cache buster to force image reload
  const displayImageUri = selectedImage 
    ? selectedImage.uri 
    : user?.avatar?.url 
      ? `${user.avatar.url}?t=${avatarTimestamp}` 
      : null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header Title */}
        <View className="px-6 pt-6 pb-2">
          <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile</Text>
        </View>

        {user ? (
          <View className="px-6">
            
            {/* Centered Avatar & Basic Info */}
            <View className="items-center mt-6 mb-8">
              <View className="relative">
                {/* Avatar Image/Icon Container */}
                <View className="w-28 h-28 rounded-full bg-indigo-100 items-center justify-center border-4 border-white shadow-sm mb-4">
                  {displayImageUri ? (
                    <Image 
                      key={`avatar-${avatarTimestamp}`}
                      source={{ uri: displayImageUri }} 
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <MaterialCommunityIcons name="account" size={48} color="#6366f1" />
                  )}
                </View>

                {/* Floating Edit Icon */}
                <TouchableOpacity 
                  onPress={handleImagePick}
                  activeOpacity={0.8}
                  className="absolute bottom-4 right-0 bg-indigo-600 w-8 h-8 rounded-full items-center justify-center border-2 border-white shadow-sm"
                >
                  <MaterialCommunityIcons name="camera-plus" size={16} color="white" />
                </TouchableOpacity>
              </View>

              <Text className="text-2xl font-bold text-gray-900">{user.username || 'User'}</Text>
              <Text className="text-base text-gray-500 mt-1">{user.email}</Text>

              {/* Conditionally Rendered Save/Cancel Buttons */}
              {selectedImage && (
                <View className="flex-row mt-4 space-x-3">
                  <TouchableOpacity 
                    disabled={isUploading}
                    onPress={cancelImageSelection}
                    className="px-6 py-2 bg-gray-200 rounded-xl justify-center items-center"
                  >
                    <Text className="text-gray-700 font-semibold">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    disabled={isUploading}
                    onPress={handleSaveAvatar}
                    className="px-6 py-2 bg-green-600 rounded-xl flex-row justify-center items-center shadow-sm"
                  >
                    {isUploading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <MaterialCommunityIcons name="check" size={18} color="white" />
                        <Text className="text-white font-semibold ml-1">Save Avatar</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Detailed Info Card */}
            <View className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 mb-8">
              <View className="flex-row items-center justify-between p-4 border-b border-gray-50">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                    <MaterialCommunityIcons name="shield-account-outline" size={20} color="#3b82f6" />
                  </View>
                  <Text className="text-gray-700 font-medium text-base">Account Role</Text>
                </View>
                <Text className="text-gray-900 font-semibold capitalize">{user.role || 'User'}</Text>
              </View>

              <View className="flex-row items-center justify-between p-4 border-b border-gray-50">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center mr-3">
                    <MaterialCommunityIcons name="login" size={20} color="#8b5cf6" />
                  </View>
                  <Text className="text-gray-700 font-medium text-base">Login Method</Text>
                </View>
                <Text className="text-gray-900 font-semibold capitalize">{user.loginType || 'Email'}</Text>
              </View>

              <View className="flex-row items-center justify-between p-4 border-b border-gray-50">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center mr-3">
                    <MaterialCommunityIcons name="email-check-outline" size={20} color="#10b981" />
                  </View>
                  <Text className="text-gray-700 font-medium text-base">Email Status</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${user.isEmailVerified ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  <Text className={`text-xs font-bold ${user.isEmailVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                    {user.isEmailVerified ? 'VERIFIED' : 'PENDING'}
                  </Text>
                </View>
              </View>

              {user.createdAt && (
                <View className="flex-row items-center justify-between p-4">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mr-3">
                      <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#f97316" />
                    </View>
                    <Text className="text-gray-700 font-medium text-base">Joined On</Text>
                  </View>
                  <Text className="text-gray-900 font-semibold">
                    {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              )}
            </View>

          </View>
        ) : (
          <View className="px-6 py-20 items-center justify-center">
            <MaterialCommunityIcons name="account-search-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 font-medium mt-4 text-lg">No user information available</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="px-6 space-y-4">
          <TouchableOpacity
            disabled={isLoggingOut || isUploading}
            onPress={handleLogout}
            activeOpacity={0.8}
            className={`flex-row items-center justify-center h-14 rounded-2xl border-2 ${
              isLoggingOut ? 'border-red-200 bg-red-50' : 'border-red-100 bg-red-50'
            }`}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color="#dc2626" />
            ) : (
              <>
                <MaterialCommunityIcons name="logout-variant" size={22} color="#dc2626" />
                <Text className="text-red-600 font-bold text-lg ml-2">Logout</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;