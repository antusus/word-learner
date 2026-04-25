import type { Unit, UnitBundle } from '../types';
import './SubUnitSelector.css';

interface SubUnitSelectorProps {
  bundle: UnitBundle;
  onSelect: (unit: Unit) => void;
  onBack: () => void;
}

export function SubUnitSelector({
  bundle,
  onSelect,
  onBack,
}: SubUnitSelectorProps) {
  return (
    <div className="subunit-selector">
      <button type="button" className="subunit-back" onClick={onBack}>
        Back
      </button>
      <h2>{bundle.title}</h2>
      <p>Select a section to practice:</p>
      <ul className="subunit-list">
        {bundle.subUnits.map((unit) => (
          <li key={unit.id}>
            <button
              type="button"
              className="subunit-button"
              onClick={() => onSelect(unit)}
            >
              <span className="subunit-title">{unit.title}</span>
              <span className="subunit-count">
                {unit.challenges.length}{' '}
                {unit.type === 'irregular-verbs' ? 'verbs' : 'words'}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
