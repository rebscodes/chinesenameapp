import pinyin from 'pinyin';
import { phonemeMap } from '../data/phonemeMap';

export const EXAMPLE_NAMES = {
  TIANYUAN: 'tianyuan',
  WENQING: 'wenqing',
  ZHIHUA: 'zhihua',
  ZHANGWEILI: '张伟丽'
};

export const EXAMPLE_NAMES_STRING = `${EXAMPLE_NAMES.TIANYUAN}, ${EXAMPLE_NAMES.WENQING}, ${EXAMPLE_NAMES.ZHIHUA}, ${EXAMPLE_NAMES.ZHANGWEILI}`;

// Get all possible syllables from phonemeMap, sorted by length (longest first)
const POSSIBLE_SYLLABLES = Object.keys(phonemeMap).sort((a, b) => b.length - a.length);

export const separatePinyinSyllables = (input) => {
  const words = input.toLowerCase().trim().split(/\s+/);
  let result = [];

  for (const word of words) {
    let remaining = word;

    while (remaining.length > 0) {
      let found = false;

      // Try all possible syllables, starting with the longest ones
      for (const syllable of POSSIBLE_SYLLABLES) {
        if (remaining.startsWith(syllable)) {
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

export const convertToPinyin = (input) => {
  // Convert Chinese to pinyin without tones
  return pinyin(input, {
    style: pinyin.STYLE_NORMAL,
    segment: true
  }).flat().join(' ');
};

export const checkIfChineseCharacters = (input) => {
  return /[\u4e00-\u9fa5]/.test(input);
};

export const getPronunciation = (name) => {
  if (!name) return { syllables: [], notFoundSyllables: [] };
  
  // First convert any Chinese characters to pinyin
  let pinyinText = name;
  if (checkIfChineseCharacters(name)) {
    pinyinText = convertToPinyin(name);
  }

  // Process the pinyin
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
