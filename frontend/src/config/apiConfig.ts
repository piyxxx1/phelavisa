// Centralized REST API Configuration for Frontend App
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
export const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';

export const ENDPOINTS = {
  // Visas Data Endpoints
  VISAS: `${API_BASE_URL}/visas`,
  VISA_BY_ID: (id: string) => `${API_BASE_URL}/visas/${id}`,
  
  // Applications & Orders Endpoints
  APPLICATIONS: `${API_BASE_URL}/applications`,
  APPLICATION_BY_ID: (id: string) => `${API_BASE_URL}/applications/${id}`,
  
  // B2B Partner Submissions Endpoints
  B2B_PARTNERS: `${API_BASE_URL}/b2b/partners`,
  
  // Auth Endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
};

// Generic REST API Fetch Helper
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`REST API Error ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[REST API] Call to ${endpoint} failed. Using client fallback mode.`, error);
    throw error;
  }
}
