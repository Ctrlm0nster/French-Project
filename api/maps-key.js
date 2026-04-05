export default function handler(req, res) {
  // Return the API key securely from Vercel's backend environment variables
  res.status(200).json({
    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || ""
  });
}
