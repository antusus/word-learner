import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Unit, Word } from '../types';
import { Quiz } from './Quiz';

const mockUnit: Unit = {
  id: 'Unit1',
  title: 'Unit 1 - Animals',
  words: [
    { en: 'cat', pl: 'kot' },
    { en: 'dog', pl: 'pies' },
    { en: 'bird', pl: 'ptak' },
  ],
  groups: [
    {
      name: 'Animals',
      words: [
        { en: 'cat', pl: 'kot' },
        { en: 'dog', pl: 'pies' },
        { en: 'bird', pl: 'ptak' },
      ],
    },
  ],
};

const scenarios: {
  label: string;
  words: Word[] | undefined;
  expectedWords: Word[];
}[] = [
  {
    label: 'with unit words (no words prop)',
    words: undefined,
    expectedWords: mockUnit.words,
  },
  {
    label: 'with explicit words prop',
    words: [
      { en: 'red', pl: 'czerwony' },
      { en: 'blue', pl: 'niebieski' },
    ],
    expectedWords: [
      { en: 'red', pl: 'czerwony' },
      { en: 'blue', pl: 'niebieski' },
    ],
  },
];

describe('Quiz', () => {
  describe.each(scenarios)('$label', ({ words, expectedWords }) => {
    const totalWords = expectedWords.length;

    it('renders the unit title', () => {
      render(
        <Quiz
          unit={mockUnit}
          words={words}
          onComplete={() => {}}
          onExit={() => {}}
        />,
      );
      expect(
        screen.getByRole('heading', { level: 2, name: 'Unit 1 - Animals' }),
      ).toBeInTheDocument();
    });

    it('shows progress indicator', () => {
      render(
        <Quiz
          unit={mockUnit}
          words={words}
          onComplete={() => {}}
          onExit={() => {}}
        />,
      );
      expect(
        screen.getByText(new RegExp(`1 / ${totalWords}`)),
      ).toBeInTheDocument();
    });

    it('shows a flashcard with a Polish word', () => {
      render(
        <Quiz
          unit={mockUnit}
          words={words}
          onComplete={() => {}}
          onExit={() => {}}
        />,
      );
      const polishWords = expectedWords.map((w) => w.pl);
      const foundWord = polishWords.some((word) => screen.queryByText(word));
      expect(foundWord).toBe(true);
    });

    it('next button is disabled until card is flipped', () => {
      render(
        <Quiz
          unit={mockUnit}
          words={words}
          onComplete={() => {}}
          onExit={() => {}}
        />,
      );
      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();
    });

    it('next button is enabled after card is flipped', async () => {
      const user = userEvent.setup();
      render(
        <Quiz
          unit={mockUnit}
          words={words}
          onComplete={() => {}}
          onExit={() => {}}
        />,
      );

      const flashcard = screen.getByRole('button', {
        name: /click to reveal/i,
      });
      await user.click(flashcard);

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).not.toBeDisabled();
    });

    it('advances to next word when next is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Quiz
          unit={mockUnit}
          words={words}
          onComplete={() => {}}
          onExit={() => {}}
        />,
      );

      const flashcard = screen.getByRole('button', {
        name: /click to reveal/i,
      });
      await user.click(flashcard);

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      expect(
        screen.getByText(new RegExp(`2 / ${totalWords}`)),
      ).toBeInTheDocument();
    });

    it('calls onExit when back button is clicked', async () => {
      const user = userEvent.setup();
      const onExit = vi.fn();
      render(
        <Quiz
          unit={mockUnit}
          words={words}
          onComplete={() => {}}
          onExit={onExit}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Back' }));
      expect(onExit).toHaveBeenCalledTimes(1);
    });

    it('shows completion screen and calls onComplete when finished', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(
        <Quiz
          unit={mockUnit}
          words={words}
          onComplete={onComplete}
          onExit={() => {}}
        />,
      );

      for (let i = 0; i < totalWords; i++) {
        const flashcard = screen.getByRole('button', {
          name: /click to reveal/i,
        });
        await user.click(flashcard);
        const button = screen.getByRole('button', {
          name: i < totalWords - 1 ? /next/i : /finish/i,
        });
        await user.click(button);
      }

      expect(screen.getByText('Well done!')).toBeInTheDocument();
      expect(
        screen.getByText(/You've completed Unit 1 - Animals/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`${totalWords} words`)),
      ).toBeInTheDocument();
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('returns to unit list from completion screen', async () => {
      const user = userEvent.setup();
      const onExit = vi.fn();
      render(
        <Quiz
          unit={mockUnit}
          words={words}
          onComplete={() => {}}
          onExit={onExit}
        />,
      );

      for (let i = 0; i < totalWords; i++) {
        const flashcard = screen.getByRole('button', {
          name: /click to reveal/i,
        });
        await user.click(flashcard);
        const button = screen.getByRole('button', {
          name: i < totalWords - 1 ? /next/i : /finish/i,
        });
        await user.click(button);
      }

      await user.click(screen.getByRole('button', { name: 'Back to Units' }));
      expect(onExit).toHaveBeenCalledTimes(1);
    });
  });
});
