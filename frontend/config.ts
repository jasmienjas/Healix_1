// Base URL for API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'https://healix-backend.onrender.com';

// Other configuration constants can be added here
export const JWT_STORAGE_KEY = 'healix_jwt';
export const USER_STORAGE_KEY = 'healix_user'; 