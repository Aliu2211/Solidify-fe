import { create } from 'zustand';
import adminService from '../services/admin.service';
import { handleApiError, handleApiSuccess } from '../utils/errorHandler';

/**
 * Admin Store
 * Manages admin-only operations and state with intelligent caching
 */

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

const useAdminStore = create((set, get) => ({
  // ============================================
  // STATE
  // ============================================

  // Courses
  courses: [],
  currentCourse: null,
  coursesLoading: false,
  coursesLastFetch: null,

  // Library Resources
  resources: [],
  currentResource: null,
  resourcesLoading: false,
  resourcesLastFetch: null,

  // News Articles
  news: [],
  currentNews: null,
  newsLoading: false,
  newsLastFetch: null,

  // Knowledge Articles
  knowledge: [],
  currentKnowledge: null,
  knowledgeLoading: false,
  knowledgeLastFetch: null,

  // Organizations
  organizations: [],
  currentOrganization: null,
  organizationsLoading: false,
  organizationsLastFetch: null,

  // Dashboard Stats
  dashboardStats: {
    totalUsers: 0,
    usersByRole: { user: 0, manager: 0, admin: 0 },
    verifiedUsers: 0,
    recentRegistrations: 0,
    totalCourses: 0,
    totalResources: 0,
    totalNews: 0,
    totalOrganizations: 0,
  },
  statsLoading: false,
  statsLastFetch: null,

  // Users
  users: [],
  currentUser: null,
  usersLoading: false,
  usersLastFetch: null,

  // General
  error: null,

  // ============================================
  // COURSE ACTIONS
  // ============================================

  fetchCourses: async (params = {}, forceRefresh = false) => {
    const state = get();
    const now = Date.now();
    const isCacheValid = state.coursesLastFetch && (now - state.coursesLastFetch < CACHE_DURATION);

    // Return cached data if available and fresh, unless force refresh
    if (!forceRefresh && isCacheValid && state.courses.length > 0) {
      console.log('📦 Using cached courses data');
      return state.courses;
    }

    // Prevent duplicate calls if already loading
    if (state.coursesLoading) {
      console.log('⏳ Courses already loading, skipping duplicate request');
      return state.courses;
    }

    console.log('🔄 Fetching fresh courses data from API');
    set({ coursesLoading: true, error: null });
    try {
      const response = await adminService.getCourses(params);
      if (response.success) {
        set({
          courses: response.data,
          coursesLoading: false,
          coursesLastFetch: Date.now()
        });
        return response.data;
      } else {
        set({ error: response.message, coursesLoading: false });
        return [];
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, coursesLoading: false });
      return [];
    }
  },

  fetchCourseById: async (id) => {
    set({ coursesLoading: true, error: null });
    try {
      const response = await adminService.getCourseById(id);
      if (response.success) {
        set({ currentCourse: response.data, coursesLoading: false });
        return response.data;
      } else {
        set({ error: response.message, coursesLoading: false });
        return null;
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, coursesLoading: false });
      return null;
    }
  },

  createCourse: async (courseData) => {
    set({ coursesLoading: true, error: null });
    try {
      const response = await adminService.createCourse(courseData);
      if (response.success) {
        set({ coursesLoading: false });
        handleApiSuccess('Course created successfully!');
        await get().fetchCourses({}, true); // Force refresh
        return { success: true, data: response.data };
      } else {
        set({ error: response.message, coursesLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, coursesLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  updateCourse: async (id, courseData) => {
    set({ coursesLoading: true, error: null });
    try {
      const response = await adminService.updateCourse(id, courseData);
      if (response.success) {
        set({ coursesLoading: false });
        handleApiSuccess('Course updated successfully!');
        await get().fetchCourses({}, true); // Force refresh
        return { success: true, data: response.data };
      } else {
        set({ error: response.message, coursesLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, coursesLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  deleteCourse: async (id) => {
    set({ coursesLoading: true, error: null });
    try {
      const response = await adminService.deleteCourse(id);
      if (response.success) {
        set({ coursesLoading: false });
        handleApiSuccess('Course deleted successfully!');
        await get().fetchCourses({}, true); // Force refresh
        return { success: true };
      } else {
        set({ error: response.message, coursesLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, coursesLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  // ============================================
  // LIBRARY RESOURCE ACTIONS
  // ============================================

  fetchResources: async (params = {}, forceRefresh = false) => {
    const state = get();
    const now = Date.now();
    const isCacheValid = state.resourcesLastFetch && (now - state.resourcesLastFetch < CACHE_DURATION);

    // Return cached data if available and fresh, unless force refresh
    if (!forceRefresh && isCacheValid && state.resources.length > 0) {
      console.log('📦 Using cached resources data');
      return state.resources;
    }

    // Prevent duplicate calls if already loading
    if (state.resourcesLoading) {
      console.log('⏳ Resources already loading, skipping duplicate request');
      return state.resources;
    }

    console.log('🔄 Fetching fresh resources data from API');
    set({ resourcesLoading: true, error: null });
    try {
      const response = await adminService.getLibraryResources(params);
      if (response.success) {
        set({
          resources: response.data,
          resourcesLoading: false,
          resourcesLastFetch: Date.now()
        });
        return response.data;
      } else {
        set({ error: response.message, resourcesLoading: false });
        return [];
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, resourcesLoading: false });
      return [];
    }
  },

  createResource: async (resourceData) => {
    set({ resourcesLoading: true, error: null });
    try {
      const response = await adminService.createLibraryResource(resourceData);
      if (response.success) {
        set({ resourcesLoading: false });
        handleApiSuccess('Resource created successfully!');
        await get().fetchResources({}, true); // Force refresh
        return { success: true, data: response.data };
      } else {
        set({ error: response.message, resourcesLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, resourcesLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  updateResource: async (id, resourceData) => {
    set({ resourcesLoading: true, error: null });
    try {
      const response = await adminService.updateLibraryResource(id, resourceData);
      if (response.success) {
        set({ resourcesLoading: false });
        handleApiSuccess('Resource updated successfully!');
        await get().fetchResources({}, true); // Force refresh
        return { success: true, data: response.data };
      } else {
        set({ error: response.message, resourcesLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, resourcesLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  deleteResource: async (id) => {
    set({ resourcesLoading: true, error: null });
    try {
      const response = await adminService.deleteLibraryResource(id);
      if (response.success) {
        set({ resourcesLoading: false });
        handleApiSuccess('Resource deleted successfully!');
        await get().fetchResources({}, true); // Force refresh
        return { success: true };
      } else {
        set({ error: response.message, resourcesLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, resourcesLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  // ============================================
  // NEWS ACTIONS
  // ============================================

  fetchNews: async (params = {}, forceRefresh = false) => {
    const state = get();
    const now = Date.now();
    const isCacheValid = state.newsLastFetch && (now - state.newsLastFetch < CACHE_DURATION);

    // Return cached data if available and fresh, unless force refresh
    if (!forceRefresh && isCacheValid && state.news.length > 0) {
      console.log('📦 Using cached news data');
      return state.news;
    }

    // Prevent duplicate calls if already loading
    if (state.newsLoading) {
      console.log('⏳ News already loading, skipping duplicate request');
      return state.news;
    }

    console.log('🔄 Fetching fresh news data from API');
    set({ newsLoading: true, error: null });
    try {
      const response = await adminService.getNewsArticles(params);
      if (response.success) {
        set({
          news: response.data,
          newsLoading: false,
          newsLastFetch: Date.now()
        });
        return response.data;
      } else {
        set({ error: response.message, newsLoading: false });
        return [];
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, newsLoading: false });
      return [];
    }
  },

  createNews: async (newsData) => {
    set({ newsLoading: true, error: null });
    try {
      const response = await adminService.createNewsArticle(newsData);
      if (response.success) {
        set({ newsLoading: false });
        handleApiSuccess('News article created successfully!');
        await get().fetchNews({}, true); // Force refresh
        return { success: true, data: response.data };
      } else {
        set({ error: response.message, newsLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, newsLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  updateNews: async (id, newsData) => {
    set({ newsLoading: true, error: null });
    try {
      const response = await adminService.updateNewsArticle(id, newsData);
      if (response.success) {
        set({ newsLoading: false });
        handleApiSuccess('News article updated successfully!');
        await get().fetchNews({}, true); // Force refresh
        return { success: true, data: response.data };
      } else {
        set({ error: response.message, newsLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, newsLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  deleteNews: async (id) => {
    set({ newsLoading: true, error: null });
    try {
      const response = await adminService.deleteNewsArticle(id);
      if (response.success) {
        set({ newsLoading: false });
        handleApiSuccess('News article deleted successfully!');
        await get().fetchNews({}, true); // Force refresh
        return { success: true };
      } else {
        set({ error: response.message, newsLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, newsLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  // ============================================
  // KNOWLEDGE ACTIONS
  // ============================================

  fetchKnowledge: async (params = {}, forceRefresh = false) => {
    const state = get();
    const now = Date.now();
    const isCacheValid = state.knowledgeLastFetch && (now - state.knowledgeLastFetch < CACHE_DURATION);

    // Return cached data if available and fresh, unless force refresh
    if (!forceRefresh && isCacheValid && state.knowledge.length > 0) {
      console.log('📦 Using cached knowledge data');
      return state.knowledge;
    }

    // Prevent duplicate calls if already loading
    if (state.knowledgeLoading) {
      console.log('⏳ Knowledge already loading, skipping duplicate request');
      return state.knowledge;
    }

    console.log('🔄 Fetching fresh knowledge data from API');
    set({ knowledgeLoading: true, error: null });
    try {
      const response = await adminService.getKnowledgeArticles(params);
      if (response.success) {
        set({
          knowledge: response.data,
          knowledgeLoading: false,
          knowledgeLastFetch: Date.now()
        });
        return response.data;
      } else {
        set({ error: response.message, knowledgeLoading: false });
        return [];
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, knowledgeLoading: false });
      return [];
    }
  },

  createKnowledge: async (knowledgeData) => {
    set({ knowledgeLoading: true, error: null });
    try {
      const response = await adminService.createKnowledgeArticle(knowledgeData);
      if (response.success) {
        set({ knowledgeLoading: false });
        handleApiSuccess('Knowledge article created successfully!');
        await get().fetchKnowledge({}, true); // Force refresh
        return { success: true, data: response.data };
      } else {
        set({ error: response.message, knowledgeLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, knowledgeLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  // ============================================
  // ORGANIZATION ACTIONS
  // ============================================

  fetchOrganizations: async (params = {}, forceRefresh = false) => {
    const state = get();
    const now = Date.now();
    const isCacheValid = state.organizationsLastFetch && (now - state.organizationsLastFetch < CACHE_DURATION);

    // Return cached data if available and fresh, unless force refresh
    if (!forceRefresh && isCacheValid && state.organizations.length > 0) {
      console.log('📦 Using cached organizations data');
      return state.organizations;
    }

    // Prevent duplicate calls if already loading
    if (state.organizationsLoading) {
      console.log('⏳ Organizations already loading, skipping duplicate request');
      return state.organizations;
    }

    console.log('🔄 Fetching fresh organizations data from API');
    set({ organizationsLoading: true, error: null });
    try {
      const response = await adminService.getOrganizations(params);
      if (response.success) {
        set({
          organizations: response.data,
          organizationsLoading: false,
          organizationsLastFetch: Date.now()
        });
        return response.data;
      } else {
        set({ error: response.message, organizationsLoading: false });
        return [];
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, organizationsLoading: false });
      return [];
    }
  },

  createOrganization: async (orgData) => {
    set({ organizationsLoading: true, error: null });
    try {
      const response = await adminService.createOrganization(orgData);
      if (response.success) {
        set({ organizationsLoading: false });
        handleApiSuccess('Organization created successfully!');
        await get().fetchOrganizations({}, true); // Force refresh
        return { success: true, data: response.data };
      } else {
        set({ error: response.message, organizationsLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, organizationsLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  updateOrganization: async (id, orgData) => {
    set({ organizationsLoading: true, error: null });
    try {
      const response = await adminService.updateOrganization(id, orgData);
      if (response.success) {
        set({ organizationsLoading: false });
        handleApiSuccess('Organization updated successfully!');
        await get().fetchOrganizations({}, true); // Force refresh
        return { success: true, data: response.data };
      } else {
        set({ error: response.message, organizationsLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, organizationsLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  deleteOrganization: async (id) => {
    set({ organizationsLoading: true, error: null });
    try {
      const response = await adminService.deleteOrganization(id);
      if (response.success) {
        set({ organizationsLoading: false });
        handleApiSuccess('Organization deleted successfully!');
        await get().fetchOrganizations({}, true); // Force refresh
        return { success: true };
      } else {
        set({ error: response.message, organizationsLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, organizationsLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  // ============================================
  // USER MANAGEMENT ACTIONS
  // ============================================

  fetchUsers: async (params = {}, forceRefresh = false) => {
    const state = get();
    const now = Date.now();
    const isCacheValid = state.usersLastFetch && (now - state.usersLastFetch < CACHE_DURATION);

    // Return cached data if available and fresh, unless force refresh
    if (!forceRefresh && isCacheValid && state.users.length > 0) {
      console.log('📦 Using cached users data');
      return state.users;
    }

    // Prevent duplicate calls if already loading
    if (state.usersLoading) {
      console.log('⏳ Users already loading, skipping duplicate request');
      return state.users;
    }

    console.log('🔄 Fetching fresh users data from API');
    set({ usersLoading: true, error: null });
    try {
      const response = await adminService.getUsers(params);
      if (response.success) {
        set({
          users: response.data.users || response.data,
          usersLoading: false,
          usersLastFetch: Date.now()
        });
        return response.data.users || response.data;
      } else {
        set({ error: response.message, usersLoading: false });
        return [];
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, usersLoading: false });
      return [];
    }
  },

  fetchUserById: async (userId) => {
    set({ usersLoading: true, error: null });
    try {
      const response = await adminService.getUserById(userId);
      if (response.success) {
        set({ currentUser: response.data, usersLoading: false });
        return response.data;
      } else {
        set({ error: response.message, usersLoading: false });
        return null;
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, usersLoading: false });
      return null;
    }
  },

  updateUser: async (userId, userData) => {
    set({ usersLoading: true, error: null });
    try {
      const response = await adminService.updateUser(userId, userData);
      if (response.success) {
        set({ usersLoading: false });
        handleApiSuccess('User updated successfully!');
        await get().fetchUsers({}, true); // Force refresh
        return { success: true, data: response.data };
      } else {
        set({ error: response.message, usersLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, usersLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  deleteUser: async (userId) => {
    set({ usersLoading: true, error: null });
    try {
      const response = await adminService.deleteUser(userId);
      if (response.success) {
        set({ usersLoading: false });
        handleApiSuccess('User deleted successfully!');
        await get().fetchUsers({}, true); // Force refresh
        return { success: true };
      } else {
        set({ error: response.message, usersLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, usersLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  // ============================================
  // DASHBOARD STATS
  // ============================================

  fetchDashboardStats: async (forceRefresh = false) => {
    const state = get();
    const now = Date.now();
    const isCacheValid = state.statsLastFetch && (now - state.statsLastFetch < CACHE_DURATION);

    // Check if stats have been loaded (any non-zero value)
    const hasStats = state.dashboardStats.totalCourses > 0 ||
                     state.dashboardStats.totalResources > 0 ||
                     state.dashboardStats.totalNews > 0 ||
                     state.dashboardStats.totalOrganizations > 0;

    // Return cached data if available and fresh, unless force refresh
    if (!forceRefresh && isCacheValid && hasStats) {
      console.log('📦 Using cached dashboard stats');
      return state.dashboardStats;
    }

    // Prevent duplicate calls if already loading
    if (state.statsLoading) {
      console.log('⏳ Dashboard stats already loading, skipping duplicate request');
      return state.dashboardStats;
    }

    console.log('🔄 Fetching fresh dashboard stats from API');
    set({ statsLoading: true, error: null });
    try {
      const stats = await adminService.getDashboardStats();
      set({
        dashboardStats: stats,
        statsLoading: false,
        statsLastFetch: Date.now()
      });
      return stats;
    } catch (error) {
      const errorMsg = handleApiError(error);
      set({ error: errorMsg, statsLoading: false });
      return null;
    }
  },

  // ============================================
  // UTILITY
  // ============================================

  clearError: () => set({ error: null }),
}));

export default useAdminStore;
