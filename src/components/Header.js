import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => (
  <div className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pinyin Helper</h1>
          <p className="text-sm text-gray-600">Helping English speakers pronounce Chinese</p>
        </div>
      </div>
    </div>
  </div>
);

export default Header;
