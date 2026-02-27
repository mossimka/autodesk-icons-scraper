function validateProducts(products) {
  if (!Array.isArray(products)) {
    throw new Error("Products config must be an array.");
  }

  const slugs = new Set();

  products.forEach((product, index) => {
    if (!product || typeof product !== "object") {
      throw new Error(`Product at index ${index} must be an object.`);
    }
    if (!product.name || typeof product.name !== "string") {
      throw new Error(`Product at index ${index} is missing valid "name".`);
    }
    if (!product.slug || typeof product.slug !== "string") {
      throw new Error(`Product at index ${index} is missing valid "slug".`);
    }
    if (product.directUrl && typeof product.directUrl !== "string") {
      throw new Error(`Product "${product.slug}" has invalid "directUrl".`);
    }
    if (slugs.has(product.slug)) {
      throw new Error(`Duplicate slug found: "${product.slug}".`);
    }
    slugs.add(product.slug);
  });
}

module.exports = {
  validateProducts,
};
