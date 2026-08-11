import apiClient from './api';

export const kycService = {
  // POST /api/v1/kyc/initiate
  // Returns: { success, document_id, redirect_url }
  initiate: (data: { name: string; phone: string; platform?: string }) => {
    // ── DEBUG LOG START ──
    console.log('[KYC SERVICE] 📤 Sending Initiate Request...');
    console.log('[KYC SERVICE] Payload Details:', JSON.stringify(data, null, 2));
    // ── DEBUG LOG END ──

    return apiClient.post('/kyc/initiate', data)
      .then(res => {
        // ── DEBUG LOG RESPONSE ──
        console.log('[KYC SERVICE] ✅ Initiate Response Received:', JSON.stringify(res.data, null, 2));
        return res.data;
      })
      .catch(err => {
        // ── DEBUG LOG ERROR ──
        console.error('[KYC SERVICE] ❌ Initiate Error:', err?.response?.data || err.message);
        throw err;
      });
  },

  // GET /api/v1/kyc/status
  // Returns: { success, kyc_status: 'none'|'initiated'|'pending'|'approval_pending'|'approved', ... }
  getStatus: () => {
    const url = '/kyc/status?platform=mobile';

    // ── DEBUG LOG START ──
    console.log(`[KYC SERVICE] 🔍 Fetching Status from URL: ${url}`);
    // ── DEBUG LOG END ──

    return apiClient.get(url)
      .then(res => {
        // ── DEBUG LOG RESPONSE ──
        console.log('[KYC SERVICE] 📊 Status Response Received:', JSON.stringify(res.data, null, 2));

        // विशेष रूप से चेक करें कि रिज़्यूम यूआरएल में क्या आ रहा है
        if (res.data?.resume_url) {
          console.log('[KYC SERVICE] 🔗 Target Resume URL for Mobile:', res.data.resume_url);
        }

        return res.data;
      })
      .catch(err => {
        // ── DEBUG LOG ERROR ──
        console.error('[KYC SERVICE] ❌ Status Check Error:', err?.response?.data || err.message);
        throw err;
      });
  },
};