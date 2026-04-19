const API_BASE = "https://api.themoviedb.org/3";

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function toTmdbType(type) {
  return type === "series" ? "tv" : "movie";
}

function toSearchParams(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}

async function tmdbFetch(path, apiKey, params = {}) {
  const trimmedKey = String(apiKey || "").trim();
  const isLikelyV4Bearer = trimmedKey.startsWith("eyJ");
  const authParams = isLikelyV4Bearer ? params : { ...params, api_key: trimmedKey };
  const query = toSearchParams(authParams);
  const url = `${API_BASE}${path}${query ? `?${query}` : ""}`;
  const headers = {
    accept: "application/json",
  };
  if (isLikelyV4Bearer) {
    headers.Authorization = `Bearer ${trimmedKey}`;
  }
  const response = await fetch(url, { headers });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error("TMDB request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

function scoreCandidate(candidate, tmdbType, targetTitle, targetYear) {
  const titleField = tmdbType === "tv" ? candidate.name : candidate.title;
  const originalTitleField = tmdbType === "tv" ? candidate.original_name : candidate.original_title;
  const candidateYear = tmdbType === "tv"
    ? Number(String(candidate.first_air_date || "").slice(0, 4))
    : Number(String(candidate.release_date || "").slice(0, 4));

  const normTargetTitle = normalizeText(targetTitle);
  const normTitle = normalizeText(titleField);
  const normOriginalTitle = normalizeText(originalTitleField);
  const numericYear = Number(targetYear || 0);

  let score = 0;

  if (candidate.original_language === "fr") score += 80;
  if (tmdbType === "tv" && Array.isArray(candidate.origin_country) && candidate.origin_country.includes("FR")) {
    score += 40;
  }
  if (normTargetTitle && normTitle === normTargetTitle) score += 35;
  if (normTargetTitle && normOriginalTitle === normTargetTitle) score += 30;
  if (normTargetTitle && (normTitle.includes(normTargetTitle) || normTargetTitle.includes(normTitle))) score += 12;
  if (numericYear && candidateYear && numericYear === candidateYear) score += 20;

  score += Number(candidate.vote_average || 0) * 0.5;
  score += Number(candidate.popularity || 0) * 0.01;

  return score;
}

function isFrenchCandidate(candidate, tmdbType) {
  if (candidate.original_language === "fr") return true;
  if (tmdbType === "tv" && Array.isArray(candidate.origin_country)) {
    return candidate.origin_country.includes("FR");
  }
  return false;
}

async function resolveByTitle({ apiKey, tmdbType, title, year, frenchOnly }) {
  const searchPath = tmdbType === "tv" ? "/search/tv" : "/search/movie";
  const yearParam = tmdbType === "tv" ? "first_air_date_year" : "year";
  const search = await tmdbFetch(searchPath, apiKey, {
    query: title,
    language: "fr-FR",
    region: "FR",
    include_adult: "false",
    page: 1,
    [yearParam]: year || undefined,
  });

  const list = Array.isArray(search.results) ? search.results : [];
  const filtered = frenchOnly ? list.filter((item) => isFrenchCandidate(item, tmdbType)) : list;
  const candidates = filtered;
  if (candidates.length === 0) return null;

  const ranked = candidates
    .map((item) => ({ item, score: scoreCandidate(item, tmdbType, title, year) }))
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) return null;
  
  const best = ranked[0].item;
  // Final safeguard: if frenchOnly is true, the best candidate MUST be French
  if (frenchOnly && !isFrenchCandidate(best, tmdbType)) {
    return null;
  }

  return best;
}

async function fetchDetails(apiKey, tmdbType, id) {
  return tmdbFetch(`/${tmdbType}/${id}`, apiKey, {
    language: "fr-FR",
    append_to_response: "credits,videos",
  });
}

export default async function handler(req, res) {
  const { id, type, title, year, frenchOnly } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!type) {
    return res.status(400).json({ error: "Missing type" });
  }
  if (!id && !title) {
    return res.status(400).json({ error: "Missing id or title" });
  }
  if (!apiKey) {
    return res.status(500).json({ error: "TMDB_API_KEY not configured" });
  }

  const tmdbType = toTmdbType(type);
  const enforceFrenchOnly = String(frenchOnly || "1") !== "0";

  try {
    let details = null;
    let source = "id";

    // 1. Try by ID if provided
    if (id) {
      try {
        const potentialDetails = await fetchDetails(apiKey, tmdbType, id);
        if (potentialDetails && (!enforceFrenchOnly || isFrenchCandidate(potentialDetails, tmdbType))) {
          details = potentialDetails;
          source = "id";
        }
      } catch (e) {
        console.warn("TMDB ID fetch failed, will try title search:", id);
      }
    }

    // 2. Try by Title if no details yet or title provided
    if (!details && title) {
      const match = await resolveByTitle({
        apiKey,
        tmdbType,
        title,
        year,
        frenchOnly: enforceFrenchOnly,
      });
      if (match && match.id) {
        details = await fetchDetails(apiKey, tmdbType, match.id);
        source = "title";
      }
    }

    if (!details) {
      return res.status(404).json({ error: "No suitable French TMDB match found" });
    }

    details._resolvedBy = source;
    return res.status(200).json(details);
  } catch (error) {
    console.error("TMDB Proxy Error:", error?.data || error);
    const status = Number(error?.status) || 500;
    return res.status(status).json(error?.data || { error: "Failed to fetch from TMDB" });
  }
}
