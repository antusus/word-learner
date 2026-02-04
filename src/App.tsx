import { useState } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { UnitSelector } from './components/UnitSelector';
import { loadUnits } from './data/loader';
import { type GameMode, getGameModes } from './modes';
import type { Unit } from './types';
import './App.css';

const units = loadUnits();
const gameModes = getGameModes();

type Screen = 'units' | 'modes' | 'quiz';

function App() {
  const [screen, setScreen] = useState<Screen>('units');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    if (gameModes.length === 1) {
      setSelectedMode(gameModes[0]);
      setScreen('quiz');
    } else {
      setScreen('modes');
    }
  };

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode);
    setScreen('quiz');
  };

  const handleBackToUnits = () => {
    setSelectedUnit(null);
    setSelectedMode(null);
    setScreen('units');
  };

  if (screen === 'quiz' && selectedUnit && selectedMode) {
    const GameComponent = selectedMode.component;
    return (
      <div className="app">
        <GameComponent
          unit={selectedUnit}
          onComplete={() => {}}
          onExit={handleBackToUnits}
        />
      </div>
    );
  }

  if (screen === 'modes' && selectedUnit) {
    return (
      <div className="app">
        <ModeSelector
          modes={gameModes}
          onSelect={handleSelectMode}
          onBack={handleBackToUnits}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <UnitSelector units={units} onSelect={handleSelectUnit} />
    </div>
  );
}

export default App;
