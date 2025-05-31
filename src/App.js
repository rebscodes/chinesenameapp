import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { phonemeMap } from './data/phonemeMap';

const PINYIN_INITIALS = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'];
const PINYIN_FINALS = ['iang', 'iong', 'uang', 'ian', 'iao', 'ing', 'ong', 'uai', 'uan', 'ang', 'eng', 'ian', 'iao', 'ing', 'ong', 'uai', 'uan', 'ai', 'an', 'ao', 'ei', 'en', 'er', 'ie', 'in', 'iu', 'ou', 'ui', 'un', 'uo', 'a', 'e', 'i', 'o', 'u', 'v', 'ü'];

const App = () => {
  const [inputName, setInputName] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const separatePinyinSyllables = (input) => {
    const cleanInput = input.toLowerCase().trim();
    let result = [];
    let remaining = cleanInput;
    
    while (remaining.length > 0) {
      // Try to find the longest valid syllable at the start of remaining string
      let found = false;
      
      // Try each initial + final combination
      for (const initial of PINYIN_INITIALS) {
        if (remaining.startsWith(initial)) {
          for (const final of PINYIN_FINALS) {
            const syllable = initial + final;
            if (remaining.startsWith(syllable) && phonemeMap[syllable]) {
              result.push(syllable);
              remaining = remaining.slice(syllable.length);
              found = true;
              break;
            }
          }
          if (found) break;
        }
      }
      
      // If no initial+final combination found, try just finals
      if (!found) {
        for (const final of PINYIN_FINALS) {
          if (remaining.startsWith(final) && phonemeMap[final]) {
            result.push(final);
            remaining = remaining.slice(final.length);
            found = true;
            break;
          }
        }
      }
      
      // If still no match found, take one character
      if (!found) {
        result.push(remaining[0]);
        remaining = remaining.slice(1);
      }
    }
    
    return result;
  };

  const getPronunciation = (name) => {
    if (!name) return { syllables: [], notFoundSyllables: [] };
    
    const syllables = separatePinyinSyllables(name);
    const notFoundSyllables = syllables.filter(syllable => !phonemeMap[syllable]);
    return { syllables, notFoundSyllables };
  };

  const handlePronounce = () => {
    if (!inputName.trim()) return;
    setIsLoading(true);
    setErrors([]);
    
    setTimeout(() => {
      const { syllables, notFoundSyllables } = getPronunciation(inputName);
      
      if (notFoundSyllables.length > 0) {
        setErrors([
          `Found pronunciation for: "${syllables.filter(s => phonemeMap[s]).join('", "')}"${syllables.length ? '.' : ''} ` +
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