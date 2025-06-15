import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import AboutModal from './AboutModal';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Learn more about Pinyin Helper"
                >
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AboutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Header;
