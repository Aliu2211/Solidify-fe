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

  // View a resource
  viewResource: async (id) => {
    set({ error: null });
    try {
      const response = await libraryService.viewResource(id);
      if (response.success) {
        // Update the resource in the list to reflect new view count
        const resources = get().resources.map((resource) =>
          resource._id === id
            ? { ...resource, views: (resource.views || 0) + 1 }
            : resource
        );
        set({ resources });
        return response;
      } else {
        set({ error: response.message });
        return response;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to view resource";
      set({ error: errorMsg });
      return {
        success: false,
        message: errorMsg,
      };
    }
  },

  // Save/bookmark a resource
  saveResource: async (id) => {
    set({ error: null });
    try {
      const response = await libraryService.saveResource(id);
      if (response.success) {
        // Refresh saved resources
        await get().fetchMySavedResources();
        return response;
      } else {
        set({ error: response.message });
        return response;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to save resource";
      set({ error: errorMsg });
      return {
        success: false,
        message: errorMsg,
      };
    }
  },

  // Unsave/unbookmark a resource
  unsaveResource: async (id) => {
    set({ error: null });
    try {
      const response = await libraryService.unsaveResource(id);
      if (response.success) {
        // Refresh saved resources
        await get().fetchMySavedResources();
        return response;
      } else {
        set({ error: response.message });
        return response;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to unsave resource";
      set({ error: errorMsg });
      return {
        success: false,
        message: errorMsg,
      };
    }
  },

  // Fetch my saved resources
  fetchMySavedResources: async () => {
    set({ error: null });
    try {
      const response = await libraryService.getMySavedResources();
      if (response.success) {
        set({ savedResources: response.data });
        return response.data;
      } else {
        set({ error: response.message });
        return [];
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch saved resources",
      });
      return [];
    }
  },

  // Download a resource
  downloadResource: async (id, filename) => {
    set({ error: null });
    try {
      const blob = await libraryService.downloadResource(id);
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || "resource";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { success: true };
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
