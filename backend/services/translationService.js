const axios = require('axios');

class TranslationService {
  constructor() {
    this.apiKey = process.env.SARVAM_API_KEY;
    this.apiUrl = 'https://api.sarvam.ai/translate';
  }

  async translateText(text, targetLanguage) {
    // Map standard language codes to Sarvam supported codes (mostly adding -IN)
    const languageMap = {
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'od': 'od-IN',
      'as': 'as-IN',
      'ur': 'ur-IN',
      'sa': 'sa-IN',
      'ks': 'ks-IN',
      'ne': 'ne-IN',
      'kok': 'kok-IN',
      'sd': 'sd-IN',
      'mni': 'mni-IN',
      'doi': 'doi-IN',
      'brx': 'brx-IN',
      'mai': 'mai-IN',
      'sat': 'sat-IN',
      'en': 'en-IN'
    };

    const targetCode = languageMap[targetLanguage] || targetLanguage;

    // If target is English or same as source (assuming source is English for now), return text
    if (targetLanguage === 'en' || !this.apiKey) {
        if (!this.apiKey) console.warn('SARVAM_API_KEY not found, returning mock/original text');
        if (targetLanguage === 'en') return text;
        // Mock fallback if Key missing but not English
        return `[Mock ${targetLanguage}] ${text}`;
    }

    try {
      const response = await axios.post(this.apiUrl, {
        input: text,
        source_language_code: 'en-IN', // Assuming source is English for now
        target_language_code: targetCode,
        speaker_gender: 'Male', // Optional
        mode: 'formal', // Optional
        model: 'mayura:v1', // Optional, checking docs or defaulting
        enable_preprocessing: true
      }, {
        headers: {
          'api-subscription-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.translated_text) {
        return response.data.translated_text;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Sarvam AI Translation Error:', error.response?.data || error.message);
      // Fallback
      return `[Error] ${text}`;
    }
  }

  async getSupportedLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'bn', name: 'Bengali' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'mr', name: 'Marathi' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'kn', name: 'Kannada' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'od', name: 'Odia' }
    ];
  }
}

module.exports = new TranslationService();