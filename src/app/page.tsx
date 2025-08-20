'use client';

import { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import PreviewPanel from './components/PreviewPanel';

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState({
    html: '<div class="text-center p-8"><h1 class="text-4xl font-bold text-blue-600 mb-4">Welcome to PageCrafter</h1><p class="text-gray-600">Ask me to create something amazing!</p></div>',
    css: 'body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }',
    js: '// Your JavaScript code will appear here'
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat Panel - Left Side */}
      <div className="w-1/2 border-r border-gray-300">
        <ChatPanel onCodeGenerated={setGeneratedCode} />
      </div>
      
      {/* Preview Panel - Right Side */}
      <div className="w-1/2">
        <PreviewPanel code={generatedCode} />
      </div>
    </div>
  );
}
