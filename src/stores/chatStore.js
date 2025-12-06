import { create } from 'zustand';
import chatService from '../services/chat.service';
import { handleApiError, handleApiSuccess } from '../utils/errorHandler';
import storage from '../utils/storage';

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

      // Calculate unread counts based on lastReadAt timestamps
      const currentUser = storage.getUser();
      const currentUserId = currentUser?._id;

      const conversationsWithUnread = response.data.map(conv => {
        // Find current user's participant data
        const currentParticipant = conv.participants?.find(
          p => (p.user?._id === currentUserId) || (p.user === currentUserId)
        );

        const lastReadAt = currentParticipant?.lastReadAt ? new Date(currentParticipant.lastReadAt) : new Date(0);
        const lastMessageAt = conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt) : new Date(0);

        // If last message is after lastReadAt and not sent by current user, it's unread
        const hasUnread = lastMessageAt > lastReadAt && conv.lastMessage?.sender !== currentUserId;

        return {
          ...conv,
          unreadCount: hasUnread ? 1 : 0 // Simple unread indicator
        };
      });

      set({
        conversations: conversationsWithUnread,
        isLoading: false,
      });
      return conversationsWithUnread;
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

      // Get current user
      const currentUser = storage.getUser();
      const currentUserId = currentUser?._id;

      // Update conversation in list to mark as read
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv._id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        ),
        // Also update messages to add current user to readBy array
        messages: state.messages.map((msg) => {
          if (msg.sender?._id !== currentUserId && !msg.readBy?.includes(currentUserId)) {
            return {
              ...msg,
              readBy: [...(msg.readBy || []), currentUserId]
            };
          }
          return msg;
        })
      }));

      console.log(`✅ Marked conversation ${conversationId} as read`);
    } catch (error) {
      handleApiError(error);
    }
  },

  clearMessages: () => set({ messages: [] }),
  clearCurrentConversation: () => set({ currentConversation: null }),
  clearError: () => set({ error: null }),

  // Helper - Get total unread count
  getTotalUnreadCount: () => {
    const { conversations } = get();
    const total = conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
    return total;
  },

  // Socket Actions
  addMessage: (message) => {
    const state = get();
    const { currentConversation, conversations } = state;

    // Normalize conversation IDs to strings for comparison
    const msgConvId = typeof message.conversation === 'object' 
      ? message.conversation._id 
      : message.conversation;
      
    const currentConvId = currentConversation?._id;

    console.log('Socket Message Received:', { 
      msgId: message._id, 
      msgConvId, 
      currentConvId,
      match: msgConvId === currentConvId 
    });

    // 1. If message belongs to current conversation, add it to messages
    if (currentConvId && msgConvId === currentConvId) {
      // Check if message already exists (to avoid duplicates)
      const exists = state.messages.some(m => m._id === message._id);
      if (!exists) {
        set({ messages: [...state.messages, message] });
      }
    }

    // 2. Update conversation list (last message, unread count)
    const updatedConversations = conversations.map(conv => {
      if (conv._id === msgConvId) {
        const isCurrent = currentConvId === conv._id;
        return {
          ...conv,
          lastMessage: message,
          updatedAt: message.createdAt,
          unreadCount: isCurrent ? 0 : (conv.unreadCount || 0) + 1
        };
      }
      return conv;
    });

    // Sort conversations by updated date
    updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    set({ conversations: updatedConversations });
  },

  addConversation: (conversation) => {
    const state = get();
    // Check if already exists
    const exists = state.conversations.some(c => c._id === conversation._id);
    if (!exists) {
      set({ conversations: [conversation, ...state.conversations] });
    }
  },
}));

export default useChatStore;
