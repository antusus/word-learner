import { useMemo, useState } from 'react';
import type { ChallengeItem, Unit } from '../types';
import { shuffleArray } from '../utils/shuffle';
import { Flashcard } from './Flashcard';
import './Quiz.css';

interface QuizProps {
  unit: Unit;
  challenges?: ChallengeItem[];
  onComplete: () => void;
  onExit: () => void;
}

export function Quiz({ unit, challenges, onComplete, onExit }: QuizProps) {
  const challengeList = challenges ?? unit.challenges;
  const shuffledChallenges = useMemo(
    () => shuffleArray(challengeList),
    [challengeList],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentChallenge: ChallengeItem | undefined =
    shuffledChallenges[currentIndex];
  const totalWords = shuffledChallenges.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < totalWords - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setIsCompleted(true);
      onComplete();
    }
  };

  if (isCompleted) {
    return (
      <div className="quiz quiz-completed">
        <h2>Well done!</h2>
        <p>You've completed {unit.title}</p>
        <p>You practiced {totalWords} words</p>
        <button type="button" className="quiz-button" onClick={onExit}>
          Back to Units
        </button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-header">
        <button type="button" className="quiz-back" onClick={onExit}>
          Back
        </button>
        <span className="quiz-progress">
          {currentIndex + 1} / {totalWords}
        </span>
      </div>

      <h2 className="quiz-title">{unit.title}</h2>

      {currentChallenge && (
        <Flashcard
          challenge={currentChallenge}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      )}

      <div className="quiz-actions">
        <button
          type="button"
          className="quiz-button quiz-next"
          onClick={handleNext}
          disabled={!isFlipped}
        >
          {currentIndex < totalWords - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
}
