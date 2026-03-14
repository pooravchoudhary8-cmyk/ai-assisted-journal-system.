const redis = require('redis');
const crypto = require('crypto');

let client;

// Initialize Redis Client
const initRedis = async () => {
  if (process.env.REDIS_URL && process.env.REDIS_URL !== 'undefined') {
    client = redis.createClient({
      url: process.env.REDIS_URL
    });

    client.on('error', (err) => {
      // Quietly handle connection errors during development
      client = null;
    });

    try {
      await client.connect();
      console.log('Redis Caching Enabled');
    } catch (err) {
      // Fallback silently if redis is not running
      client = null;
    }
  } else {
    console.log('Redis Caching Disabled (No URL provided)');
  }
};

/**
 * Generate a hash for the journal text to use as a cache key
 * @param {string} text 
 */
const getHash = (text) => {
  return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex');
};

/**
 * Get cached analysis result
 */
const getCachedAnalysis = async (text) => {
  if (!client) return null;
  const key = `analysis:${getHash(text)}`;
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

/**
 * Set analysis result to cache
 */
const setCachedAnalysis = async (text, data) => {
  if (!client) return;
  const key = `analysis:${getHash(text)}`;
  await client.set(key, JSON.stringify(data), {
    EX: 86400 // Cache for 24 hours
  });
};

module.exports = {
  initRedis,
  getCachedAnalysis,
  setCachedAnalysis
};
