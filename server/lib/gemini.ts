import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'placeholder-gemini-api-key') {
  console.warn('⚠️ GEMINI_API_KEY is not configured or using placeholder in .env. Live Gemini API calls will require a valid key.');
}

export const ai = new GoogleGenAI({
  apiKey: apiKey && apiKey !== 'placeholder-gemini-api-key' ? apiKey : 'AIzaSyDummyKeyForInitializationOnly',
});

export const isGeminiConfigured = () => {
  return Boolean(apiKey && apiKey !== 'placeholder-gemini-api-key');
};
