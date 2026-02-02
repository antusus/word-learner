import type { Word } from '../types';
import './Flashcard.css';

interface FlashcardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ word, isFlipped, onFlip }: FlashcardProps) {
  return (
    <button
      type="button"
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={onFlip}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <span className="flashcard-text">{word.pl}</span>
          <span className="flashcard-hint">Click to reveal</span>
        </div>
        <div className="flashcard-back">
          <span className="flashcard-text">{word.en}</span>
        </div>
      </div>
    </button>
  );
}
