// Test data constants
export const TEST_SYLLABLES = {
  SINGLE: 'zhang',
  DOUBLE_FIRST: 'li',
  DOUBLE_SECOND: 'ming',
  SIMILAR_FIRST: 'zhao',
  SIMILAR_SECOND: 'zao'
};

export const TEST_NAMES = {
  SINGLE: TEST_SYLLABLES.SINGLE,
  DOUBLE: `${TEST_SYLLABLES.DOUBLE_FIRST}${TEST_SYLLABLES.DOUBLE_SECOND}`,
  SIMILAR: `${TEST_SYLLABLES.SIMILAR_FIRST}${TEST_SYLLABLES.SIMILAR_SECOND}`
};

// Helper function to create pronunciation string
export const createPronunciationString = (syllables, phonemeMap) => {
  return syllables
    .map(syllable => `"${syllable}" ${phonemeMap[syllable].description}`)
    .join('\n');
};
