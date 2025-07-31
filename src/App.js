import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import ExamplesSection from './components/ExamplesSection';
import { getPronunciation, formatPronunciationError, formatPronunciationResult } from './utils/pinyinUtils';

const App = () => {
  const [inputName, setInputName] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [pronunciationInput, setPronunciationInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handlePronounce = useCallback(() => {
    if (!inputName.trim()) return;

    setIsLoading(true);
    setErrors([]);
    setPronunciation('');
    setPronunciationInput(inputName);

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
          setPronunciationInput('');
        } else {
          setPronunciation(formatPronunciationResult(syllables, inputName.trim()));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [inputName]);

  const clearInput = useCallback(() => {
    setInputName('');
    setPronunciation('');
    setPronunciationInput('');
    setErrors([]);
  }, []);

  return (
    <div className="min-h-screen">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Chinese Name Pronunciation Tool",
            "description": "Free tool to learn correct pronunciation of Chinese names with pinyin guide. Perfect for English speakers learning Mandarin Chinese.",
            "url": "https://pinyinhelper.com",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Person",
              "name": "Rebecca Chinn"
            }
          })}
        </script>
      </Helmet>
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
          <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="bg-orange-50/80 rounded-xl p-4">
              {errors.map((error, index) => (
                <p key={index} className="text-orange-500">
                  {error}
                </p>
              ))}
            </div>
          </div>
        )}

        {errors.length === 0 && (
          <ResultsSection
            pronunciation={pronunciation}
            originalInput={pronunciationInput}
          />
        )}

        <ExamplesSection setInputName={setInputName} />

        <div className="text-center text-sm text-gray-500 space-y-2">
          <a href="https://www.youtube.com/watch?v=Z-xI1384Ry4&ab_channel=WorldSchool">that's just like, your 'pinyin man!</a>
          <p>made with 💖 by
            <a href="http://instagram.com/rebswushu">@rebswushu</a>.&nbsp;
            <a href="https://www.admonymous.co/rebecca-chinn">got thoughts?💭</a>&nbsp;
            <a href="https://coff.ee/rebscodes">say thanks!☕</a> &nbsp;
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
