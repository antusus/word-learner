import type { ComponentType } from 'react'
import type { Unit } from '../types'

export interface GameModeProps {
  unit: Unit
  onComplete: () => void
  onExit: () => void
}

export interface GameMode {
  id: string
  name: string
  description: string
  component: ComponentType<GameModeProps>
}

import { Quiz } from '../components/Quiz'

export const gameModes: GameMode[] = [
  {
    id: 'flashcard',
    name: 'Flip Cards',
    description: 'Show Polish, reveal English',
    component: Quiz,
  },
]

export function getGameModes(): GameMode[] {
  return gameModes
}
