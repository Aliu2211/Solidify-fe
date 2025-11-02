import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import requestQueue from '../utils/requestQueue';

/**
 * Admin Service
 * Handles all admin-only operations for managing courses, library, news, knowledge, and organizations
 * All requests are queued to prevent rate limiting
 */
class AdminService {
  // ============================================
  // COURSE MANAGEMENT (Admin Only)
  // ============================================

  /**
   * Get all courses with optional filtering
   */
  async getCourses(params = {}) {
    return await requestQueue.enqueue(async () => {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`${API_ENDPOINTS.ADMIN_COURSES}${queryString ? `?${queryString}` : ''}`);
      return response.data;
    });
  }

  /**
   * Get course by ID
   */
  async getCourseById(id) {
    const response = await api.get(API_ENDPOINTS.ADMIN_COURSE(id));
    return response.data;
  }

  /**
   * Create a new course
   */
  async createCourse(courseData) {
    return await requestQueue.enqueue(async () => {
      const response = await api.post(API_ENDPOINTS.ADMIN_COURSES, courseData);
      return response.data;
    });
  }

  /**
   * Update a course
   */
  async updateCourse(id, courseData) {
    return await requestQueue.enqueue(async () => {
      const response = await api.put(API_ENDPOINTS.ADMIN_COURSE(id), courseData);
      return response.data;
    });
  }

  /**
   * Delete a course (soft delete)
   */
  async deleteCourse(id) {
    return await requestQueue.enqueue(async () => {
      const response = await api.delete(API_ENDPOINTS.ADMIN_COURSE(id));
      return response.data;
    });
  }

  // ============================================
  // LIBRARY RESOURCE MANAGEMENT (Admin Only)
  // ============================================

  /**
   * Get all library resources
   */
  async getLibraryResources(params = {}) {
    return await requestQueue.enqueue(async () => {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`${API_ENDPOINTS.ADMIN_LIBRARY_RESOURCES}${queryString ? `?${queryString}` : ''}`);
      return response.data;
    });
  }

  /**
   * Get library resource by ID
   */
  async getLibraryResourceById(id) {
    const response = await api.get(API_ENDPOINTS.ADMIN_LIBRARY_RESOURCE(id));
    return response.data;
  }

  /**
   * Create a new library resource
   */
  async createLibraryResource(resourceData) {
    return await requestQueue.enqueue(async () => {
      const response = await api.post(API_ENDPOINTS.ADMIN_LIBRARY_RESOURCES, resourceData);
      return response.data;
    });
  }

  /**
   * Update a library resource
   */
  async updateLibraryResource(id, resourceData) {
    return await requestQueue.enqueue(async () => {
      const response = await api.put(API_ENDPOINTS.ADMIN_LIBRARY_RESOURCE(id), resourceData);
      return response.data;
    });
  }

  /**
   * Delete a library resource (soft delete)
   */
  async deleteLibraryResource(id) {
    return await requestQueue.enqueue(async () => {
      const response = await api.delete(API_ENDPOINTS.ADMIN_LIBRARY_RESOURCE(id));
      return response.data;
    });
  }

  // ============================================
  // NEWS MANAGEMENT (Admin Only)
  // ============================================

  /**
   * Get all news articles
   */
  async getNewsArticles(params = {}) {
    return await requestQueue.enqueue(async () => {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`${API_ENDPOINTS.ADMIN_NEWS}${queryString ? `?${queryString}` : ''}`);
      return response.data;
    });
  }

  /**
   * Get news article by ID
   */
  async getNewsArticleById(id) {
    const response = await api.get(API_ENDPOINTS.ADMIN_NEWS_ARTICLE(id));
    return response.data;
  }

  /**
   * Create a new news article
   */
  async createNewsArticle(articleData) {
    return await requestQueue.enqueue(async () => {
      const response = await api.post(API_ENDPOINTS.ADMIN_NEWS, articleData);
      return response.data;
    });
  }

  /**
   * Update a news article
   */
  async updateNewsArticle(id, articleData) {
    return await requestQueue.enqueue(async () => {
      const response = await api.put(API_ENDPOINTS.ADMIN_NEWS_ARTICLE(id), articleData);
      return response.data;
    });
  }

  /**
   * Delete a news article
   */
  async deleteNewsArticle(id) {
    return await requestQueue.enqueue(async () => {
      const response = await api.delete(API_ENDPOINTS.ADMIN_NEWS_ARTICLE(id));
      return response.data;
    });
  }

  // ============================================
  // KNOWLEDGE BASE MANAGEMENT (Admin/Manager)
  // ============================================

  /**
   * Get all knowledge articles
   */
  async getKnowledgeArticles(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`${API_ENDPOINTS.ADMIN_KNOWLEDGE}${queryString ? `?${queryString}` : ''}`);
    return response.data;
  }

  /**
   * Get knowledge article by slug
   */
  async getKnowledgeArticleBySlug(slug) {
    const response = await api.get(API_ENDPOINTS.ADMIN_KNOWLEDGE_ARTICLE(slug));
    return response.data;
  }

  /**
   * Create a new knowledge article
   */
  async createKnowledgeArticle(articleData) {
    return await requestQueue.enqueue(async () => {
      const response = await api.post(API_ENDPOINTS.ADMIN_KNOWLEDGE, articleData);
      return response.data;
    });
  }

  /**
   * Update a knowledge article
   */
  async updateKnowledgeArticle(slug, articleData) {
    return await requestQueue.enqueue(async () => {
      const response = await api.put(API_ENDPOINTS.ADMIN_KNOWLEDGE_ARTICLE(slug), articleData);
      return response.data;
    });
  }

  /**
   * Delete a knowledge article
   */
  async deleteKnowledgeArticle(slug) {
    return await requestQueue.enqueue(async () => {
      const response = await api.delete(API_ENDPOINTS.ADMIN_KNOWLEDGE_ARTICLE(slug));
      return response.data;
    });
  }

  // ============================================
  // ORGANIZATION MANAGEMENT (Admin Only)
  // ============================================

  /**
   * Get all organizations
   */
  async getOrganizations(params = {}) {
    return await requestQueue.enqueue(async () => {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`${API_ENDPOINTS.ORGANIZATIONS}${queryString ? `?${queryString}` : ''}`);
      return response.data;
    });
  }

  /**
   * Get organization by ID
   */
  async getOrganizationById(id) {
    const response = await api.get(API_ENDPOINTS.ORGANIZATION(id));
    return response.data;
  }

  /**
   * Create a new organization
   */
  async createOrganization(orgData) {
    return await requestQueue.enqueue(async () => {
      const response = await api.post(API_ENDPOINTS.ORGANIZATIONS, orgData);
      return response.data;
    });
  }

  /**
   * Update an organization
   */
  async updateOrganization(id, orgData) {
    return await requestQueue.enqueue(async () => {
      const response = await api.put(API_ENDPOINTS.ORGANIZATION(id), orgData);
      return response.data;
    });
  }

  /**
   * Delete an organization (soft delete)
   */
  async deleteOrganization(id) {
    return await requestQueue.enqueue(async () => {
      const response = await api.delete(API_ENDPOINTS.ORGANIZATION(id));
      return response.data;
    });
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Get dashboard statistics
   * Fetches sequentially with delays to avoid rate limiting
   */
  async getDashboardStats() {
    try {
      console.log('📊 Fetching dashboard stats sequentially to avoid rate limiting...');

      // Fetch sequentially with delays between requests (increased to 2 seconds to avoid rate limiting)
      const courses = await this.getCourses({ limit: 1 });
      console.log('✓ Courses fetched');
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay

      const resources = await this.getLibraryResources({ limit: 1 });
      console.log('✓ Resources fetched');
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay

      const news = await this.getNewsArticles({ limit: 1 });
      console.log('✓ News fetched');
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay

      const organizations = await this.getOrganizations({ limit: 1 });
      console.log('✓ Organizations fetched');

      const stats = {
        totalCourses: courses.data?.pagination?.total || 0,
        totalResources: resources.data?.pagination?.total || 0,
        totalNews: news.data?.pagination?.total || 0,
        totalOrganizations: organizations.data?.pagination?.total || 0,
      };

      console.log('✅ Dashboard stats fetched successfully:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      return {
        totalCourses: 0,
        totalResources: 0,
        totalNews: 0,
        totalOrganizations: 0,
      };
    }
  }
}

export default new AdminService();
