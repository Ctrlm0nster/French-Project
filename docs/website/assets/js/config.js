/**
 * Frontend config (single source of truth).
 * Keep only public, browser-safe values here.
 * Server-only secrets must stay in backend env vars and never be baked into docs/.
 */
window.APP_CONFIG = {
  SUPABASE_URL: "VOTRE_SUPABASE_URL",
  SUPABASE_ANON_KEY: "VOTRE_SUPABASE_ANON_KEY",
  GOOGLE_MAPS_API_KEY: "VOTRE_GOOGLE_MAPS_API_KEY",
  CHAT_API_URL: "",
};
