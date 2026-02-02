import type { Unit } from '../types';

interface UnitSelectorProps {
  units: Unit[];
  completedUnits?: string[];
  onSelect: (unit: Unit) => void;
}

export function UnitSelector({
  units,
  completedUnits = [],
  onSelect,
}: UnitSelectorProps) {
  return (
    <div className="unit-selector">
      <h1>Word Learner</h1>
      <p>Select a unit to practice:</p>
      <ul className="unit-list">
        {units.map((unit) => {
          const isCompleted = completedUnits.includes(unit.id);
          return (
            <li key={unit.id}>
              <button
                type="button"
                className={`unit-button ${isCompleted ? 'completed' : ''}`}
                onClick={() => onSelect(unit)}
              >
                <span className="unit-title">
                  {isCompleted && (
                    <span
                      className="unit-check"
                      role="img"
                      aria-label="completed"
                    >
                      ✓{' '}
                    </span>
                  )}
                  {unit.title}
                </span>
                <span className="unit-count">{unit.words.length} words</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
