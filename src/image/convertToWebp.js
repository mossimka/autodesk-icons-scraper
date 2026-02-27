const fs = require("fs-extra");
const path = require("path");
const { spawnSync } = require("child_process");
const { ICONS_DIR, ICONS_WEBP_DIR } = require("../config/constants");

function validateDimension(value, label) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
  return parsed;
}

function ensureCwebp() {
  const result = spawnSync("cwebp", ["-version"], { stdio: "ignore" });
  if (result.error || result.status !== 0) {
    throw new Error(
      "cwebp is not installed or not in PATH. Install WebP tools first.",
    );
  }
}

function convertOneFile(inputPath, outputPath, width, height, quality) {
  const args = [
    "-resize",
    String(width),
    String(height),
    "-q",
    String(quality),
    inputPath,
    "-o",
    outputPath,
  ];

  const result = spawnSync("cwebp", args, {
    encoding: "utf8",
  });

  if (result.error || result.status !== 0) {
    const reason = result.stderr?.trim() || result.error?.message || "unknown error";
    throw new Error(reason);
  }
}

async function convertPngDirectory({ width, height, quality = 80 }) {
  ensureCwebp();
  await fs.ensureDir(ICONS_WEBP_DIR);

  const files = await fs.readdir(ICONS_DIR);
  const pngFiles = files.filter((file) => file.toLowerCase().endsWith(".png"));

  if (pngFiles.length === 0) {
    return {
      total: 0,
      successCount: 0,
      failureCount: 0,
      failures: [],
    };
  }

  const failures = [];
  let successCount = 0;

  for (const file of pngFiles) {
    const inputPath = path.join(ICONS_DIR, file);
    const outputPath = path.join(
      ICONS_WEBP_DIR,
      file.replace(/\.png$/i, ".webp"),
    );

    try {
      convertOneFile(inputPath, outputPath, width, height, quality);
      successCount += 1;
      console.log(`OK   ${file} -> ${path.basename(outputPath)}`);
    } catch (error) {
      failures.push({ file, error: error.message });
      console.log(`FAIL ${file} -> ${error.message}`);
    }
  }

  return {
    total: pngFiles.length,
    successCount,
    failureCount: failures.length,
    failures,
  };
}

module.exports = {
  validateDimension,
  convertPngDirectory,
};
