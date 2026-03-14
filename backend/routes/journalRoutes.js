const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { analysisLimiter } = require('../middleware/rateLimiter');

// Journal routes
router.post('/', journalController.createEntry);
router.get('/:userId', journalController.getEntries);

// Analysis route with stricter rate limiting
router.post('/analyze', analysisLimiter, journalController.analyzeText);

// Insights route
router.get('/insights/:userId', journalController.getInsights);

module.exports = router;
