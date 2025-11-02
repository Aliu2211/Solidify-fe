import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/auth.service';
import storage from '../utils/storage';
import { handleApiError, handleApiSuccess } from '../utils/errorHandler';

/**
 * Authentication Store
 * Manages user authentication state, tokens, and auth operations
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: storage.getUser(),
      isAuthenticated: storage.isAuthenticated(),
      isLoading: false,
      error: null,

      // Actions
      login: async (identifier, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(identifier, password);
          const { user, accessToken, refreshToken } = response.data;

          // Store tokens
          storage.setTokens(accessToken, refreshToken);
          storage.setUser(user);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          handleApiSuccess('Login successful!');
          return { success: true, user };
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          const { user, accessToken, refreshToken } = response.data;

          // Store tokens
          storage.setTokens(accessToken, refreshToken);
          storage.setUser(user);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          handleApiSuccess('Registration successful!');
          return { success: true, user };
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          await authService.changePassword(currentPassword, newPassword);
          set({ isLoading: false, error: null });
          handleApiSuccess('Password changed successfully!');
          return { success: true };
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.forgotPassword(email);
          set({ isLoading: false, error: null });
          handleApiSuccess('Password reset link sent to your email!');
          return { success: true, message: response.message };
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      resetPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.resetPassword(token, newPassword);
          set({ isLoading: false, error: null });
          handleApiSuccess('Password reset successful! You can now login.');
          return { success: true, message: response.message };
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        storage.clearAll();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
        handleApiSuccess('Logged out successfully');
      },

      refreshUser: async () => {
        try {
          const response = await authService.getCurrentUser();
          const user = response.data;
          storage.setUser(user);
          set({ user });
          return user;
        } catch (error) {
          handleApiError(error);
          return null;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
