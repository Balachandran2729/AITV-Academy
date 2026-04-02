import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  _id?: string | null;
  username?: string | null;
  email?: string | null;
  avatar?: {
    url?: string | null;
    localPath?: string | null;
    _id?: string | null;
  } | null;
  role?: string | null;
  loginType?: string | null;
  isEmailVerified?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  __v?: number | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isInitialized: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  setIsInitialized: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  saveTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  loadTokens: () => Promise<void>;
  clearAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isInitialized: false,
  isLoading: false,

  setUser: (user) => set({ user }),
  
  setTokens: (accessToken, refreshToken) => 
    set({ accessToken, refreshToken }),

  setIsInitialized: (value) => set({ isInitialized: value }),
  
  setIsLoading: (value) => set({ isLoading: value }),

  saveTokens: async (accessToken: string, refreshToken: string) => {
    try {
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      set({ accessToken, refreshToken });
    } catch (error) {
      console.log('Error saving tokens:', error);
    }
  },

  loadTokens: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      
      if (accessToken && refreshToken) {
        set({ accessToken, refreshToken });
      }
    } catch (error) {
      console.log('Error loading tokens:', error);
    }
  },

  clearAuth: async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      set({ 
        accessToken: null, 
        refreshToken: null, 
        user: null 
      });
    } catch (error) {
      console.log('Error clearing tokens:', error);
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      set({ 
        accessToken: null, 
        refreshToken: null, 
        user: null 
      });
    } catch (error) {
      console.log('Error during logout:', error);
    }
  },
}));
