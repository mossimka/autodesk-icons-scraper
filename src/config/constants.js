const path = require("path");

const BASE_URL = "https://www.autodesk.com/products";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  Referer: "https://www.autodesk.com/",
};

const RETRY_CONFIG = {
  retries: 3,
  baseDelayMs: 600,
  timeoutMs: 15000,
};

const OUTPUT_DIR = path.join(process.cwd(), "output");
const ICONS_DIR = path.join(OUTPUT_DIR, "icons");
const ICONS_WEBP_DIR = path.join(OUTPUT_DIR, "icons_webp");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");

module.exports = {
  BASE_URL,
  HEADERS,
  RETRY_CONFIG,
  OUTPUT_DIR,
  ICONS_DIR,
  ICONS_WEBP_DIR,
  MANIFEST_PATH,
};
