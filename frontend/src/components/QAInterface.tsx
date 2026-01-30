import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, HelpCircle } from 'lucide-react';
import { PolicyAnalysis } from '../types';
import { askQuestion, translateText } from '../services/api';

interface QAInterfaceProps {
  analysis: PolicyAnalysis;
  language: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  source?: {
    page: number;
    clause?: string;
  };
}

const QAInterface: React.FC<QAInterfaceProps> = ({ analysis, language }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I've analyzed your policy. outcomes. Feel free to ask me anything about coverage, exclusions, or claims.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 1. Ask question (backend returns English usually)
      const response = await askQuestion(userMessage.text, analysis.fullText || '');
      
      let answerText = response.answer;
      
      // 2. Translate answer if needed
      if (language !== 'en') {
        try {
            answerText = await translateText(answerText, language);
        } catch (err) {
            console.error('Failed to translate answer:', err);
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answerText,
        sender: 'bot',
        timestamp: new Date(),
        source: response.source
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get answer:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error while processing your question. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[600px] flex flex-col">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <HelpCircle className="mr-2 text-blue-500" />
          Ask Questions
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Ask specific questions about your policy like "Is diabetes covered?"
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none'
              }`}
            >
              <div className="flex items-center mb-1 opacity-75 text-xs">
                {message.sender === 'user' ? (
                  <User size={12} className="mr-1" />
                ) : (
                  <Bot size={12} className="mr-1" />
                )}
                <span>{message.sender === 'user' ? 'You' : 'Bima Buddy'}</span>
              </div>
              
              <p className="whitespace-pre-wrap">{message.text}</p>
              
              {message.source && (
                <div className={`mt-2 text-xs p-2 rounded ${
                  message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-100'
                }`}>
                  <span className="font-semibold opacity-75">Source: </span>
                  Page {message.source.page}
                  {message.source.clause && `, Clause ${message.source.clause}`}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 rounded-bl-none flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
              <span className="text-gray-500 text-sm">Analyzing policy...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default QAInterface;