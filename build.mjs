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
            let content = fs.readFileSync(srcPath, 'utf8');

            // Replace process.env placeholders with actual values from the environment
            if (srcPath.endsWith('.html') || srcPath.endsWith('.js')) {
                const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "YOUR_OPENAI_API_KEY";
                
                // We no longer inject GROQ_API_KEY into the frontend for security reasons.
                // It is now handled securely via /api/chat.js (Groq SDK).
                content = content.replace(/(process\.env\.NEXT_PUBLIC_OPENAI_API_KEY|"YOUR_OPENAI_API_KEY")/g, `"${openaiKey}"`);

                // Insert Google Maps API Key
                const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY || "VOTRE_CLE_API";
                content = content.replace(/VOTRE_CLE_API/g, googleMapsKey);
            }

            fs.writeFileSync(destPath, content);
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
