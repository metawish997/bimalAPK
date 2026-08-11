import apiClient from './api';

export const tradeJournalService = {
  getAll: (params?: any) => apiClient.get('/trade-journals', { params }),
  getById: (id: string) => apiClient.get(`/trade-journals/${id}`),
  create: (data: any) => apiClient.post('/trade-journals', data),
  update: (id: string, data: any) => apiClient.put(`/trade-journals/${id}`, data),
  delete: (id: string) => apiClient.delete(`/trade-journals/${id}`),
  getAnalytics: (params?: any) => apiClient.get('/trade-journals/analytics', { params }),
};
