import { getPronunciation, formatPronunciationError, formatPronunciationResult } from '../utils/pinyinUtils';
import { phonemeMap } from '../data/phonemeMap';
import { TEST_SYLLABLES, TEST_NAMES, createPronunciationString } from '../utils/testUtils';

describe('Pinyin Utilities', () => {
  describe('getPronunciation', () => {
    test('handles single syllable names', () => {
      const cases = [TEST_SYLLABLES.DOUBLE_FIRST, TEST_SYLLABLES.SIMILAR_FIRST, TEST_SYLLABLES.SINGLE];
      cases.forEach(name => {
        const result = getPronunciation(name);
        expect(result.syllables).toEqual([name]);
        expect(result.notFoundSyllables).toEqual([]);
      });
    });

    test('handles multi-syllable names', () => {
      const cases = [
        { input: TEST_NAMES.DOUBLE, expected: [TEST_SYLLABLES.DOUBLE_FIRST, TEST_SYLLABLES.DOUBLE_SECOND] },
        { input: TEST_NAMES.SIMILAR, expected: [TEST_SYLLABLES.SIMILAR_FIRST, TEST_SYLLABLES.SIMILAR_SECOND] }
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
    test('formats error message for different types of invalid input', () => {
      const cases = [
        {
          syllables: ['x', 'y', 'z'],
          notFound: ['x', 'y', 'z'],
          input: 'xyz',
          expected: 'Could not parse "xyz" into valid pinyin.'
        },
        {
          syllables: ['zhang', 'x'],
          notFound: ['x'],
          input: 'zhangx',
          expected: 'Could not parse "zhangx" into valid pinyin.'
        }
      ];

      cases.forEach(({ syllables, notFound, input, expected }) => {
        const result = formatPronunciationError(syllables, notFound, input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('formatPronunciationResult', () => {
    test('formats pronunciation guide correctly', () => {
      const cases = [
        {
          syllables: [TEST_SYLLABLES.SINGLE],
          expected: createPronunciationString([TEST_SYLLABLES.SINGLE], phonemeMap)
        },
        {
          syllables: [TEST_SYLLABLES.DOUBLE_FIRST, TEST_SYLLABLES.DOUBLE_SECOND],
          expected: createPronunciationString([TEST_SYLLABLES.DOUBLE_FIRST, TEST_SYLLABLES.DOUBLE_SECOND], phonemeMap)
        },
        {
          syllables: [TEST_SYLLABLES.SIMILAR_FIRST, TEST_SYLLABLES.SIMILAR_SECOND],
          expected: createPronunciationString([TEST_SYLLABLES.SIMILAR_FIRST, TEST_SYLLABLES.SIMILAR_SECOND], phonemeMap)
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