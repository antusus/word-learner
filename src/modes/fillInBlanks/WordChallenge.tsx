import { useEffect, useMemo, useRef } from 'react';
import type { Word } from '../../types';
import type { CharSlot } from './blanking';

interface WordChallengeProps {
  word: Word;
  slots: CharSlot[];
  userInput: string[];
  onChange: (input: string[]) => void;
  submitted?: boolean;
}

export function WordChallenge({
  word,
  slots,
  userInput,
  onChange,
  submitted,
}: WordChallengeProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const blankIndices = useMemo(
    () =>
      slots.reduce<number[]>((acc, s, i) => {
        if (s.isBlank) acc.push(i);
        return acc;
      }, []),
    [slots],
  );

  useEffect(() => {
    if (!submitted && blankIndices.length > 0) {
      inputRefs.current[blankIndices[0]]?.focus();
    }
  }, [submitted, blankIndices]);

  const handleInput = (slotIndex: number, value: string) => {
    const next = [...userInput];
    next[slotIndex] = value;
    onChange(next);

    if (value) {
      const pos = blankIndices.indexOf(slotIndex);
      if (pos < blankIndices.length - 1) {
        inputRefs.current[blankIndices[pos + 1]]?.focus();
      }
    }
  };

  const handleKeyDown = (
    slotIndex: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !userInput[slotIndex]) {
      const pos = blankIndices.indexOf(slotIndex);
      if (pos > 0) {
        const prevIndex = blankIndices[pos - 1];
        inputRefs.current[prevIndex]?.focus();
      }
    }
  };

  return (
    <div className="fib-challenge">
      <p className="fib-prompt">{word.pl}</p>
      <div className="fib-word">
        {slots.map((slot) =>
          slot.isBlank ? (
            <input
              key={slot.index}
              ref={(el) => {
                inputRefs.current[slot.index] = el;
              }}
              className="fib-blank"
              type="text"
              maxLength={1}
              value={userInput[slot.index] ?? ''}
              onChange={(e) => handleInput(slot.index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(slot.index, e)}
              disabled={submitted}
              aria-label={`Letter ${slot.index + 1}`}
            />
          ) : (
            <span key={slot.index} className="fib-letter">
              {slot.char}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
