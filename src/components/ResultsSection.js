import React from 'react';
import { BookOpen } from 'lucide-react';

const ResultsSection = ({ pronunciation }) => {
  if (!pronunciation) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2 text-green-700">
        <BookOpen className="w-5 h-5" />
        <span className="font-medium">Pronunciation Guide</span>
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