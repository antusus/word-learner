import type { ComponentType } from 'react';
import type { Unit, Word } from '../types';

export interface GameModeProps {
  unit: Unit;
  words?: Word[];
  onComplete: () => void;
  onExit: () => void;
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  component: ComponentType<GameModeProps>;
}

import { Quiz } from '../components/Quiz';
import { FillInBlanks } from './fillInBlanks/FillInBlanks';

export const gameModes: GameMode[] = [
  {
    id: 'flashcard',
    name: 'Flip Cards',
    description: 'Show Polish, reveal English',
    component: Quiz,
  },
  {
    id: 'fill-in-blanks',
    name: 'Fill in Blanks',
    description: 'Fill missing letters in English words',
    component: FillInBlanks,
  },
];

export function getGameModes(): GameMode[] {
  return gameModes;
}
