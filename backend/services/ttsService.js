const { SarvamAIClient } = require("sarvamai");

class TTSService {
  constructor() {
    this.sarvamApiKey = process.env.SARVAM_API_KEY;
    if (!this.sarvamApiKey) {
      console.warn('Sarvam API key not configured. TTS will not work.');
    } else {
      this.client = new SarvamAIClient({
        apiSubscriptionKey: this.sarvamApiKey
      });
    }
    
    // Language to Sarvam language code mapping (Only 11 languages supported for TTS)
    this.languageMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'mr': 'mr-IN',
      'pa': 'pa-IN',
      'od': 'od-IN'
    };
    
    // Speaker selection based on language
    this.speakerMap = {
      'en-IN': 'shubh',
      'hi-IN': 'meera',
      'bn-IN': 'meera',
      'ta-IN': 'arjun',
      'te-IN': 'arjun',
      'gu-IN': 'shubh',
      'kn-IN': 'arjun',
      'ml-IN': 'arjun',
      'mr-IN': 'meera',
      'pa-IN': 'shubh',
      'od-IN': 'arjun'
    };
  }

  async synthesizeSpeech(text, language) {
    if (!this.sarvamApiKey) {
      throw new Error('Sarvam API key not configured');
    }
    
    const targetLanguageCode = this.languageMap[language] || 'en-IN';
    const speaker = this.speakerMap[targetLanguageCode] || 'shubh';
    
    console.log(`Synthesizing speech in ${targetLanguageCode} for: "${text.substring(0, 50)}..."`);
    
    try {
      const response = await this.client.textToSpeech.convert({
        text: text,
        target_language_code: targetLanguageCode,
        speaker: speaker,
        pace: 1.0,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: "bulbul:v3-beta",
        temperature: 0.6
      });
      
      // The response contains base64 audio data
      if (response.audios && response.audios.length > 0) {
        // Convert base64 to buffer
        const audioBase64 = response.audios[0];
        return Buffer.from(audioBase64, 'base64');
      } else {
        throw new Error('No audio data received from Sarvam AI');
      }
    } catch (error) {
      console.error('Sarvam AI TTS Error:', error);
      throw new Error(`TTS synthesis failed: ${error.message}`);
    }
  }

  async getAvailableVoices(language) {
    const voices = {
      'en': [
        { id: 'shubh', name: 'Shubh', gender: 'male', accent: 'Indian English' }
      ],
      'hi': [
        { id: 'meera', name: 'Meera', gender: 'female', accent: 'Standard Hindi' }
      ],
      'ta': [
        { id: 'arjun', name: 'Arjun', gender: 'male', accent: 'Standard Tamil' }
      ]
    };

    return voices[language] || voices['en'];
  }

  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' }
    ];
  }
}

module.exports = new TTSService();