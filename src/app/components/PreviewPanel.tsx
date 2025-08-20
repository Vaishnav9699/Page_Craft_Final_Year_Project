'use client';

import { useEffect, useRef, useState } from 'react';

interface PreviewPanelProps {
  code: {
    html: string;
    css: string;
    js: string;
  };
}

export default function PreviewPanel({ code }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview');

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      
      // Create the complete HTML document as a data URL
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>
            ${code.css}
          </style>
        </head>
        <body>
          ${code.html}
          <script>
            ${code.js}
          </script>
        </body>
        </html>
      `;
      
      // Use data URL to avoid cross-origin issues
      const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(fullHtml);
      iframe.src = dataUrl;
    }
  }, [code]);

  const renderCodeView = (language: string, content: string) => (
    <div className="h-full overflow-auto">
      <pre className="p-4 text-sm font-mono bg-gray-900 text-green-400 h-full overflow-auto">
        <code>{content}</code>
      </pre>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header with tabs */}
      <div className="bg-gray-800 text-white">
        <div className="flex">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'html'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'css'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'js'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            JavaScript
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white">
        {activeTab === 'preview' && (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
        
        {activeTab === 'html' && renderCodeView('html', code.html)}
        {activeTab === 'css' && renderCodeView('css', code.css)}
        {activeTab === 'js' && renderCodeView('javascript', code.js)}
      </div>
    </div>
  );
}
