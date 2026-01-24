import axios from 'axios';
import { PolicyAnalysis, QAResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const analyzePolicy = async (file: File): Promise<PolicyAnalysis> => {
  const formData = new FormData();
  formData.append('policy', file);
  
  const response = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const askQuestion = async (question: string, policyText: string): Promise<QAResponse> => {
  const response = await api.post('/ask', {
    question,
    policyText,
  });
  
  return response.data;
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  const response = await api.post('/translate', {
    text,
    targetLanguage,
  });
  
  return response.data.translatedText;
};

export const synthesizeSpeech = async (text: string, language: string): Promise<Blob> => {
  const response = await api.post('/synthesize', {
    text,
    language,
  }, {
    responseType: 'blob',
  });
  
  return response.data;
};