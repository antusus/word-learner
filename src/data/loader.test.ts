import type { WordsFile } from '../types';
import { parseUnitEntries, parseUnits } from './loader';

const fixtureModules: Record<string, WordsFile> = {
  './UnitA/words.json': {
    title: 'Unit A - Single Group',
    groups: [
      {
        name: 'Fruits',
        words: [
          { en: 'apple', pl: 'jabłko' },
          { en: 'banana', pl: 'banan' },
        ],
      },
    ],
  },
  './UnitB/words.json': {
    title: 'Unit B - Multiple Groups',
    groups: [
      {
        name: 'Colors',
        words: [
          { en: 'red', pl: 'czerwony' },
          { en: 'blue', pl: 'niebieski' },
          { en: 'green', pl: 'zielony' },
        ],
      },
      {
        name: 'Shapes',
        words: [
          { en: 'circle', pl: 'koło' },
          { en: 'square', pl: 'kwadrat' },
        ],
      },
    ],
  },
  './UnitC/words.json': {
    title: 'Unit C - Vocabulary Explicit',
    type: 'vocabulary',
    groups: [
      {
        name: 'Food',
        words: [{ en: 'bread', pl: 'chleb' }],
      },
    ],
  },
};

const irregularVerbModules: Record<string, WordsFile> = {
  './UnitIV/words.json': {
    title: 'Unit IV - Irregular Verbs',
    type: 'irregular-verbs',
    groups: [
      {
        name: 'Group A',
        words: [
          { base: 'go', pastSimple: 'went' },
          { base: 'see', pastSimple: 'saw' },
        ],
      },
      {
        name: 'Group B',
        words: [{ base: 'run', pastSimple: 'ran' }],
      },
    ],
  },
};

