import { generateBlanks } from './blanking';

describe('generateBlanks', () => {
  it('returns one slot per character', () => {
    const slots = generateBlanks('hello', 0.4);
    expect(slots).toHaveLength(5);
  });

  it('blanks the correct number of letters', () => {
    const slots = generateBlanks('hello', 0.4);
    const blanks = slots.filter((s) => s.isBlank);
    // 5 letters * 0.4 = 2
    expect(blanks).toHaveLength(2);
  });

  it('blanks more letters at higher percentage', () => {
    const slotsEasy = generateBlanks('computer', 0.2);
    const slotsHard = generateBlanks('computer', 0.75);
    const easyBlanks = slotsEasy.filter((s) => s.isBlank).length;
    const hardBlanks = slotsHard.filter((s) => s.isBlank).length;
    expect(hardBlanks).toBeGreaterThan(easyBlanks);
  });

  it('never blanks non-letter characters', () => {
    const slots = generateBlanks("it's a test!", 0.75);
    for (const slot of slots) {
      if (!/[a-zA-Z]/.test(slot.char)) {
        expect(slot.isBlank).toBe(false);
      }
    }
  });

  it('always has at least 1 blank for words with 2+ letters', () => {
    const slots = generateBlanks('ab', 0.01);
    const blanks = slots.filter((s) => s.isBlank).length;
    expect(blanks).toBeGreaterThanOrEqual(1);
  });

  it('always reveals at least 1 letter for words with 2+ letters', () => {
    const slots = generateBlanks('ab', 0.99);
    const revealed = slots.filter((s) => !s.isBlank && /[a-zA-Z]/.test(s.char));
    expect(revealed.length).toBeGreaterThanOrEqual(1);
  });

  it('blanks the single letter in a one-letter word', () => {
    const slots = generateBlanks('I', 0.2);
    expect(slots).toHaveLength(1);
    expect(slots[0].isBlank).toBe(true);
  });

  it('handles multi-word phrases', () => {
    const slots = generateBlanks('guinea pig', 0.4);
    expect(slots).toHaveLength(10);
    const space = slots.find((s) => s.char === ' ');
    expect(space?.isBlank).toBe(false);
  });

  it('preserves character values and indices', () => {
    const slots = generateBlanks('hi', 0.5);
    expect(slots[0].char).toBe('h');
    expect(slots[0].index).toBe(0);
    expect(slots[1].char).toBe('i');
    expect(slots[1].index).toBe(1);
  });
});
