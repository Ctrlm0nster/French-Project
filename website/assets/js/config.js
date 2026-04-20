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
