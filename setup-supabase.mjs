import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://opcktewzfwgivnlhlezb.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wY2t0ZXd6ZndnaXZubGhsZXpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIyODY5NywiZXhwIjoyMDkwODA0Njk3fQ.3c4REYn6pffBzXZVAuSWnF3_fY9W6A-jSvXjBjZJwBk';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function pushData() {
  console.log('🚀 Starting Supabase data synchronization...');

  // 1. Load local data
  const loadJSON = (file) => {
    const filePath = path.join(__dirname, 'website', 'assets', 'data', file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      console.error(`❌ Failed to load ${file}:`, err.message);
      return [];
    }
  };

  const movies = loadJSON('movies.json');
  const series = loadJSON('series.json');
  const documentaries = loadJSON('documentaries.json');

  console.log(`📊 Loaded: ${movies.length} movies, ${series.length} series, ${documentaries.length} documentaries.`);

  // 2. Clear existing entries
  console.log('🧹 Clearing previous entries...');
  
  const clearTable = async (table) => {
    const { error } = await supabase.from(table).delete().neq('id', -1);
    if (error) console.error(`❌ Error clearing ${table}:`, error.message);
    else console.log(`✅ Table ${table} cleared.`);
  };

  await clearTable('movies');
  await clearTable('series');
  // Check if documentaries table exists before clearing
  const { error: docTableError } = await supabase.from('documentaries').select('id').limit(1);
  if (!docTableError) {
    await clearTable('documentaries');
  } else {
    console.warn('⚠️  Documentaries table might not exist yet.');
  }

  // 3. Helper to format data for Supabase (removing extra fields if necessary)
  const formatMovie = (m) => ({
    title: m.title,
    year: m.year,
    director: m.director,
    genre: m.genre,
    image: m.image
  });

  const formatSeries = (s) => ({
    title: s.title,
    genre: s.genre,
    year: s.year,
    episodes: s.episodes || 0,
    image: s.image
  });

  const formatDoc = (d) => ({
    title: d.title,
    year: d.year,
    director: d.director || d.author || 'Inconnu',
    genre: d.genre || 'Documentaire',
    image: d.image
  });

  // 4. Push data
  console.log('📤 Uploading new data...');

  if (movies.length > 0) {
    const { error } = await supabase.from('movies').insert(movies.map(formatMovie));
    if (error) console.error('❌ Error uploading movies:', error.message);
    else console.log('✅ Movies uploaded successfully.');
  }

  if (series.length > 0) {
    const { error } = await supabase.from('series').insert(series.map(formatSeries));
    if (error) console.error('❌ Error uploading series:', error.message);
    else console.log('✅ Series uploaded successfully.');
  }

  if (documentaries.length > 0 && !docTableError) {
    const { error } = await supabase.from('documentaries').insert(documentaries.map(formatDoc));
    if (error) console.error('❌ Error uploading documentaries:', error.message);
    else console.log('✅ Documentaries uploaded successfully.');
  }

  console.log('🎉 Supabase synchronization complete!');
}

pushData().catch(err => {
  console.error('💥 Fatal error during sync:', err);
  process.exit(1);
});
