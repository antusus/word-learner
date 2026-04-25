import type { ChallengeItem } from '../types';
import './Flashcard.css';

interface FlashcardProps {
  challenge: ChallengeItem;
  isFlipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ challenge, isFlipped, onFlip }: FlashcardProps) {
  return (
    <button
      type="button"
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={onFlip}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <span className="flashcard-text">{challenge.prompt}</span>
          <span className="flashcard-hint">Click to reveal</span>
        </div>
        <div className="flashcard-back">
          <span className="flashcard-text">{challenge.answer}</span>
        </div>
      </div>
    </button>
  );
}
