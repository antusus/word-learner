import { useEffect, useMemo, useRef, useState } from 'react';
import type { Word } from '../../types';
import type { CharSlot } from './blanking';

interface WordChallengeProps {
  word: Word;
  slots: CharSlot[];
  userInput: string[];
  onChange: (input: string[]) => void;
  submitted?: boolean;
}

function groupSlotsByWord(slots: CharSlot[]): CharSlot[][] {
  const groups: CharSlot[][] = [];
  let current: CharSlot[] = [];
  for (const slot of slots) {
    if (slot.char === ' ') {
      if (current.length > 0) groups.push(current);
      current = [];
    } else {
      current.push(slot);
    }
  }
  if (current.length > 0) groups.push(current);
  return groups;
}

export function WordChallenge({
  word,
  slots,
  userInput,
  onChange,
  submitted,
}: WordChallengeProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [hintRevealed, setHintRevealed] = useState(false);
  const blankIndices = useMemo(
    () =>
      slots.reduce<number[]>((acc, s, i) => {
        if (s.isBlank) acc.push(i);
        return acc;
      }, []),
    [slots],
  );

  useEffect(() => {
    setHintRevealed(false);
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

  const wordGroups = useMemo(() => groupSlotsByWord(slots), [slots]);

  const renderSlot = (slot: CharSlot) =>
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
    );

  return (
    <div className="fib-challenge">
      <div className="fib-hint">
        {hintRevealed ? (
          <p className="fib-prompt">{word.pl}</p>
        ) : (
          <button
            type="button"
            className="fib-hint-button"
            onClick={() => setHintRevealed(true)}
          >
            Show translation
          </button>
        )}
      </div>
      <div className="fib-word">
        {wordGroups.map((group) => (
          <span key={group[0].index} className="fib-word-group">
            {group.map(renderSlot)}
          </span>
        ))}
      </div>
    </div>
  );
}
