// Simple in-memory cache
const cache = new Map();

export function getCachedDescription(productId) {
  return cache.get(productId);
}

export function setCachedDescription(productId, description) {
  cache.set(productId, description);
}
