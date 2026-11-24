/**
 * System Cache Service for PETC Inventory & Scanned Receipt Records
 *
 * Implements Multi-User & Multi-Branch Scoped Cache Storage with
 * Stale-While-Revalidate loading.
 *
 * When switching between Admin and Employee accounts, the user's specific
 * branch records are rendered in 0ms directly from dedicated local cache slots,
 * eliminating all switching lag while maintaining strict isolation.
 */

import { getStoredUser } from './api';

const GLOBAL_CACHE_PREFIX = 'petc_cache_v3';

// Automatically purge legacy mock-polluted caches on load
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const keysToPurge = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('petc_cache_v2') || k.startsWith('petc_cache_v1') || k.startsWith('petc_inventory_items_cache'))) {
        keysToPurge.push(k);
      }
    }
    keysToPurge.forEach(k => localStorage.removeItem(k));
  } catch {}
}

/**
 * Determine deterministic cache key for a given user context
 */
export function getUserCacheKey(user) {
  const targetUser = user || getStoredUser();
  if (!targetUser) return `${GLOBAL_CACHE_PREFIX}_guest`;

  const role = targetUser.role || (targetUser.isAdmin ? 'admin' : 'employee');
  if (role === 'admin') {
    return `${GLOBAL_CACHE_PREFIX}_admin_${targetUser.id || 'all'}`;
  }

  // For employee accounts, scope cache strictly to their assigned branch
  const branch = (targetUser.branch || targetUser.assignedBranch || targetUser.department || 'PETC')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');

  return `${GLOBAL_CACHE_PREFIX}_branch_${branch}`;
}

/**
 * Load cached items synchronously for a specific user/branch context
 * @param {Object} [user] - Current user context
 * @returns {Array} Cached items list or empty array
 */
export function loadUserCachedItems(user) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const key = getUserCacheKey(user);
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('[CacheService] Error reading user items cache:', err);
  }
  return [];
}

/**
 * Persists current items list to client-side localStorage under user/branch scoped key
 * @param {Array} items
 * @param {Object} [user] - Current user context
 */
export function saveUserCachedItems(user, items) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  if (!Array.isArray(items)) return;

  const key = getUserCacheKey(user);
  const timeKey = `${key}_time`;

  try {
    // 1. Try standard serialization
    localStorage.setItem(key, JSON.stringify(items));
    localStorage.setItem(timeKey, Date.now().toString());
  } catch (err) {
    console.warn('[CacheService] Storage quota reached, saving compact cache without heavy base64 images...');
    try {
      // 2. Fallback: Strip heavy base64 strings (>25KB) from filePath & previewData to avoid quota errors
      const compactItems = items.map(item => {
        const copy = { ...item };
        if (copy.filePath && copy.filePath.length > 25000) {
          copy.filePath = '';
        }
        if (copy.previewData && copy.previewData.image && copy.previewData.image.length > 25000) {
          copy.previewData = { ...copy.previewData, image: '' };
        }
        return copy;
      });

      localStorage.setItem(key, JSON.stringify(compactItems));
      localStorage.setItem(timeKey, Date.now().toString());
    } catch (innerErr) {
      console.warn('[CacheService] Fallback to minimal metadata cache:', innerErr);
      try {
        // 3. Minimal metadata fallback
        const minimalItems = items.map(({ filePath, previewData, ...rest }) => rest);
        localStorage.setItem(key, JSON.stringify(minimalItems));
        localStorage.setItem(timeKey, Date.now().toString());
      } catch (finalErr) {
        console.error('[CacheService] Failed to cache items:', finalErr);
      }
    }
  }
}

/**
 * Returns human-readable relative string of when the active user cache was last synchronized
 * @param {Object} [user]
 */
export function getCacheSyncTime(user) {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const key = getUserCacheKey(user);
    const timeKey = `${key}_time`;
    const timeStr = localStorage.getItem(timeKey);
    if (!timeStr) return null;
    const time = parseInt(timeStr, 10);
    if (isNaN(time)) return null;

    const diffSec = Math.floor((Date.now() - time) / 1000);
    if (diffSec < 15) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    return `${diffHours}h ago`;
  } catch {
    return null;
  }
}

/**
 * Clears only the active user's cache slot
 * @param {Object} [user]
 */
export function clearUserCache(user) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const key = getUserCacheKey(user);
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_time`);
  } catch (err) {
    console.warn('[CacheService] Error clearing user cache:', err);
  }
}

/**
 * Clears ALL application caches across all accounts (manual hard reset)
 */
export function clearAllCaches() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith(GLOBAL_CACHE_PREFIX) || k.startsWith('petc_inventory_items_cache'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (err) {
    console.warn('[CacheService] Error clearing all caches:', err);
  }
}

/**
 * Backward compatibility aliases for existing callers
 */
export function loadCachedItems(user) {
  return loadUserCachedItems(user);
}

export function saveCachedItems(items, user) {
  return saveUserCachedItems(user, items);
}

export function clearCachedItems(user) {
  if (user) {
    clearUserCache(user);
  } else {
    // If no user specified, remove legacy key
    try {
      localStorage.removeItem('petc_inventory_items_cache_v1');
      localStorage.removeItem('petc_inventory_items_cache_time');
    } catch {}
  }
}
