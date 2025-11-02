import { create } from 'zustand';
import newsService from '../services/news.service';
import { handleApiError } from '../utils/errorHandler';

/**
 * News Store
 * Manages sustainability news articles
 */
const useNewsStore = create((set, get) => ({
  // State
  news: [],
  currentArticle: null,
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
  fetchNews: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await newsService.getNews(filters);
      set({
        news: response.data,
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

  fetchNewsArticle: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const response = await newsService.getNewsArticle(slug);
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

  clearCurrentArticle: () => set({ currentArticle: null }),
  clearError: () => set({ error: null }),
}));

export default useNewsStore;
