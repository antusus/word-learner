import type { DifficultyConfig, DifficultyLevel } from '../types';
import config from './fill-in-blanks-config.json';

export function validateDifficultyConfig(
  data: DifficultyConfig,
): DifficultyLevel[] {
  const { difficulties } = data;

  if (!Array.isArray(difficulties) || difficulties.length === 0) {
    throw new Error('Config must have at least one difficulty');
  }

  const ids = new Set<string>();

  for (const d of difficulties) {
    if (ids.has(d.id)) {
      throw new Error(`Duplicate difficulty id: "${d.id}"`);
    }
    ids.add(d.id);

    if (d.blankPercentage <= 0 || d.blankPercentage >= 1) {
      throw new Error(
        `blankPercentage for "${d.id}" must be > 0 and < 1, got ${d.blankPercentage}`,
      );
    }
  }

  return difficulties;
}

export function loadDifficultyLevels(): DifficultyLevel[] {
  return validateDifficultyConfig(config);
}
