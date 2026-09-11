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

  it('splits a multi-word answer into word groups without space tiles', () => {
    const results: WordResult[] = [
      {
        challenge: { prompt: 'czas szkolny', answer: 'school time' },
        userAnswer: ['s', 'c', 'h', 'o', 'o', 'l', ' ', 't', 'i', 'm', 'e'],
        correct: false,
      },
    ];
    const { container } = render(
      <ResultsSummary
        results={results}
        unitTitle="Unit 1"
        totalWords={1}
        onExit={() => {}}
      />,
    );

    // Two cards ("You typed" and "Correct"), each with 2 word groups
    const groups = container.querySelectorAll('.fib-error-word');
    expect(groups).toHaveLength(4);
    expect(groups[0].children).toHaveLength(6);
    expect(groups[1].children).toHaveLength(4);
    expect(groups[2].children).toHaveLength(6);
    expect(groups[3].children).toHaveLength(4);

    const tiles = container.querySelectorAll(
      '.fib-letter-correct, .fib-letter-wrong',
    );
    for (const tile of tiles) {
      expect(tile.textContent).not.toBe(' ');
    }
  });

  it('keeps absolute index alignment when a later word is wrong', () => {
    const userAnswer = ['s', 'c', 'h', 'o', 'o', 'l', ' ', 't', 'i', 'z', 'e'];
    const results: WordResult[] = [
      {
        challenge: { prompt: 'czas szkolny', answer: 'school time' },
        userAnswer,
        correct: false,
      },
    ];
    const { container } = render(
      <ResultsSummary
        results={results}
        unitTitle="Unit 1"
        totalWords={1}
        onExit={() => {}}
      />,
    );

    const typedGroups = container.querySelectorAll('.fib-error-word');
    const firstWord = Array.from(typedGroups[0].children);
    const secondWord = Array.from(typedGroups[1].children);

    for (const tile of firstWord) {
      expect(tile.className).toBe('fib-letter-correct');
    }
    const wrong = secondWord.filter((el) =>
      el.className.includes('fib-letter-wrong'),
    );
    expect(wrong).toHaveLength(1);
    expect(wrong[0].textContent).toBe('z');
  });

  it('renders exactly one word group for a single-word answer', () => {
    const results: WordResult[] = [
      {
        challenge: { prompt: 'pies', answer: 'dog' },
        userAnswer: ['d', 'a', 'g'],
        correct: false,
      },
    ];
    const { container } = render(
      <ResultsSummary
        results={results}
        unitTitle="Unit 1"
        totalWords={1}
        onExit={() => {}}
      />,
    );

    const typedCard = container.querySelectorAll('.fib-error-letters')[0];
    expect(typedCard.querySelectorAll('.fib-error-word')).toHaveLength(1);
  });

  it('exposes the full answer text with spaces via aria-label', () => {
    const results: WordResult[] = [
      {
        challenge: { prompt: 'czas szkolny', answer: 'school time' },
        userAnswer: ['s', 'c', 'h', 'o', 'o', 'l', ' ', 't', 'i', 'z', 'e'],
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

    expect(screen.getByLabelText('school tize')).toBeInTheDocument();
    expect(screen.getByLabelText('school time')).toBeInTheDocument();
  });

  it('marks unfilled blanks in the label instead of dropping them', () => {
    const results: WordResult[] = [
      {
        challenge: { prompt: 'czas szkolny', answer: 'school time' },
        userAnswer: ['s', '', 'h', 'o', 'o', 'l', ' ', 't', 'i', 'm', 'e'],
        correct: false,
      },
    ];
    const { container } = render(
      <ResultsSummary
        results={results}
        unitTitle="Unit 1"
        totalWords={1}
        onExit={() => {}}
      />,
    );

    expect(screen.getByLabelText('s_hool time')).toBeInTheDocument();

    const typedTiles = container
      .querySelectorAll('.fib-error-letters')[0]
      .querySelectorAll('.fib-letter-correct, .fib-letter-wrong');
    expect(typedTiles[1].className).toBe('fib-letter-wrong');
    expect(typedTiles[1].textContent).toBe('');
  });

  it('labels an entirely empty answer rather than rendering a nameless row', () => {
    const results: WordResult[] = [
      {
        challenge: { prompt: 'pies', answer: 'dog' },
        userAnswer: ['', '', ''],
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

    expect(screen.getByLabelText('___')).toBeInTheDocument();
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
