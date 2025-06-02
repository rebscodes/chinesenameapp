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
        {pronunciation.split('\n').map((line, index) => {
          // Find the index of the first space after the closing quote
          const quoteEndIndex = line.indexOf('" ');
          const syllable = line.substring(0, quoteEndIndex + 1);
          const description = line.substring(quoteEndIndex + 2);
          
          return (
            <div key={index} className="mb-4 last:mb-0">
              <p className="text-green-800 text-lg">
                <span className="font-semibold">{syllable}</span>
                {' ' + description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsSection; 