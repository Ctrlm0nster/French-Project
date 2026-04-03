window.APP_CONFIG = {
  // Supabase Public Keys (Safe for frontend)
  SUPABASE_URL: "https://opcktewzfwgivnlhlezb.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wY2t0ZXd6ZndnaXZubGhsZXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjg2OTcsImV4cCI6MjA5MDgwNDY5N30.qerv1Wr1pEH6hjH8Q7UidG5fG55IQHqXzzNOSwOfLXM",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_E-CW1Pww-lbMLwhGXB1-Dg_Xo9mRfBz",

  // Database Configuration (non-sensitive info only)
  POSTGRES_DATABASE: "postgres",
  POSTGRES_HOST: "db.opcktewzfwgivnlhlezb.supabase.co",
  POSTGRES_USER: "postgres",

  // Google Maps API
  GOOGLE_MAPS_API_KEY: "YOUR_GOOGLE_MAPS_API_KEY"

  // NOTE: Server-side secrets (SERVICE_ROLE_KEY, JWT_SECRET, POSTGRES_PASSWORD, etc.)
  // should NEVER be included in frontend code.
  // Store them in backend environment variables only (.env file on server).
};