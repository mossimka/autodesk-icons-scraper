const {
  validateDimension,
  convertPngDirectory,
} = require("../src/image/convertToWebp");

async function main() {
  const width = validateDimension(process.argv[2], "width");
  const height = validateDimension(process.argv[3], "height");
  const qualityArg = process.argv[4];
  const quality =
    qualityArg === undefined ? 80 : validateDimension(qualityArg, "quality");

  const summary = await convertPngDirectory({ width, height, quality });
  console.log(
    `Finished: ${summary.successCount}/${summary.total} converted, ${summary.failureCount} failed.`,
  );
  if (summary.failureCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  console.error(
    "Usage: node scripts/convert-webp.js <width> <height> [quality]",
  );
  process.exit(1);
});
