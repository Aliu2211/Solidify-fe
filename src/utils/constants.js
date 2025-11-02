// API Configuration
const getApiBaseUrl = () => {
  // Check if we have a custom API URL from environment
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Production environment - use the full backend URL
  if (import.meta.env.PROD) {
    return 'https://solidify.onrender.com/api/v1';
  }
  
  // Development environment - use proxy
  return '/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging in development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    baseUrl: API_BASE_URL,
    environment: import.meta.env.PROD ? 'production' : 'development',
    customUrl: import.meta.env.VITE_API_BASE_URL || 'not set'
  });
}

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'solidify_access_token',
  REFRESH_TOKEN: 'solidify_refresh_token',
  USER: 'solidify_user',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',
  GET_ORGANIZATIONS: '/auth/organizations',

  // Carbon Tracking
  CARBON_ENTRIES: '/carbon/entries',
  CARBON_DASHBOARD: '/carbon/dashboard',
  CARBON_ROADMAP: '/carbon/roadmap',
  CARBON_ROADMAP_MILESTONE: '/carbon/roadmap/milestone',
  CARBON_GOALS: '/carbon/goals',
  EMISSION_FACTORS: '/carbon/emission-factors',

  // Chat
  CONVERSATIONS: '/chat/conversations',
  MESSAGES: '/chat/messages',
  CONVERSATION_MESSAGES: (id) => `/chat/conversations/${id}/messages`,
  MARK_READ: (id) => `/chat/conversations/${id}/read`,

  // Knowledge Base
  KNOWLEDGE_ARTICLES: '/knowledge/articles',
  KNOWLEDGE_ARTICLE: (slug) => `/knowledge/articles/${slug}`,
  KNOWLEDGE_SEARCH: '/knowledge/search',

  // News
  NEWS: '/news',
  NEWS_ARTICLE: (slug) => `/news/${slug}`,

  // Organizations
  ORGANIZATIONS: '/organizations',
  ORGANIZATION: (id) => `/organizations/${id}`,

  // Admin - Courses
  ADMIN_COURSES: '/courses',
  ADMIN_COURSE: (id) => `/courses/${id}`,

  // Admin - Library Resources
  ADMIN_LIBRARY_RESOURCES: '/library/resources',
  ADMIN_LIBRARY_RESOURCE: (id) => `/library/resources/${id}`,

  // Admin - News
  ADMIN_NEWS: '/news',
  ADMIN_NEWS_ARTICLE: (id) => `/news/${id}`,

  // Admin - Knowledge Base
  ADMIN_KNOWLEDGE: '/knowledge/articles',
  ADMIN_KNOWLEDGE_ARTICLE: (slug) => `/knowledge/articles/${slug}`,
};

// Sustainability Levels
export const SUSTAINABILITY_LEVELS = {
  FOUNDATION: 1,
  EFFICIENCY: 2,
  TRANSFORMATION: 3,
};

export const SUSTAINABILITY_LEVEL_LABELS = {
  1: 'Foundation',
  2: 'Efficiency',
  3: 'Transformation',
};

// Carbon Entry Types
export const CARBON_ENTRY_TYPES = {
  ELECTRICITY: 'electricity',
  FUEL: 'fuel',
  TRANSPORT: 'transport',
  WASTE: 'waste',
  WATER: 'water',
  RENEWABLE_ENERGY: 'renewable_energy',
  CARBON_OFFSET: 'carbon_offset',
};

// News Categories
export const NEWS_CATEGORIES = {
  POLICY: 'policy',
  TECHNOLOGY: 'technology',
  SUCCESS_STORIES: 'success-stories',
  EVENTS: 'events',
  GLOBAL_TRENDS: 'global-trends',
};

// Knowledge Categories
export const KNOWLEDGE_CATEGORIES = {
  CARBON_TRACKING: 'carbon-tracking',
  REGULATIONS: 'regulations',
  BEST_PRACTICES: 'best-practices',
  CASE_STUDIES: 'case-studies',
  TOOLS: 'tools',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

export default API_BASE_URL;
