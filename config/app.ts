// Application Configuration

// Set to true to use Supabase, false to use mock data
// Important: Configure Supabase first (see /SUPABASE_SETUP.md) before enabling
export const USE_SUPABASE = false;

// Set to true to use the local Express backend
export const USE_LOCAL_BACKEND = true;

// API base URL for the local backend
export const API_BASE_URL = (typeof process !== 'undefined' && process.env?.API_BASE_URL) ||
  (import.meta as any).env?.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

// Feature flags
export const FEATURES = {
  faceRecognition: true,
  geolocation: true,
  realTimeMonitoring: true,
  aiAlerts: true,
};

// App constants
export const APP_CONFIG = {
  verificationFrequency: 90, // minutes
  defaultSiteRadius: 100, // meters
  aiConfidenceThreshold: 70, // percentage
  maxCheckInsPerDay: 20,
};