describe('parseUnits', () => {
  it('returns one unit per module entry', () => {
    const units = parseUnits(fixtureModules);
    expect(units).toHaveLength(3);
  });

  it('extracts the unit id from the path', () => {
    const units = parseUnits(fixtureModules);
    expect(units[0].id).toBe('UnitA');
    expect(units[1].id).toBe('UnitB');
    expect(units[2].id).toBe('UnitC');
  });

  it('preserves the title from the data file', () => {
    const units = parseUnits(fixtureModules);
    expect(units[0].title).toBe('Unit A - Single Group');
    expect(units[1].title).toBe('Unit B - Multiple Groups');
    expect(units[2].title).toBe('Unit C - Vocabulary Explicit');
  });

  it('defaults type to vocabulary when not specified', () => {
    const units = parseUnits(fixtureModules);
    expect(units[0].type).toBe('vocabulary');
    expect(units[1].type).toBe('vocabulary');
  });

  it('preserves explicit vocabulary type', () => {
    const units = parseUnits(fixtureModules);
    expect(units[2].type).toBe('vocabulary');
  });

  it('flattens group words into unit.words', () => {
    const units = parseUnits(fixtureModules);

    expect(units[0].words).toEqual([
      { en: 'apple', pl: 'jabłko' },
      { en: 'banana', pl: 'banan' },
    ]);

    expect(units[1].words).toHaveLength(5);
    expect(units[1].words).toEqual([
      { en: 'red', pl: 'czerwony' },
      { en: 'blue', pl: 'niebieski' },
      { en: 'green', pl: 'zielony' },
      { en: 'circle', pl: 'koło' },
      { en: 'square', pl: 'kwadrat' },
    ]);
  });

  it('passes through groups unchanged', () => {
    const units = parseUnits(fixtureModules);

    expect(units[0].groups).toHaveLength(1);
    expect(units[0].groups[0].name).toBe('Fruits');
    expect(units[0].groups[0].words).toHaveLength(2);

    expect(units[1].groups).toHaveLength(2);
    expect(units[1].groups[0].name).toBe('Colors');
    expect(units[1].groups[0].words).toHaveLength(3);
    expect(units[1].groups[1].name).toBe('Shapes');
    expect(units[1].groups[1].words).toHaveLength(2);
  });

  it('produces challenges from vocabulary words (pl -> en)', () => {
    const units = parseUnits(fixtureModules);

    expect(units[0].challenges).toEqual([
      { prompt: 'jabłko', answer: 'apple' },
      { prompt: 'banan', answer: 'banana' },
    ]);
  });

  it('produces challengeGroups from vocabulary groups', () => {
    const units = parseUnits(fixtureModules);

    expect(units[1].challengeGroups).toHaveLength(2);
    expect(units[1].challengeGroups[0]).toEqual({
      name: 'Colors',
      items: [
        { prompt: 'czerwony', answer: 'red' },
        { prompt: 'niebieski', answer: 'blue' },
        { prompt: 'zielony', answer: 'green' },
      ],
    });
    expect(units[1].challengeGroups[1]).toEqual({
      name: 'Shapes',
      items: [
        { prompt: 'koło', answer: 'circle' },
        { prompt: 'kwadrat', answer: 'square' },
      ],
    });
  });

  it('sorts units by id with numeric ordering', () => {
    const modules: Record<string, WordsFile> = {
      './Unit10/words.json': {
        title: 'Unit 10',
        groups: [{ name: 'G', words: [{ en: 'a', pl: 'b' }] }],
      },
      './Unit2/words.json': {
        title: 'Unit 2',
        groups: [{ name: 'G', words: [{ en: 'c', pl: 'd' }] }],
      },
      './Unit1/words.json': {
        title: 'Unit 1',
        groups: [{ name: 'G', words: [{ en: 'e', pl: 'f' }] }],
      },
    };

    const units = parseUnits(modules);
    expect(units.map((u) => u.id)).toEqual(['Unit1', 'Unit2', 'Unit10']);
  });

  it('returns an empty array when no modules are provided', () => {
    const units = parseUnits({});
    expect(units).toEqual([]);
  });

  it('skips entries with paths that do not match the expected pattern', () => {
    const modules: Record<string, WordsFile> = {
      './Unit1/words.json': {
        title: 'Valid',
        groups: [{ name: 'G', words: [{ en: 'a', pl: 'b' }] }],
      },
      './not-a-match.json': {
        title: 'Invalid',
        groups: [{ name: 'G', words: [{ en: 'c', pl: 'd' }] }],
      },
    };

    const units = parseUnits(modules);
    expect(units).toHaveLength(1);
    expect(units[0].id).toBe('Unit1');
  });

  describe('irregular-verbs type', () => {
    it('sets type to irregular-verbs', () => {
      const units = parseUnits(irregularVerbModules);
      expect(units[0].type).toBe('irregular-verbs');
    });

    it('leaves words and groups empty for irregular-verbs', () => {
      const units = parseUnits(irregularVerbModules);
      expect(units[0].words).toEqual([]);
      expect(units[0].groups).toEqual([]);
    });

    it('produces challenges from irregular verbs (base -> pastSimple)', () => {
      const units = parseUnits(irregularVerbModules);

      expect(units[0].challenges).toEqual([
        { prompt: 'go', answer: 'went' },
        { prompt: 'see', answer: 'saw' },
        { prompt: 'run', answer: 'ran' },
      ]);
    });

    it('produces challengeGroups from irregular verb groups', () => {
      const units = parseUnits(irregularVerbModules);

      expect(units[0].challengeGroups).toHaveLength(2);
      expect(units[0].challengeGroups[0]).toEqual({
        name: 'Group A',
        items: [
          { prompt: 'go', answer: 'went' },
          { prompt: 'see', answer: 'saw' },
        ],
      });
      expect(units[0].challengeGroups[1]).toEqual({
        name: 'Group B',
        items: [{ prompt: 'run', answer: 'ran' }],
      });
    });
  });
});

