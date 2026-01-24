const express = require('express');
const router = express.Router();
const ttsService = require('../services/ttsService');

// Synthesize speech
router.post('/synthesize', async (req, res) => {
  try {
    const { text, language } = req.body;
    
    if (!text || !language) {
      return res.status(400).json({ 
        error: 'Text and language are required' 
      });
    }

    const audioBuffer = await ttsService.synthesizeSpeech(text, language);
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    
    res.send(audioBuffer);
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ 
      error: 'Failed to synthesize speech',
      message: error.message 
    });
  }
});

module.exports = router;