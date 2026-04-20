/**
 * Serverless function to serve public configuration to the frontend at runtime.
 * This pulls keys from Vercel's private environment variables.
 */
function firstDefined(keys) {
  for (const key of keys) {
    const value = String(process.env[key] || "").trim();
    if (value) {
      return value;
    }
  }

  return "";
}

export default function handler(req, res) {
  // Only expose keys that are safe for the browser
  const publicConfig = {
    SUPABASE_URL: firstDefined([
      "NEXT_PUBLIC_PARTH_SUPABASE_URL",
      "PARTH_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_URL",
    ]),
    SUPABASE_ANON_KEY: firstDefined([
      "NEXT_PUBLIC_PARTH_SUPABASE_ANON_KEY",
      "PARTH_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_ANON_KEY",
    ]),
    GOOGLE_MAPS_API_KEY: firstDefined([
      "GOOGLE_MAPS_API_KEY",
      "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
      "NEXT_PUBLIC_PARTH_GOOGLE_MAPS_API_KEY",
      "PARTH_GOOGLE_MAPS_API_KEY",
    ]),
  };

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).json(publicConfig);
}
