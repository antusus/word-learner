import type { Unit, WordsFile } from '../types';

const wordModules = import.meta.glob<WordsFile>('./*/words.json', {
  eager: true,
  import: 'default',
});

export function loadUnits(): Unit[] {
  const units: Unit[] = [];

  for (const [path, data] of Object.entries(wordModules)) {
    const match = path.match(/\.\/([^/]+)\/words\.json$/);
    if (match) {
      const id = match[1];
      units.push({
        id,
        title: data.title,
        words: data.words,
      });
    }
  }

  return units.sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );
}
