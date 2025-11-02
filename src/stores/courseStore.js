import { create } from "zustand";
import courseService from "../services/course.service";

const useCourseStore = create((set, get) => ({
  // State
  courses: [],
  currentCourse: null,
  myProgress: null,
  organizationProgress: null,
  leaderboard: [],
  isLoading: false,
  error: null,
  currentLevel: 1, // User's current sustainability level

  // Fetch all courses
  fetchCourses: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await courseService.getAllCourses(params);
      if (response.success) {
        set({ courses: response.data, isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch courses",
        isLoading: false,
      });
    }
  },

  // Fetch course by ID
  fetchCourseById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await courseService.getCourseById(id);
      if (response.success) {
        set({ currentCourse: response.data, isLoading: false });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch course",
        isLoading: false,
      });
      return null;
    }
  },

  // Start a course
  startCourse: async (id) => {
    set({ error: null });
    try {
      const response = await courseService.startCourse(id);
      if (response.success) {
        // Refresh my progress after starting
        await get().fetchMyProgress();
        return response;
      } else {
        set({ error: response.message });
        return response;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to start course";
      set({ error: errorMsg });
      return {
        success: false,
        message: errorMsg,
      };
    }
  },

  // Complete a course
  completeCourse: async (id, data) => {
    set({ error: null });
    try {
      const response = await courseService.completeCourse(id, data);
      if (response.success) {
        // Refresh my progress after completion
        const progressData = await get().fetchMyProgress();

        // Check if level was upgraded
        const newLevel = progressData?.currentLevel;
        const oldLevel = get().currentLevel;

        return {
          ...response,
          levelUpgraded: newLevel > oldLevel,
          newLevel: newLevel
        };
      } else {
        set({ error: response.message });
        return response;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to complete course";
      set({ error: errorMsg });
      return {
        success: false,
        message: errorMsg,
      };
    }
  },

  // Fetch my learning progress
  fetchMyProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await courseService.getMyProgress();
      if (response.success) {
        // Update current level based on progress
        const currentLevel = response.data.currentLevel || 1;
        set({
          myProgress: response.data,
          currentLevel: currentLevel,
          isLoading: false
        });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch progress",
        isLoading: false,
      });
      return null;
    }
  },

  // Fetch organization progress
  fetchOrganizationProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await courseService.getOrganizationProgress();
      if (response.success) {
        set({ organizationProgress: response.data, isLoading: false });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch organization progress",
        isLoading: false,
      });
      return null;
    }
  },

  // Fetch leaderboard
  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await courseService.getLeaderboard();
      if (response.success) {
        set({ leaderboard: response.data, isLoading: false });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch leaderboard",
        isLoading: false,
      });
      return null;
    }
  },

  // Set current course
  setCurrentCourse: (course) => set({ currentCourse: course }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useCourseStore;
