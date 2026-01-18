import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, template, variables } = body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a code enhancement assistant. Review and improve ${language} code for best practices, performance, and readability.`
        },
        {
          role: 'user',
          content: `Enhance this ${language} code from template "${template}":\n\n${code}\n\nVariables used: ${JSON.stringify(variables)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return NextResponse.json({
      enhancedCode: completion.choices[0]?.message?.content || '',
      suggestions: [
        'Added error handling',
        'Improved variable names',
        'Added comments',
        'Optimized performance'
      ]
    });

  } catch (error) {
    console.error('AI enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance code' },
      { status: 500 }
    );
  }
}