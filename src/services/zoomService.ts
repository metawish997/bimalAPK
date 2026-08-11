import api from './api';

export const zoomService = {
  /**
   * Fetch all meetings
   */
  getMeetings: async (status?: string) => {
    const url = status ? `/zoom/meetings?status=${status}` : '/zoom/meetings';
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Get meeting details by ID
   */
  getMeetingDetails: async (id: string) => {
    const response = await api.get(`/zoom/meeting/${id}`);
    return response.data;
  },

  /**
   * Schedule a new meeting
   */
  scheduleMeeting: async (data: any) => {
    const response = await api.post('/zoom/create-meeting', data);
    return response.data;
  },

  /**
   * Start an instant meeting
   */
  startInstantMeeting: async (topic: string) => {
    const response = await api.post('/zoom/start-instant-meeting', { topic });
    return response.data;
  },

  /**
   * Request Zoom SDK Signature from backend
   */
  generateSignature: async (meetingNumber: string, role: number) => {
    const response = await api.post('/zoom/generate-signature', { meetingNumber, role });
    return response.data; // { signature, sdkKey }
  },
};
