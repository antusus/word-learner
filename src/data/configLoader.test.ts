import type { DifficultyConfig } from '../types';
import {
  loadDifficultyLevels,
  loadDifficultyLevelsForType,
  validateDifficultyConfig,
} from './configLoader';

describe('validateDifficultyConfig', () => {
  const validConfig: DifficultyConfig = {
    difficulties: [
      { id: 'easy', name: 'Easy', description: '20%', blankPercentage: 0.2 },
      { id: 'hard', name: 'Hard', description: '75%', blankPercentage: 0.75 },
    ],
  };

  it('returns difficulties for a valid config', () => {
    const result = validateDifficultyConfig(validConfig);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('easy');
  });

  it('throws on empty difficulties array', () => {
    expect(() => validateDifficultyConfig({ difficulties: [] })).toThrow(
      'at least one difficulty',
    );
  });

  it('throws when blankPercentage is 0', () => {
    expect(() =>
      validateDifficultyConfig({
        difficulties: [
          { id: 'zero', name: 'Z', description: '', blankPercentage: 0 },
        ],
      }),
    ).toThrow('must be > 0 and <= 1');
  });

  it('accepts blankPercentage of exactly 1', () => {
    const result = validateDifficultyConfig({
      difficulties: [
        { id: 'full', name: 'F', description: '', blankPercentage: 1 },
      ],
    });
    expect(result).toHaveLength(1);
    expect(result[0].blankPercentage).toBe(1);
  });

  it('throws when blankPercentage exceeds 1', () => {
    expect(() =>
      validateDifficultyConfig({
        difficulties: [
          { id: 'over', name: 'O', description: '', blankPercentage: 1.5 },
        ],
      }),
    ).toThrow('must be > 0 and <= 1');
  });

  it('throws when blankPercentage is negative', () => {
    expect(() =>
      validateDifficultyConfig({
        difficulties: [
          { id: 'neg', name: 'N', description: '', blankPercentage: -0.5 },
        ],
      }),
    ).toThrow('must be > 0 and <= 1');
  });

  it('throws on duplicate ids', () => {
    expect(() =>
      validateDifficultyConfig({
        difficulties: [
          { id: 'same', name: 'A', description: '', blankPercentage: 0.2 },
          { id: 'same', name: 'B', description: '', blankPercentage: 0.5 },
        ],
      }),
    ).toThrow('Duplicate difficulty id: "same"');
  });
});

describe('loadDifficultyLevels', () => {
  it('loads and returns the built-in config', () => {
    const levels = loadDifficultyLevels();
    expect(levels.length).toBeGreaterThanOrEqual(1);
    for (const level of levels) {
      expect(level.blankPercentage).toBeGreaterThan(0);
      expect(level.blankPercentage).toBeLessThanOrEqual(1);
    }
  });
});

describe('loadDifficultyLevelsForType', () => {
  it('loads vocabulary config for vocabulary type', () => {
    const levels = loadDifficultyLevelsForType('vocabulary');
    expect(levels.length).toBeGreaterThanOrEqual(1);
    for (const level of levels) {
      expect(level.blankPercentage).toBeGreaterThan(0);
      expect(level.blankPercentage).toBeLessThanOrEqual(1);
    }
  });

  it('loads irregular-verbs config for irregular-verbs type', () => {
    const levels = loadDifficultyLevelsForType('irregular-verbs');
    expect(levels.length).toBeGreaterThanOrEqual(1);
    for (const level of levels) {
      expect(level.blankPercentage).toBeGreaterThan(0);
      expect(level.blankPercentage).toBeLessThanOrEqual(1);
    }
  });
});
