import { shuffleArray } from './shuffle';

describe('shuffleArray', () => {
  it('returns an array of the same length', () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffleArray(input)).toHaveLength(input.length);
  });

  it('contains all original elements', () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffleArray(input).sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffleArray(input);
    expect(input).toEqual(copy);
  });

  it('returns an empty array when given an empty array', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('returns a single-element array unchanged', () => {
    expect(shuffleArray([42])).toEqual([42]);
  });
});
