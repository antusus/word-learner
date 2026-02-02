import { loadUnits } from './loader';

describe('loadUnits', () => {
  it('returns an array of units', () => {
    const units = loadUnits();
    expect(Array.isArray(units)).toBe(true);
    expect(units.length).toBeGreaterThan(0);
  });

  it('each unit has required properties', () => {
    const units = loadUnits();
    for (const unit of units) {
      expect(unit).toHaveProperty('id');
      expect(unit).toHaveProperty('title');
      expect(unit).toHaveProperty('words');
      expect(Array.isArray(unit.words)).toBe(true);
    }
  });

  it('each word has en and pl properties', () => {
    const units = loadUnits();
    for (const unit of units) {
      for (const word of unit.words) {
        expect(word).toHaveProperty('en');
        expect(word).toHaveProperty('pl');
        expect(typeof word.en).toBe('string');
        expect(typeof word.pl).toBe('string');
      }
    }
  });

  it('returns units sorted by id', () => {
    const units = loadUnits();
    const ids = units.map((u) => u.id);
    const sortedIds = [...ids].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );
    expect(ids).toEqual(sortedIds);
  });
});
