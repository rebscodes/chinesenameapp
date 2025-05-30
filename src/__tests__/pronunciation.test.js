import pinyinSeparate from 'pinyin-separate';
import { phonemeMap } from '../data/phonemeMap';

describe('Pinyin Segmentation', () => {
  const getPronunciation = (name) => {
    const cleanName = name.toLowerCase().trim();
    const syllables = pinyinSeparate(cleanName);
    const notFoundSyllables = syllables.filter(syllable => !phonemeMap[syllable]);
    return { syllables, notFoundSyllables };
  };

  test('handles basic two-syllable names', () => {
    const result = getPronunciation('zhengxun');
    expect(result.syllables).toEqual(['zheng', 'xun']);
    expect(result.notFoundSyllables).toEqual([]);
  });

  test('handles names with spaces', () => {
    const result = getPronunciation('li ming');
    expect(result.syllables).toEqual(['li', 'ming']);
    expect(result.notFoundSyllables).toEqual([]);
  });

  test('handles uppercase input', () => {
    const result = getPronunciation('WEIMING');
    expect(result.syllables).toEqual(['wei', 'ming']);
    expect(result.notFoundSyllables).toEqual([]);
  });

  test('identifies unknown syllables', () => {
    const result = getPronunciation('zzzz');
    expect(result.notFoundSyllables.length).toBeGreaterThan(0);
  });

  test('handles empty input', () => {
    const result = getPronunciation('');
    expect(result.syllables).toEqual([]);
    expect(result.notFoundSyllables).toEqual([]);
  });

  test('handles whitespace input', () => {
    const result = getPronunciation('   ');
    expect(result.syllables).toEqual([]);
    expect(result.notFoundSyllables).toEqual([]);
  });

  test('handles three-syllable names', () => {
    const result = getPronunciation('zhangyiming');
    expect(result.syllables).toEqual(['zhang', 'yi', 'ming']);
    expect(result.notFoundSyllables).toEqual([]);
  });

  test('handles mixed valid and invalid syllables', () => {
    const result = getPronunciation('zhengxxx');
    expect(result.syllables).toContain('zheng');
    expect(result.notFoundSyllables.length).toBeGreaterThan(0);
  });
}); 