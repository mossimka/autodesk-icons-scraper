const axios = require("axios");
const { HEADERS, RETRY_CONFIG } = require("../config/constants");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetries(task) {
  let lastError;
  for (let attempt = 1; attempt <= RETRY_CONFIG.retries; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt === RETRY_CONFIG.retries) {
        break;
      }
      const delay = RETRY_CONFIG.baseDelayMs * attempt;
      await sleep(delay);
    }
  }
  throw lastError;
}

async function fetchPage(url) {
  return withRetries(async () => {
    const response = await axios.get(url, {
      headers: HEADERS,
      timeout: RETRY_CONFIG.timeoutMs,
    });
    return response.data;
  });
}

module.exports = {
  fetchPage,
  withRetries,
};
