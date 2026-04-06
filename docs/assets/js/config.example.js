/**
 * Example config — copy to config.local.js and set your project values.
 * Never commit config.local.js (see .gitignore).
 *
 * Mapping from Vercel / .env (Next.js) to this file:
 *   PARTH_SUPABASE_URL or NEXT_PUBLIC_* URL → SUPABASE_URL (must be https://…supabase.co)
 *   NEXT_PUBLIC_PARTH_SUPABASE_ANON_KEY → SUPABASE_ANON_KEY (public JWT; safe in browser)
 *
 * Never put in the website: PARTH_SUPABASE_SERVICE_ROLE_KEY, PARTH_SUPABASE_SECRET_KEY,
 * PARTH_SUPABASE_JWT_SECRET, PARTH_POSTGRES_*, PRISMA URLs — those are server-only secrets.
 */
window.APP_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
  GOOGLE_MAPS_API_KEY: "YOUR_GOOGLE_MAPS_API_KEY",
};
