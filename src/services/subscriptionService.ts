import apiClient from './api';

export const subscriptionService = {
  getMySubscriptions: () => apiClient.get('/user-subscriptions/my'),
  getPlans: () => apiClient.get('/subscription-plans'),
  createOrder: (planId: string) => apiClient.post('/subscription-payments/create-order', { planId }),
  verifyPayment: (data: any) => apiClient.post('/subscription-payments/verify', data),
};
