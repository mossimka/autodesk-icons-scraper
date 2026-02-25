const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "icons");
const outputDir = path.join(__dirname, "icons_webp");

// Function to check if cwebp is installed, if not, try to install it
function ensureCwebp() {
  try {
    execSync("which cwebp", { stdio: "ignore" });
  } catch (e) {
    console.log("cwebp not found. Attempting to install...");
    const platform = process.platform;
    try {
      if (platform === "linux") {
        console.log(
          "Detected Linux. Running: sudo apt-get update && sudo apt-get install -y webp",
        );
        execSync("sudo apt-get update && sudo apt-get install -y webp", {
          stdio: "inherit",
        });
      } else if (platform === "darwin") {
        console.log("Detected macOS. Running: brew install webp");
        execSync("brew install webp", { stdio: "inherit" });
      } else if (platform === "win32") {
        console.log(
          "Detected Windows. Please install WebP manually from: https://developers.google.com/speed/webp/docs/precompiled",
        );
        process.exit(1);
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (installError) {
      console.error(
        "Failed to install cwebp automatically. Please install it manually.",
      );
      console.error(installError.message);
      process.exit(1);
    }
  }
}

// Ensure cwebp is available before proceeding
ensureCwebp();

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Get width and height from command line arguments
// Usage: node convertToWebp.js <width> <height>
// Example: node convertToWebp.js 128 128
const width = process.argv[2];
const height = process.argv[3];

if (!width || !height) {
  console.error("Error: Please provide dimensions.");
  console.error("Usage: node convertToWebp.js <width> <height>");
  process.exit(1);
}

console.log(`Converting PNGs to WebP with dimensions: ${width}x${height}`);

const files = fs.readdirSync(inputDir);
const pngFiles = files.filter((file) => file.endsWith(".png"));

if (pngFiles.length === 0) {
  console.log("No PNG files found in icons/ directory.");
  process.exit(0);
}

pngFiles.forEach((file) => {
  const inputPath = path.join(inputDir, file);
  const outputFileName = file.replace(".png", ".webp");
  const outputPath = path.join(outputDir, outputFileName);

  try {
    console.log(`Converting ${file}...`);
    // Use cwebp with resize option
    // -resize <width> <height>
    // -q 80 for decent quality
    execSync(
      `cwebp -resize ${width} ${height} -q 80 "${inputPath}" -o "${outputPath}"`,
    );
    console.log(`Successfully converted to ${outputFileName}`);
  } catch (error) {
    console.error(`Failed to convert ${file}:`, error.message);
  }
});

console.log('\nConversion complete! Check the "icons_webp" folder.');
