import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { register } from '../services/register';
import { showToast } from '../../../core/Notification/toastUtils';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [loading, setLoading] = useState(false);
  
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      isValid = false;
    }

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    showToast.loading('Creating Account', 'Please wait...');

    try {
    const sendData = {username,email,password, role}
    console.log("Sending Data:", sendData);
    
      const response = await register(sendData);

      showToast.hideLoading();

      if (response.data?.success) {
        showToast.success('Success', 'Account created! Please login now.');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      } else {
        const errorMessage = response.data?.message || 'Registration failed';
        console.log("Registration failed:", response.data);
        showToast.error('Registration Failed', errorMessage);
      }
    } catch (error: any) {
      showToast.hideLoading();
      const backendMessage =error?.response?.data?.message || error.message;
      console.log("FULL ERROR:", error?.response?.data);
      showToast.error('Error', backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="mt-12 mb-10">
            <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-blue-300">
              <MaterialCommunityIcons name="account-plus-outline" size={32} color="white" />
            </View>
            <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create Account
            </Text>
            <Text className="text-base text-gray-500 mt-2">
              Join us today and get started
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-5">
            {/* Username Input */}
            <View>
              <Text className="text-gray-600 font-medium ml-1 mb-2">Username</Text>
              <View
                className={`flex-row items-center border rounded-2xl px-4 h-14 ${
                  usernameError ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <MaterialCommunityIcons
                  name="account-outline"
                  size={20}
                  color={usernameError ? '#ef4444' : '#9ca3af'}
                />
                <TextInput
                  placeholder="Choose a username"
                  placeholderTextColor="#9ca3af"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (usernameError) setUsernameError('');
                  }}
                  editable={!loading}
                  className="flex-1 ml-3 text-gray-900 text-base"
                />
              </View>
              {usernameError && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{usernameError}</Text>
              )}
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-gray-600 font-medium ml-1 mb-2">Email Address</Text>
              <View
                className={`flex-row items-center border rounded-2xl px-4 h-14 ${
                  emailError ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={emailError ? '#ef4444' : '#9ca3af'}
                />
                <TextInput
                  placeholder="name@example.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                  className="flex-1 ml-3 text-gray-900 text-base"
                />
              </View>
              {emailError && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{emailError}</Text>
              )}
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-gray-600 font-medium ml-1 mb-2">Password</Text>
              <View
                className={`flex-row items-center border rounded-2xl px-4 h-14 ${
                  passwordError ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={passwordError ? '#ef4444' : '#9ca3af'}
                />
                <TextInput
                  placeholder="Create a password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  secureTextEntry
                  editable={!loading}
                  className="flex-1 ml-3 text-gray-900 text-base"
                />
              </View>
              {passwordError && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{passwordError}</Text>
              )}
            </View>

            {/* Password Requirements Card */}
            <View className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-2 mb-2">
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons name="information-outline" size={16} color="#6b7280" />
                <Text className="text-gray-600 font-semibold ml-2 text-sm">Password Requirements</Text>
              </View>
              <Text className="text-gray-500 text-xs leading-5 ml-6">
                • Username must be at least 3 characters{'\n'}
                • Password must be at least 6 characters{'\n'}
                • Must be a valid email format
              </Text>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              disabled={loading}
              onPress={handleRegister}
              activeOpacity={0.8}
              className={`h-14 rounded-2xl flex-row items-center justify-center shadow-sm mt-2 ${
                loading ? 'bg-blue-400' : 'bg-blue-600'
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Login Link */}
          <View className="flex-row justify-center items-center mt-10 pb-6">
            <Text className="text-gray-500">Already have an account? </Text>
            <TouchableOpacity disabled={loading} onPress={() => navigation.navigate('Login')}>
              <Text className="text-blue-600 font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;