import React from 'react';
import { Volume2 } from 'lucide-react';

const ResultsSection = ({ pronunciation, playAudio }) => {
  if (!pronunciation) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-700">
          <Volume2 className="w-5 h-5" />
          <span className="font-medium">Pronunciation Guide</span>
        </div>
        <button
          onClick={playAudio}
          className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
          title="Play audio"
        >
          <Volume2 className="w-4 h-4 text-green-600" />
        </button>
      </div>
      
      <div className="bg-green-50 rounded-xl p-4">
        <p className="text-green-800 text-lg leading-relaxed">
          {pronunciation}
        </p>
      </div>
    </div>
  );
};

export default ResultsSection; 