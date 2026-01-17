'use client';

import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportCode?: (format: 'html' | 'zip') => void;
}

export default function SettingsModal({ isOpen, onClose, onExportCode }: SettingsModalProps) {
  const { theme } = useTheme();
  const [exportFormat, setExportFormat] = useState<'html' | 'zip'>('html');

  if (!isOpen) return null;

  const handleExport = () => {
    onExportCode?.(exportFormat);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-5 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Settings
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2.5 rounded-xl transition-all duration-200 ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Options */}
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Export Project
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setExportFormat('html')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${exportFormat === 'html'
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : theme === 'dark'
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${exportFormat === 'html' ? 'bg-indigo-500/20' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <svg className={`w-5 h-5 ${exportFormat === 'html' ? 'text-indigo-400' : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className={`font-semibold ${exportFormat === 'html' ? 'text-indigo-400' : theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>HTML File</p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Single file</p>
                </button>
                <button
                  onClick={() => setExportFormat('zip')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${exportFormat === 'zip'
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : theme === 'dark'
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${exportFormat === 'zip' ? 'bg-indigo-500/20' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <svg className={`w-5 h-5 ${exportFormat === 'zip' ? 'text-indigo-400' : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <p className={`font-semibold ${exportFormat === 'zip' ? 'text-indigo-400' : theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ZIP Package</p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>All files</p>
                </button>
              </div>
              <button
                onClick={handleExport}
                className="w-full px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                Export Project
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}></div>

          {/* About */}
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              About
            </h3>
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PC</span>
                </div>
                <div>
                  <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>PageCrafter</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Version 1.0.0</p>
                </div>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                AI-powered web development assistant that helps you create beautiful websites with natural language.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
          <button
            onClick={onClose}
            className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
