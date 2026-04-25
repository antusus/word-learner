import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { WordResult } from './ResultsSummary';
import { ResultsSummary } from './ResultsSummary';

describe('ResultsSummary', () => {
  it('shows success message when all correct', () => {
    const results: WordResult[] = [
      {
        challenge: { prompt: 'kot', answer: 'cat' },
        userAnswer: ['c', 'a', 't'],
        correct: true,
      },
    ];
    render(
      <ResultsSummary
        results={results}
        unitTitle="Unit 1"
        totalWords={1}
        onExit={() => {}}
      />,
    );
    expect(screen.getByText('Well done!')).toBeInTheDocument();
    expect(screen.getByText(/All 1 word correct/)).toBeInTheDocument();
  });

  it('shows score and error list when there are mistakes', () => {
    const results: WordResult[] = [
      {
        challenge: { prompt: 'kot', answer: 'cat' },
        userAnswer: ['c', 'a', 't'],
        correct: true,
      },
      {
        challenge: { prompt: 'pies', answer: 'dog' },
        userAnswer: ['d', 'a', 'g'],
        correct: false,
      },
    ];
    render(
      <ResultsSummary
        results={results}
        unitTitle="Unit 1"
        totalWords={2}
        onExit={() => {}}
      />,
    );
    expect(screen.getByText('1 / 2 correct')).toBeInTheDocument();
    expect(screen.getByText('pies')).toBeInTheDocument();
  });

  it('highlights correct letters in green and wrong in red', () => {
    const results: WordResult[] = [
      {
        challenge: { prompt: 'x', answer: 'ab' },
        userAnswer: ['a', 'z'],
        correct: false,
      },
    ];
    render(
      <ResultsSummary
        results={results}
        unitTitle="Unit 1"
        totalWords={1}
        onExit={() => {}}
      />,
    );
    const letters = screen.getAllByText(/^[a-z ]$/);
    const wrongLetter = letters.find(
      (el) =>
        el.textContent === 'z' && el.className.includes('fib-letter-wrong'),
    );
    const correctLetter = letters.find(
      (el) =>
        el.textContent === 'b' && el.className.includes('fib-letter-correct'),
    );
    expect(wrongLetter).toBeDefined();
    expect(correctLetter).toBeDefined();
  });

  it("shows 'You typed' and 'Correct' labels for wrong entries", () => {
    const results: WordResult[] = [
      {
        challenge: { prompt: 'x', answer: 'ab' },
        userAnswer: ['a', 'z'],
        correct: false,
      },
    ];
    render(
      <ResultsSummary
        results={results}
        unitTitle="Unit 1"
        totalWords={1}
        onExit={() => {}}
      />,
    );
    expect(screen.getByText('You typed')).toBeInTheDocument();
    expect(screen.getByText('Correct')).toBeInTheDocument();
  });

  it('calls onExit when back button is clicked', async () => {
    const onExit = vi.fn();
    const user = userEvent.setup();
    render(
      <ResultsSummary
        results={[]}
        unitTitle="Unit 1"
        totalWords={0}
        onExit={onExit}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Back to Units' }));
    expect(onExit).toHaveBeenCalled();
  });

  it('pluralizes word count correctly', () => {
    const results: WordResult[] = [
      {
        challenge: { prompt: 'kot', answer: 'cat' },
        userAnswer: ['c', 'a', 't'],
        correct: true,
      },
      {
        challenge: { prompt: 'pies', answer: 'dog' },
        userAnswer: ['d', 'o', 'g'],
        correct: true,
      },
    ];
    render(
      <ResultsSummary
        results={results}
        unitTitle="Unit 1"
        totalWords={2}
        onExit={() => {}}
      />,
    );
    expect(screen.getByText(/All 2 words correct/)).toBeInTheDocument();
  });
});
