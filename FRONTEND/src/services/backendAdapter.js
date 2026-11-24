/**
 * KM100 Backend Adapter
 *
 * Provides a unified abstraction layer connecting the React frontend exclusively
 * to the Laravel 11 REST API + MySQL database with Sanctum authentication.
 *
 * All data operations route strictly through /api/v1 endpoints.
 */

import { api, setAuthToken, getAuthToken, setStoredUser, getStoredUser, initCsrf } from './api';

export const isLaravelDriver = () => true;

// Purge legacy sensitive browser storage on initialization
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    localStorage.removeItem('petc_employee_accounts');
    localStorage.removeItem('petc_gemini_api_key');
    localStorage.removeItem('petc_admin_token'); // purge legacy session token
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export const backend = {
  getDriver() {
    return 'laravel';
  },

  /**
   * Fetch rows for a specific receipt or inventory table
   */
  async fetchTable(tableName, filters = {}) {
    try {
      const response = await api.get('/receipts', {
        table: tableName,
        entity: filters.entity,
        year: filters.year,
        month: filters.month,
        category: filters.category,
        status: filters.status,
        search: filters.search,
        limit: filters.limit || 500,
      });
      return { data: response.data || [], error: null };
    } catch (err) {
      console.error(`[Laravel] Error fetching table ${tableName}:`, err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetch full record details (including file_path blob and preview_data)
   */
  async fetchReceiptDetails(tableName, id) {
    try {
      const response = await api.get(`/receipts/${id}`, { table: tableName });
      return { data: response.data || null, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Save (insert or upsert) a receipt record
   */
  async saveReceipt(tableName, record) {
    try {
      const payload = {
        table: tableName,
        ...record,
        year: record.year !== undefined && record.year !== null ? String(record.year) : '',
        amount: record.amount !== undefined && record.amount !== null ? Number(record.amount) : 0,
      };
      const response = await api.post('/receipts', payload);
      return { data: response.data, error: null };
    } catch (err) {
      console.error(`[Laravel] Error saving receipt to ${tableName}:`, err);
      return { data: null, error: err };
    }
  },

  /**
   * Update an existing receipt
   */
  async updateReceipt(tableName, id, updates) {
    try {
      const payload = {
        table: tableName,
        ...updates,
      };
      const response = await api.put(`/receipts/${id}`, payload);
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Delete a single receipt
   */
  async deleteReceipt(tableName, id) {
    try {
      await api.delete(`/receipts/${id}`, { table: tableName });
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  },

  /**
   * Bulk delete receipts
   */
  async bulkDeleteReceipts(tableName, ids) {
    try {
      const res = await api.post('/receipts/bulk-delete', { table: tableName, ids });
      return { data: res.data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Register a new admin account
   */
  async register(data) {
    try {
      await initCsrf();
      const response = await api.post('/auth/register', {
        name: data.name || data.fullName,
        email: data.email,
        password: data.password,
        role: data.role || 'admin',
        branch: data.branch || 'All',
        department: data.department || 'Administration',
        ...(data.authAdminEmail ? { auth_admin_email: data.authAdminEmail } : {}),
        ...(data.authAdminPassword ? { auth_admin_password: data.authAdminPassword } : {}),
      });

      const user = response.data?.user || response.user;
      const token = response.data?.token || response.token;

      // Only switch login to the new user if no existing admin session exists or explicit switch is requested
      const activeToken = getAuthToken();
      if (!activeToken || data.switchUser) {
        if (token) setAuthToken(token);
        if (user) setStoredUser(user);
      }

      return { user, token, error: null };
    } catch (err) {
      return {
        user: null,
        token: null,
        error: err.data?.message || err.message || 'Registration failed.',
      };
    }
  },

  /**
   * Authenticate user credentials
   */
  async login(email, password, portalType = 'admin') {
    try {
      await initCsrf();
      const response = await api.post('/auth/login', {
        email,
        password,
        portal_type: portalType,
      });

      const user = response.data?.user;
      const token = response.data?.token;

      if (token) setAuthToken(token);
      if (user) setStoredUser(user);

      return {
        user,
        token,
        error: null,
      };
    } catch (err) {
      return {
        user: null,
        token: null,
        error: err.data?.message || err.message || 'Login failed.',
      };
    }
  },

  /**
   * Log out currently authenticated user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Logout request completed with notice:', e);
    } finally {
      setAuthToken(null);
      setStoredUser(null);
    }
    return { error: null };
  },

  /**
   * Fetch current authenticated user
   */
  async getCurrentUser() {
    const cached = getStoredUser();
    const token = getAuthToken();
    if (!token) return null;

    try {
      const response = await api.get('/auth/me');
      if (response.data) {
        setStoredUser(response.data);
        return response.data;
      }
    } catch {
      // Fallback to cached user if offline or network error
      return cached;
    }
    return cached;
  },

  /**
   * Employee management (Admin only)
   */
  async getEmployees() {
    try {
      const res = await api.get('/employees');
      return { data: res.data || [], error: null };
    } catch (err) {
      console.error('[Laravel] Error fetching employees:', err);
      return { data: [], error: err };
    }
  },

  async createEmployee(employeeData) {
    try {
      await initCsrf();
      const res = await api.post('/employees', employeeData);
      return { data: res.data, error: null };
    } catch (err) {
      console.error('[Laravel] Error creating employee:', err);
      return { data: null, error: err };
    }
  },

  async updateEmployee(id, employeeData) {
    try {
      const res = await api.put(`/employees/${id}`, employeeData);
      return { data: res.data, error: null };
    } catch (err) {
      console.error('[Laravel] Error updating employee:', err);
      return { data: null, error: err };
    }
  },

  async deleteEmployee(id) {
    try {
      await api.delete(`/employees/${id}`);
      return { error: null };
    } catch (err) {
      console.error('[Laravel] Error deleting employee:', err);
      return { error: err };
    }
  },

  /**
   * Upload binary file to Laravel Storage
   */
  async uploadFile(file, folder = 'documents') {
    try {
      const response = await api.uploadFile(file, folder);
      return { data: response.data, error: null };
    } catch (err) {
      console.error('[Laravel Storage] Upload failed:', err);
      return { data: null, error: err };
    }
  },
};

export default backend;
