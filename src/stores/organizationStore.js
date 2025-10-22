import { create } from 'zustand';
import organizationService from '../services/organization.service';
import { handleApiError } from '../utils/errorHandler';

/**
 * Organization Store
 * Manages SME organizations for discovery and networking
 */
const useOrganizationStore = create((set, get) => ({
  // State
  organizations: [],
  currentOrganization: null,
  isLoading: false,
  error: null,

  // Filters
  filters: {
    industryType: '',
    size: '',
    location: '',
    sustainabilityLevel: null,
    search: '',
  },

  // Pagination
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },

  // Actions
  fetchOrganizations: async (customFilters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = get().filters;
      const currentPagination = get().pagination;

      const params = {
        ...currentFilters,
        ...customFilters,
        page: currentPagination.page,
        limit: currentPagination.limit,
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await organizationService.getOrganizations(params);

      set({
        organizations: response.data || [],
        pagination: response.pagination || get().pagination,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return null;
    }
  },

  fetchOrganization: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await organizationService.getOrganization(id);
      set({
        currentOrganization: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return null;
    }
  },

  setFilters: (newFilters) => {
    set({
      filters: { ...get().filters, ...newFilters },
      pagination: { ...get().pagination, page: 1 } // Reset to page 1 when filters change
    });
  },

  clearFilters: () => {
    set({
      filters: {
        industryType: '',
        size: '',
        location: '',
        sustainabilityLevel: null,
        search: '',
      },
      pagination: { ...get().pagination, page: 1 }
    });
  },

  setPage: (page) => {
    set({ pagination: { ...get().pagination, page } });
  },

  clearCurrentOrganization: () => set({ currentOrganization: null }),
  clearError: () => set({ error: null }),
}));

export default useOrganizationStore;
