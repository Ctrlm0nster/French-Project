import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://opcktewzfwgivnlhlezb.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wY2t0ZXd6ZndnaXZubGhsZXpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIyODY5NywiZXhwIjoyMDkwODA0Njk3fQ.3c4REYn6pffBzXZVAuSWnF3_fY9W6A-jSvXjBjZJwBk';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const SQL = `
-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER,
  director TEXT,
  genre TEXT,
  image TEXT
);

-- Create series table
CREATE TABLE IF NOT EXISTS series (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT,
  year INTEGER,
  episodes INTEGER,
  image TEXT
);

-- Enable RLS
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Allow public read access on movies" ON movies;
DROP POLICY IF EXISTS "Allow public read access on series" ON series;

-- Allow public read access
CREATE POLICY "Allow public read access on movies" ON movies FOR SELECT USING (true);
CREATE POLICY "Allow public read access on series" ON series FOR SELECT USING (true);
`;

async function setup() {
  console.log('Creating tables...');

  // Use the SQL endpoint via fetch since supabase-js doesn't have raw SQL
  const sqlResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  // Try creating tables via the postgres connection string
  // Since we can't run raw SQL via REST API, let's use the Supabase Management API
  // Actually, let's use the /sql endpoint
  const mgmtResponse = await fetch(`https://api.supabase.com/v1/projects/opcktewzfwgivnlhlezb/database/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: SQL }),
  });

  console.log('Management API status:', mgmtResponse.status);
  const mgmtData = await mgmtResponse.text();
  console.log('Management API response:', mgmtData);

  // If the above doesn't work, try inserting data directly
  // (tables might already exist from dashboard setup)
  console.log('\nTrying to insert movies data...');

  const movies = [
    { title: 'La règle du jeu', year: 1939, director: 'Jean Renoir', genre: 'Nouvelle Vague', image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthf.bing.com%2Fth%2Fid%2FOIP.knQpkAnusZA5IGTRxBZ7TAAAAA%3Fcb%3Dthfc1%26pid%3DApi&f=1&ipt=434646a3f3f7ebb0fc014ddf9cae93eaa48eb7f1d707642def13c55751fae267&ipo=images' },
    { title: 'Portrait de la jeune fille en feu', year: 2019, director: 'Céline Sciamma', genre: 'Drame Psychologique', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTDICqjC3gpwmAquX9S0j7e0Hg5SXTht5ZmpaPZEZrpGWAGk_0MI60upK3SeJ7d5RrarLlzcACU__kwEbri0Oic6m1JSuTsUUXPobNjk3kZlZlguxhlBXorZcqMSFC94_Gtx4JAG_0zuBFb9EqzUUcOAZoeNgCvBaePXSkyOxpASV-kSwmzuGC_2OYB0VFymev3Vq4yMeyyKzE3hfa5QU7hLY-wvLXyVQ4rjrIle7bbf9TzyvrxBHIaj9DE6fvDLUIId0s74vrNms' },
    { title: 'La Haine', year: 1995, director: 'Mathieu Kassovitz', genre: 'Polar Français', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMchufuIsWFDWPVEPGWRJ2wmauv0MMNJumHep1-MHBqewwUX49fnxuum-Lc4xi1YGyswBiPnyPV0duVZKN9Jxd_b2q_3rfGwfI3OrqXKI7lKoAa-CXvnqT1W1D_LjQyXtPNQOxObJljhnH_LFyJbuofnFiqRa8r8BFYmNK3E506A0CFTe8xRACDAm8w5XaJX838wW2WLhGRxOgQVCZ-3GulWzQPW7gv-ODCpJ9Amy-SJdPlLMtrs1i5ucfdeYM1gfYDjxq04vvPIA' },
    { title: 'Le Samouraï', year: 1967, director: 'Jean-Pierre Melville', genre: 'Polar Français', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj6y_sAoXVX82PqjV-RqqDZqdMyEetAgG0bvVtZ9BghsBhnQmdmdJ_a0WCLfEm8_bIG2TxgDAd_2OGQgG40nmCRUPIXlJzSt7GWqbWswMSkykfWW33cCTrvgS_TYOsKWJvlzmCFJeTghUF482_Zytf9Km6uZTxq92YaMxPPyR2igHBVPw5_Q19fV165ewYgpYmy1Zd9uvSacTvW1_M8IAxCYnV82ISW9WzULbDboZMDyNkZCTbdF71KUVCR5wtPBN8chsl5xSba0U' },
  ];

  const { data: moviesData, error: moviesError } = await supabase.from('movies').insert(movies);
  console.log('Movies insert:', moviesError ? `ERROR: ${moviesError.message}` : 'SUCCESS');

  const series = [
    { title: 'Le Bureau des Légendes', genre: 'Drame', year: 2024, episodes: 8, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeah_M8qii9LF4blFI3KovBrK-s7oOLws1uZBeG9JOtq4DAQ2ZggWRzQlV2Y9BQBqlmf4ZIIl02o7EeonTfCyxcMUudkThfsNe1gAMuNsUS0PVw7t6tWFdVrfJ3zT421WqZGUEcc0vN2Dy9IMHB2WR3ZekPPsKqyULfUVUy1_K136ctGsYp-0XhocWuQ_EJvOUuBCWiHXDaaXfDydh7gTpU3RPWYj-VEO-d1pG2YwtbUmPzrq4HPR0JzqQSTNQGcYheGSBoVgeZCI' },
    { title: 'Versailles', genre: 'Histoire', year: 2015, episodes: 30, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEW4w8tggSbnTkWkn0wdgHD41_0eAF3qXvkI05dLLcncRqwUO56NUlY9NshajCI2lLfuI_9ps8W3reTIRBGpgitx2imF_meZgJjwZJfB7_MxmfjBqWFr8hKkwjtBE2CTDF0LV6PQna-lOBsPZ6sG1uucSLFl5uwuA9IAOY2DPh26_yy75xHGPMQMYo9BIa0xwfTVAHPj75mq_0YZZ32WM53Z6iyhQ2DpbtFo7u6es_XLlFAkHSc4P3rc0zL6989HWKImF9lS4VYqg' },
    { title: 'Lupin', genre: 'Polar', year: 2021, episodes: 17, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYXS5MmgN6T-GjLWKyHi955_J_jrorq9AMc6fsMH-6X_RQxVKHMndb1bXAG3bw4nmcfpr_WsRIOuCPaQlYvS-XFqTkUfComgmH3I9KiDmNSl56Ygqlrlyd8wg8W4_oocw6BvlUIyrcp0jmsYZDO4hIhtJmupW2BdYrPN3eELXKACn4tnqfboNuQcHdkukkR_4zJ6QZr3GLme5Swyd6IxpXbvGbTcFO2EgyX62S7FPbzvaa8WfUHKJvlIs7_lbczPOoE1WZqfKPyP8' },
    { title: 'Dix Pour Cent', genre: 'Comédie', year: 2015, episodes: 24, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN8rf5bTgMEhFPpQehuchaBwJ6dWqwDafP4DCjmoXAHJbpEqd9xSv0zyLJksQXI1QzY8FQ1h-aC_t2bN6kEQIVtFbuIea1GtymMD_pySls4kDfA3Ix2BqdpGNox3asjlVv9htRhgPInJBzVxdlibNXHWdsZqNXQ_poYi_63Ir3Y11Wan9OTJI_5bxFFy8jlYDuzO4qItYjnuTKOrsuq8pkP4cCj5VRuveD9zh30fSlkJQYE582GKSN5eOVSjagO7RXsEYvXvgabkc' },
    { title: 'Zone Blanche', genre: 'Drame', year: 2017, episodes: 16, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABdoag3-v4czxdmp3y8alcWGMSz32oxZlT8BWVl_41VQiaMUE01et1bnMzMNMADvd1ksQIBQJh0zSXHoVxmcU7bFKusRU_qxmhU_t0uZd7VATzLIpjsZNvHyfBOMeEe-4X0ZvsD7GMzP3a96uTAeEQOPJf3T2HOjnAd1Sp2SucNW3I6ck1u9qAGCLveeUIxZX-trDN2FGNC_cC4U8Ll2MnVcmaD5ZQW-PRyIfmoIVhsz3yVwwcuHN7FaH8yLHy2F9cz2YcBfOCUpo' },
    { title: 'Ad Vitam', genre: 'Polar', year: 2018, episodes: 6, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwRxufTuVxWayczMclhCNVjpSVnotdBPpSyRX7s8vL_hjprk0nAuMvP86wbvXRYVIYBBzf30w-O_fHIUafeoK58V2IlTuBNY1CDYjueD5MPPdz4K4d5-xSg_H-z-Jl3yFXu5tpMcQpTVSeZ5-02o34w_5aXSLiXye6p-dAlThq9DKJhCN3jGEyEwrt5ACKXF890RbeXq6b_NJvQw4rL-ktF2Fq9-2AKrrDiTnef3_iiNzRVLaiPeQUohsWp3fXnt49rptgl3aJgCc' },
  ];

  const { data: seriesData, error: seriesError } = await supabase.from('series').insert(series);
  console.log('Series insert:', seriesError ? `ERROR: ${seriesError.message}` : 'SUCCESS');

  // Test read
  console.log('\nTesting read...');
  const { data: readMovies, error: readError } = await supabase.from('movies').select('*');
  console.log('Movies read:', readError ? `ERROR: ${readError.message}` : `Got ${readMovies?.length} movies`);
  if (readMovies) console.log('First movie:', JSON.stringify(readMovies[0], null, 2));

  const { data: readSeries, error: readSeriesError } = await supabase.from('series').select('*');
  console.log('Series read:', readSeriesError ? `ERROR: ${readSeriesError.message}` : `Got ${readSeries?.length} series`);
}

setup().catch(console.error);
