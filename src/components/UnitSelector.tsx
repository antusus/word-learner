import type { UnitEntry } from '../types';

interface UnitSelectorProps {
  entries: UnitEntry[];
  onSelect: (entry: UnitEntry) => void;
}

export function UnitSelector({ entries, onSelect }: UnitSelectorProps) {
  return (
    <div className="unit-selector">
      <h1>Word Learner</h1>
      <p>Select a unit to practice:</p>
      <ul className="unit-list">
        {entries.map((entry) => {
          const isBundle = entry.kind === 'bundle';
          const key = isBundle ? entry.id : entry.unit.id;
          const title = isBundle ? entry.title : entry.unit.title;
          const count = isBundle
            ? `${entry.subUnits.length} ${entry.subUnits.length === 1 ? 'section' : 'sections'}`
            : `${entry.unit.challenges.length} ${entry.unit.type === 'irregular-verbs' ? 'verbs' : 'words'}`;

          return (
            <li key={key}>
              <button
                type="button"
                className="unit-button"
                onClick={() => onSelect(entry)}
              >
                <span className="unit-title">{title}</span>
                <span className="unit-count">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
