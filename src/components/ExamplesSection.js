import React from 'react';

const ExamplesSection = ({ setInputName }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="font-semibold text-gray-800 mb-3">Try these examples:</h3>
    <div className="flex flex-wrap gap-2">
      {['zhengxun', 'weiming', 'li', 'chen'].map((example) => (
        <button
          key={example}
          onClick={() => setInputName(example)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
        >
          {example}
        </button>
      ))}
    </div>
  </div>
);

export default ExamplesSection; 