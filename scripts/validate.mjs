import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const failures = [];

function readFile(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function validateJsonFile(relativePath) {
  try {
    JSON.parse(readFile(relativePath));
  } catch (error) {
    failures.push(`${relativePath} is not valid JSON: ${error.message}`);
  }
}

function validateDataArray(relativePath) {
  try {
    const data = JSON.parse(readFile(relativePath));
    assert(Array.isArray(data), `${relativePath} must contain a top-level array.`);
  } catch (error) {
    failures.push(`${relativePath} could not be parsed: ${error.message}`);
  }
}

const removedRouteFiles = [
  "api/openai-key.js",
  "api/maps-key.js",
];

for (const relativePath of removedRouteFiles) {
  assert(!fs.existsSync(path.join(rootDir, relativePath)), `${relativePath} should not exist because it exposes keys to the browser.`);
}

const buildFile = readFile("build.mjs");
assert(buildFile.includes("buildPublicConfig"), "build.mjs should generate a docs config from an allowlisted set of public env vars.");
assert(buildFile.includes("writeDocsConfig"), "build.mjs should emit docs/website/assets/js/config.js from the build step.");
assert(!buildFile.includes("NEXT_PUBLIC_OPENAI_API_KEY"), "build.mjs must not expose NEXT_PUBLIC_OPENAI_API_KEY in generated public config.");

const websiteConfig = readFile("website/assets/js/config.js");
const docsConfigPath = path.join(rootDir, "docs/website/assets/js/config.js");
const docsConfig = fs.existsSync(docsConfigPath) ? fs.readFileSync(docsConfigPath, "utf8") : "";

assert(websiteConfig.includes('SUPABASE_URL: "VOTRE_SUPABASE_URL"'), "website/assets/js/config.js should keep the public Supabase URL placeholder.");
assert(websiteConfig.includes('SUPABASE_ANON_KEY: "VOTRE_SUPABASE_ANON_KEY"'), "website/assets/js/config.js should keep the public Supabase anon key placeholder.");
assert(websiteConfig.includes('GOOGLE_MAPS_API_KEY: "VOTRE_GOOGLE_MAPS_API_KEY"'), "website/assets/js/config.js should keep the browser-safe Google Maps placeholder.");

if (docsConfig) {
  const forbiddenSecrets = [
    /gsk_[0-9A-Za-z]+/,
    /sk-[0-9A-Za-z]+/,
    /sk-svcacct-/,
    /service_role/i,
    /POSTGRES_PASSWORD/i,
    /POSTGRES_URL/i,
    /VERCEL_OIDC_TOKEN/i,
  ];
  forbiddenSecrets.forEach((pattern) => {
    assert(!pattern.test(docsConfig), `docs/website/assets/js/config.js still appears to contain a secret matching ${pattern}.`);
  });
}

[
  "package.json",
  "website/assets/data/movies.json",
  "website/assets/data/series.json",
  "website/assets/data/documentaries.json",
  "website/assets/data/theaters.json",
].forEach(validateJsonFile);

[
  "website/assets/data/movies.json",
  "website/assets/data/series.json",
  "website/assets/data/documentaries.json",
].forEach(validateDataArray);

if (failures.length > 0) {
  console.error("Validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Validation passed.");
