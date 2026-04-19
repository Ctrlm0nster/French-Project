import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env and .env.local files into process.env
['.env', '.env.local'].forEach(envFile => {
    const envPath = path.join(__dirname, envFile);
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
                if (!process.env[key.trim()]) {
                    process.env[key.trim()] = value;
                }
            }
        });
    }
});
const srcDir = path.join(__dirname, 'website');
const destDocsDir = path.join(__dirname, 'docs');
const destSiteDir = path.join(destDocsDir, 'website');

// Function to recursively copy and process files
function processDirectory(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            processDirectory(srcPath, destPath);
        } else {
            if (srcPath.endsWith('.html') || srcPath.endsWith('.js')) {
                let content = fs.readFileSync(srcPath, 'utf8');
                // Replace process.env placeholders with actual values from the environment
                const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "YOUR_OPENAI_API_KEY";
                content = content.replace(/(process\.env\.NEXT_PUBLIC_OPENAI_API_KEY|"YOUR_OPENAI_API_KEY")/g, `"${openaiKey}"`);

                const supabaseUrl = process.env.PARTH_SUPABASE_URL || process.env.SUPABASE_URL || "VOTRE_SUPABASE_URL";
                content = content.replace(/VOTRE_SUPABASE_URL/g, supabaseUrl);

                const supabaseAnonKey = process.env.NEXT_PUBLIC_PARTH_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "VOTRE_SUPABASE_ANON_KEY";
                content = content.replace(/VOTRE_SUPABASE_ANON_KEY/g, supabaseAnonKey);

                const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY || "VOTRE_GOOGLE_MAPS_API_KEY";
                content = content.replace(/VOTRE_GOOGLE_MAPS_API_KEY/g, googleMapsKey);
                // Also handle old placeholder if any
                content = content.replace(/VOTRE_CLE_API/g, googleMapsKey);

                fs.writeFileSync(destPath, content, 'utf8');
            } else {
                // Copy binary files directly
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

console.log('Building project: Injecting environment variables...');

// Clear old docs
if (fs.existsSync(destDocsDir)) {
    fs.rmSync(destDocsDir, { recursive: true, force: true });
}
fs.mkdirSync(destDocsDir, { recursive: true });

processDirectory(srcDir, destSiteDir);

// Copy root index.html to docs/index.html
const rootIndexSrc = path.join(__dirname, 'index.html');
if (fs.existsSync(rootIndexSrc)) {
    fs.copyFileSync(rootIndexSrc, path.join(destDocsDir, 'index.html'));
}

console.log('Build complete: Files synced to docs/');
