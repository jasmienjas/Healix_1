// Base URL for API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

// Other configuration constants can be added here
export const JWT_STORAGE_KEY = 'healix_jwt';
export const USER_STORAGE_KEY = 'healix_user'; 