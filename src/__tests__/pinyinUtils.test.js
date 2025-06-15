import { getPronunciation, formatPronunciationError, formatPronunciationResult, separatePinyinSyllables } from '../utils/pinyinUtils';
import { phonemeMap } from '../data/phonemeMap';
import { TEST_SYLLABLES, TEST_NAMES, createPronunciationString } from '../utils/testUtils';

describe('Pinyin Utilities', () => {
  describe('separatePinyinSyllables', () => {
    test('handles single syllables', () => {
      expect(separatePinyinSyllables('li')).toEqual(['li']);
      expect(separatePinyinSyllables('wei')).toEqual(['wei']);
      expect(separatePinyinSyllables('zhao')).toEqual(['zhao']);
    });

    test('handles compound syllables', () => {
      expect(separatePinyinSyllables('zheng')).toEqual(['zheng']);
      expect(separatePinyinSyllables('zhang')).toEqual(['zhang']);
      expect(separatePinyinSyllables('xiao')).toEqual(['xiao']);
    });

    test('handles multi-syllable words', () => {
      expect(separatePinyinSyllables('zhangwei')).toEqual(['zhang', 'wei']);
      expect(separatePinyinSyllables('liming')).toEqual(['li', 'ming']);
      expect(separatePinyinSyllables('xiaoming')).toEqual(['xiao', 'ming']);
    });

    test('handles case variations', () => {
      expect(separatePinyinSyllables('ZHENG')).toEqual(['zheng']);
      expect(separatePinyinSyllables('ZhangWei')).toEqual(['zhang', 'wei']);
      expect(separatePinyinSyllables('LiMing')).toEqual(['li', 'ming']);
    });

    test('handles whitespace', () => {
      expect(separatePinyinSyllables('zhang wei')).toEqual(['zhang', 'wei']);
      expect(separatePinyinSyllables('  li  ming  ')).toEqual(['li', 'ming']);
      expect(separatePinyinSyllables('zhao ming')).toEqual(['zhao', 'ming']);
    });

    test('handles invalid input', () => {
      expect(separatePinyinSyllables('xyz')).toEqual(['x', 'y', 'z']);
      expect(separatePinyinSyllables('zhengxyz')).toEqual(['zheng', 'x', 'y', 'z']);
      expect(separatePinyinSyllables('')).toEqual([]);
      expect(separatePinyinSyllables('   ')).toEqual([]);
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

    test('handles mixed valid and invalid syllables', () => {
      const result = formatPronunciationResult(['zhang', 'xyz']);
      expect(result).toContain(phonemeMap['zhang'].description);
      expect(result).toContain('"xyz" (pronunciation not found)');
    });

    test('displays tone-marked pinyin for Chinese character input', () => {
      const result = formatPronunciationResult(['zhang', 'wei'], '张伟');
      expect(result).toContain('"zhāng"');
      expect(result).toContain('"wěi"');
      expect(result).toContain(phonemeMap['zhang'].description);
      expect(result).toContain(phonemeMap['wei'].description);
    });

    test('keeps original pinyin for non-Chinese input', () => {
      const result = formatPronunciationResult(['zhang', 'wei'], 'zhang wei');
      expect(result).toContain('"zhang"');
      expect(result).toContain('"wei"');
      expect(result).toContain(phonemeMap['zhang'].description);
      expect(result).toContain(phonemeMap['wei'].description);
    });

    test('handles empty input', () => {
      expect(formatPronunciationResult([], '')).toBe('');
      expect(formatPronunciationResult([], '张伟')).toBe('');
    });
  });
}); 