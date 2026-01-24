import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { PolicyAnalysis, QAResponse } from '../types';
import { askQuestion } from '../services/api';

interface QAInterfaceProps {
  analysis: PolicyAnalysis;
}

const QAInterface: React.FC<QAInterfaceProps> = ({ analysis }) => {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', content: string, response?: QAResponse}>>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim()) return;

    const userMessage = { type: 'user' as const, content: currentQuestion };
    setMessages(prev => [...prev, userMessage]);
    setCurrentQuestion('');
    setIsLoading(true);

    try {
      const response = await askQuestion(currentQuestion, analysis.fullText);
      const botMessage = { 
        type: 'bot' as const, 
        content: response.answer,
        response
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get answer:', error);
      const errorMessage = { 
        type: 'bot' as const, 
        content: 'Sorry, I encountered an error while trying to answer your question. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
        <Bot className="mr-3 text-blue-500" />
        Ask Questions About Your Policy
      </h2>

      <div className="bg-gray-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Bot className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p>Ask me anything about your policy in simple language!</p>
            <p className="text-sm mt-2">For example: "Does this cover diabetes treatment?"</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'bot' && <Bot className="h-6 w-6 text-blue-500 mr-2 mt-1" />}
                
                <div className={`max-w-lg px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white ml-12' 
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  <p>{message.content}</p>
                  
                  {message.response && (
                    <div className="mt-2 text-xs bg-white bg-opacity-20 rounded p-2">
                      <div className="flex items-center justify-between">
                        <span>Source: Page {message.response.source.page}</span>
                        <span>Confidence: {Math.round(message.response.confidence * 100)}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {message.type === 'user' && <User className="h-6 w-6 text-gray-500 ml-2 mt-1" />}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start">
                <Bot className="h-6 w-6 text-blue-500 mr-2 mt-1" />
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          placeholder="Ask about coverage, exclusions, claims..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !currentQuestion.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default QAInterface;