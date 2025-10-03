import axios from "axios";

// Extend Window interface to include RUNTIME_ENV
declare global {
  interface Window {
    RUNTIME_ENV?: {
      API_BASE_URL?: string;
    };
  }
}

const apiBaseUrl = window?.RUNTIME_ENV?.API_BASE_URL ?? "http://localhost:8000";

const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

// Response interceptor to handle errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default http;
