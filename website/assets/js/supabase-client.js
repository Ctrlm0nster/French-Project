/**
 * Supabase Client Module for Cinémathèque
 * Provides a lightweight wrapper around the Supabase REST API
 * for fetching movies and series data.
 * 
 * Uses the public anon key from config.local.js (window.APP_CONFIG).
 * Falls back to local JSON files if Supabase is unavailable.
 */

const SupabaseClient = (() => {
  // Get config from window.APP_CONFIG (loaded from config.local.js)
  const getConfig = () => {
    const config = window.APP_CONFIG || {};
    return {
      url: config.SUPABASE_URL || '',
      anonKey: config.SUPABASE_ANON_KEY || '',
    };
  };

  /**
   * Fetch data from a Supabase table via REST API.
   * @param {string} table - Table name (e.g., 'movies', 'series')
   * @param {object} options - Query options
   * @param {string} options.select - Columns to select (default: '*')
   * @param {string} options.order - Order by column (e.g., 'year.desc')
   * @param {number} options.limit - Limit number of rows
   * @returns {Promise<Array>} - Array of rows
   */
  async function fetchFromTable(table, options = {}) {
    const { url, anonKey } = getConfig();

    if (!url || !anonKey) {
      console.warn('[Supabase] Missing URL or Anon Key in APP_CONFIG. Falling back to local data.');
      return null;
    }

    const params = new URLSearchParams();
    params.set('select', options.select || '*');

    if (options.order) {
      params.set('order', options.order);
    }

    if (options.limit) {
      params.set('limit', String(options.limit));
    }

    const endpoint = `${url}/rest/v1/${table}?${params.toString()}`;

    try {
      const response = await fetch(endpoint, {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[Supabase] Error fetching ${table}:`, response.status, errorBody);
        return null;
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(`[Supabase] Network error fetching ${table}:`, err);
      return null;
    }
  }

  /**
   * Fetch movies from Supabase with fallback to local JSON.
   * @returns {Promise<Array>} - Array of movie objects
   */
  async function fetchMovies() {
    console.log('[Supabase] Fetching movies from Supabase...');
    const data = await fetchFromTable('movies', { order: 'year.asc' });

    if (data !== null && data.length > 0) {
      console.log(`[Supabase] ✓ Loaded ${data.length} movies from Supabase`);
      return data;
    }

    console.warn('[Supabase] Falling back to local movies.json');
    return fetchLocalJSON('assets/data/movies.json');
  }

  /**
   * Fetch series from Supabase with fallback to local JSON.
   * @returns {Promise<Array>} - Array of series objects
   */
  async function fetchSeries() {
    console.log('[Supabase] Fetching series from Supabase...');
    const data = await fetchFromTable('series', { order: 'year.desc' });

    if (data !== null && data.length > 0) {
      console.log(`[Supabase] ✓ Loaded ${data.length} series from Supabase`);
      return data;
    }

    console.warn('[Supabase] Falling back to local series.json');
    return fetchLocalJSON('assets/data/series.json');
  }

  /**
   * Fetch local JSON file as fallback.
   * @param {string} path - Relative path to JSON file
   * @returns {Promise<Array>}
   */
  async function fetchLocalJSON(path) {
    try {
      const response = await fetch(path);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(`[Supabase] Failed to load local fallback: ${path}`, err);
      return [];
    }
  }

  // Public API
  return {
    fetchMovies,
    fetchSeries,
    fetchFromTable,
  };
})();
