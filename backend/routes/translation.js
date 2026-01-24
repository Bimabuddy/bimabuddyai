const express = require('express');
const router = express.Router();
const translationService = require('../services/translationService');

// Translate text
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ 
        error: 'Text and target language are required' 
      });
    }

    const translation = await translationService.translateText(text, targetLanguage);
    res.json({ translatedText: translation });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Failed to translate text',
      message: error.message 
    });
  }
});

module.exports = router;