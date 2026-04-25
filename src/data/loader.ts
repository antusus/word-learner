import type { Unit, UnitType, WordGroup, WordsFile } from '../types';
import { mapGroupsToChallenges } from './challengeMapper';

const wordModules = import.meta.glob<WordsFile>('./*/words.json', {
  eager: true,
  import: 'default',
});

export function parseUnits(modules: Record<string, WordsFile>): Unit[] {
  const units: Unit[] = [];

  for (const [path, data] of Object.entries(modules)) {
    const match = path.match(/\.\/([^/]+)\/words\.json$/);
    if (match) {
      const id = match[1];
      const type: UnitType = data.type ?? 'vocabulary';
      const { challenges, challengeGroups } = mapGroupsToChallenges(
        type,
        data.groups,
      );

      const words =
        type === 'vocabulary'
          ? (data.groups as WordGroup[]).flatMap((g) => g.words)
          : [];
      const groups = type === 'vocabulary' ? (data.groups as WordGroup[]) : [];

      units.push({
        id,
        title: data.title,
        type,
        words,
        groups,
        challenges,
        challengeGroups,
      });
    }
  }

  return units.sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );
}

export function loadUnits(): Unit[] {
  return parseUnits(wordModules);
}
