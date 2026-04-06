export default function handler(req, res) {
  // Return the API key from Vercel's backend environment variables
  res.status(200).json({
    key: process.env.NEXT_PUBLIC_OPENAI_API_KEY || ""
  });
}
