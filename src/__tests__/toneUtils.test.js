import { getToneDescription } from '../components/ResultsSection';

describe('Tone Description Utils', () => {
  describe('getToneDescription', () => {
    test('returns correct description for 1st tone', () => {
      expect(getToneDescription('zhāng')).toBe('The tone is high and steady, like singing a single note');
      expect(getToneDescription('mā')).toBe('The tone is high and steady, like singing a single note');
      expect(getToneDescription('lǖ')).toBe('The tone is high and steady, like singing a single note');
    });

    test('returns correct description for 2nd tone', () => {
      expect(getToneDescription('zháng')).toBe('The tone rises as if asking a question, like "huh?"');
      expect(getToneDescription('má')).toBe('The tone rises as if asking a question, like "huh?"');
      expect(getToneDescription('lǘ')).toBe('The tone rises as if asking a question, like "huh?"');
    });

    test('returns correct description for 3rd tone', () => {
      expect(getToneDescription('zhǎng')).toBe('The tone dips down and back up, like saying "hmmm...?"');
      expect(getToneDescription('mǎ')).toBe('The tone dips down and back up, like saying "hmmm...?"');
      expect(getToneDescription('lǚ')).toBe('The tone dips down and back up, like saying "hmmm...?"');
    });

    test('returns correct description for 4th tone', () => {
      expect(getToneDescription('zhàng')).toBe('The tone falls sharply, like firmly answering "no."');
      expect(getToneDescription('mà')).toBe('The tone falls sharply, like firmly answering "no."');
      expect(getToneDescription('lǜ')).toBe('The tone falls sharply, like firmly answering "no."');
    });

    test('returns empty string for pinyin without tone marks', () => {
      expect(getToneDescription('zhang')).toBe('');
      expect(getToneDescription('ma')).toBe('');
      expect(getToneDescription('')).toBe('');
    });

    test('handles edge cases', () => {
      expect(getToneDescription(null)).toBe('');
      expect(getToneDescription(undefined)).toBe('');
      expect(getToneDescription(' ')).toBe('');
    });
  });
}); 