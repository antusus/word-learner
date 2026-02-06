import type { WordsFile } from '../types';
import { parseUnits } from './loader';

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
};

describe('parseUnits', () => {
  it('returns one unit per module entry', () => {
    const units = parseUnits(fixtureModules);
    expect(units).toHaveLength(2);
  });

  it('extracts the unit id from the path', () => {
    const units = parseUnits(fixtureModules);
    expect(units[0].id).toBe('UnitA');
    expect(units[1].id).toBe('UnitB');
  });

  it('preserves the title from the data file', () => {
    const units = parseUnits(fixtureModules);
    expect(units[0].title).toBe('Unit A - Single Group');
    expect(units[1].title).toBe('Unit B - Multiple Groups');
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
});
