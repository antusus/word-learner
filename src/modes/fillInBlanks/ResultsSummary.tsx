import type { ChallengeItem } from '../../types';
import { groupIndicesByWord } from './blanking';

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
            {errors.map((r) => {
              const wordGroups = groupIndicesByWord(r.challenge.answer);
              // Unfilled blanks are stored as '', which would silently vanish
              // from the label and read as a different word.
              const typedLabel = r.userAnswer.map((c) => c || '_').join('');
              return (
                <li key={r.challenge.answer} className="fib-error-item">
                  <span className="fib-error-polish">{r.challenge.prompt}</span>
                  <div className="fib-error-cards">
                    <div className="fib-error-card">
                      <span className="fib-error-card-label">You typed</span>
                      {/* Space tiles are dropped, so the tile text runs together —
                        the label is what conveys word breaks to screen readers. */}
                      <div
                        className="fib-error-letters"
                        role="img"
                        aria-label={typedLabel}
                      >
                        {wordGroups.map((group) => (
                          <span
                            key={`${r.challenge.answer}-user-group-${group[0]}`}
                            className="fib-error-word"
                          >
                            {group.map((i) => {
                              const char = r.challenge.answer[i];
                              const userChar = r.userAnswer[i] ?? ' ';
                              const isCorrect =
                                userChar.toLowerCase() === char.toLowerCase();
                              return (
                                <span
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
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="fib-error-card">
                      <span className="fib-error-card-label">Correct</span>
                      <div
                        className="fib-error-letters"
                        role="img"
                        aria-label={r.challenge.answer}
                      >
                        {wordGroups.map((group) => (
                          <span
                            key={`${r.challenge.answer}-correct-group-${group[0]}`}
                            className="fib-error-word"
                          >
                            {group.map((i) => (
                              <span
                                key={`${r.challenge.answer}-correct-${i}`}
                                className="fib-letter-correct"
                              >
                                {r.challenge.answer[i]}
                              </span>
                            ))}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <button type="button" className="fib-exit-button" onClick={onExit}>
        Back to Units
      </button>
    </div>
  );
}
