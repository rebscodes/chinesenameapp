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
const allSyllables = Object.keys(phonemeMap).sort((a, b) => b.length - a.length);

export const checkIfChineseCharacters = (text) => {
  if (!text) return false;
  // Check if the text contains any Chinese characters
  return /[\u4e00-\u9fa5]/.test(text);
};

// Convert Chinese to pinyin with tone marks for display
export const convertToPinyin = (input) => {
  if (!input) return '';
  
  // If the input is already pinyin (no Chinese characters), return as is
  if (!checkIfChineseCharacters(input)) {
    return input;
  }
  
  // Convert Chinese to pinyin with tone marks
  return pinyin(input, {
    style: pinyin.STYLE_TONE,  // Use tone marks (e.g., zhāng wěi)
    segment: true
  }).flat().join(' ');
};

// Convert Chinese to pinyin without tones for phoneme lookup
export const convertToPinyinNoTones = (input) => {
  if (!input) return '';
  
  // If the input is already pinyin (no Chinese characters), return as is
  if (!checkIfChineseCharacters(input)) {
    return input;
  }
  
  // Convert Chinese to pinyin without tones
  return pinyin(input, {
    style: pinyin.STYLE_NORMAL,  // No tones
    segment: true
  }).flat().join(' ');
};

export const separatePinyinSyllables = (input) => {
  if (!input) return [];
  
  // Split by spaces first, then process each syllable
  const syllables = input.toLowerCase().trim().split(/\s+/);
  const result = [];
  
  for (const syllable of syllables) {
    let remaining = syllable;
    
    while (remaining) {
      let found = false;
      
      // Try all possible syllables, starting with the longest ones
      for (const possibleSyllable of allSyllables) {
        if (remaining.startsWith(possibleSyllable)) {
          result.push(possibleSyllable);
          remaining = remaining.slice(possibleSyllable.length);
          found = true;
          break;
        }
      }
      
      if (!found) {
        // If no syllable matches, take the first character
        result.push(remaining[0]);
        remaining = remaining.slice(1);
      }
    }
  }
  
  return result;
};

export const getPronunciation = (name) => {
  if (!name) return { syllables: [], notFoundSyllables: [] };
  
  // Convert to pinyin without tones for phoneme lookup
  const pinyinText = convertToPinyinNoTones(name);
  const syllables = separatePinyinSyllables(pinyinText);
  
  // Check which syllables are in our phoneme map
  const notFoundSyllables = syllables.filter(syllable => !phonemeMap[syllable]);
  
  return { syllables, notFoundSyllables };
};

export const formatPronunciationError = (syllables, notFoundSyllables, originalInput) => {
  if (notFoundSyllables.length === 0) return '';
  
  const hasChineseChars = checkIfChineseCharacters(originalInput);
  if (hasChineseChars) {
    const pinyinText = convertToPinyinNoTones(originalInput);
    return `Could not parse "${originalInput}" (converted to pinyin: "${pinyinText}") into valid syllables.`;
  }
  
  return `Could not parse "${originalInput}" into valid pinyin.`;
};

export const formatPronunciationResult = (syllables, originalInput) => {
  if (!syllables.length) return '';
  
  // If the input contains Chinese characters, use tone-marked pinyin for display
  const hasChineseChars = checkIfChineseCharacters(originalInput);
  const displaySyllables = hasChineseChars ? 
    convertToPinyin(originalInput).split(' ') : 
    syllables;
  
  return syllables.map((syllable, index) => {
    const pronunciation = phonemeMap[syllable];
    if (!pronunciation) {
      return `"${syllable}" (pronunciation not found)`;
    }
    // Use the tone-marked syllable for display if available
    const displaySyllable = displaySyllables[index] || syllable;
    return `"${displaySyllable}" ${pronunciation.description}`;
  }).join('\n');
};
