/**
 * Frontend config (single source of truth).
 * Keep only public placeholders in source control.
 * The docs build can replace these from .env / .env.local for browser-safe keys only.
 */
window.APP_CONFIG = {
  SUPABASE_URL: "VOTRE_SUPABASE_URL",
  SUPABASE_ANON_KEY: "VOTRE_SUPABASE_ANON_KEY",
  GOOGLE_MAPS_API_KEY: "VOTRE_GOOGLE_MAPS_API_KEY",
  CHAT_API_URL: "",
};

// Runtime Pull: Fetch public keys from Vercel Serverless Function
// This works both in production and locally with 'vercel dev'
fetch('/api/public-config')
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(data => {
    if (data) {
      console.log("[Config] Dynamic configuration loaded from API.");
      Object.assign(window.APP_CONFIG, data);
      window.dispatchEvent(new CustomEvent('configReady', { detail: data }));
    }
  })
  .catch(() => {
    console.log("[Config] Runtime pull skipped or failed. Using local defaults.");
  });

