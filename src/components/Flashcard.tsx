import type { Word } from '../types'
import './Flashcard.css'

interface FlashcardProps {
  word: Word
  isFlipped: boolean
  onFlip: () => void
}

export function Flashcard({ word, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onFlip()
        }
      }}
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
    </div>
  )
}
