const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { HEADERS, RETRY_CONFIG } = require("../config/constants");
const { withRetries } = require("./fetchPage");

async function downloadImage(url, filePath) {
  return withRetries(async () => {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      headers: HEADERS,
      timeout: RETRY_CONFIG.timeoutMs,
    });

    await fs.ensureDir(path.dirname(filePath));

    await new Promise((resolve, reject) => {
      const stream = response.data.pipe(fs.createWriteStream(filePath));
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  });
}

module.exports = {
  downloadImage,
};
