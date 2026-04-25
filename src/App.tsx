import { useState } from 'react';
import { GroupSelector } from './components/GroupSelector';
import { ModeSelector } from './components/ModeSelector';
import { UnitSelector } from './components/UnitSelector';
import { loadUnits } from './data/loader';
import { type GameMode, getGameModes } from './modes';
import type { ChallengeItem, Unit } from './types';
import './App.css';

const units = loadUnits();
const gameModes = getGameModes();

type Screen = 'units' | 'groups' | 'modes' | 'quiz';

function App() {
  const [screen, setScreen] = useState<Screen>('units');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedChallenges, setSelectedChallenges] = useState<
    ChallengeItem[] | null
  >(null);

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    if (unit.challengeGroups.length > 1) {
      setScreen('groups');
    } else if (gameModes.length === 1) {
      setSelectedMode(gameModes[0]);
      setScreen('quiz');
    } else {
      setScreen('modes');
    }
  };

  const handleSelectGroups = (challenges: ChallengeItem[]) => {
    setSelectedChallenges(challenges);
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
    setSelectedChallenges(null);
    setScreen('units');
  };

  const handleBackFromGroups = () => {
    setSelectedUnit(null);
    setSelectedChallenges(null);
    setScreen('units');
  };

  if (screen === 'quiz' && selectedUnit && selectedMode) {
    const GameComponent = selectedMode.component;
    return (
      <div className="app">
        <GameComponent
          unit={selectedUnit}
          challenges={selectedChallenges ?? undefined}
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
          unitType={selectedUnit.type}
          groups={selectedUnit.challengeGroups}
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
