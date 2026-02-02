import type { GameMode } from '../modes';

interface ModeSelectorProps {
  modes: GameMode[];
  onSelect: (mode: GameMode) => void;
  onBack: () => void;
}

export function ModeSelector({ modes, onSelect, onBack }: ModeSelectorProps) {
  return (
    <div className="mode-selector">
      <button type="button" className="mode-back" onClick={onBack}>
        Back
      </button>
      <h2>Choose a mode</h2>
      <ul className="mode-list">
        {modes.map((mode) => (
          <li key={mode.id}>
            <button
              type="button"
              className="mode-button"
              onClick={() => onSelect(mode)}
            >
              <span className="mode-name">{mode.name}</span>
              <span className="mode-description">{mode.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
