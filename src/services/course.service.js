import api from "./api";

const courseService = {
  /**
   * Get all courses with optional filtering
   * @param {Object} params - Query parameters
   * @param {number} params.level - Filter by level (1, 2, or 3)
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response
   */
  async getAllCourses(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/courses${queryString ? `?${queryString}` : ""}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  /**
   * Get course by ID
   * @param {string} id - Course ID
   * @returns {Promise} API response
   */
  async getCourseById(id) {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course:", error);
      throw error;
    }
  },

  /**
   * Start or resume a course
   * @param {string} id - Course ID
   * @returns {Promise} API response
   */
  async startCourse(id) {
    try {
      const response = await api.post(`/courses/${id}/start`);
      return response.data;
    } catch (error) {
      console.error("Error starting course:", error);
      throw error;
    }
  },

  /**
   * Complete a course
   * @param {string} id - Course ID
   * @param {Object} data - Completion data
   * @param {number} data.timeSpent - Time spent in minutes
   * @param {number} data.quizScore - Quiz score (0-100)
   * @returns {Promise} API response
   */
  async completeCourse(id, data) {
    try {
      const response = await api.post(`/courses/${id}/complete`, data);
      return response.data;
    } catch (error) {
      console.error("Error completing course:", error);
      throw error;
    }
  },

  /**
   * Get my learning progress
   * @returns {Promise} API response
   */
  async getMyProgress() {
    try {
      const response = await api.get("/learning/my-progress");
      return response.data;
    } catch (error) {
      console.error("Error fetching my progress:", error);
      throw error;
    }
  },

  /**
   * Get organization learning progress
   * @returns {Promise} API response
   */
  async getOrganizationProgress() {
    try {
      const response = await api.get("/learning/organization-progress");
      return response.data;
    } catch (error) {
      console.error("Error fetching organization progress:", error);
      throw error;
    }
  },

  /**
   * Get learning leaderboard
   * @returns {Promise} API response
   */
  async getLeaderboard() {
    try {
      const response = await api.get("/learning/leaderboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      throw error;
    }
  },
};

export default courseService;
