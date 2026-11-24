/**
 * Database Mappers & Supabase Decommission Stub
 *
 * NOTE: As of the Laravel + MySQL migration, all direct Supabase communication
 * is permanently retired. All database operations execute through the
 * Laravel 11 REST API (/api/v1).
 */

import { mapFromDb, mapToDb } from './dataMapper';

// Decommissioned stub: throws error if any legacy code attempts direct Supabase communication
export const supabase = new Proxy({}, {
  get: (_target, prop) => {
    throw new Error(
      `[MacroSync Migration] Direct Supabase access is decommissioned. ` +
      `All operations must use the Laravel REST API.`
    );
  }
});

// Re-export standard database mapping helpers
export { mapFromDb, mapToDb };
