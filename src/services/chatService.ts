import apiClient from './api';

export const chatService = {
  // Get messages between current user and specific user
  getMessages: (userId: string) =>
    apiClient.get(`/chats/${userId}/messages`),

  // Send a message
  sendMessage: (data: { recipientId: string; text: string }) =>
    apiClient.post('/chats/send', data),

  // Mark chat as read
  markAsRead: (chatId: string) =>
    apiClient.put(`/chats/${chatId}/read`),

  // Get Super Admin user info
  getSuperAdmin: () =>
    apiClient.get('/chats/super-admin/info'),

  // Update online status
  updateOnlineStatus: (isOnline: boolean) =>
    apiClient.put('/chats/online', { isOnline }),

  // Set typing status
  setTypingStatus: (recipientId: string, isTyping: boolean) =>
    apiClient.post('/chats/typing', { recipientId, isTyping }),
};
