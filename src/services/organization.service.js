import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Organization Service
 */
class OrganizationService {
  /**
   * Get all organizations
   */
  async getOrganizations() {
    const response = await api.get(API_ENDPOINTS.ORGANIZATIONS);
    return response.data;
  }

  /**
   * Get single organization by ID
   */
  async getOrganization(id) {
    const response = await api.get(API_ENDPOINTS.ORGANIZATION(id));
    return response.data;
  }

  /**
   * Create new organization (Admin only)
   */
  async createOrganization(orgData) {
    const response = await api.post(API_ENDPOINTS.ORGANIZATIONS, orgData);
    return response.data;
  }

  /**
   * Update organization (Admin only)
   */
  async updateOrganization(id, orgData) {
    const response = await api.put(API_ENDPOINTS.ORGANIZATION(id), orgData);
    return response.data;
  }

  /**
   * Delete organization (Admin only)
   */
  async deleteOrganization(id) {
    const response = await api.delete(API_ENDPOINTS.ORGANIZATION(id));
    return response.data;
  }

  /**
   * Get users from an organization
   */
  async getOrganizationUsers(id) {
    const response = await api.get(`/organizations/${id}/users`);
    return response.data;
  }

  /**
   * Connect with an organization (create conversation)
   * @param {string} id - Organization ID
   * @param {Object} data - Connection data
   * @param {string} data.connectType - 'organization' or 'user'
   * @param {string} data.userId - User ID (required if connectType is 'user')
   */
  async connectWithOrganization(id, data) {
    try {
      console.log('Service - Connecting to org:', id);
      console.log('Service - Request data:', data);
      const response = await api.post(`/organizations/${id}/connect`, data);
      return response.data;
    } catch (error) {
      console.error('Service - Connection error:', error);
      console.error('Service - Error response:', error.response?.data);
      throw error;
    }
  }
}

export default new OrganizationService();
