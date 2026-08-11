import apiClient from './api';

export const notificationService = {
  getMyNotifications: (page = 1, limit = 20) =>
    apiClient.get('/notifications/my', { params: { page, limit } }),

  getUnreadCount: () =>
    apiClient.get('/notifications/unread-count'),

  markAsRead: (id: string) =>
    apiClient.put(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.put('/notifications/read-all'),

  dismiss: (id: string) =>
    apiClient.delete(`/notifications/${id}/dismiss`),
};
