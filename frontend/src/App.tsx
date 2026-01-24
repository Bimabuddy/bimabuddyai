import React, { useState } from 'react';
import { Upload, Mic, MicOff, Volume2, Globe, User } from 'lucide-react';
import FileUploader from './components/FileUploader';
import PolicySummary from './components/PolicySummary';
import QAInterface from './components/QAInterface';
import { PolicyAnalysis, Language } from './types';
import { analyzePolicy } from './services/api';

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
];

function App() {
  const [policyAnalysis, setPolicyAnalysis] = useState<PolicyAnalysis | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [isNarrating, setIsNarrating] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      const analysis = await analyzePolicy(file);
      setPolicyAnalysis(analysis);
    } catch (error) {
      console.error('Failed to analyze policy:', error);
      alert('Failed to analyze policy. Please try again.');
    }
  };

  const toggleNarration = () => {
    setIsNarrating(!isNarrating);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Bima Buddy</h1>
          <p className="text-lg text-gray-600">Your Insurance Policy Narrator</p>
        </header>

        {/* Language Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-md p-2 flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedLanguage.code === lang.code
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {!policyAnalysis ? (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left - Upload Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Upload className="mr-3 text-blue-500" />
                Upload Your Policy
              </h2>
              <FileUploader onFileUpload={handleFileUpload} />
            </div>

            {/* Right - Avatar */}
            <div className="flex flex-col items-center">
              <div className={`w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white avatar-glow ${isNarrating ? '' : ''}`}>
                <User size={80} />
              </div>
              <p className="mt-4 text-gray-600 text-center">
                Hi! I'm your insurance buddy. Upload your policy document and I'll explain it to you in simple terms.
              </p>
              <button
                onClick={toggleNarration}
                className="mt-4 flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                disabled={!policyAnalysis}
              >
                {isNarrating ? <MicOff size={20} /> : <Mic size={20} />}
                {isNarrating ? 'Stop' : 'Start'} Narration
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Policy Summary */}
            <PolicySummary analysis={policyAnalysis} />

            {/* QA Interface */}
            <QAInterface analysis={policyAnalysis} />

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={() => setPolicyAnalysis(null)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Upload New Policy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;