import pinyin from 'pinyin';
import { phonemeMap } from '../data/phonemeMap';

export const EXAMPLE_NAMES = {
  TIANYUAN: 'tianyuan',
  WENQING: 'wenqing',
  ZHIHUA: 'zhihua',
  ZHANGWEILI: '张伟丽'
};

export const EXAMPLE_NAMES_STRING = `${EXAMPLE_NAMES.TIANYUAN}, ${EXAMPLE_NAMES.WENQING}, ${EXAMPLE_NAMES.ZHIHUA}, ${EXAMPLE_NAMES.ZHANGWEILI}`;

export const PINYIN_INITIALS = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'];
export const PINYIN_FINALS = ['iang', 'iong', 'uang', 'ang', 'eng', 'ian', 'iao', 'ing', 'ong', 'uai', 'uan', 'ai', 'an', 'ao', 'ei', 'en', 'er', 'ie', 'in', 'iu', 'ou','ua', 'ui', 'un', 'uo', 'a', 'e', 'i', 'o', 'u', 'v', 'ü'];

// Helper function to get all possible syllables
const getAllPossibleSyllables = () => {
  const syllables = [];
  // Add all initial + final combinations
  for (const initial of PINYIN_INITIALS) {
    for (const final of PINYIN_FINALS) {
      syllables.push(initial + final);
    }
  }
  // Add all finals as standalone syllables
  syllables.push(...PINYIN_FINALS);
  // Sort by length (longest first) to ensure we match longest valid syllables first
  return syllables.sort((a, b) => b.length - a.length);
};

const POSSIBLE_SYLLABLES = getAllPossibleSyllables();

export const separatePinyinSyllables = (input) => {
  const words = input.toLowerCase().trim().split(/\s+/);
  let result = [];

  for (const word of words) {
    let remaining = word;

    while (remaining.length > 0) {
      let found = false;

      // Try all possible syllables, starting with the longest ones
      for (const syllable of POSSIBLE_SYLLABLES) {
        if (remaining.startsWith(syllable) && phonemeMap[syllable]) {
          result.push(syllable);
          remaining = remaining.slice(syllable.length);
          found = true;
          break;
        }
      }

      // If no valid syllable found, take one character
      if (!found) {
        result.push(remaining[0]);
        remaining = remaining.slice(1);
      }
    }
  }

  return result;
};

// Add this new function to convert Chinese characters to pinyin
export const convertToPinyin = (input) => {
  // Check if input contains Chinese characters
  const containsChinese = /[\u4e00-\u9fa5]/.test(input);
  
  if (!containsChinese) {
    return input; // Return as is if no Chinese characters
  }
  
  // Convert Chinese to pinyin without tones
  return pinyin(input, {
    style: pinyin.STYLE_NORMAL,
    segment: true
  }).flat().join(' ');
};

export const getPronunciation = (name) => {
  if (!name) return { syllables: [], notFoundSyllables: [] };
  
  // First convert any Chinese characters to pinyin
  const pinyinText = convertToPinyin(name);
  
  // Then process the pinyin as before
  const syllables = separatePinyinSyllables(pinyinText);
  const notFoundSyllables = syllables.filter(syllable => !phonemeMap[syllable]);
  return { syllables, notFoundSyllables };
};

export const formatPronunciationError = (syllables, notFoundSyllables, originalInput) => {
  const containsChinese = /[\u4e00-\u9fa5]/.test(originalInput);
  if (containsChinese) {
    return `Could not parse "${originalInput}" (converted to pinyin: "${convertToPinyin(originalInput)}") into valid syllables.`;
  }
  return `Could not parse "${originalInput}" into valid pinyin.`;
};

export const formatPronunciationResult = (syllables) => {
  return syllables.map(syllable => {
    if (phonemeMap[syllable]) {
      return `"${syllable}" ${phonemeMap[syllable].description}`;
    }
    return `"${syllable}" (pronunciation not found)`;
  }).join('\n');
};
