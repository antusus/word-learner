import type { DifficultyLevel } from '../../types';

interface DifficultyPickerProps {
  difficulties: DifficultyLevel[];
  onSelect: (difficulty: DifficultyLevel) => void;
}

export function DifficultyPicker({
  difficulties,
  onSelect,
}: DifficultyPickerProps) {
  return (
    <div className="fib-difficulty">
      <h2>Choose difficulty</h2>
      <ul className="fib-difficulty-list">
        {difficulties.map((d) => (
          <li key={d.id}>
            <button
              type="button"
              className="fib-difficulty-button"
              onClick={() => onSelect(d)}
            >
              <span className="fib-difficulty-name">{d.name}</span>
              <span className="fib-difficulty-desc">{d.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
