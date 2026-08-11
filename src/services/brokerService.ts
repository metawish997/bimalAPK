import apiClient from './api';

export const brokerService = {
  getAll: () => apiClient.get('/brokers'),
  getActive: () => apiClient.get('/brokers/active'),
  getById: (id: string) => apiClient.get(`/brokers/${id}`),
};
