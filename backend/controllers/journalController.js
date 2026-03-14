const Journal = require('../models/Journal');
const llmService = require('../services/llmService');
const { getCachedAnalysis, setCachedAnalysis } = require('../utils/cache');

// Create new entry
exports.createEntry = async (req, res) => {
  try {
    const { userId, ambience, text, emotion, keywords, summary } = req.body;

    if (!userId || !ambience || !text) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const journal = await Journal.create({
      userId, ambience, text, emotion, keywords, summary
    });

    res.status(201).json(journal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user entries
exports.getEntries = async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await Journal.find({ userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Analyze text
exports.analyzeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Empty text' });
    }

    const cached = await getCachedAnalysis(text);
    if (cached) return res.json(cached);

    const analysis = await llmService.analyzeEmotion(text);
    await setCachedAnalysis(text, analysis);

    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User stats
exports.getInsights = async (req, res) => {
  try {
    const { userId } = req.params;

    const entries = await Journal.find({ userId });

    if (!entries || entries.length === 0) {
      return res.json({
        totalEntries: 0,
        topEmotion: 'N/A',
        mostUsedAmbience: 'N/A',
        recentKeywords: []
      });
    }

    // Aggregate
    const totalEntries = entries.length;
    const emotionCounts = {};
    const ambienceCounts = {};
    let allKeywords = [];

    entries.forEach(entry => {
      if (entry.emotion) emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
      ambienceCounts[entry.ambience] = (ambienceCounts[entry.ambience] || 0) + 1;
      if (entry.keywords?.length) allKeywords.push(...entry.keywords);
    });

    const topEmotion = Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b, 'N/A');
    const mostUsedAmbience = Object.keys(ambienceCounts).reduce((a, b) => ambienceCounts[a] > ambienceCounts[b] ? a : b, 'N/A');
    const recentKeywords = [...new Set(allKeywords)].slice(-10);

    res.json({ totalEntries, topEmotion, mostUsedAmbience, recentKeywords });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
