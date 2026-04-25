export type UnitType = 'vocabulary' | 'irregular-verbs';

export interface Word {
  en: string;
  pl: string;
}

export interface IrregularVerb {
  base: string;
  pastSimple: string;
}

export interface ChallengeItem {
  prompt: string;
  answer: string;
}

export interface WordGroup {
  name: string;
  words: Word[];
}

export interface IrregularVerbGroup {
  name: string;
  words: IrregularVerb[];
}

export interface ChallengeGroup {
  name: string;
  items: ChallengeItem[];
}

export interface WordsFile {
  title: string;
  type?: UnitType;
  groups: WordGroup[] | IrregularVerbGroup[];
}

export interface Unit {
  id: string;
  title: string;
  type: UnitType;
  words: Word[];
  groups: WordGroup[];
  challenges: ChallengeItem[];
  challengeGroups: ChallengeGroup[];
}

export interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
  blankPercentage: number;
}

export interface DifficultyConfig {
  difficulties: DifficultyLevel[];
}
