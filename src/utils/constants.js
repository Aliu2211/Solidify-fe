// API Configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://solidify.onrender.com/api/v1'
  : '/api/v1'; // Use proxy in development

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
