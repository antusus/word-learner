import type { Unit } from '../types';

interface UnitSelectorProps {
  units: Unit[];
  onSelect: (unit: Unit) => void;
}

export function UnitSelector({ units, onSelect }: UnitSelectorProps) {
  return (
    <div className="unit-selector">
      <h1>Word Learner</h1>
      <p>Select a unit to practice:</p>
      <ul className="unit-list">
        {units.map((unit) => (
          <li key={unit.id}>
            <button
              type="button"
              className="unit-button"
              onClick={() => onSelect(unit)}
            >
              <span className="unit-title">{unit.title}</span>
              <span className="unit-count">{unit.words.length} words</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
