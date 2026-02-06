import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import type { Unit } from './types';

vi.mock('./data/loader', () => ({
  loadUnits: (): Unit[] => [
    {
      id: 'Unit1',
      title: 'Unit 1 - Test Unit',
      words: [
        { en: 'cat', pl: 'kot' },
        { en: 'dog', pl: 'pies' },
        { en: 'red', pl: 'czerwony' },
      ],
      groups: [
        {
          name: 'Animals',
          words: [
            { en: 'cat', pl: 'kot' },
            { en: 'dog', pl: 'pies' },
          ],
        },
        {
          name: 'Colors',
          words: [{ en: 'red', pl: 'czerwony' }],
        },
      ],
    },
  ],
}));

describe('App', () => {
  it('renders the unit selector on home screen', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Word Learner' }),
    ).toBeInTheDocument();
  });

  it('renders unit list', () => {
    render(<App />);
    expect(screen.getByText('Unit 1 - Test Unit')).toBeInTheDocument();
  });

  it('navigates to quiz when unit and group is selected', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Unit 1 - Test Unit'));
    await user.click(
      screen.getByRole('checkbox', { name: /^Animals2 words$/ }),
    );
    await user.click(screen.getByRole('button', { name: 'Start' }));

    // Select game mode
    await user.click(screen.getByText('Flip Cards'));

    expect(
      screen.getByRole('heading', { level: 2, name: 'Unit 1 - Test Unit' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/1 \//)).toBeInTheDocument();
  });

  it('navigates back to unit list from group selector', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Unit 1 - Test Unit'));
    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Word Learner' }),
    ).toBeInTheDocument();
  });

  it('completes full quiz flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Select unit and group
    await user.click(screen.getByText('Unit 1 - Test Unit'));
    await user.click(screen.getByRole('checkbox', { name: /^Colors1 word$/ }));
    await user.click(screen.getByRole('button', { name: 'Start' }));

    // Select game mode
    await user.click(screen.getByText('Flip Cards'));

    // Complete all cards
    const totalWords = 1;
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

    // Should show completion screen
    expect(screen.getByText('Well done!')).toBeInTheDocument();

    // Go back to units
    await user.click(screen.getByRole('button', { name: 'Back to Units' }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'Word Learner' }),
    ).toBeInTheDocument();
  });

  it('shows group selector for multi-group units', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Unit 1 - Test Unit'));

    // Should show group selector
    expect(screen.getByText('Select groups to practice:')).toBeInTheDocument();
    expect(screen.getByText('Animals')).toBeInTheDocument();
    expect(screen.getByText('Colors')).toBeInTheDocument();
  });

  it('navigates from group selector to quiz with selected words', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Unit 1 - Test Unit'));

    // Select one group and start
    await user.click(
      screen.getByRole('checkbox', { name: /^Animals2 words$/ }),
    );
    await user.click(screen.getByRole('button', { name: 'Start' }));

    // Select game mode
    await user.click(screen.getByText('Flip Cards'));

    // Should be in quiz with the selected group's words
    expect(
      screen.getByRole('heading', { level: 2, name: 'Unit 1 - Test Unit' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument();
  });

  it('navigates back from group selector to unit list', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Unit 1 - Test Unit'));
    expect(screen.getByText('Select groups to practice:')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Word Learner' }),
    ).toBeInTheDocument();
  });
});
