const products = require("../src/config/products");
const { runCrawler } = require("../src/crawler");

async function main() {
  const manifest = await runCrawler(products);
  console.log(
    `Finished: ${manifest.successCount}/${manifest.total} succeeded, ${manifest.failureCount} failed.`,
  );
  if (manifest.failureCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
