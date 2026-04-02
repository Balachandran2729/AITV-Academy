import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { getUserData } from '../services/aboutMe';

export const useAuthInit = () => {
  const { 
    loadTokens, 
    setIsInitialized, 
    setIsLoading,
    setUser,
    accessToken,
  } = useAuthStore();

  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Load tokens from secure storage
      await loadTokens();

      // Get current tokens after loading
      const currentAccessToken = useAuthStore.getState().accessToken;

      // If tokens exist, fetch user data
      if (currentAccessToken) {
        const response = await getUserData();
        
        if (response.data?.success && response.data?.data) {
          // Update user data in store
          setUser(response.data.data);
        } else {
          // If user data fetch fails, clear auth
          await useAuthStore.getState().clearAuth();
        }
      }
    } catch (error) {
      console.log('Auth initialization error:', error);
      // If loading fails, clear auth
      await useAuthStore.getState().clearAuth();
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [loadTokens, setIsInitialized, setIsLoading, setUser]);

  useEffect(() => {
    initializeAuth();
  }, []);

  return {
    isInitialized: useAuthStore((state) => state.isInitialized),
    isLoading: useAuthStore((state) => state.isLoading),
    hasToken: !!accessToken,
  };
};