describe('parseUnitEntries', () => {
  it('wraps all units as StandaloneUnit when no bundles exist', () => {
    const modules: Record<string, WordsFile> = {
      './UnitA/words.json': {
        title: 'Unit A',
        groups: [{ name: 'G', words: [{ en: 'a', pl: 'b' }] }],
      },
      './UnitB/words.json': {
        title: 'Unit B',
        groups: [{ name: 'G', words: [{ en: 'c', pl: 'd' }] }],
      },
    };

    const entries = parseUnitEntries(modules);
    expect(entries).toHaveLength(2);
    expect(entries.every((e) => e.kind === 'standalone')).toBe(true);
  });

  it('groups two modules with the same bundle into one UnitBundle', () => {
    const modules: Record<string, WordsFile> = {
      './Unit7/words.json': {
        title: 'Unit 7 - Vocabulary',
        bundle: 'Unit 7',
        groups: [{ name: 'G1', words: [{ en: 'a', pl: 'b' }] }],
      },
      './IrregularVerbs/words.json': {
        title: 'Unit 7 - Irregular Verbs',
        bundle: 'Unit 7',
        type: 'irregular-verbs',
        groups: [{ name: 'G2', words: [{ base: 'go', pastSimple: 'went' }] }],
      },
    };

    const entries = parseUnitEntries(modules);
    expect(entries).toHaveLength(1);
    expect(entries[0].kind).toBe('bundle');

    const bundle = entries[0] as {
      kind: 'bundle';
      title: string;
      subUnits: unknown[];
    };
    expect(bundle.title).toBe('Unit 7');
    expect(bundle.subUnits).toHaveLength(2);
  });

  it('returns mixed entries: bundled and standalone', () => {
    const modules: Record<string, WordsFile> = {
      './Unit5/words.json': {
        title: 'Unit 5 - Standalone',
        groups: [{ name: 'G', words: [{ en: 'x', pl: 'y' }] }],
      },
      './Unit7/words.json': {
        title: 'Unit 7 - Vocabulary',
        bundle: 'Unit 7',
        groups: [{ name: 'G1', words: [{ en: 'a', pl: 'b' }] }],
      },
      './IrregularVerbs/words.json': {
        title: 'Unit 7 - Irregular Verbs',
        bundle: 'Unit 7',
        type: 'irregular-verbs',
        groups: [{ name: 'G2', words: [{ base: 'go', pastSimple: 'went' }] }],
      },
    };

    const entries = parseUnitEntries(modules);
    expect(entries).toHaveLength(2);

    const standalone = entries.find((e) => e.kind === 'standalone');
    const bundle = entries.find((e) => e.kind === 'bundle');
    expect(standalone).toBeDefined();
    expect(bundle).toBeDefined();
  });

  it('sorts entries by title with numeric locale ordering', () => {
    const modules: Record<string, WordsFile> = {
      './Unit10/words.json': {
        title: 'Unit 10',
        groups: [{ name: 'G', words: [{ en: 'a', pl: 'b' }] }],
      },
      './Unit7Vocab/words.json': {
        title: 'Unit 7 - Vocabulary',
        bundle: 'Unit 7',
        groups: [{ name: 'G', words: [{ en: 'c', pl: 'd' }] }],
      },
      './Unit7Verbs/words.json': {
        title: 'Unit 7 - Verbs',
        bundle: 'Unit 7',
        type: 'irregular-verbs',
        groups: [{ name: 'G', words: [{ base: 'go', pastSimple: 'went' }] }],
      },
      './Unit2/words.json': {
        title: 'Unit 2',
        groups: [{ name: 'G', words: [{ en: 'e', pl: 'f' }] }],
      },
    };

    const entries = parseUnitEntries(modules);
    const titles = entries.map((e) =>
      e.kind === 'bundle' ? e.title : e.unit.title,
    );
    expect(titles).toEqual(['Unit 2', 'Unit 7', 'Unit 10']);
  });

  it('computes totalChallenges as sum of sub-unit challenges', () => {
    const modules: Record<string, WordsFile> = {
      './Unit7/words.json': {
        title: 'Unit 7 - Vocabulary',
        bundle: 'Unit 7',
        groups: [
          {
            name: 'G1',
            words: [
              { en: 'a', pl: 'b' },
              { en: 'c', pl: 'd' },
            ],
          },
        ],
      },
      './IrregularVerbs/words.json': {
        title: 'Unit 7 - Irregular Verbs',
        bundle: 'Unit 7',
        type: 'irregular-verbs',
        groups: [
          {
            name: 'G2',
            words: [
              { base: 'go', pastSimple: 'went' },
              { base: 'see', pastSimple: 'saw' },
              { base: 'run', pastSimple: 'ran' },
            ],
          },
        ],
      },
    };

    const entries = parseUnitEntries(modules);
    expect(entries).toHaveLength(1);
    expect(entries[0].kind).toBe('bundle');

    const bundle = entries[0] as { kind: 'bundle'; totalChallenges: number };
    expect(bundle.totalChallenges).toBe(5);
  });
});
