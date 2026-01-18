"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Copy, ThumbsUp, ThumbsDown, Volume2, Paperclip } from "lucide-react";
import { aiService } from "@/lib/ai-service";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: 'like' | 'dislike';
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI coding assistant. I can generate, explain, optimize, debug, and translate code. What would you like to build today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedCode, setAttachedCode] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !attachedCode) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Analyze if user wants code analysis or generation
      const isCodeRequest = attachedCode || 
        input.toLowerCase().includes('code') ||
        input.toLowerCase().includes('generate') ||
        input.toLowerCase().includes('create') ||
        input.toLowerCase().includes('how to');

      let response;
      
      if (attachedCode) {
        // Code analysis
        response = await aiService.generate({
          task: 'explain',
          code: attachedCode,
          language: 'javascript',
          description: input || 'Explain this code'
        });
      } else if (isCodeRequest) {
        // Code generation
        response = await aiService.generate({
          task: 'generate',
          description: input,
          language: 'javascript',
          options: {
            includeComments: true,
            includeDocumentation: true,
            complexity: 'medium'
          }
        });
      } else {
        // General conversation
        const openai = new (window as any).OpenAI({
          apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true
        });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful coding assistant. Help users with programming questions, code generation, debugging, and learning.'
            },
            {
              role: 'user',
              content: input
            }
          ],
          max_tokens: 1000
        });

        response = { code: '', explanation: completion.choices[0]?.message?.content || '' };
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.explanation + (response.code ? `\n\n\`\`\`javascript\n${response.code}\n\`\`\`` : ''),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setAttachedCode('');

      // Speak response if browser supports it
      if ('speechSynthesis' in window && response.explanation) {
        const utterance = new SpeechSynthesisUtterance(response.explanation);
        speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const quickPrompts = [
    "Generate a React form with validation",
    "Explain this JavaScript function",
    "Optimize my database query",
    "Create a REST API in Express",
    "Debug this Python code",
    "Translate this to TypeScript"
  ];

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-gray-900 to-black rounded-2xl border border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">AI Coding Assistant</h2>
              <p className="text-sm text-gray-400">Real-time code generation & analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages(messages.slice(0, 1))}
              className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInput(prompt)}
              className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user' 
                ? 'bg-blue-600' 
                : 'bg-linear-to-r from-purple-600 to-pink-600'
            }`}>
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            
            <div className={`flex-1 ${message.role === 'user' ? 'items-end' : ''}`}>
              <div className={`rounded-2xl p-4 max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* Code blocks */}
                {message.content.includes('```') && (
                  <div className="mt-3">
                    <pre className="bg-gray-900 p-3 rounded-lg overflow-x-auto">
                      <code>
                        {message.content.match(/```[\s\S]*?```/g)?.[0].replace(/```/g, '')}
                      </code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(message.content.match(/```[\s\S]*?```/g)?.[0].replace(/```/g, '') || '')}
                      className="mt-2 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                    >
                      <Copy className="w-3 h-3 inline mr-1" />
                      Copy Code
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleFeedback(message.id, 'like')}
                      className={`p-1 ${message.feedback === 'like' ? 'text-green-500' : 'text-gray-500'}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'dislike')}
                      className={`p-1 ${message.feedback === 'dislike' ? 'text-red-500' : 'text-gray-500'}`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(message.content.replace(/```[\s\S]*?```/g, ''));
                        speechSynthesis.speak(utterance);
                      }}
                      className="p-1 text-gray-500"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-800 rounded-2xl p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about code... (Shift+Enter for new line)"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg resize-none min-h-15 max-h-30"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={2}
            />
            
            {attachedCode && (
              <div className="absolute -top-10 left-0 right-0 bg-gray-800 p-2 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Code attached ({attachedCode.length} chars)</span>
                  <button
                    type="button"
                    onClick={() => setAttachedCode('')}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const code = prompt('Paste your code to analyze:');
                  if (code) setAttachedCode(code);
                }}
                className="p-1.5 hover:bg-gray-700 rounded"
                title="Attach code"
              >
                <Paperclip className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !attachedCode)}
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}