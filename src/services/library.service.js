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

  // Get recent resources
  async getRecentResources(limit = 10) {
    const response = await api.get(`/library/recent?limit=${limit}`);
    return response.data;
  },

  // Get recommended resources
  async getRecommendedResources(limit = 10) {
    const response = await api.get(`/library/recommended?limit=${limit}`);
    return response.data;
  },

  // Favorite a resource (replaces view)
  async favoriteResource(id) {
    const response = await api.post(`/library/resources/${id}/favorite`);
    return response.data;
  },

  // Unfavorite a resource
  async unfavoriteResource(id) {
    const response = await api.delete(`/library/resources/${id}/favorite`);
    return response.data;
  },

  // Get my favorite resources
  async getMyFavorites() {
    const response = await api.get("/library/my-favorites");
    return response.data;
  },

  // Download a resource (get download URL - increments download count)
  async downloadResource(id) {
    const response = await api.get(`/library/resources/${id}/download`);
    // Normalize response so callers can always use data.downloadUrl
    const payload = response.data || {};
    const inner = payload.data || {};
    const downloadUrl = inner.fileUrl || inner.downloadUrl || payload.fileUrl || payload.downloadUrl || null;
    return {
      success: payload.success,
      message: payload.message,
      data: {
        downloadUrl,
        fileName: inner.fileName || payload.fileName || null,
        fileType: inner.fileType || payload.fileType || null,
      },
    };
  },
};

export default libraryService;
