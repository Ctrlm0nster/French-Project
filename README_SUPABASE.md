# Supabase Integration | Cinémathèque

This project uses **Supabase** as its primary cloud database and backend service to manage the Cinémathèque catalogue dynamically. It follows a "Cloud-First, Local-Fallback" architecture to ensure maximum reliability.

## 🏗️ Architecture Overview

1.  **Cloud Database**: Stores the curated list of movies, series, and documentaries.
2.  **Frontend Client**: A lightweight, dependency-free wrapper (`website/assets/js/supabase-client.js`) that interacts with the Supabase REST API via the public `anon` key.
3.  **Local Fallback**: If the Supabase service is unreachable or keys are missing, the site automatically falls back to the static JSON files in `website/assets/data/`.
4.  **Sync Tool**: A Node.js utility (`setup-supabase.mjs`) to synchronize local curated data with the cloud database.

---

## 🚀 Data Synchronization

To push your latest local curation to the Supabase cloud, run the following command from the project root:

```powershell
node setup-supabase.mjs
```

### What this script does:
1.  **Validates** local `movies.json`, `series.json`, and `documentaries.json`.
2.  **Clears** all existing entries in the Supabase tables to prevent duplicates.
3.  **Uploads** the fresh dataset to the cloud.

---

## 🔐 Database Configuration

### 1. Connection Keys
Public keys are managed in `website/assets/js/config.js`. These are intended for frontend use and are safe to be public as long as Row Level Security (RLS) is enabled.

```javascript
window.APP_CONFIG = {
  SUPABASE_URL: "https://opcktewzfwgivnlhlezb.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-key",
};
```

### 2. SQL Schema & Security
The database schema and security policies are defined in `website/assets/js/supabase-setup.sql`. Ensure you run this SQL in your Supabase Dashboard to set up the environment.

**Key Tables:**
*   `movies`: title, year, director, genre, image.
*   `series`: title, genre, year, episodes, image.
*   `documentaries`: title, year, director, genre, image.

**Security Policy (RLS):**
We use a **Read-Only Public Policy**. Unauthenticated users (using the `anon` key) can select records but cannot insert, update, or delete data. Administrative changes are strictly performed via the `SERVICE_ROLE_KEY` in the sync script.

```sql
CREATE POLICY "anon can read movies" ON public.movies FOR SELECT TO anon USING (true);
```

---

## 📂 File Structure

| File | Purpose |
| :--- | :--- |
| `setup-supabase.mjs` | Node.js script for bulk data uploads and synchronization. |
| `website/assets/js/supabase-client.js` | Frontend module for fetching data from the DB. |
| `website/assets/js/supabase-setup.sql` | SQL definitions for tables and security policies. |
| `website/assets/js/config.js` | Configuration file for Supabase URL and Anon Key. |

---

## 🛠️ Usage in HTML/React

To use Supabase data in any page, ensure `config.js` and `supabase-client.js` are included in the `<head>`:

```html
<script src="assets/js/config.js"></script>
<script src="assets/js/supabase-client.js"></script>
```

Then fetch data as follows:

```javascript
SupabaseClient.fetchMovies().then(movies => {
  console.log("Loaded movies:", movies);
});
```

---

*Note: For server-side secret management (like the Service Role Key), use environment variables in your deployment platform (e.g., Vercel).*
