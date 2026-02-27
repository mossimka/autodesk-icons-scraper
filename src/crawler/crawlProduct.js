const path = require("path");
const cheerio = require("cheerio");
const { BASE_URL, ICONS_DIR } = require("../config/constants");
const { fetchPage } = require("./fetchPage");
const { extractIconUrl } = require("./extractIconUrl");
const { downloadImage } = require("./downloadImage");

function getFileExtension(url) {
  const clean = url.split("?")[0];
  const ext = clean.split(".").pop()?.toLowerCase();
  return ext || "png";
}

async function crawlProduct(product) {
  const startedAt = new Date().toISOString();
  const result = {
    product: product.name,
    slug: product.slug,
    status: "failed",
    sourceUrl: null,
    localFile: null,
    startedAt,
    finishedAt: null,
    error: null,
  };

  try {
    if (product.directUrl) {
      const ext = getFileExtension(product.directUrl);
      const filePath = path.join(ICONS_DIR, `${product.slug}.${ext}`);

      await downloadImage(product.directUrl, filePath);
      result.status = "ok";
      result.sourceUrl = product.directUrl;
      result.localFile = filePath;
      return result;
    }

    const productPageUrl = `${BASE_URL}/${product.slug}/overview`;
    const html = await fetchPage(productPageUrl);
    const $ = cheerio.load(html);
    const iconUrl = extractIconUrl($, product);

    if (!iconUrl) {
      result.error = "Icon URL not found in page.";
      result.sourceUrl = productPageUrl;
      return result;
    }

    const ext = getFileExtension(iconUrl);
    const filePath = path.join(ICONS_DIR, `${product.slug}.${ext}`);

    await downloadImage(iconUrl, filePath);
    result.status = "ok";
    result.sourceUrl = iconUrl;
    result.localFile = filePath;
    return result;
  } catch (error) {
    result.error = error.message;
    return result;
  } finally {
    result.finishedAt = new Date().toISOString();
  }
}

module.exports = {
  crawlProduct,
};
