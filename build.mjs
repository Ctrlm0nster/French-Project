import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, 'website');
const destDocsDir = path.join(__dirname, 'docs');
const destSiteDir = path.join(destDocsDir, 'website');

function cleanDirectory(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const entryPath = path.join(dir, entry.name);
        try {
            fs.rmSync(entryPath, { recursive: true, force: true });
        } catch (error) {
            console.warn(`Skipping stale build artifact that could not be removed: ${entryPath}`);
        }
    }
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
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('Building project: copying static assets without injecting environment variables...');

// Clear old docs
fs.mkdirSync(destDocsDir, { recursive: true });
cleanDirectory(destDocsDir);

processDirectory(srcDir, destSiteDir);

// Copy root index.html to docs/index.html
const rootIndexSrc = path.join(__dirname, 'index.html');
if (fs.existsSync(rootIndexSrc)) {
    fs.copyFileSync(rootIndexSrc, path.join(destDocsDir, 'index.html'));
}

console.log('Build complete: Files synced to docs/');
