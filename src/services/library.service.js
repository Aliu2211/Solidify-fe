import api from "./api";

const libraryService = {
  // Get all library resources with optional filtering
  async getAllResources(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/library/resources${queryString ? `?${queryString}` : ""}`);
    return response.data;
  },

  // Get resource by ID
  async getResourceById(id) {
    const response = await api.get(`/library/resources/${id}`);
    return response.data;
  },

  // Get resource categories
  async getCategories() {
    const response = await api.get("/library/categories");
    return response.data;
  },

  // Get popular resources
  async getPopularResources(limit = 10) {
    const response = await api.get(`/library/popular?limit=${limit}`);
    return response.data;
  },

  // Get recommended resources
  async getRecommendedResources(limit = 10) {
    const response = await api.get(`/library/recommended?limit=${limit}`);
    return response.data;
  },

  // View a resource (increment view count)
  async viewResource(id) {
    const response = await api.post(`/library/resources/${id}/view`);
    return response.data;
  },

  // Save/bookmark a resource
  async saveResource(id) {
    const response = await api.post(`/library/resources/${id}/save`);
    return response.data;
  },

  // Unsave/unbookmark a resource
  async unsaveResource(id) {
    const response = await api.delete(`/library/resources/${id}/save`);
    return response.data;
  },

  // Get my saved resources
  async getMySavedResources() {
    const response = await api.get("/library/my-saved");
    return response.data;
  },

  // Download a resource
  async downloadResource(id) {
    const response = await api.get(`/library/resources/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },
};

export default libraryService;
