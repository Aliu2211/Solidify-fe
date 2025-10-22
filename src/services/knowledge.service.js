import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Knowledge Base Service
 */
class KnowledgeService {
  /**
   * Get knowledge base articles with filters
   */
  async getArticles(filters = {}) {
    const response = await api.get(API_ENDPOINTS.KNOWLEDGE_ARTICLES, {
      params: filters,
    });
    return response.data;
  }

  /**
   * Get a single article by slug
   */
  async getArticle(slug) {
    const response = await api.get(API_ENDPOINTS.KNOWLEDGE_ARTICLE(slug));
    return response.data;
  }

  /**
   * Search knowledge base articles
   */
  async searchArticles(query, filters = {}) {
    const response = await api.get(API_ENDPOINTS.KNOWLEDGE_SEARCH, {
      params: { q: query, ...filters },
    });
    return response.data;
  }

  /**
   * Create a new article (Admin/Manager only)
   */
  async createArticle(articleData) {
    const response = await api.post(API_ENDPOINTS.KNOWLEDGE_ARTICLES, articleData);
    return response.data;
  }
}

export default new KnowledgeService();
