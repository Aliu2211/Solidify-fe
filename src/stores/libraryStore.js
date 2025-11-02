import { create } from "zustand";
import libraryService from "../services/library.service";

const useLibraryStore = create((set, get) => ({
  // State
  resources: [],
  categories: [],
  popularResources: [],
  recommendedResources: [],
  savedResources: [],
  currentResource: null,
  isLoading: false,
  error: null,

  // Fetch all resources
  fetchResources: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await libraryService.getAllResources(params);
      if (response.success) {
        set({ resources: response.data, isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch resources",
        isLoading: false,
      });
    }
  },

  // Fetch resource by ID
  fetchResourceById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await libraryService.getResourceById(id);
      if (response.success) {
        set({ currentResource: response.data, isLoading: false });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch resource",
        isLoading: false,
      });
      return null;
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    set({ error: null });
    try {
      const response = await libraryService.getCategories();
      if (response.success) {
        set({ categories: response.data });
      } else {
        set({ error: response.message });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch categories",
      });
    }
  },

  // Fetch popular resources
  fetchPopularResources: async (limit = 10) => {
    set({ error: null });
    try {
      const response = await libraryService.getPopularResources(limit);
      if (response.success) {
        set({ popularResources: response.data });
      } else {
        set({ error: response.message });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch popular resources",
      });
    }
  },

  // Fetch recommended resources
  fetchRecommendedResources: async (limit = 10) => {
    set({ error: null });
    try {
      const response = await libraryService.getRecommendedResources(limit);
      if (response.success) {
        set({ recommendedResources: response.data });
      } else {
        set({ error: response.message });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch recommended resources",
      });
    }
  },

  // Favorite a resource
  favoriteResource: async (id) => {
    set({ error: null });
    try {
      const response = await libraryService.favoriteResource(id);
      if (response.success) {
        // Refresh favorites
        await get().fetchMyFavorites();
        return response;
      } else {
        set({ error: response.message });
        return response;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to favorite resource";
      set({ error: errorMsg });
      return {
        success: false,
        message: errorMsg,
      };
    }
  },

  // Unfavorite a resource
  unfavoriteResource: async (id) => {
    set({ error: null });
    try {
      const response = await libraryService.unfavoriteResource(id);
      if (response.success) {
        // Refresh favorites
        await get().fetchMyFavorites();
        return response;
      } else {
        set({ error: response.message });
        return response;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to unfavorite resource";
      set({ error: errorMsg });
      return {
        success: false,
        message: errorMsg,
      };
    }
  },

  // Fetch my favorite resources
  fetchMyFavorites: async () => {
    set({ error: null });
    try {
      const response = await libraryService.getMyFavorites();
      if (response.success) {
        set({ savedResources: response.data });
        return response.data;
      } else {
        set({ error: response.message });
        return [];
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch favorites",
      });
      return [];
    }
  },

  // Download a resource (get download URL - increments download count)
  downloadResource: async (id) => {
    set({ error: null });
    try {
      const response = await libraryService.downloadResource(id);
      if (response.success && response.data.downloadUrl) {
        // Open download URL in new tab or trigger download
        window.open(response.data.downloadUrl, "_blank", "noopener,noreferrer");
        return response;
      } else {
        set({ error: response.message || "Download URL not available" });
        return response;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to download resource";
      set({ error: errorMsg });
      return {
        success: false,
        message: errorMsg,
      };
    }
  },

  // Set current resource
  setCurrentResource: (resource) => set({ currentResource: resource }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useLibraryStore;
