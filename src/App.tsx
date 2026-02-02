import { useState } from 'react'
import { UnitSelector } from './components/UnitSelector'
import { ModeSelector } from './components/ModeSelector'
import { loadUnits } from './data/loader'
import { getGameModes, type GameMode } from './modes'
import type { Unit } from './types'
import './App.css'

const units = loadUnits()
const gameModes = getGameModes()

type Screen = 'units' | 'modes' | 'quiz'

function App() {
  const [screen, setScreen] = useState<Screen>('units')
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit)
    if (gameModes.length === 1) {
      setSelectedMode(gameModes[0])
      setScreen('quiz')
    } else {
      setScreen('modes')
    }
  }

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode)
    setScreen('quiz')
  }

  const handleBackToUnits = () => {
    setSelectedUnit(null)
    setSelectedMode(null)
    setScreen('units')
  }

  const handleBackToModes = () => {
    setSelectedMode(null)
    setScreen('modes')
  }

  const handleComplete = () => {
    // Progress tracking will be added in Phase 5
  }

  if (screen === 'quiz' && selectedUnit && selectedMode) {
    const GameComponent = selectedMode.component
    return (
      <div className="app">
        <GameComponent unit={selectedUnit} onComplete={handleComplete} onExit={handleBackToUnits} />
      </div>
    )
  }

  if (screen === 'modes' && selectedUnit) {
    return (
      <div className="app">
        <ModeSelector modes={gameModes} onSelect={handleSelectMode} onBack={handleBackToUnits} />
      </div>
    )
  }

  return (
    <div className="app">
      <UnitSelector units={units} onSelect={handleSelectUnit} />
    </div>
  )
}

export default App
