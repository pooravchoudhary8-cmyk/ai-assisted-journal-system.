const rateLimit = require('express-rate-limit');

// Rate limiter for general API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Stricter rate limiting for LLM analysis to save costs
const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 analysis requests per hour
  message: {
    message: 'Too many analysis requests, please try again later'
  }
});

module.exports = { apiLimiter, analysisLimiter };
