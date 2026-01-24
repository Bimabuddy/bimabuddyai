class TranslationService {
  constructor() {
    this.googleApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  }

  async translateText(text, targetLanguage) {
    // For demo purposes, return English text with a note
    // In production, this would use Google Translate API or similar
    
    const languageMap = {
      'hi': 'Hindi (हिंदी)',
      'ta': 'Tamil (தமிழ்)',
      'en': 'English'
    };

    if (targetLanguage === 'en') {
      return text; // Return as-is for English
    }

    // Mock translation for demo
    return `[${languageMap[targetLanguage] || targetLanguage} Translation] ${text}`;
  }

  async getSupportedLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'mr', name: 'Marathi' },
      { code: 'bn', name: 'Bengali' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'kn', name: 'Kannada' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'pa', name: 'Punjabi' }
    ];
  }
}

module.exports = new TranslationService();