import { useMemo, useState } from 'react';
import { loadDifficultyLevelsForType } from '../../data/configLoader';
import type { ChallengeItem, DifficultyLevel, Unit } from '../../types';
import { shuffleArray } from '../../utils/shuffle';
import { generateBlanks } from './blanking';
import { DifficultyPicker } from './DifficultyPicker';
import type { WordResult } from './ResultsSummary';
import { ResultsSummary } from './ResultsSummary';
import { WordChallenge } from './WordChallenge';
import './FillInBlanks.css';

interface FillInBlanksProps {
  unit: Unit;
  challenges?: ChallengeItem[];
  onComplete: () => void;
  onExit: () => void;
}

type Phase = 'difficulty' | 'playing' | 'results';

export function FillInBlanks({
  unit,
  challenges,
  onComplete,
  onExit,
}: FillInBlanksProps) {
  const challengeList = challenges ?? unit.challenges;
  const shuffledChallenges = useMemo(
    () => shuffleArray(challengeList),
    [challengeList],
  );

  const difficulties = useMemo(
    () => loadDifficultyLevelsForType(unit.type),
    [unit.type],
  );
  const allowFullBlank = unit.type === 'irregular-verbs';

  const [phase, setPhase] = useState<Phase>('difficulty');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [results, setResults] = useState<WordResult[]>([]);

  const allSlots = useMemo(() => {
    if (!difficulty) return [];
    return shuffledChallenges.map((c) =>
      generateBlanks(c.answer, difficulty.blankPercentage, allowFullBlank),
    );
  }, [shuffledChallenges, difficulty, allowFullBlank]);

  const currentChallenge = shuffledChallenges[currentIndex];
  const currentSlots = allSlots[currentIndex];
  const totalWords = shuffledChallenges.length;

  const handleSelectDifficulty = (d: DifficultyLevel) => {
    setDifficulty(d);
    setPhase('playing');
  };

  const handleNext = () => {
    const challenge = shuffledChallenges[currentIndex];
    const slots = allSlots[currentIndex];

    const fullAnswer = slots.map((s) =>
      s.isBlank ? (userInput[s.index] ?? '') : s.char,
    );
    const correct =
      fullAnswer.join('').toLowerCase() === challenge.answer.toLowerCase();

    const newResults = [
      ...results,
      { challenge, userAnswer: fullAnswer, correct },
    ];
    setResults(newResults);

    if (currentIndex < totalWords - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput([]);
    } else {
      onComplete();
      setPhase('results');
    }
  };

  if (phase === 'difficulty') {
    return (
      <div className="fib">
        <div className="fib-header">
          <button type="button" className="fib-back" onClick={onExit}>
            Back
          </button>
        </div>
        <DifficultyPicker
          difficulties={difficulties}
          onSelect={handleSelectDifficulty}
        />
      </div>
    );
  }

  if (phase === 'results') {
    return (
      <div className="fib">
        <ResultsSummary
          results={results}
          unitTitle={unit.title}
          totalWords={totalWords}
          onExit={onExit}
        />
      </div>
    );
  }

  return (
    <div className="fib">
      <div className="fib-header">
        <button type="button" className="fib-back" onClick={onExit}>
          Back
        </button>
        <span className="fib-progress">
          {currentIndex + 1} / {totalWords}
        </span>
      </div>

      <h2 className="fib-title">{unit.title}</h2>

      {currentChallenge && currentSlots && (
        <WordChallenge
          challenge={currentChallenge}
          slots={currentSlots}
          userInput={userInput}
          onChange={setUserInput}
          onSubmit={handleNext}
        />
      )}

      <div className="fib-actions">
        <button type="button" className="fib-next-button" onClick={handleNext}>
          {currentIndex < totalWords - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
}
