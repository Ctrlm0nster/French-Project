import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, 'website');
const destDir = path.join(__dirname, 'docs');

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
                const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "YOUR_OPENAI_API_KEY";
                content = content.replace(/(process\.env\.NEXT_PUBLIC_OPENAI_API_KEY|"YOUR_OPENAI_API_KEY")/g, `"${apiKey}"`);
            }

            fs.writeFileSync(destPath, content);
        }
    }
}

console.log('Building project: Injecting environment variables...');
processDirectory(srcDir, destDir);
console.log('Build complete: Files synced to docs/');
