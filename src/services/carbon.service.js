import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Carbon Tracking Service
 */
class CarbonService {
  /**
   * Create a new carbon emission entry
   */
  async createEntry(entryData) {
    const response = await api.post(API_ENDPOINTS.CARBON_ENTRIES, entryData);
    return response.data;
  }

  /**
   * Get carbon emission entries with filters
   */
  async getEntries(filters = {}) {
    const response = await api.get(API_ENDPOINTS.CARBON_ENTRIES, {
      params: filters,
    });
    return response.data;
  }

  /**
   * Get carbon dashboard summary
   */
  async getDashboard() {
    const response = await api.get(API_ENDPOINTS.CARBON_DASHBOARD);
    return response.data;
  }

  /**
   * Get organization sustainability roadmap
   */
  async getRoadmap() {
    const response = await api.get(API_ENDPOINTS.CARBON_ROADMAP);
    return response.data;
  }

  /**
   * Update roadmap milestone status
   */
  async updateMilestone(milestoneNumber, completed) {
    const response = await api.put(API_ENDPOINTS.CARBON_ROADMAP_MILESTONE, {
      milestoneNumber,
      completed,
    });
    return response.data;
  }

  /**
   * Create a carbon reduction goal
   */
  async createGoal(goalData) {
    const response = await api.post(API_ENDPOINTS.CARBON_GOALS, goalData);
    return response.data;
  }

  /**
   * Get emission factors for calculations
   */
  async getEmissionFactors(filters = {}) {
    const response = await api.get(API_ENDPOINTS.EMISSION_FACTORS, {
      params: filters,
    });
    return response.data;
  }
}

export default new CarbonService();
