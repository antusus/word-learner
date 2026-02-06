import { useMemo, useState } from 'react';
import { loadDifficultyLevels } from '../../data/configLoader';
import type { DifficultyLevel, Word } from '../../types';
import { shuffleArray } from '../../utils/shuffle';
import { generateBlanks } from './blanking';
import { DifficultyPicker } from './DifficultyPicker';
import type { WordResult } from './ResultsSummary';
import { ResultsSummary } from './ResultsSummary';
import { WordChallenge } from './WordChallenge';
import './FillInBlanks.css';

interface FillInBlanksProps {
  unit: { title: string; words: Word[] };
  words?: Word[];
  onComplete: () => void;
  onExit: () => void;
}

type Phase = 'difficulty' | 'playing' | 'results';

const difficulties = loadDifficultyLevels();

export function FillInBlanks({
  unit,
  words,
  onComplete,
  onExit,
}: FillInBlanksProps) {
  const wordList = words ?? unit.words;
  const shuffledWords = useMemo(() => shuffleArray(wordList), [wordList]);

  const [phase, setPhase] = useState<Phase>('difficulty');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [results, setResults] = useState<WordResult[]>([]);

  const allSlots = useMemo(() => {
    if (!difficulty) return [];
    return shuffledWords.map((w) =>
      generateBlanks(w.en, difficulty.blankPercentage),
    );
  }, [shuffledWords, difficulty]);

  const currentWord = shuffledWords[currentIndex];
  const currentSlots = allSlots[currentIndex];
  const totalWords = shuffledWords.length;

  const handleSelectDifficulty = (d: DifficultyLevel) => {
    setDifficulty(d);
    setPhase('playing');
  };

  const handleNext = () => {
    const word = shuffledWords[currentIndex];
    const slots = allSlots[currentIndex];

    const fullAnswer = slots.map((s) =>
      s.isBlank ? (userInput[s.index] ?? '') : s.char,
    );
    const correct = fullAnswer.join('').toLowerCase() === word.en.toLowerCase();

    const newResults = [...results, { word, userAnswer: fullAnswer, correct }];
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

      {currentWord && currentSlots && (
        <WordChallenge
          word={currentWord}
          slots={currentSlots}
          userInput={userInput}
          onChange={setUserInput}
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
