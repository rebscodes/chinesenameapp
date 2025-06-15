import React from 'react';
import { HelpCircle } from 'lucide-react';

const Header = () => (
  <div className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 overflow-hidden flex items-center justify-center">
          <img src="/logo3.png" alt="Pinyin Helper Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pinyin Helper</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">A simplified guide for pronouncing Chinese</p>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-3 bg-white rounded-lg shadow-lg border border-gray-100 text-sm text-gray-700 hidden group-hover:block z-10">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                <p className="mb-2">Converts Mandarin pinyin to English sound-alikes. Covers basic syllable pronunciation only - no tones / dialects / special sounds (eg. umlaut, etc.)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Header;
