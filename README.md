# Autodesk Icons Scraper

A Node.js tool to crawl and download official Autodesk product icons directly from their website.

## Features

- Scrapes the latest product overview pages.
- Automatically handles different page structures and lazy-loaded images.
- Downloads icons in **SVG** or **PNG** format (depending on source availability).
- Saves icons to `./icons/` folder using product slugs.

## Supported Products

The crawler is pre-configured to fetch icons for:

- 3ds Max, Advance Steel, Alias, Arnold
- AutoCAD (including Industry Toolsets)
- Autodesk Build, Docs, Rendering, Takeoff, Tandem
- BIM Collaborate Pro, Civil 3D
- Fusion, Inventor, Maya, Moldflow, Navisworks
- ReCap Pro, Revit, Robot Structural Analysis, Vault

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the crawler

```bash
node crawler.js
```

### 3. Convert icons to WebP (Optional)

You can convert the downloaded PNG icons to WebP format with custom dimensions. This command will automatically try to install `webp` utilities if they are missing (supports macOS via Brew and Linux via APT).

```bash
# Usage: node convertToWebp.js <width> <height>
node convertToWebp.js 128 128
```

The output will be saved in the `./icons_webp/` folder.

## Requirements

- Node.js 16+
- axios, cheerio, fs-extra
