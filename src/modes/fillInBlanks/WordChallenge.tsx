import { useEffect, useMemo, useRef } from 'react';
import type { ChallengeItem } from '../../types';
import type { CharSlot } from './blanking';
import { groupIndicesByWord } from './blanking';
import { Hint } from './Hint';

interface WordChallengeProps {
  challenge: ChallengeItem;
  slots: CharSlot[];
  userInput: string[];
  onChange: (input: string[]) => void;
  onSubmit?: () => void;
  submitted?: boolean;
}

function groupSlotsByWord(slots: CharSlot[]): CharSlot[][] {
  const phrase = slots.map((slot) => slot.char).join('');
  return groupIndicesByWord(phrase).map((group) => group.map((i) => slots[i]));
}

export function WordChallenge({
  challenge,
  slots,
  userInput,
  onChange,
  onSubmit,
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
    if (e.key === 'Enter') {
      onSubmit?.();
    } else if (e.key === 'Backspace' && !userInput[slotIndex]) {
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
      <Hint translation={challenge.prompt} />
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
