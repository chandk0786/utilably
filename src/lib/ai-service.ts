// lib/ai-service.ts - Fixed imports
import { getOpenAI } from './openai';

export type AIModel = 'gpt-4' | 'gpt-3.5-turbo' | 'gpt-4-turbo';
export type AITask = 'generate' | 'explain' | 'optimize' | 'debug' | 'test' | 'translate';

export class AICodeService {
  private getOpenAIClient() {
    return getOpenAI();
  }

  async generate(request: any): Promise<any> {
    const openai = this.getOpenAIClient();
    
    if (!openai) {
      // Return mock response if no API key
      return {
        code: `// Mock response - Add OpenAI API key to .env.local\n// ${request.description || 'Example'}`,
        explanation: 'AI features require OpenAI API key',
        suggestions: ['Add NEXT_PUBLIC_OPENAI_API_KEY to .env.local'],
        estimatedTime: '1 minute'
      };
    }
    
    try {
      // Your AI generation logic here
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert code generator.'
          },
          {
            role: 'user',
            content: request.description || 'Generate example code'
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
      
      return {
        code: completion.choices[0]?.message?.content || '',
        explanation: 'AI generated successfully',
        suggestions: [],
        estimatedTime: '5 minutes'
      };
    } catch (error) {
      console.error('OpenAI error:', error);
      return {
        code: '// Error generating code',
        explanation: 'Failed to generate with AI',
        suggestions: ['Try again', 'Check API key'],
        estimatedTime: '0 minutes'
      };
    }
  }
}

export const aiService = new AICodeService();