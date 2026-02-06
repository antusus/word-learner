import { shuffleArray } from '../../utils/shuffle';

export interface CharSlot {
  char: string;
  isBlank: boolean;
  index: number;
}

/**
 * Takes a word and a blank percentage, returns a CharSlot for each character
 * indicating whether it should be shown or hidden.
 *
 * 1. Split the word into individual characters.
 * 2. Identify letter indices — only alphabetic characters are candidates
 *    (spaces, apostrophes, punctuation are never blanked).
 * 3. Calculate blank count:
 *    - Single-letter words: blank the one letter.
 *    - 2+ letter words: Math.round(letterCount * blankPercentage), clamped
 *      to [1, letterCount - 1] so there's always at least one blank and
 *      at least one revealed letter.
 * 4. Shuffle the letter indices and take the first N as blanks.
 * 5. Map every character to a CharSlot with isBlank set accordingly.
 */
export function generateBlanks(
  word: string,
  blankPercentage: number,
): CharSlot[] {
  const chars = word.split('');
  const letterIndices = chars.reduce<number[]>((acc, ch, i) => {
    if (/[a-zA-Z]/.test(ch)) acc.push(i);
    return acc;
  }, []);

  const letterCount = letterIndices.length;

  let blankCount: number;
  if (letterCount <= 1) {
    blankCount = letterCount;
  } else {
    blankCount = Math.round(letterCount * blankPercentage);
    blankCount = Math.max(1, Math.min(blankCount, letterCount - 1));
  }

  const blankedIndices = new Set(
    shuffleArray(letterIndices).slice(0, blankCount),
  );

  return chars.map((char, index) => ({
    char,
    isBlank: blankedIndices.has(index),
    index,
  }));
}
