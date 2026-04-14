# 🎬 Cinémathèque

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20JS%20%7C%20Supabase%20%7C%20Groq-blue?style=flat-square)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Cinémathèque** is a premium, high-performance web platform dedicated to the exploration of French cinema. Built with a focus on modern aesthetics (Glassmorphism) and cutting-edge API integrations, it provides a seamless experience for discovering movies, series, and theater locations.

---

## ✨ Key Features

- **🤖 AI Ciné-Chatbot**: A secure, context-aware chatbot powered by the **Groq SDK** and Llama 3 models, designed to answer queries about cinema history and provide recommendations.
- **📡 Live Data Sync**: Real-time metadata enrichment using the **TMDB API** and **Supabase**, ensuring always-up-to-date movie details, posters, and ratings.
- **🗺️ Interactive Theater Map**: Custom-styled exploration of cinemas and theaters via the **Google Maps JavaScript API**.
- **🎭 Premium UI/UX**:
  - **Glassmorphism Design**: Elegant visuals with frosted glass components.
  - **Intelligent Micro-interactions**: 3D tilt effects, magnetic buttons, and custom animated cursors.
  - **Dynamic Filtering**: Real-time search and pagination for movies and series.
- **🔒 Secure Architecture**: Robust serverless backend via Vercel Functions to hide sensitive API keys (TMDB, Groq).

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
   Create a `.env.local` file in the root directory:
   ```bash
   # Database (Supabase)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-key

   # AI (Groq)
   GROQ_API_KEY=gsk_your_key

   # External Data (TMDB & Maps)
   TMDB_API_KEY=your_tmdb_key
   GOOGLE_MAPS_API_KEY=your_maps_key
   ```

4. **Run the Development Server**:
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
│   └── theater.html    # Map-based Theater Finder
├── docs/               # Production Build (Vercel Output)
├── build.mjs           # Build & Sync script
└── vercel.json         # Deployment configuration
```

---

## 🏗️ Deployment

This project is optimized for [Vercel](https://vercel.com).

1. **Auto-deploy**: Connect your GitHub repository to Vercel.
2. **Environment Variables**: Add `GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `TMDB_API_KEY`, and `GOOGLE_MAPS_API_KEY` to the Vercel dashboard.
3. **Build Command**: The system automatically runs `npm run build` to sync assets and compile the `/docs` directory.

---

## 📜 Credits

- **Developer**: Parth Sachin Bhardwaj
- **Data Souces**: [The Movie Database (TMDB)](https://www.themoviedb.org/), [Supabase](https://supabase.com/)
- **AI Inference**: [Groq](https://groq.com/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
