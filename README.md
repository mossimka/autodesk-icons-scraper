# Autodesk Icons Crawler

A Node.js tool that crawls Autodesk product pages, downloads product icons, and optionally converts PNG files to WebP.

## Project Structure

```txt
src/
  config/
    constants.js
    products.js
  crawler/
    crawlProduct.js
    downloadImage.js
    extractIconUrl.js
    fetchPage.js
    index.js
    validateProducts.js
  image/
    convertToWebp.js
scripts/
  crawl.js
  convert-webp.js
output/
  icons/
  icons_webp/
  manifest.json
```

## Features

- Modular crawler architecture (`config`, `crawler`, `image`).
- Retry + timeout behavior for HTTP requests.
- Product config validation before crawling.
- Run manifest (`output/manifest.json`) with per-product status and errors.
- Safe WebP conversion via `spawnSync` (no shell interpolation).

## Requirements

- Node.js 16+
- `cwebp` binary available in `PATH` for WebP conversion

Install dependencies:

```bash
npm install
```

## Usage

Run crawler:

```bash
npm run crawl
```

Convert downloaded PNG icons to WebP:

```bash
# <width> <height> [quality]
npm run convert:webp -- 128 128 80
```

## Output

- Downloaded source icons: `output/icons/`
- Converted icons: `output/icons_webp/`
- Run summary: `output/manifest.json`

## Legacy Commands (Still Supported)

- `node crawler.js`
- `node convertToWebp.js <width> <height> [quality]`
