function normalizeUrl(src) {
  if (!src) {
    return null;
  }
  return src.startsWith("//") ? `https:${src}` : src;
}

function extractIconUrl($, product) {
  const { name, slug } = product;

  return (
    normalizeUrl($(`img[aria-label="${name}"][src*="product-icon"]`).attr("src")) ||
    normalizeUrl($(`img[aria-label="${name}"]`).first().attr("src")) ||
    normalizeUrl($(`img[alt="${name}"]`).first().attr("src")) ||
    normalizeUrl($(`img[alt="${name}"]`).first().attr("data-src")) ||
    normalizeUrl($(`img[src*="${slug}"][src*="badge"]`).first().attr("src")) ||
    normalizeUrl($(`img[src*="product-icon"]`).first().attr("src")) ||
    normalizeUrl($('meta[property="og:image"]').attr("content"))
  );
}

module.exports = {
  extractIconUrl,
  normalizeUrl,
};
