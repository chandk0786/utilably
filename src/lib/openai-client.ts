// lib/openai-client.ts
let openaiInstance: any = null;

export const getOpenAI = () => {
  if (!openaiInstance) {
    if (typeof window !== 'undefined') {
      // Client-side: Use browser-safe initialization
      const { OpenAI } = require('openai');
      openaiInstance = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });
    } else {
      // Server-side
      const { OpenAI } = require('openai');
      openaiInstance = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }
  return openaiInstance;
};