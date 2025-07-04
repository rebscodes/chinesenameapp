import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BookOpen, Volume2, Info } from 'lucide-react';
import { checkIfChineseCharacters, convertToPinyin } from '../utils/pinyinUtils';
import { playAudio } from '../utils/tts';

export const getToneDescription = (pinyinWithTone) => {
  if (!pinyinWithTone) return '';
  
  // Extract the tone number from the pinyin
  const toneMatch = pinyinWithTone.match(/[āáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜ]/);
  if (!toneMatch) return '';
  
  const toneChar = toneMatch[0];
  const toneMap = {
    'āēīōūǖ': 'The tone is high and steady, like singing a single note',
    'áéíóúǘ': 'The tone rises as if asking a question, like "huh?"',
    'ǎěǐǒǔǚ': 'The tone dips down and back up, like saying "hmmmMMH...?"',
    'àèìòùǜ': 'The tone falls sharply, like firmly answering "no."',
  };
  
  for (const [chars, description] of Object.entries(toneMap)) {
    if (chars.includes(toneChar)) {
      return description;
    }
  }
  
  return '';
};

const ResultsSection = ({ pronunciation, originalInput = '' }) => {
  // Track playing state for each syllable independently
  const [playingStates, setPlayingStates] = useState({});

  if (!pronunciation) return null;

  // Only show speaker buttons if the original input contains Chinese characters
  const showSpeakerButtons = originalInput && checkIfChineseCharacters(originalInput);

  const handleSpeak = async (text, index) => {
    if (playingStates[index]) return;
    
    try {
      setPlayingStates(prev => ({ ...prev, [index]: true }));
      // Use the original Chinese character for TTS
      await playAudio(text);
    } catch (error) {
      console.error('Failed to play audio:', error);
      // Show a user-friendly error message
      alert('Unable to play pronunciation. Please try again.');
    } finally {
      setPlayingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  // Split the pronunciation into lines and get the corresponding Chinese characters
  const lines = pronunciation.split('\n');
  const chineseChars = originalInput ? originalInput.split('') : [];
  
  // Get pinyin with tones for each character
  const pinyinWithTones = showSpeakerButtons ? 
    convertToPinyin(originalInput).split(' ') : 
    Array(chineseChars.length).fill('');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2 text-green-700">
        <BookOpen className="w-5 h-5" />
        <span className="font-medium">Pronunciation Guide</span>
      </div>

      <div className="bg-green-50 rounded-xl p-4">
        {lines.map((line, index) => {
          // Find the index of the first space after the closing quote
          const quoteEndIndex = line.indexOf('" ');
          const syllable = line.substring(0, quoteEndIndex + 1);
          const description = line.substring(quoteEndIndex + 2);

          // Get the corresponding Chinese character and pinyin with tone
          const chineseChar = chineseChars[index];
          const pinyinWithTone = pinyinWithTones[index];
          const toneDescription = getToneDescription(pinyinWithTone);

          return (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-800 text-lg">{syllable}</span>
                  {showSpeakerButtons && chineseChar && (
                    <button
                      onClick={() => handleSpeak(chineseChar, index)}
                      disabled={playingStates[index]}
                      className="p-1 hover:bg-green-100 rounded-full transition-colors disabled:opacity-50"
                      title="Listen to pronunciation"
                    >
                      <Volume2 className={`w-5 h-5 text-green-700 ${playingStates[index] ? 'animate-pulse' : ''}`} />
                    </button>
                  )}
                </div>
                <div>
                  <p className="text-green-800 text-lg leading-tight pt-0.5">{description}</p>
                  {toneDescription && (
                    <p className="text-green-700 text-sm mt-1 italic">{toneDescription}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!showSpeakerButtons && (
        <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-blue-700 text-sm">
            <span className="font-medium"></span> This describes syllable sounds only. Tones are important to proper Chinese pronunciation but not covered here.
          </p>
        </div>
      )}
    </div>
  );
};

ResultsSection.propTypes = {
  pronunciation: PropTypes.string.isRequired,
  originalInput: PropTypes.string
};

export default ResultsSection;
