import { create } from 'zustand';
import carbonService from '../services/carbon.service';
import { handleApiError, handleApiSuccess } from '../utils/errorHandler';

/**
 * Carbon Tracking Store
 * Manages carbon entries, dashboard data, roadmap, and goals
 */
const useCarbonStore = create((set, get) => ({
  // State
  entries: [],
  dashboard: null,
  roadmap: null,
  emissionFactors: [],
  isLoading: false,
  error: null,

  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  // Actions - Entries
  fetchEntries: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carbonService.getEntries(filters);
      set({
        entries: response.data,
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

  createEntry: async (entryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carbonService.createEntry(entryData);
      const newEntry = response.data;

      set((state) => ({
        entries: [newEntry, ...state.entries],
        isLoading: false,
      }));

      handleApiSuccess('Carbon entry created successfully!');
      // Refresh dashboard after creating entry
      get().fetchDashboard();
      return { success: true, data: newEntry };
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Actions - Dashboard
  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await carbonService.getDashboard();
      set({
        dashboard: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return null;
    }
  },

  // Actions - Roadmap
  fetchRoadmap: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await carbonService.getRoadmap();
      set({
        roadmap: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return null;
    }
  },

  updateMilestone: async (milestoneNumber, completed) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carbonService.updateMilestone(
        milestoneNumber,
        completed
      );

      handleApiSuccess(
        `Milestone ${completed ? 'completed' : 'marked as incomplete'}!`
      );

      // Refresh roadmap
      await get().fetchRoadmap();

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Actions - Goals
  createGoal: async (goalData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carbonService.createGoal(goalData);
      set({ isLoading: false });
      handleApiSuccess('Carbon reduction goal created!');
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Actions - Emission Factors
  fetchEmissionFactors: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await carbonService.getEmissionFactors(filters);
      set({
        emissionFactors: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useCarbonStore;
