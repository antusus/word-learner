import { useState, useMemo } from 'react'
import { Flashcard } from './Flashcard'
import type { Unit, Word } from '../types'
import './Quiz.css'

interface QuizProps {
  unit: Unit
  onComplete: () => void
  onExit: () => void
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function Quiz({ unit, onComplete, onExit }: QuizProps) {
  const shuffledWords = useMemo(() => shuffleArray(unit.words), [unit.words])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const currentWord: Word | undefined = shuffledWords[currentIndex]
  const totalWords = shuffledWords.length

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    if (currentIndex < totalWords - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      setIsCompleted(true)
      onComplete()
    }
  }

  if (isCompleted) {
    return (
      <div className="quiz quiz-completed">
        <h2>Well done!</h2>
        <p>You've completed {unit.title}</p>
        <p>You practiced {totalWords} words</p>
        <button className="quiz-button" onClick={onExit}>
          Back to Units
        </button>
      </div>
    )
  }

  return (
    <div className="quiz">
      <div className="quiz-header">
        <button className="quiz-back" onClick={onExit}>
          Back
        </button>
        <span className="quiz-progress">
          {currentIndex + 1} / {totalWords}
        </span>
      </div>

      <h2 className="quiz-title">{unit.title}</h2>

      {currentWord && <Flashcard word={currentWord} isFlipped={isFlipped} onFlip={handleFlip} />}

      <div className="quiz-actions">
        <button className="quiz-button quiz-next" onClick={handleNext} disabled={!isFlipped}>
          {currentIndex < totalWords - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  )
}
