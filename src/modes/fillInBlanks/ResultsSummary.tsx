import type { ChallengeItem } from '../../types';

export interface WordResult {
  challenge: ChallengeItem;
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
              <li key={r.challenge.answer} className="fib-error-item">
                <span className="fib-error-polish">{r.challenge.prompt}</span>
                <div className="fib-error-cards">
                  <div className="fib-error-card">
                    <span className="fib-error-card-label">You typed</span>
                    <div className="fib-error-letters">
                      {r.challenge.answer.split('').map((char, i) => {
                        const userChar = r.userAnswer[i] ?? ' ';
                        const isCorrect =
                          userChar.toLowerCase() === char.toLowerCase();
                        return (
                          <span
                            // biome-ignore lint/suspicious/noArrayIndexKey: characters are static positional data — index is the correct key
                            key={`${r.challenge.answer}-user-${i}`}
                            className={
                              isCorrect
                                ? 'fib-letter-correct'
                                : 'fib-letter-wrong'
                            }
                          >
                            {userChar}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="fib-error-card">
                    <span className="fib-error-card-label">Correct</span>
                    <div className="fib-error-letters">
                      {r.challenge.answer.split('').map((char, i) => (
                        <span
                          // biome-ignore lint/suspicious/noArrayIndexKey: characters are static positional data — index is the correct key
                          key={`${r.challenge.answer}-correct-${i}`}
                          className="fib-letter-correct"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
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
