import { getPronunciation, formatPronunciationError, formatPronunciationResult } from '../utils/pinyinUtils';

describe('Pinyin Utilities', () => {
  describe('getPronunciation', () => {
    // Basic functionality
    test('handles single syllable names', () => {
      const cases = ['li', 'wei', 'zhao', 'zhang'];
      cases.forEach(name => {
        const result = getPronunciation(name);
        expect(result.syllables).toEqual([name]);
        expect(result.notFoundSyllables).toEqual([]);
      });
    });

    test('handles multi-syllable names', () => {
      const cases = [
        { input: 'zhangwei', expected: ['zhang', 'wei'] },
        { input: 'liming', expected: ['li', 'ming'] },
        { input: 'zhaoming', expected: ['zhao', 'ming'] }
      ];
      cases.forEach(({ input, expected }) => {
        const result = getPronunciation(input);
        expect(result.syllables).toEqual(expected);
        expect(result.notFoundSyllables).toEqual([]);
      });
    });

    // Edge cases
    test('handles empty and whitespace input', () => {
      const cases = ['', ' ', '   '];
      cases.forEach(input => {
        const result = getPronunciation(input);
        expect(result.syllables).toEqual([]);
        expect(result.notFoundSyllables).toEqual([]);
      });
    });

    test('handles case variations', () => {
      const cases = [
        { input: 'ZHANG', expected: ['zhang'] },
        { input: 'LiMing', expected: ['li', 'ming'] },
        { input: 'ZhaoMING', expected: ['zhao', 'ming'] }
      ];
      cases.forEach(({ input, expected }) => {
        const result = getPronunciation(input);
        expect(result.syllables).toEqual(expected);
        expect(result.notFoundSyllables).toEqual([]);
      });
    });

    // Special cases
    test('handles repeated syllables', () => {
      const cases = [
        { input: 'lingling', expected: ['ling', 'ling'] },
        { input: 'mingming', expected: ['ming', 'ming'] },
        { input: 'zhaozhao', expected: ['zhao', 'zhao'] }
      ];
      cases.forEach(({ input, expected }) => {
        const result = getPronunciation(input);
        expect(result.syllables).toEqual(expected);
        expect(result.notFoundSyllables).toEqual([]);
      });
    });

    test('handles similar syllables', () => {
      const cases = [
        { input: 'zhaozao', expected: ['zhao', 'zao'] },
        { input: 'zhangzhan', expected: ['zhang', 'zhan'] },
        { input: 'zhaozhan', expected: ['zhao', 'zhan'] }
      ];
      cases.forEach(({ input, expected }) => {
        const result = getPronunciation(input);
        expect(result.syllables).toEqual(expected);
        expect(result.notFoundSyllables).toEqual([]);
      });
    });

    test('handles syllables with spaces', () => {
      const cases = [
        { input: 'zhao zao', expected: ['zhao', 'zao'] },
        { input: 'zhang zhan', expected: ['zhang', 'zhan'] },
        { input: 'ling ling', expected: ['ling', 'ling'] }
      ];
      cases.forEach(({ input, expected }) => {
        const result = getPronunciation(input);
        expect(result.syllables).toEqual(expected);
        expect(result.notFoundSyllables).toEqual([]);
      });
    });

    // Invalid input handling
    test('handles invalid characters', () => {
      const cases = [
        { input: 'zhang123', expected: ['zhang', '1', '2', '3'] },
        { input: 'li!wei@', expected: ['li', '!', 'wei', '@'] }
      ];
      cases.forEach(({ input, expected }) => {
        const result = getPronunciation(input);
        expect(result.syllables).toEqual(expected);
      });
    });
  });

  describe('formatPronunciationError', () => {
    test('formats error message for invalid syllables', () => {
      const cases = [
        {
          syllables: ['zhang', 'xyz'],
          notFound: ['xyz'],
          expected: 'Found pronunciation for: "zhang". Could not find pronunciation for: "xyz". Try checking the spelling or breaking the name into different syllables.'
        },
        {
          syllables: ['abc', '123'],
          notFound: ['abc', '123'],
          expected: 'Found pronunciation for: . Could not find pronunciation for: "abc", "123". Try checking the spelling or breaking the name into different syllables.'
        }
      ];

      cases.forEach(({ syllables, notFound, expected }) => {
        const result = formatPronunciationError(syllables, notFound);
        expect(result).toBe(expected);
      });
    });
  });

  describe('formatPronunciationResult', () => {
    test('formats pronunciation guide correctly', () => {
      const cases = [
        {
          syllables: ['zhang'],
          expected: '"zhang" is said rhymes with "song" but starts with "j"'
        },
        {
          syllables: ['li', 'ming'],
          expected: '"li" is said rhymes with tree, "ming" is said rhymes with ring'
        },
        {
          syllables: ['zhao', 'zao'],
          expected: '"zhao" is said rhymes with "wow" but starts with "j", "zao" is said rhymes with "now" but starts with "z"'
        }
      ];

      cases.forEach(({ syllables, expected }) => {
        const result = formatPronunciationResult(syllables);
        expect(result).toBe(expected);
      });
    });

    test('handles syllables without pronunciation', () => {
      const result = formatPronunciationResult(['xyz']);
      expect(result).toBe('"xyz" (pronunciation not found)');
    });
  });
}); 