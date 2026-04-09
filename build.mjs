import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env file into process.env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value;
        }
    });
}
const srcDir = path.join(__dirname, 'website');
const destDir = path.join(__dirname, 'docs');

// Keep docs/ in sync with website/ by removing stale files before copy.
if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
}

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
            }

            fs.writeFileSync(destPath, content);
        }
    }
}

console.log('Building project: Injecting environment variables...');
processDirectory(srcDir, destDir);
console.log('Build complete: Files synced to docs/');
