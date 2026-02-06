import type { Word } from '../../types';

export interface WordResult {
  word: Word;
  userAnswer: string[];
  correct: boolean;
}

interface ResultsSummaryProps {
  results: WordResult[];
  unitTitle: string;
  totalWords: number;
  onExit: () => void;
}

export function ResultsSummary({
  results,
  unitTitle,
  totalWords,
  onExit,
}: ResultsSummaryProps) {
  const errors = results.filter((r) => !r.correct);

  return (
    <div className="fib-results">
      {errors.length === 0 ? (
        <>
          <h2 className="fib-results-success">Well done!</h2>
          <p>You completed {unitTitle}</p>
          <p>
            All {totalWords} word{totalWords !== 1 ? 's' : ''} correct
          </p>
        </>
      ) : (
        <>
          <h2>Results</h2>
          <p>
            {totalWords - errors.length} / {totalWords} correct
          </p>
          <ul className="fib-error-list">
            {errors.map((r) => (
              <li key={r.word.en} className="fib-error-item">
                <span className="fib-error-polish">{r.word.pl}</span>
                <div className="fib-error-letters">
                  {r.word.en.split('').map((char, i) => {
                    const userChar = r.userAnswer[i] ?? '';
                    const isCorrect =
                      userChar.toLowerCase() === char.toLowerCase();
                    return (
                      <span
                        key={`${r.word.en}-${i}`}
                        className={
                          isCorrect ? 'fib-letter-correct' : 'fib-letter-wrong'
                        }
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <button type="button" className="fib-exit-button" onClick={onExit}>
        Back to Units
      </button>
    </div>
  );
}
