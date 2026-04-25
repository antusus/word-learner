import type { ComponentType } from 'react';
import type { ChallengeItem, Unit } from '../types';

export interface GameModeProps {
  unit: Unit;
  challenges?: ChallengeItem[];
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
    description: 'Show prompt, reveal answer',
    component: Quiz,
  },
  {
    id: 'fill-in-blanks',
    name: 'Fill in Blanks',
    description: 'Fill missing letters',
    component: FillInBlanks,
  },
];

export function getGameModes(): GameMode[] {
  return gameModes;
}
