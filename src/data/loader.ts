import type {
  StandaloneUnit,
  Unit,
  UnitBundle,
  UnitEntry,
  UnitType,
  WordGroup,
  WordsFile,
} from '../types';
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

export function parseUnitEntries(
  modules: Record<string, WordsFile>,
): UnitEntry[] {
  const units = parseUnits(modules);

  const bundleMap = new Map<string, string>();
  for (const [path, data] of Object.entries(modules)) {
    const match = path.match(/\.\/([^/]+)\/words\.json$/);
    if (match && data.bundle) {
      bundleMap.set(match[1], data.bundle);
    }
  }

  const bundleGroups = new Map<string, Unit[]>();
  const standalones: StandaloneUnit[] = [];

  for (const unit of units) {
    const bundleName = bundleMap.get(unit.id);
    if (bundleName) {
      if (!bundleGroups.has(bundleName)) {
        bundleGroups.set(bundleName, []);
      }
      bundleGroups.get(bundleName)?.push(unit);
    } else {
      standalones.push({ kind: 'standalone', unit });
    }
  }

  const entries: UnitEntry[] = [...standalones];

  for (const [title, subUnits] of bundleGroups) {
    const bundle: UnitBundle = {
      kind: 'bundle',
      id: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      subUnits,
      totalChallenges: subUnits.reduce(
        (sum, u) => sum + u.challenges.length,
        0,
      ),
    };
    entries.push(bundle);
  }

  return entries.sort((a, b) => {
    const titleA = a.kind === 'bundle' ? a.title : a.unit.title;
    const titleB = b.kind === 'bundle' ? b.title : b.unit.title;
    return titleA.localeCompare(titleB, undefined, { numeric: true });
  });
}

export function loadUnitEntries(): UnitEntry[] {
  return parseUnitEntries(wordModules);
}
