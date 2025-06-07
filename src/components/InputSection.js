import React from 'react';
import { Search, BookOpen } from 'lucide-react';
import { EXAMPLE_NAMES_STRING } from '../utils/pinyinUtils';

const InputSection = ({ inputName, setInputName, handlePronounce, isLoading, clearInput }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
    <div className="flex items-center gap-2 text-gray-700 mb-2">
      <BookOpen className="w-5 h-5" />
      <span className="font-medium">Enter Chinese Word or Name</span>
    </div>

    <div className="relative">
      <input
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handlePronounce()}
        placeholder={`e.g., ${EXAMPLE_NAMES_STRING}`}
        className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
      />
      {inputName && (
        <button
          onClick={clearInput}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>

    <button
      onClick={handlePronounce}
      disabled={!inputName.trim() || isLoading}
      className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:shadow-lg"
    >
      {isLoading ? (
        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
      ) : (
        <>
          <Search className="w-5 h-5" />
          Get Pronunciation
        </>
      )}
    </button>
  </div>
);

export default InputSection;
