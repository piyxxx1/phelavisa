// Centralized REST API Configuration for Admin CRM Panel
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5174';
export const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';

export const ENDPOINTS = {
  // Visas Manager Endpoints
  VISAS: `${API_BASE_URL}/visas`,
  VISA_BY_ID: (id) => `${API_BASE_URL}/visas/${id}`,
  
  // Applications & Orders Endpoints
  APPLICATIONS: `${API_BASE_URL}/applications`,
  APPLICATION_BY_ID: (id) => `${API_BASE_URL}/applications/${id}`,
  UPDATE_APPLICATION_STATUS: (id) => `${API_BASE_URL}/applications/${id}/status`,
  
  // B2B Partner Portal Endpoints
  B2B_PARTNERS: `${API_BASE_URL}/b2b/partners`,
  B2B_PARTNER_BY_ID: (id) => `${API_BASE_URL}/b2b/partners/${id}`,
  
  // Admin Auth Endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  ADMIN_VERIFY: `${API_BASE_URL}/admin/verify`,
};

// Generic REST API Fetch Helper for Admin
export async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Admin REST API Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[Admin REST API] Call to ${endpoint} failed. Falling back to local state.`, error);
    throw error;
  }
}
