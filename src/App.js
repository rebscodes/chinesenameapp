import React, { useState } from 'react';
import { phonemeMap } from './data/phonemeMap';
import { speak } from './utils/textToSpeech';
import pinyinSeparate from 'pinyin-separate';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import ExamplesSection from './components/ExamplesSection';

const ChineseNameApp = () => {
  const [inputName, setInputName] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const getPronunciation = (name) => {
    const cleanName = name.toLowerCase().trim();
    const syllables = pinyinSeparate(cleanName);
    const notFoundSyllables = syllables.filter(syllable => !phonemeMap[syllable]);
    return { syllables, notFoundSyllables };
  };

  const handlePronounce = () => {
    if (!inputName.trim()) return;
    setIsLoading(true);
    setErrors([]);
    
    setTimeout(() => {
      const { syllables, notFoundSyllables } = getPronunciation(inputName);
      
      // Handle errors if any syllables weren't found
      if (notFoundSyllables.length > 0) {
        setErrors([
          `Found pronunciation for: "${syllables.join('", "')}"${syllables.length ? '.' : ''} ` +
          `Could not find pronunciation for: "${notFoundSyllables.join('", "')}". ` +
          `Try checking the spelling or breaking the name into different syllables.`
        ]);
      }

      const pronunciationParts = syllables.map(syllable => {
        if (phonemeMap[syllable]) {
          const mapping = phonemeMap[syllable];
          return `"${syllable}" is said ${mapping.description}`;
        } else {
          return `"${syllable}" (pronunciation not found)`;
        }
      });
      
      setPronunciation(pronunciationParts.join(', '));
      setIsLoading(false);
    }, 800);
  };

  const clearInput = () => {
    setInputName('');
    setPronunciation('');
    setErrors([]);
  };

  const playAudio = () => {
    if (pronunciation) {
      speak(pronunciation);
    }
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
          playAudio={playAudio}
        />

        <ExamplesSection setInputName={setInputName} />

        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>Phonetic mappings help English speakers</p>
          <p>pronounce Chinese names correctly</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChineseNameApp;