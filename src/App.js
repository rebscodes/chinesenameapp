import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { phonemeMap } from './data/phonemeMap';
import { speak } from './utils/textToSpeech';

const App = () => {
  const [inputName, setInputName] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [pinyinModule, setPinyinModule] = useState(null);

  useEffect(() => {
    // Debug log for phonemeMap
    console.log('PhonemeMap loaded:', phonemeMap);
    
    // Load pinyin-separate dynamically
    import('pinyin-separate').then(module => {
      console.log('Loaded pinyin module:', module); // Debug log
      setPinyinModule(module.default || module);
    }).catch(err => {
      console.error('Failed to load pinyin-separate:', err);
      setPinyinModule(null);
    });
  }, []);

  const findLongestMatchingSyllable = (str, startIndex) => {
    // Try to find the longest matching syllable starting at startIndex
    let end = str.length;
    while (end > startIndex) {
      const syllable = str.substring(startIndex, end);
      console.log('Trying syllable:', syllable, 'Found in map:', !!phonemeMap[syllable]);
      if (phonemeMap[syllable]) {
        console.log('Found matching syllable:', syllable);
        return syllable;
      }
      end--;
    }
    console.log('No match found, returning single character:', str[startIndex]);
    return str[startIndex]; // Return single character if no match found
  };

  const getPronunciation = (name) => {
    if (!name) return { syllables: [], notFoundSyllables: [] };
    
    const cleanName = name.toLowerCase().trim();
    console.log('Processing name:', cleanName);
    console.log('PhonemeMap keys:', Object.keys(phonemeMap));
    let syllables = [];
    let i = 0;

    // First try using the pinyin module
    if (pinyinModule && typeof pinyinModule === 'function') {
      try {
        syllables = pinyinModule(cleanName);
        console.log('Pinyin module returned:', syllables);
      } catch (err) {
        console.error('Error using pinyin module:', err);
        // If pinyin module fails, fall back to our own syllable detection
        while (i < cleanName.length) {
          const syllable = findLongestMatchingSyllable(cleanName, i);
          syllables.push(syllable);
          i += syllable.length;
        }
      }
    } else {
      console.log('Using fallback syllable detection');
      // If no pinyin module, use our own syllable detection
      while (i < cleanName.length) {
        const syllable = findLongestMatchingSyllable(cleanName, i);
        syllables.push(syllable);
        i += syllable.length;
      }
    }
    
    console.log('Final syllables:', syllables);
    const notFoundSyllables = syllables.filter(syllable => !phonemeMap[syllable]);
    console.log('Not found syllables:', notFoundSyllables);
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

        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>Phonetic mappings help English speakers</p>
          <p>pronounce Chinese names correctly</p>
        </div>
      </div>
    </div>
  );
};

export default App;