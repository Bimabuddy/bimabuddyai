const express = require('express');
const router = express.Router();
const policyService = require('../services/policyService');

// Analyze policy document
router.post('/analyze', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No policy file uploaded' });
    }

    const analysis = await policyService.analyzePolicy(req.file);
    res.json(analysis);
  } catch (error) {
    console.error('Policy analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze policy',
      message: error.message 
    });
  }
});

// Ask question about policy
router.post('/ask', async (req, res) => {
  try {
    const { question, policyText } = req.body;
    
    if (!question || !policyText) {
      return res.status(400).json({ 
        error: 'Question and policy text are required' 
      });
    }

    const answer = await policyService.answerQuestion(question, policyText);
    res.json(answer);
  } catch (error) {
    console.error('Q&A error:', error);
    res.status(500).json({ 
      error: 'Failed to process question',
      message: error.message 
    });
  }
});

module.exports = router;