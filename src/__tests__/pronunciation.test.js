import { phonemeMap } from '../data/phonemeMap';

const PINYIN_INITIALS = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'];
const PINYIN_FINALS = ['iang', 'iong', 'uang', 'ian', 'iao', 'ing', 'ong', 'uai', 'uan', 'ang', 'eng', 'ian', 'iao', 'ing', 'ong', 'uai', 'uan', 'ai', 'an', 'ao', 'ei', 'en', 'er', 'ie', 'in', 'iu', 'ou', 'ui', 'un', 'uo', 'a', 'e', 'i', 'o', 'u', 'v', 'ü'];

const separatePinyinSyllables = (input) => {
  // Split by whitespace first to handle multi-word inputs
  const words = input.toLowerCase().trim().split(/\s+/);
  let result = [];
  
  for (const word of words) {
    let remaining = word;
    
    while (remaining.length > 0) {
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
  }
  
  return result;
};

describe('Pinyin Syllable Separation', () => {
  const getPronunciation = (name) => {
    if (!name) return { syllables: [], notFoundSyllables: [] };
    const syllables = separatePinyinSyllables(name);
    const notFoundSyllables = syllables.filter(syllable => !phonemeMap[syllable]);
    return { syllables, notFoundSyllables };
  };

  // Test single syllables
  test('handles single syllables correctly', () => {
    expect(getPronunciation('li').syllables).toEqual(['li']);
    expect(getPronunciation('wei').syllables).toEqual(['wei']);
    expect(getPronunciation('zhao').syllables).toEqual(['zhao']);
  });

  // Test compound syllables
  test('handles compound syllables correctly', () => {
    expect(getPronunciation('zheng').syllables).toEqual(['zheng']);
    expect(getPronunciation('zhang').syllables).toEqual(['zhang']);
    expect(getPronunciation('xiao').syllables).toEqual(['xiao']);
  });

  // Test multi-syllable names
  test('handles multi-syllable names correctly', () => {
    expect(getPronunciation('zhangwei').syllables).toEqual(['zhang', 'wei']);
    expect(getPronunciation('liming').syllables).toEqual(['li', 'ming']);
    expect(getPronunciation('xiaoming').syllables).toEqual(['xiao', 'ming']);
  });

  // Test case insensitivity
  test('handles different cases correctly', () => {
    expect(getPronunciation('ZHENG').syllables).toEqual(['zheng']);
    expect(getPronunciation('ZhangWei').syllables).toEqual(['zhang', 'wei']);
    expect(getPronunciation('LiMing').syllables).toEqual(['li', 'ming']);
  });

  // Test whitespace handling
  test('handles whitespace correctly', () => {
    // Test with spaces between syllables
    const result1 = getPronunciation('zhang wei');
    console.log('Result for "zhang wei":', result1);
    expect(result1.syllables).toEqual(['zhang', 'wei']);

    const result2 = getPronunciation('li ming');
    console.log('Result for "li ming":', result2);
    expect(result2.syllables).toEqual(['li', 'ming']);

    // Test with extra spaces
    const result3 = getPronunciation('  zhao  ming  ');
    console.log('Result for "  zhao  ming  ":', result3);
    expect(result3.syllables).toEqual(['zhao', 'ming']);
  });

  // Test invalid input
  test('handles invalid input correctly', () => {
    const result1 = getPronunciation('abc');
    expect(result1.syllables).toEqual(['a', 'b', 'c']);
    expect(result1.notFoundSyllables).toEqual(['a', 'b', 'c']);

    const result2 = getPronunciation('zhengabc');
    expect(result2.syllables).toEqual(['zheng', 'a', 'b', 'c']);
    expect(result2.notFoundSyllables).toEqual(['a', 'b', 'c']);
  });

  // Test empty input
  test('handles empty input correctly', () => {
    expect(getPronunciation('').syllables).toEqual([]);
    expect(getPronunciation('   ').syllables).toEqual([]);
  });

  // Test names with valid and invalid parts
  test('handles mixed valid and invalid syllables', () => {
    const result = getPronunciation('zhengxxx');
    expect(result.syllables).toContain('zheng');
    expect(result.notFoundSyllables.length).toBeGreaterThan(0);
  });
}); 