import React, { useState } from 'react';
import { phonemeMap } from './data/phonemeMap';
import { speak } from './utils/textToSpeech';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import ExamplesSection from './components/ExamplesSection';

const ChineseNameApp = () => {
  const [inputName, setInputName] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getPronunciation = (name) => {
    const cleanName = name.toLowerCase().trim();
    const syllables = [];
    const phonemes = Object.keys(phonemeMap);
    let remainingName = cleanName;
    
    while (remainingName.length > 0) {
      let matched = false;
      for (let phoneme of phonemes.sort((a, b) => b.length - a.length)) {
        if (remainingName.startsWith(phoneme)) {
          syllables.push(phoneme);
          remainingName = remainingName.slice(phoneme.length);
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        syllables.push(remainingName[0]);
        remainingName = remainingName.slice(1);
      }
    }
    
    return syllables;
  };

  const handlePronounce = () => {
    if (!inputName.trim()) return;
    setIsLoading(true);
    
    setTimeout(() => {
      const syllables = getPronunciation(inputName);
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

      <style jsx>{`
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