import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, Clock, DollarSign, Loader2, FileText, Ban, CheckCircle, Volume2, VolumeX } from 'lucide-react';
import { PolicyAnalysis, KeyFeature } from '../types';
import { translateText, synthesizeSpeech } from '../services/api';

interface PolicySummaryProps {
  analysis: PolicyAnalysis;
  language: string;
  supportsTTS: boolean;
}

const PolicySummary: React.FC<PolicySummaryProps> = ({ analysis, language, supportsTTS }) => {
  const [translatedAnalysis, setTranslatedAnalysis] = useState<PolicyAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Use original analysis if language is English, otherwise use translated
  const displayAnalysis = language === 'en' ? analysis : (translatedAnalysis || analysis);

  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedAnalysis(null);
        return;
      }

      setLoading(true);
      try {
        const { summary, simplifiedClauses } = analysis;
        
        // Translate summary fields
        const [title, overview] = await Promise.all([
          translateText(summary.title, language),
          translateText(summary.overview, language)
        ]);
        
        // Translate key features
        const keyFeatures = await Promise.all(
          summary.keyFeatures.map(async (feature) => ({
            ...feature,
            label: await translateText(feature.label, language),
            value: await translateText(feature.value, language)
          }))
        );
        
        // Translate exclusions
        const keyExclusions = await Promise.all(
          summary.keyExclusions.map(ex => translateText(ex, language))
        );

        // Translate simplified clauses
        const translatedClauses = await Promise.all(
          simplifiedClauses.map(async (clause) => ({
             ...clause,
             simplifiedText: await translateText(clause.simplifiedText, language),
             analogy: await translateText(clause.analogy, language)
          }))
        );

        setTranslatedAnalysis({
          ...analysis,
          summary: {
            ...summary,
            title,
            overview,
            keyFeatures,
            keyExclusions
          },
          simplifiedClauses: translatedClauses
        });
      } catch (error) {
        console.error('Translation failed:', error);
      } finally {
        setLoading(false);
      }
    };

    translateContent();
  }, [analysis, language]);

  const handleNarrate = async () => {
    if (isNarrating && audioRef.current) {
      // Stop narration
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsNarrating(false);
      return;
    }

    setIsLoadingAudio(true);
    try {
      const { summary } = displayAnalysis;
      
      // Build narration text
      let narrationText = `${summary.title}. ${summary.overview}. `;
      narrationText += 'Key Features: ';
      summary.keyFeatures.forEach((feature) => {
        narrationText += `${feature.label}: ${feature.value}. `;
      });
      
      // Get audio from backend
      const audioBlob = await synthesizeSpeech(narrationText, language);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsNarrating(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsNarrating(false);
        setIsLoadingAudio(false);
        alert('Failed to play audio');
      };
      
      await audio.play();
      setIsNarrating(true);
    } catch (error) {
      console.error('Narration failed:', error);
      alert('Failed to generate narration. Please check your API key.');
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const { summary } = displayAnalysis;

  // Helper to get icon based on category or label
  const getIcon = (feature: KeyFeature) => {
    const { category, label } = feature;
    
    if (category === 'financial' || label.toLowerCase().includes('amount') || label.toLowerCase().includes('coverage')) {
      return DollarSign;
    }
    if (category === 'limitation' || label.toLowerCase().includes('wait') || label.toLowerCase().includes('time')) {
      return Clock;
    }
    if (category === 'coverage' || label.toLowerCase().includes('cover')) {
      return Shield;
    }
    if (category === 'exclusion') {
      return Ban;
    }
    return CheckCircle;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-800">{summary.title}</h2>
          </div>
          
          {supportsTTS && (
            <button
              onClick={handleNarrate}
              disabled={isLoadingAudio}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingAudio ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : isNarrating ? (
                <>
                  <VolumeX className="h-5 w-5" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-5 w-5" />
                  <span>Listen</span>
                </>
              )}
            </button>
          )}
        </div>
        <p className="text-gray-600 leading-relaxed">{summary.overview}</p>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Features</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {summary.keyFeatures.map((feature, index) => {
          const Icon = getIcon(feature);
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start mb-2">
                <Icon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-600 block">{feature.label}</span>
                  <p className="text-base font-semibold text-gray-800 mt-1">{feature.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          What's Not Covered
        </h3>
        <ul className="space-y-2">
          {summary.keyExclusions.map((exclusion, index) => (
            <li key={index} className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              <span className="text-gray-700">{exclusion}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Clauses Explained</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {displayAnalysis.simplifiedClauses.slice(0, 3).map((clause, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Page {clause.pageNumber}, {clause.clauseNumber}
                </span>
              </div>
              
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-600 mb-1">Simple Explanation:</h4>
                <p className="text-gray-800">{clause.simplifiedText}</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <h4 className="text-sm font-semibold text-green-800 mb-1">Think of it like this:</h4>
                <p className="text-green-700 text-sm">{clause.analogy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolicySummary;