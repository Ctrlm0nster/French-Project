import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, 'website');
const destDocsDir = path.join(__dirname, 'docs');
const destSiteDir = path.join(destDocsDir, 'website');
const docsConfigPath = path.join(destSiteDir, 'assets', 'js', 'config.js');

function parseEnvFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return {};
    }

    const env = {};
    const content = fs.readFileSync(filePath, 'utf8');

    for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) {
            continue;
        }

        const separatorIndex = line.indexOf('=');
        if (separatorIndex === -1) {
            continue;
        }

        const key = line.slice(0, separatorIndex).trim();
        let value = line.slice(separatorIndex + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        env[key] = value;
    }

    return env;
}

function loadEnvConfig() {
    return {
        ...parseEnvFile(path.join(__dirname, '.env')),
        ...parseEnvFile(path.join(__dirname, '.env.local')),
    };
}

function firstDefined(env, keys, fallback = '') {
    for (const key of keys) {
        const value = String(env[key] || '').trim();
        if (value) {
            return value;
        }
    }
    return fallback;
}

function buildPublicConfig(env) {
    return {
        SUPABASE_URL: firstDefined(env, [
            'NEXT_PUBLIC_PARTH_SUPABASE_URL',
            'PARTH_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_URL',
            'SUPABASE_URL',
        ], 'VOTRE_SUPABASE_URL'),
        SUPABASE_ANON_KEY: firstDefined(env, [
            'NEXT_PUBLIC_PARTH_SUPABASE_ANON_KEY',
            'PARTH_SUPABASE_ANON_KEY',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'SUPABASE_ANON_KEY',
        ], 'VOTRE_SUPABASE_ANON_KEY'),
        GOOGLE_MAPS_API_KEY: firstDefined(env, [
            'GOOGLE_MAPS_API_KEY',
            'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
        ], 'VOTRE_GOOGLE_MAPS_API_KEY'),
        CHAT_API_URL: firstDefined(env, [
            'NEXT_PUBLIC_CHAT_API_URL',
            'CHAT_API_URL',
        ], ''),
    };
}

function writeDocsConfig(publicConfig) {
    const lines = [
        '/**',
        ' * Frontend config (generated for docs build from .env / .env.local).',
        ' * Only public, browser-safe values should be emitted here.',
        ' */',
        'window.APP_CONFIG = {',
        `  SUPABASE_URL: ${JSON.stringify(publicConfig.SUPABASE_URL)},`,
        `  SUPABASE_ANON_KEY: ${JSON.stringify(publicConfig.SUPABASE_ANON_KEY)},`,
        `  GOOGLE_MAPS_API_KEY: ${JSON.stringify(publicConfig.GOOGLE_MAPS_API_KEY)},`,
        `  CHAT_API_URL: ${JSON.stringify(publicConfig.CHAT_API_URL)},`,
        '};',
        '',
    ];

    fs.mkdirSync(path.dirname(docsConfigPath), { recursive: true });
    fs.writeFileSync(docsConfigPath, lines.join('\n'), 'utf8');
}

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

const envConfig = loadEnvConfig();
const publicConfig = buildPublicConfig(envConfig);

console.log('Building project: copying static assets and generating public docs config from .env files...');

// Clear old docs
fs.mkdirSync(destDocsDir, { recursive: true });
cleanDirectory(destDocsDir);

processDirectory(srcDir, destSiteDir);
writeDocsConfig(publicConfig);

// Copy root index.html to docs/index.html
const rootIndexSrc = path.join(__dirname, 'index.html');
if (fs.existsSync(rootIndexSrc)) {
    fs.copyFileSync(rootIndexSrc, path.join(destDocsDir, 'index.html'));
}

console.log('Build complete: Files synced to docs/');
