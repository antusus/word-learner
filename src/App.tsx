import { useState } from 'react'
import { UnitSelector } from './components/UnitSelector'
import { loadUnits } from './data/loader'
import type { Unit } from './types'
import './App.css'

const units = loadUnits()

function App() {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit)
  }

  const handleExit = () => {
    setSelectedUnit(null)
  }

  if (selectedUnit) {
    return (
      <div className="app">
        <h2>{selectedUnit.title}</h2>
        <p>Quiz coming soon...</p>
        <button onClick={handleExit}>Back to Units</button>
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
