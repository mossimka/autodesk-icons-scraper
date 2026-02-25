// crawler.js
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");

const products = require("./products");

const BASE_URL = "https://www.autodesk.com/products";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  Referer: "https://www.autodesk.com/",
};

async function downloadImage(url, filePath) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
    headers: HEADERS,
  });

  await fs.ensureDir(path.dirname(filePath));

  return new Promise((resolve, reject) => {
    const stream = response.data.pipe(fs.createWriteStream(filePath));
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

async function crawlProduct(product) {
  try {
    // Products with no standard page — download icon directly
    if (product.directUrl) {
      const ext = product.directUrl.split(".").pop().split("?")[0];
      const filePath = `./icons/${product.slug}.${ext}`;
      await downloadImage(product.directUrl, filePath);
      console.log("✅ Saved:", filePath);
      return;
    }

    const url = `${BASE_URL}/${product.slug}/overview`;
    console.log("Checking:", url);

    const { data } = await axios.get(url, { headers: HEADERS });
    const $ = cheerio.load(data);

    // Find product icon — structure varies per product page
    const name = product.name;
    const normalize = (src) => {
      if (!src) return null;
      return src.startsWith("//") ? "https:" + src : src;
    };

    const iconSrc =
      // aria-label + product-icon in src (e.g. AutoCAD, Revit)
      normalize(
        $(`img[aria-label="${name}"][src*="product-icon"]`).attr("src"),
      ) ||
      // aria-label only
      normalize($(`img[aria-label="${name}"]`).first().attr("src")) ||
      // alt + src (e.g. Fusion, Maya)
      normalize($(`img[alt="${name}"]`).first().attr("src")) ||
      // alt + data-src (lazy-loaded)
      normalize($(`img[alt="${name}"]`).first().attr("data-src")) ||
      // badge with product slug in URL (e.g. Autodesk Docs)
      normalize(
        $(`img[src*="${product.slug}"][src*="badge"]`).first().attr("src"),
      ) ||
      // any product-icon on page
      normalize($(`img[src*="product-icon"]`).first().attr("src")) ||
      // og:image fallback
      normalize($('meta[property="og:image"]').attr("content"));

    if (!iconSrc) {
      console.log("❌ No image found for", name);
      return;
    }

    const ext = iconSrc.split("?")[0].split(".").pop();
    const filePath = `./icons/${product.slug}.${ext}`;

    await downloadImage(iconSrc, filePath);

    console.log("✅ Saved:", filePath);
  } catch (err) {
    console.log(
      "⚠️ Error with",
      product.name,
      "-",
      err.message,
      err.response?.status ?? "",
    );
  }
}

async function run() {
  for (const product of products) {
    await crawlProduct(product);
  }
}

run();
