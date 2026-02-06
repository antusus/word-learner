import type { Unit, WordsFile } from '../types';

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
      const words = data.groups.flatMap((group) => group.words);
      units.push({
        id,
        title: data.title,
        words,
        groups: data.groups,
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
