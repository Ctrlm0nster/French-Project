# Cinémathèque Website

This repository contains a **dynamic website** built from Stitch MCP screens, deployed via **Vercel**. It integrates live data from external APIs to power key features.

## Dynamic Data Integrations

### Supabase API

The site connects to a [Supabase](https://supabase.com/) backend to fetch and display dynamic content across the site. Movie and series metadata, user data, and other structured content are served in real time from the Supabase database via its REST API.

- **Used for:** Fetching movies, series, and related metadata dynamically at runtime.
- **Configuration:** Set your Supabase project URL and public anon key as Vercel environment variables (see [Vercel Deployment](#vercel-deployment) below).

### Google Maps API — `/theater` Page

The **Theater page** (`/theater`) uses the [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript) to display an interactive map with cinema and theater locations.

- **Used for:** Rendering a live map with markers for cinemas/theaters.
- **Configuration:** A valid Google Maps API key with the **Maps JavaScript API** and **Places API** enabled is required (see [Vercel Deployment](#vercel-deployment) below).

---

## Configuration

API keys are managed as environment variables. For local development, create a `.env.local` file at the project root:

```bash
# .env.local — never commit this file
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

> ⚠️ **Never commit secret keys to the repository.** Use Vercel's Environment Variables dashboard for production.

---

## Vercel Deployment

This site is deployed on [Vercel](https://vercel.com/). Every push to `main` triggers an automatic production deployment.

### First-time setup

1. Import the repository in the [Vercel dashboard](https://vercel.com/new).
2. Set the **Root Directory** to `website/` (the folder containing `index.html`).
3. Add the following **Environment Variables** under **Project Settings → Environment Variables**:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase public anon key |
| `GOOGLE_MAPS_API_KEY` | Your Google Maps API key |

1. Click **Deploy**.

### Preview deployments

Every pull request automatically gets a unique preview URL from Vercel, making it easy to review changes before merging to `main`.

---

## Local Testing

### With Vercel CLI (recommended)

1. Install the [Vercel CLI](https://vercel.com/docs/cli):

   ```bash
   npm i -g vercel
   ```

2. Pull environment variables locally:

   ```bash
   vercel env pull .env.local
   ```

3. Start the local dev server:

   ```bash
   vercel dev
   ```

4. Open `http://localhost:3000`

### Without CLI

1. Copy `website/assets/js/config.example.js` to `website/assets/js/config.local.js` and add your API keys.
2. `cd website`
3. `python -m http.server 8000`
4. Open `http://localhost:8000`

---

## Content Structure

```
website/              # Editable source files
website/assets/       # Posters, metadata, and JS config
website/index.html    # Home page
website/theater.html  # Theater map page (Google Maps API)
website/movies.html   # Movies page (Supabase data)
website/series.html   # Series page (Supabase data)
.env.local            # Local environment variables (never commit)
vercel.json           # Vercel configuration (optional)
```

---

## Adding Series / Movie Posters

1. Add poster images to `website/assets/posters/`.
2. Add content metadata in `website/assets/movies/` and `website/assets/series/`.
3. Update `website/movies.html` or `website/series.html` with relative image paths, or update the Supabase records to reference the new assets.
4. Push to `main` — Vercel will redeploy automatically.

---

## API Reference

| API | Purpose | Docs |
|-----|---------|------|
| Supabase REST API | Dynamic movie/series data | [supabase.com/docs](https://supabase.com/docs) |
| Google Maps JavaScript API | Theater map with markers | [developers.google.com/maps](https://developers.google.com/maps/documentation/javascript) |
| Google Places API | Theater location details | [developers.google.com/maps/places](https://developers.google.com/maps/documentation/places/web-service) |
