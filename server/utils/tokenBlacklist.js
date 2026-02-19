/**
 * Token Blacklist for Logout Functionality
 * In-memory store - for production consider Redis
 */

const blacklistedTokens = new Set();

const addToBlacklist = (token) => {
  blacklistedTokens.add(token);
};

const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

// Optional: Clean old tokens periodically (if using expiry-based cleanup)
// For production with Redis, use TTL matching JWT expiry

module.exports = { addToBlacklist, isTokenBlacklisted };
