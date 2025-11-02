import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * News Service
 */
class NewsService {
  /**
   * Get sustainability news articles with filters
   */
  async getNews(filters = {}) {
    const response = await api.get(API_ENDPOINTS.NEWS, {
      params: filters,
    });
    return response.data;
  }

  /**
   * Get a single news article by slug
   */
  async getNewsArticle(slug) {
    const response = await api.get(API_ENDPOINTS.NEWS_ARTICLE(slug));
    return response.data;
  }

  /**
   * Create a new news article (Admin only)
   */
  async createNews(newsData) {
    const response = await api.post(API_ENDPOINTS.NEWS, newsData);
    return response.data;
  }
}

export default new NewsService();
