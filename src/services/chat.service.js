import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Chat Service
 */
class ChatService {
  /**
   * Get all conversations for authenticated user
   */
  async getConversations(filters = {}) {
    const response = await api.get(API_ENDPOINTS.CONVERSATIONS, {
      params: filters,
    });
    return response.data;
  }

  /**
   * Create a new conversation
   */
  async createConversation(conversationData) {
    const response = await api.post(API_ENDPOINTS.CONVERSATIONS, conversationData);
    return response.data;
  }

  /**
   * Get messages in a conversation
   */
  async getMessages(conversationId, filters = {}) {
    const response = await api.get(
      API_ENDPOINTS.CONVERSATION_MESSAGES(conversationId),
      { params: filters }
    );
    return response.data;
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(messageData) {
    const response = await api.post(API_ENDPOINTS.MESSAGES, messageData);
    return response.data;
  }

  /**
   * Mark conversation messages as read
   */
  async markAsRead(conversationId) {
    const response = await api.put(API_ENDPOINTS.MARK_READ(conversationId));
    return response.data;
  }
}

export default new ChatService();
