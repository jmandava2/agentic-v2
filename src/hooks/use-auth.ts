'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService, type LoginCredentials, type User } from '@/lib/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      const user = authService.getUser();
      
      setAuthState({
        isAuthenticated,
        user,
        isLoading: false,
      });
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await authService.login(credentials);
      
      const user = authService.getUser();
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
}