import { create } from 'zustand';
import chatService from '../services/chat.service';
import { handleApiError, handleApiSuccess } from '../utils/errorHandler';

/**
 * Chat Store
 * Manages conversations and messages
 */
const useChatStore = create((set, get) => ({
  // State
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,

  // Pagination
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  },

  // Actions - Conversations
  fetchConversations: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatService.getConversations(filters);
      set({
        conversations: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return null;
    }
  },

  createConversation: async (conversationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatService.createConversation(conversationData);
      const newConversation = response.data;

      set((state) => ({
        conversations: [newConversation, ...state.conversations],
        currentConversation: newConversation,
        isLoading: false,
      }));

      handleApiSuccess('Conversation created successfully!');
      return { success: true, data: newConversation };
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  },

  // Actions - Messages
  fetchMessages: async (conversationId, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatService.getMessages(conversationId, filters);
      set({
        messages: response.data,
        pagination: response.pagination || get().pagination,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return null;
    }
  },

  sendMessage: async (messageData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatService.sendMessage(messageData);
      const newMessage = response.data;

      set((state) => ({
        messages: [...state.messages, newMessage],
        isLoading: false,
      }));

      return { success: true, data: newMessage };
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  markAsRead: async (conversationId) => {
    try {
      await chatService.markAsRead(conversationId);
      // Update conversation in list to mark as read
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv._id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        ),
      }));
    } catch (error) {
      handleApiError(error);
    }
  },

  clearMessages: () => set({ messages: [] }),
  clearCurrentConversation: () => set({ currentConversation: null }),
  clearError: () => set({ error: null }),
}));

export default useChatStore;
