import { useState } from 'react';
import type { Word, WordGroup } from '../types';
import './GroupSelector.css';

interface GroupSelectorProps {
  unitTitle: string;
  groups: WordGroup[];
  onStart: (words: Word[]) => void;
  onBack: () => void;
}

export function GroupSelector({
  unitTitle,
  groups,
  onStart,
  onBack,
}: GroupSelectorProps) {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set(),
  );

  const handleToggle = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleStart = () => {
    const words = groups
      .filter((_, index) => selectedIndices.has(index))
      .flatMap((group) => group.words);
    onStart(words);
  };

  return (
    <div className="group-selector">
      <button type="button" className="group-back" onClick={onBack}>
        Back
      </button>
      <h2>{unitTitle}</h2>
      <p>Select groups to practice:</p>
      <ul className="group-list">
        {groups.map((group, index) => (
          <li key={group.name}>
            <label className="group-item">
              <input
                type="checkbox"
                checked={selectedIndices.has(index)}
                onChange={() => handleToggle(index)}
              />
              <span className="group-name">{group.name}</span>
              <span className="group-count">
                {group.words.length}{' '}
                {group.words.length === 1 ? 'word' : 'words'}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="group-actions">
        <button
          type="button"
          className="group-start"
          disabled={selectedIndices.size === 0}
          onClick={handleStart}
        >
          Start
        </button>
      </div>
    </div>
  );
}
