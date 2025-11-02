import { create } from 'zustand';
import knowledgeService from '../services/knowledge.service';
import { handleApiError } from '../utils/errorHandler';

/**
 * Knowledge Base Store
 * Manages knowledge articles and search
 */
const useKnowledgeStore = create((set, get) => ({
  // State
  articles: [],
  currentArticle: null,
  searchResults: [],
  isLoading: false,
  error: null,

  // Pagination
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  // Actions
  fetchArticles: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await knowledgeService.getArticles(filters);
      set({
        articles: response.data,
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

  fetchArticle: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const response = await knowledgeService.getArticle(slug);
      set({
        currentArticle: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return null;
    }
  },

  searchArticles: async (query, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await knowledgeService.searchArticles(query, filters);
      set({
        searchResults: response.data,
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

  clearCurrentArticle: () => set({ currentArticle: null }),
  clearSearchResults: () => set({ searchResults: [] }),
  clearError: () => set({ error: null }),
}));

export default useKnowledgeStore;
