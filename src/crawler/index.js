const fs = require("fs-extra");
const {
  OUTPUT_DIR,
  ICONS_DIR,
  MANIFEST_PATH,
} = require("../config/constants");
const { validateProducts } = require("./validateProducts");
const { crawlProduct } = require("./crawlProduct");

async function runCrawler(products) {
  validateProducts(products);
  await fs.ensureDir(OUTPUT_DIR);
  await fs.ensureDir(ICONS_DIR);

  const results = [];

  for (const product of products) {
    const result = await crawlProduct(product);
    results.push(result);

    if (result.status === "ok") {
      console.log(`OK   ${result.slug} -> ${result.localFile}`);
    } else {
      console.log(`FAIL ${result.slug} -> ${result.error}`);
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    successCount: results.filter((item) => item.status === "ok").length,
    failureCount: results.filter((item) => item.status !== "ok").length,
    results,
  };

  await fs.writeJson(MANIFEST_PATH, manifest, { spaces: 2 });
  return manifest;
}

module.exports = {
  runCrawler,
};
