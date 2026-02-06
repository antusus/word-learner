import { useState } from 'react';
import { GroupSelector } from './components/GroupSelector';
import { ModeSelector } from './components/ModeSelector';
import { UnitSelector } from './components/UnitSelector';
import { loadUnits } from './data/loader';
import { type GameMode, getGameModes } from './modes';
import type { Unit, Word } from './types';
import './App.css';

const units = loadUnits();
const gameModes = getGameModes();

type Screen = 'units' | 'groups' | 'modes' | 'quiz';

function App() {
  const [screen, setScreen] = useState<Screen>('units');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedWords, setSelectedWords] = useState<Word[] | null>(null);

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    if (unit.groups.length > 1) {
      setScreen('groups');
    } else if (gameModes.length === 1) {
      setSelectedMode(gameModes[0]);
      setScreen('quiz');
    } else {
      setScreen('modes');
    }
  };

  const handleSelectGroups = (words: Word[]) => {
    setSelectedWords(words);
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
    setSelectedWords(null);
    setScreen('units');
  };

  const handleBackFromGroups = () => {
    setSelectedUnit(null);
    setSelectedWords(null);
    setScreen('units');
  };

  if (screen === 'quiz' && selectedUnit && selectedMode) {
    const GameComponent = selectedMode.component;
    return (
      <div className="app">
        <GameComponent
          unit={selectedUnit}
          words={selectedWords ?? undefined}
          onComplete={() => {}}
          onExit={handleBackToUnits}
        />
      </div>
    );
  }

  if (screen === 'groups' && selectedUnit) {
    return (
      <div className="app">
        <GroupSelector
          unitTitle={selectedUnit.title}
          groups={selectedUnit.groups}
          onStart={handleSelectGroups}
          onBack={handleBackFromGroups}
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
