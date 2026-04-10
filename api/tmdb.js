export default async function handler(req, res) {
  const { id, type } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!id || !type) {
    return res.status(400).json({ error: "Missing id or type" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "TMDB_API_KEY not configured" });
  }

  const tmdbType = type === "series" ? "tv" : "movie";
  const url = `https://api.themoviedb.org/3/${tmdbType}/${id}?language=fr-FR&append_to_response=credits,videos`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("TMDB Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
}
