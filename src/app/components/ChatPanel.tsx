'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ChatPanelProps {
  onCodeGenerated: (code: { html: string; css: string; js: string }, pages?: Record<string, { title: string; html: string; css: string; js: string }>) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  currentProject?: { id: string; name: string; messages: Message[]; lastGeneratedCode?: { html: string; css: string; js: string } } | null;
  onMessagesUpdate?: (messages: Message[]) => void;
  onCodeUpdate?: (code: { html: string; css: string; js: string }) => void;
  onToggleSidebar?: () => void;
  onShowHistory?: () => void;
  onShowSettings?: () => void;
  onBack?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}



export default function ChatPanel({ onCodeGenerated, onLoadingChange, currentProject, onMessagesUpdate, onCodeUpdate, onBack }: ChatPanelProps) {
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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



  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // TODO: Handle file upload logic here
      console.log('Files selected:', e.target.files);
    }
  };

  return (
    <div className={`flex flex-col h-full min-h-0 transition-all duration-500 ease-in-out ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-indigo-50/50 to-purple-50/50'}`}>
      {/* Header with Back Button */}
      <div className={`flex items-center gap-3 p-4 border-b backdrop-blur-xl ${theme === 'dark' ? 'bg-gray-900/80 border-gray-800/50' : 'bg-white/80 border-gray-200/50'}`}>
        <button
          onClick={onBack}
          className={`p-2.5 rounded-xl transition-all duration-200 ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
          title="Back to Projects"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h2 className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {currentProject?.name || 'New Project'}
          </h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {messages.length - 1} messages
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            AI Ready
          </span>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-transparent'}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {message.role === 'assistant' && (
              <div className={`w-8 h-8 rounded-xl mr-3 flex-shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            )}
            <div
              className={`max-w-[80%] sm:max-w-[75%] p-4 rounded-2xl transition-all duration-200 ${message.role === 'user'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                : theme === 'dark'
                  ? 'bg-gray-800/70 text-gray-100 border border-gray-700/50'
                  : 'bg-white text-gray-800 border border-gray-200/50 shadow-md'
                }`}
            >
              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className={`w-8 h-8 rounded-xl ml-3 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold`}>
                U
              </div>
            )}
          </div>
        ))}



        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className={`w-8 h-8 rounded-xl mr-3 flex-shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
              <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className={`p-4 rounded-2xl shadow-md backdrop-blur-sm ${theme === 'dark'
              ? 'bg-gray-800/70 text-gray-100 border border-gray-700/50'
              : 'bg-white text-gray-800 border border-gray-200/50'
              }`}>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <span className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Crafting your code...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`border-t p-4 ${theme === 'dark' ? 'bg-gray-900/80 backdrop-blur-xl border-gray-800/50' : 'bg-white/80 backdrop-blur-xl border-gray-200/50'}`}>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus-within:border-indigo-500 ${theme === 'dark'
            ? 'bg-gray-800/50 border-gray-700/50'
            : 'bg-white border-gray-200'
            }`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the web page you want to create..."
              className={`flex-1 text-sm sm:text-base bg-transparent focus:outline-none ${theme === 'dark'
                ? 'text-gray-100 placeholder-gray-500'
                : 'text-gray-900 placeholder-gray-400'
                }`}
              disabled={isLoading}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-xl transition-all duration-200 ${theme === 'dark'
                ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              title="Add images"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform active:scale-95 flex items-center justify-center gap-2"
            title="Send message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
