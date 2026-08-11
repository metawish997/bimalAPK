import apiClient from './api';

export const journalNoteService = {
  getAll: (params?: any) => apiClient.get('/journal-notes', { params }),
  getById: (id: string) => apiClient.get(`/journal-notes/${id}`),
  create: (data: any) => apiClient.post('/journal-notes', data),
  update: (id: string, data: any) => apiClient.put(`/journal-notes/${id}`, data),
  delete: (id: string) => apiClient.delete(`/journal-notes/${id}`),
};
