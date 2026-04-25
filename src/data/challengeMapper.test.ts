import {
  mapGroupsToChallenges,
  verbToChallenge,
  wordToChallenge,
} from './challengeMapper';

describe('wordToChallenge', () => {
  it('maps a vocabulary word to prompt=pl, answer=en', () => {
    expect(wordToChallenge({ en: 'apple', pl: 'jabłko' })).toEqual({
      prompt: 'jabłko',
      answer: 'apple',
    });
  });
});

describe('verbToChallenge', () => {
  it('maps an irregular verb to prompt=base, answer=pastSimple', () => {
    expect(verbToChallenge({ base: 'go', pastSimple: 'went' })).toEqual({
      prompt: 'go',
      answer: 'went',
    });
  });
});

describe('mapGroupsToChallenges', () => {
  describe('vocabulary type', () => {
    it('returns challenges flattened from all groups', () => {
      const { challenges } = mapGroupsToChallenges('vocabulary', [
        {
          name: 'G1',
          words: [
            { en: 'cat', pl: 'kot' },
            { en: 'dog', pl: 'pies' },
          ],
        },
        {
          name: 'G2',
          words: [{ en: 'red', pl: 'czerwony' }],
        },
      ]);

      expect(challenges).toEqual([
        { prompt: 'kot', answer: 'cat' },
        { prompt: 'pies', answer: 'dog' },
        { prompt: 'czerwony', answer: 'red' },
      ]);
    });

    it('returns challengeGroups preserving group names', () => {
      const { challengeGroups } = mapGroupsToChallenges('vocabulary', [
        {
          name: 'Animals',
          words: [{ en: 'cat', pl: 'kot' }],
        },
      ]);

      expect(challengeGroups).toEqual([
        {
          name: 'Animals',
          items: [{ prompt: 'kot', answer: 'cat' }],
        },
      ]);
    });

    it('handles empty groups', () => {
      const { challenges, challengeGroups } = mapGroupsToChallenges(
        'vocabulary',
        [],
      );
      expect(challenges).toEqual([]);
      expect(challengeGroups).toEqual([]);
    });
  });

  describe('irregular-verbs type', () => {
    it('returns challenges flattened from all verb groups', () => {
      const { challenges } = mapGroupsToChallenges('irregular-verbs', [
        {
          name: 'G1',
          words: [
            { base: 'go', pastSimple: 'went' },
            { base: 'see', pastSimple: 'saw' },
          ],
        },
        {
          name: 'G2',
          words: [{ base: 'run', pastSimple: 'ran' }],
        },
      ]);

      expect(challenges).toEqual([
        { prompt: 'go', answer: 'went' },
        { prompt: 'see', answer: 'saw' },
        { prompt: 'run', answer: 'ran' },
      ]);
    });

    it('returns challengeGroups preserving group names', () => {
      const { challengeGroups } = mapGroupsToChallenges('irregular-verbs', [
        {
          name: 'Past Tense',
          words: [
            { base: 'go', pastSimple: 'went' },
            { base: 'eat', pastSimple: 'ate' },
          ],
        },
      ]);

      expect(challengeGroups).toEqual([
        {
          name: 'Past Tense',
          items: [
            { prompt: 'go', answer: 'went' },
            { prompt: 'eat', answer: 'ate' },
          ],
        },
      ]);
    });

    it('handles empty groups', () => {
      const { challenges, challengeGroups } = mapGroupsToChallenges(
        'irregular-verbs',
        [],
      );
      expect(challenges).toEqual([]);
      expect(challengeGroups).toEqual([]);
    });
  });
});
