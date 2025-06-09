import { convertToPinyin, getPronunciation, formatPronunciationError, checkIfChineseCharacters } from '../utils/pinyinUtils';

describe('Chinese Character Support', () => {
  describe('checkIfChineseCharacters', () => {
    test('correctly identifies Chinese characters', () => {
      expect(checkIfChineseCharacters('张伟')).toBe(true);
      expect(checkIfChineseCharacters('李明')).toBe(true);
      expect(checkIfChineseCharacters('王小明')).toBe(true);
    });

    test('correctly identifies non-Chinese text', () => {
      expect(checkIfChineseCharacters('zhang')).toBe(false);
      expect(checkIfChineseCharacters('li ming')).toBe(false);
      expect(checkIfChineseCharacters('123')).toBe(false);
      expect(checkIfChineseCharacters('')).toBe(false);
    });

    test('correctly identifies mixed text', () => {
      expect(checkIfChineseCharacters('张wei')).toBe(true);
      expect(checkIfChineseCharacters('li明')).toBe(true);
      expect(checkIfChineseCharacters('123明')).toBe(true);
    });
  });

  describe('convertToPinyin', () => {
    test('converts Chinese characters to pinyin', () => {
      expect(convertToPinyin('张伟')).toBe('zhang wei');
      expect(convertToPinyin('李明')).toBe('li ming');
      expect(convertToPinyin('王小明')).toBe('wang xiao ming');
    });

    test('leaves pinyin unchanged', () => {
      expect(convertToPinyin('zhang')).toBe('zhang');
      expect(convertToPinyin('li ming')).toBe('li ming');
    });

    test('handles mixed input', () => {
      expect(convertToPinyin('张wei')).toBe('zhang wei');
      expect(convertToPinyin('li明')).toBe('li ming');
    });

    test('handles empty and non-Chinese input', () => {
      expect(convertToPinyin('')).toBe('');
      expect(convertToPinyin('hello')).toBe('hello');
      expect(convertToPinyin('123')).toBe('123');
    });
  });

  describe('getPronunciation with Chinese input', () => {
    test('handles Chinese character input', () => {
      const result = getPronunciation('张伟');
      expect(result.syllables).toEqual(['zhang', 'wei']);
      expect(result.notFoundSyllables).toEqual([]);
    });

    test('handles mixed Chinese and pinyin input', () => {
      const result = getPronunciation('张wei');
      expect(result.syllables).toEqual(['zhang', 'wei']);
      expect(result.notFoundSyllables).toEqual([]);
    });

    test('handles invalid Chinese characters', () => {
      const result = getPronunciation('张xyz');
      expect(result.syllables).toEqual(['zhang', 'x', 'y', 'z']);
      expect(result.notFoundSyllables).toEqual(['x', 'y', 'z']);
    });

    test('handles empty input', () => {
      const result = getPronunciation('');
      expect(result.syllables).toEqual([]);
      expect(result.notFoundSyllables).toEqual([]);
    });

    test('handles whitespace in Chinese input', () => {
      const result = getPronunciation('张 伟');
      expect(result.syllables).toEqual(['zhang', 'wei']);
      expect(result.notFoundSyllables).toEqual([]);
    });

    test('handles multiple Chinese characters', () => {
      const result = getPronunciation('王小明');
      expect(result.syllables).toEqual(['wang', 'xiao', 'ming']);
      expect(result.notFoundSyllables).toEqual([]);
    });
  });

  describe('formatPronunciationError with Chinese input', () => {
    test('includes pinyin conversion in error message for Chinese input', () => {
      const error = formatPronunciationError(['zhang', 'x'], ['x'], '张x');
      expect(error).toContain('张x');
      expect(error).toContain('zhang x');
    });

    test('uses standard error message for non-Chinese input', () => {
      const error = formatPronunciationError(['x'], ['x'], 'x');
      expect(error).toBe('Could not parse "x" into valid pinyin.');
    });

    test('handles mixed Chinese and invalid input', () => {
      const error = formatPronunciationError(
        ['wang', 'x', 'y'], 
        ['x', 'y'], 
        '王xy'
      );
      expect(error).toBe('Could not parse "王xy" (converted to pinyin: "wang xy") into valid syllables.');
    });
  });
}); 