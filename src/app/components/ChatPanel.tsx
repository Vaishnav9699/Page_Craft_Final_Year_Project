'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Link from 'next/link';

interface ChatPanelProps {
  onCodeGenerated: (code: { html: string; css: string; js: string }, pages?: Record<string, { title: string; html: string; css: string; js: string }>) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  currentProject?: { id: string; name: string; messages: Message[]; lastGeneratedCode?: { html: string; css: string; js: string } } | null;
  onMessagesUpdate?: (messages: Message[]) => void;
  onCodeUpdate?: (code: { html: string; css: string; js: string }) => void;
  onToggleSidebar?: () => void;
  onShowHistory?: () => void;
  onShowSettings?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_PROMPTS = [
  '🎨 Create a colorful landing page',
  '📱 Build a mobile app mockup',
  '🛒 Design an e-commerce product card',
  '✍️ Make a blog post layout',
  '🎯 Create a portfolio showcase',
  '💬 Design a chat interface'
];

export default function ChatPanel({ onCodeGenerated, onLoadingChange, currentProject, onMessagesUpdate, onCodeUpdate, onShowHistory, onShowSettings }: ChatPanelProps) {
  const { theme, toggleTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>(currentProject?.messages || [
    {
      role: 'assistant',
      content: 'Hi! I\'m your PageCrafter assistant. Tell me what kind of web page you\'d like me to create, and I\'ll generate the HTML, CSS, and JavaScript for you!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastGeneratedCode, setLastGeneratedCode] = useState<{ html: string; css: string; js: string }>(currentProject?.lastGeneratedCode || {
    html: '',
    css: '',
    js: ''
  });

  // Update messages and code when currentProject changes
  useEffect(() => {
    if (currentProject) {
      setMessages(currentProject.messages.length > 0 ? currentProject.messages as Message[] : [
        {
          role: 'assistant',
          content: 'Hi! I\'m your PageCrafter assistant. Tell me what kind of web page you\'d like me to create, and I\'ll generate the HTML, CSS, and JavaScript for you!'
        }
      ]);
      setLastGeneratedCode(currentProject.lastGeneratedCode || {
        html: '',
        css: '',
        js: ''
      });
    }
  }, [currentProject]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    onLoadingChange?.(true);

    // Add user message to chat
    const newMessages: Message[] = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    onMessagesUpdate?.(newMessages);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          previousHtml: lastGeneratedCode.html,
          previousCss: lastGeneratedCode.css,
          previousJs: lastGeneratedCode.js
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const data = await response.json();

      // Add assistant response to chat
      const updatedMessages: Message[] = [...messages, { role: 'user' as const, content: userMessage }, { role: 'assistant' as const, content: data.response }];
      setMessages(updatedMessages);
      onMessagesUpdate?.(updatedMessages);

      // Update the generated code
      if (data.code) {
        // Store the code globally for next request
        setLastGeneratedCode(data.code);
        onCodeUpdate?.(data.code);
        onCodeGenerated(data.code, data.pages);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error generating the code. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className={`flex flex-col h-full min-h-0 transition-all duration-500 ease-in-out ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Messages */}
      <div ref={messagesContainerRef} className={`flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 scroll-smooth ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-2xl backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${message.role === 'user'
                ? theme === 'dark'
                  ? 'bg-primary text-white shadow-primary/20'
                  : 'bg-primary text-white shadow-primary/20'
                : theme === 'dark'
                  ? 'bg-card text-card-foreground border border-border/50'
                  : 'bg-white text-gray-800 border border-border/50 shadow-md'
                }`}
            >
              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Show suggested prompts only on initial state (no user messages yet) */}
        {messages.length === 1 && !isLoading && (
          <div className="mt-8 space-y-3">
            <p className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
              Try these suggestions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className={`p-3 sm:p-3.5 rounded-lg text-left text-sm sm:text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700'
                    : 'bg-white hover:bg-blue-50 text-gray-800 border border-gray-200 shadow-sm'
                    }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className={`p-4 rounded-2xl shadow-sm backdrop-blur-sm transition-all duration-200 ${theme === 'dark'
              ? 'bg-gray-800 text-gray-100 border border-gray-700'
              : 'bg-white text-gray-800 border border-gray-200 shadow-md'
              }`}>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm font-medium">Generating code...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`border-t p-3 sm:p-4 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the web page you want to create..."
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
              ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm transform active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Send message (Shift+Enter)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
