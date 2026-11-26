/**
 * KM100 Laravel REST API Client
 *
 * Communicates with Laravel 11 Backend under /api/v1 with Laravel Sanctum
 * session cookie and Bearer token fallback.
 */

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : 'http://localhost:8000/api/v1';

const SANCTUM_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

export const TOKEN_STORAGE_KEY = 'km100_auth_token';
export const USER_STORAGE_KEY = 'km100_current_user';

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to update auth token in storage:', e);
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to update stored user:', e);
  }
}

/**
 * Extract XSRF-TOKEN cookie value for CSRF protection
 */
function getXsrfToken() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(XSRF-TOKEN)=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Initialize CSRF cookie for Sanctum SPA requests
 */
export async function initCsrf() {
  try {
    await fetch(`${SANCTUM_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
  } catch (err) {
    console.warn('Could not initialize Sanctum CSRF cookie:', err);
  }
}

/**
 * Core HTTP Request Wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const token = getAuthToken();
  const xsrf = getXsrfToken();

  const headers = {
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // Enables Sanctum cookie session
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    console.error(`API Network Error [${options.method || 'GET'} ${url}]:`, networkError);
    throw new Error('Backend server is unreachable. Please ensure the Laravel server is running on port 8000.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get(endpoint, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    const fullPath = queryString ? `${endpoint}?${queryString}` : endpoint;
    return request(fullPath, { method: 'GET' });
  },

  post(endpoint, body = {}) {
    const isFormData = body instanceof FormData;
    return request(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  put(endpoint, body = {}) {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    const fullPath = queryString ? `${endpoint}?${queryString}` : endpoint;
    return request(fullPath, { method: 'DELETE' });
  },

  /**
   * Upload binary multipart file to storage
   */
  uploadFile(file, folder = 'documents') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return request('/files/upload', {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Multimodal receipt extraction via server-side Gemini Vision AI
   */
  processOcr(image, receiptType = null) {
    return request('/ocr/process', {
      method: 'POST',
      body: JSON.stringify({
        image,
        receipt_type: receiptType,
      }),
    });
  },

  /**
   * Conversational text generation / chatbot assistant via Gemini AI
   */
  generateAiContent(prompt, systemInstruction = null, model = null) {
    return request('/gemini/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        system_instruction: systemInstruction,
        model,
      }),
    });
  },

  /**
   * Health check for server-side Gemini AI service
   */
  checkGeminiHealth() {
    return request('/gemini/health', {
      method: 'GET',
    });
  },
};

export default api;
