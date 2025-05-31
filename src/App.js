import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
<<<<<<< HEAD
import { getPronunciation, formatPronunciationError, formatPronunciationResult } from './utils/pinyinUtils';
=======
import { phonemeMap } from './data/phonemeMap';

const PINYIN_INITIALS = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'];
const PINYIN_FINALS = ['iang', 'iong', 'uang', 'ian', 'iao', 'ing', 'ong', 'uai', 'uan', 'ang', 'eng', 'ian', 'iao', 'ing', 'ong', 'uai', 'uan', 'ai', 'an', 'ao', 'ei', 'en', 'er', 'ie', 'in', 'iu', 'ou', 'ui', 'un', 'uo', 'a', 'e', 'i', 'o', 'u', 'v', 'ü'];
>>>>>>> 26b9436e59b3ca92199826ef8ce7220ff8f04659

const App = () => {
  const [inputName, setInputName] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handlePronounce = () => {
    if (!inputName.trim()) return;
    setIsLoading(true);
    setErrors([]);
    
    setTimeout(() => {
      const { syllables, notFoundSyllables } = getPronunciation(inputName);
      
      if (notFoundSyllables.length > 0) {
        setErrors([formatPronunciationError(syllables, notFoundSyllables)]);
      }

      setPronunciation(formatPronunciationResult(syllables));
      setIsLoading(false);
    }, 800);
  };

  const clearInput = () => {
    setInputName('');
    setPronunciation('');
    setErrors([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <InputSection
          inputName={inputName}
          setInputName={setInputName}
          handlePronounce={handlePronounce}
          isLoading={isLoading}
          clearInput={clearInput}
        />

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            {errors.map((error, index) => (
              <p key={index} className="text-red-700">
                {error}
              </p>
            ))}
          </div>
        )}

        <ResultsSection 
          pronunciation={pronunciation}
        />

        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>Phonetic mappings help English speakers</p>
          <p>pronounce Chinese names correctly</p>
        </div>
      </div>
    </div>
  );
};

export default App;