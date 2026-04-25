import type {
  ChallengeGroup,
  ChallengeItem,
  IrregularVerb,
  IrregularVerbGroup,
  UnitType,
  Word,
  WordGroup,
} from '../types';

export function wordToChallenge(word: Word): ChallengeItem {
  return { prompt: word.pl, answer: word.en };
}

export function verbToChallenge(verb: IrregularVerb): ChallengeItem {
  return { prompt: verb.base, answer: verb.pastSimple };
}

export function mapGroupsToChallenges(
  type: UnitType,
  groups: WordGroup[] | IrregularVerbGroup[],
): { challenges: ChallengeItem[]; challengeGroups: ChallengeGroup[] } {
  if (type === 'irregular-verbs') {
    const verbGroups = groups as IrregularVerbGroup[];
    const challengeGroups = verbGroups.map((g) => ({
      name: g.name,
      items: g.words.map(verbToChallenge),
    }));
    return {
      challenges: challengeGroups.flatMap((g) => g.items),
      challengeGroups,
    };
  }

  const wordGroups = groups as WordGroup[];
  const challengeGroups = wordGroups.map((g) => ({
    name: g.name,
    items: g.words.map(wordToChallenge),
  }));
  return {
    challenges: challengeGroups.flatMap((g) => g.items),
    challengeGroups,
  };
}
