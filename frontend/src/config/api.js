// API configuration
// In production, this will use the VITE_API_URL environment variable
// In development, it defaults to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  HERBS: `${API_BASE_URL}/api/herbs`,
  HERB_BY_SLUG: (slug) => `${API_BASE_URL}/api/herbs/slug/${encodeURIComponent(slug)}`,
  HERB_BY_ID: (id) => `${API_BASE_URL}/api/herbs/${id}`,
  HEALTH: `${API_BASE_URL}/api/health`,
};

export default API_BASE_URL;

