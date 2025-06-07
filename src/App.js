import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import ExamplesSection from './components/ExamplesSection';
import { getPronunciation, formatPronunciationError, formatPronunciationResult } from './utils/pinyinUtils';

const App = () => {
  const [inputName, setInputName] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handlePronounce = useCallback(() => {
    if (!inputName.trim()) return;

    setIsLoading(true);
    setErrors([]);
    setPronunciation('');

    // Use Promise to handle the async operation
    new Promise((resolve) => {
      setTimeout(() => {
        const { syllables, notFoundSyllables } = getPronunciation(inputName);
        resolve({ syllables, notFoundSyllables });
      }, 800);
    })
      .then(({ syllables, notFoundSyllables }) => {
        if (notFoundSyllables.length > 0) {
          setErrors([formatPronunciationError(syllables, notFoundSyllables, inputName.trim())]);
          setPronunciation('');
        } else {
          setPronunciation(formatPronunciationResult(syllables));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [inputName]);

  const clearInput = useCallback(() => {
    setInputName('');
    setPronunciation('');
    setErrors([]);
  }, []);

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

        {errors.length === 0 && (
          <ResultsSection
            pronunciation={pronunciation}
          />
        )}

        <ExamplesSection setInputName={setInputName} />

        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>that's just like, your 'pinyin man!</p>
          <p>made with 💖 by
            <a href="http://instagram.com/rebswushu">@rebswushu</a>.&nbsp;
            <a href="https://coff.ee/rebscodes">buy me a coffee</a>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
