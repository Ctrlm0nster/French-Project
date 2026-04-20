/**
 * Serverless function to serve public configuration to the frontend at runtime.
 * This pulls keys from Vercel's private environment variables.
 */
export default function handler(req, res) {
  // Only expose keys that are safe for the browser
  const publicConfig = {
    SUPABASE_URL: process.env.PARTH_SUPABASE_URL || process.env.SUPABASE_URL || "",
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_PARTH_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "",
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "",
  };

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).json(publicConfig);
}
