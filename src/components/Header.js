import React from 'react';

const Header = () => (
  <div className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 overflow-hidden flex items-center justify-center">
          <img src="/logo3.png" alt="Pinyin Helper Logo" className="w-full h-full object-contain" />
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
