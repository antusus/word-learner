import { useState } from 'react';
import { GroupSelector } from './components/GroupSelector';
import { ModeSelector } from './components/ModeSelector';
import { SubUnitSelector } from './components/SubUnitSelector';
import { UnitSelector } from './components/UnitSelector';
import { loadUnitEntries } from './data/loader';
import { type GameMode, getGameModes } from './modes';
import type { ChallengeItem, Unit, UnitBundle, UnitEntry } from './types';
import './App.css';

const unitEntries = loadUnitEntries();
const gameModes = getGameModes();

type Screen = 'units' | 'subunits' | 'groups' | 'modes' | 'quiz';

function App() {
  const [screen, setScreen] = useState<Screen>('units');
  const [selectedBundle, setSelectedBundle] = useState<UnitBundle | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedChallenges, setSelectedChallenges] = useState<
    ChallengeItem[] | null
  >(null);

  const handleSelectEntry = (entry: UnitEntry) => {
    if (entry.kind === 'bundle') {
      setSelectedBundle(entry);
      setScreen('subunits');
    } else {
      handleSelectUnit(entry.unit);
    }
  };

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
    setSelectedBundle(null);
    setSelectedUnit(null);
    setSelectedMode(null);
    setSelectedChallenges(null);
    setScreen('units');
  };

  const handleBackFromSubUnits = () => {
    setSelectedBundle(null);
    setScreen('units');
  };

  const handleBackFromGroups = () => {
    setSelectedUnit(null);
    setSelectedChallenges(null);
    if (selectedBundle) {
      setScreen('subunits');
    } else {
      setScreen('units');
    }
  };

  const handleBackFromModes = () => {
    setSelectedMode(null);
    setSelectedChallenges(null);
    if (selectedUnit && selectedUnit.challengeGroups.length > 1) {
      setScreen('groups');
    } else if (selectedBundle) {
      setSelectedUnit(null);
      setScreen('subunits');
    } else {
      setSelectedUnit(null);
      setScreen('units');
    }
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

  if (screen === 'subunits' && selectedBundle) {
    return (
      <div className="app">
        <SubUnitSelector
          bundle={selectedBundle}
          onSelect={handleSelectUnit}
          onBack={handleBackFromSubUnits}
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
          onBack={handleBackFromModes}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <UnitSelector entries={unitEntries} onSelect={handleSelectEntry} />
    </div>
  );
}

export default App;
