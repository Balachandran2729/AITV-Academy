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
import { useAuthStore } from '../store/authStore';
import { login } from '../services/loginLogout';
import { GoogleLogin, GithubLogin } from '../services/otherLogin';
import { showToast } from '../../../core/Notification/toastUtils';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const saveTokens = useAuthStore.getState().saveTokens;
  const setUser = useAuthStore.getState().setUser;

  const validateForm = (): boolean => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');

    if (!email) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (email.trim().length < 3) {
      setUsernameError('Username must be at least 3 characters');
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

  const handleEmailLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    showToast.loading('Logging In', 'Please wait...');

    try {
      const response = await login({
        username: email.trim(),
        password: password.trim(),
      });

      showToast.hideLoading();

      if (response.data?.success && response.data?.data) {
        const { user, accessToken, refreshToken } = response.data.data;
        if (accessToken && refreshToken) {
          await saveTokens(accessToken, refreshToken);
          setUser(user || null);
          showToast.success('Success', 'Login successful!');
          
        } else {
          showToast.error('Error', 'No tokens received from server');
        }
      } else {
        const errorMessage = response.data?.message || 'Login failed';
        showToast.error('Login Failed', errorMessage);
      }
    } catch (error: any) {
      showToast.hideLoading();
      showToast.error('Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    showToast.loading('Google Login', 'Connecting...');
    try {
      const response = await GoogleLogin();
      showToast.hideLoading();
      if (response.data?.success && response.data?.data) {
        const { user, accessToken, refreshToken } = response.data.data;
        await saveTokens(accessToken, refreshToken);
        setUser(user || null);
        showToast.success('Success', 'Google login successful!');
      }
      else if (response.data?.success === false) {
        const errorMessage = response.data?.message || 'Google login failed';
        showToast.error('Login Failed', errorMessage);
      }

    } catch (error: any) {
      showToast.hideLoading();
      showToast.error('Error', 'Google login failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    showToast.loading('GitHub Login', 'Connecting...');
    try {
      const response = await GithubLogin();
      showToast.hideLoading();
      if (response.data?.success && response.data?.data) {
        const { user, accessToken, refreshToken } = response.data.data;
        await saveTokens(accessToken, refreshToken);
        setUser(user || null);
        showToast.success('Success', 'GitHub login successful!');
      }

        else if (response.data?.success === false) {
          const errorMessage = response.data?.message || 'GitHub login failed';
          showToast.error('Login Failed', errorMessage);
        }

    } catch (error: any) {
      showToast.hideLoading();
      showToast.error('Error', 'GitHub login failed');
    } finally {
      setIsGithubLoading(false);
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
              <MaterialCommunityIcons name="shield-check" size={32} color="white" />
            </View>
            <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-500 mt-2">
              Sign in to continue your journey
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-5">
            {/* Username */}
            <View>
              <Text className="text-gray-600 font-medium ml-1 mb-2">UserName</Text>
              <View className={`flex-row items-center border rounded-2xl px-4 h-14 ${usernameError ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                <MaterialCommunityIcons name="account-outline" size={20} color={usernameError ? '#ef4444' : '#9ca3af'} />
                <TextInput
                  placeholder="username"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={(text) => { setEmail(text); if (usernameError) setUsernameError(''); }}
                  keyboardType="default"
                  autoCapitalize="none"
                  editable={!loading}
                  className="flex-1 ml-3 text-gray-900 text-base"
                />
              </View>
              {usernameError && <Text className="text-red-500 text-xs mt-1 ml-1">{usernameError}</Text>}
            </View>

            {/* Password */}
            <View>
              <Text className="text-gray-600 font-medium ml-1 mb-2">Password</Text>
              <View className={`flex-row items-center border rounded-2xl px-4 h-14 ${passwordError ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                <MaterialCommunityIcons name="lock-outline" size={20} color={passwordError ? '#ef4444' : '#9ca3af'} />
                <TextInput
                  placeholder="Enter password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={(text) => { setPassword(text); if (passwordError) setPasswordError(''); }}
                  secureTextEntry
                  editable={!loading}
                  className="flex-1 ml-3 text-gray-900 text-base"
                />
              </View>
              {passwordError && <Text className="text-red-500 text-xs mt-1 ml-1">{passwordError}</Text>}
              {/* <TouchableOpacity className="mt-3 items-end">
                <Text className="text-blue-600 font-semibold text-sm">Forgot Password?</Text>
              </TouchableOpacity> */}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              disabled={loading || isGoogleLoading || isGithubLoading}
              onPress={handleEmailLogin}
              activeOpacity={0.8}
              className={`h-14 mt-4 rounded-2xl flex-row items-center justify-center shadow-sm ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Social Divider */}
          <View className="flex-row items-center my-10">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-4 text-gray-400 font-medium">Or join with</Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          {/* Social Buttons */}
          <View className="flex-row space-x-4 mb-8">
            <TouchableOpacity
              onPress={handleGoogleLogin}
              className="flex-1 h-14 flex-row items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              {isGoogleLoading ? <ActivityIndicator size="small" color="#ea4335" /> : (
                <>
                  <MaterialCommunityIcons name="google" size={22} color="#ea4335" />
                  <Text className="ml-2 font-bold text-gray-700">Google</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGithubLogin}
              className="flex-1 h-14 flex-row items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              {isGithubLoading ? <ActivityIndicator size="small" color="#333" /> : (
                <>
                  <MaterialCommunityIcons name="github" size={22} color="#333" />
                  <Text className="ml-2 font-bold text-gray-700">GitHub</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center items-center mt-auto pb-6">
            <Text className="text-gray-500">New here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-blue-600 font-bold">Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;