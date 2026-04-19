# 🎬 Cinémathèque

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20JS%20%7C%20Supabase%20%7C%20Groq-blue?style=flat-square)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Cinémathèque** is a premium, high-performance web platform dedicated to the exploration of French cinema. Built with a focus on modern aesthetics (Glassmorphism) and curated API integrations, it provides a seamless experience for discovering movies, series, documentaries, and theater locations.

---

## ✨ Key Features

- **🤖 AI Ciné-Chatbot**: A server-protected, context-aware chatbot powered by the **Groq SDK** and Llama 3 models, designed to answer queries about cinema history and provide recommendations.
- **📡 Live Data Sync**: Real-time metadata enrichment using the **TMDB API** and **Supabase**, ensuring always-up-to-date movie details, posters, and ratings.
- **🗺️ Interactive Theater Map**: Custom-styled exploration of cinemas and theaters via the **Google Maps JavaScript API**, loaded at runtime from public browser config.
- **🎭 Premium UI/UX**:
  - **Glassmorphism Design**: Elegant visuals with frosted glass components.
  - **Intelligent Micro-interactions**: 3D tilt effects, magnetic buttons, and custom animated cursors.
  - **Dynamic Filtering**: Real-time search and pagination for movies and series.
- **🔒 Secure Architecture**: Vercel Functions keep server-only secrets such as **GROQ_API_KEY** and **TMDB_API_KEY** off the client, while browser-safe public config lives in `website/assets/js/config.js`.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, Modern JavaScript (ES6+), Custom CSS3 (Aesthetic-first approach).
- **Backend & Database**: 
  - [**Supabase**](https://supabase.com/) (Cloud Database & Auth)
  - [**Vercel Serverless Functions**](https://vercel.com/features/serverless-functions) (Node.js API Proxies)
- **AI**: [**Groq SDK**](https://groq.com/) (High-speed LLM inference).
- **APIs**: TMDB (Metadata), Google Maps & Places (Geospatial).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Vercel CLI (`npm i -g vercel`)

### Local Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ctrlm0nster/French-Project.git
   cd French-Project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory for server-side secrets and sync scripts:
   ```bash
   # AI (Groq)
   GROQ_API_KEY=gsk_your_key

   # External Data (TMDB)
   TMDB_API_KEY=your_tmdb_key

   # Optional: used by setup-supabase.mjs
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Configure browser-safe public keys** in `website/assets/js/config.js`:
   ```javascript
   window.APP_CONFIG = {
     SUPABASE_URL: "https://your-project.supabase.co",
     SUPABASE_ANON_KEY: "your-public-anon-key",
     GOOGLE_MAPS_API_KEY: "your-browser-key",
     CHAT_API_URL: "",
   };
   ```
   Restrict `GOOGLE_MAPS_API_KEY` by HTTP referrer in Google Cloud Console.

5. **Run the Development Server**:
   ```bash
   vercel dev
   ```
   Open `http://localhost:3000` to view the project.

---

## 📦 Project Structure

```text
├── api/                # Vercel Serverless Functions (Chat & Proxy)
├── website/            # Main Source Code
│   ├── assets/         # Posters, Data (JSON), and Icons
│   ├── index.html      # Landing Page
│   ├── movies.html     # Movie Explorer
│   ├── series.html     # Series Catalog
│   └── theaters.html   # Map-based Theater Finder
├── docs/               # Production Build (Vercel Output)
├── build.mjs           # Build & Sync script
├── scripts/validate.mjs # Safety checks for config/build output
└── vercel.json         # Deployment configuration
```

---

## 🏗️ Deployment

This project is optimized for [Vercel](https://vercel.com).

1. **Auto-deploy**: Connect your GitHub repository to Vercel.
2. **Environment Variables**: Add `GROQ_API_KEY` and `TMDB_API_KEY` to the Vercel dashboard. Only add Supabase service credentials there if you use the sync scripts.
3. **Public Config**: Keep `website/assets/js/config.js` limited to browser-safe values such as the Supabase public URL, anon key, and a referrer-restricted Google Maps key.
4. **Build Command**: Run `npm run build` to copy the static site into `/docs` without injecting secrets, then `npm run validate` to verify the output is safe.

---

## 📜 Credits

- **Developer**: Parth Sachin Bhardwaj
- **Data Souces**: [The Movie Database (TMDB)](https://www.themoviedb.org/), [Supabase](https://supabase.com/)
- **AI Inference**: [Groq](https://groq.com/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
