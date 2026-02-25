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

## Requirements

- Node.js 16+
- axios, cheerio, fs-extra
