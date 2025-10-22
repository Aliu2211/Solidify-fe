import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Authentication Service
 */
class AuthService {
  /**
   * Login user with email/userId and password
   */
  async login(identifier, password) {
    const response = await api.post(API_ENDPOINTS.LOGIN, {
      identifier,
      password,
    });
    return response.data;
  }

  /**
   * Register new user
   */
  async register(userData) {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    const response = await api.post(API_ENDPOINTS.REFRESH, { refreshToken });
    return response.data;
  }

  /**
   * Change user password
   */
  async changePassword(currentPassword, newPassword) {
    const response = await api.put(API_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    const response = await api.get(API_ENDPOINTS.ME);
    return response.data;
  }

  /**
   * Get list of organizations (for registration)
   */
  async getOrganizations() {
    const response = await api.get(API_ENDPOINTS.GET_ORGANIZATIONS);
    return response.data;
  }
}

export default new AuthService();
