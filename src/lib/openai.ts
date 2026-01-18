// lib/openai.ts
import { OpenAI } from 'openai';

// Singleton instance
let openaiInstance: OpenAI | null = null;

export const initializeOpenAI = () => {
  if (!openaiInstance) {
    const isBrowser = typeof window !== 'undefined';
    const apiKey = isBrowser 
      ? process.env.NEXT_PUBLIC_OPENAI_API_KEY
      : process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('OpenAI API key is not configured');
      return null;
    }
    
    openaiInstance = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: isBrowser,
    });
  }
  return openaiInstance;
};

// Export the instance getter
export const getOpenAI = () => {
  return initializeOpenAI();
};

// For backward compatibility
export const openai = getOpenAI();