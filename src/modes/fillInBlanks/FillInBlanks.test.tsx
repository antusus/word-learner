import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Unit } from '../../types';
import { FillInBlanks } from './FillInBlanks';

const unit: Unit = {
  id: 'test',
  title: 'Test Unit',
  words: [
    { en: 'cat', pl: 'kot' },
    { en: 'dog', pl: 'pies' },
  ],
  groups: [
    {
      name: 'Animals',
      words: [
        { en: 'cat', pl: 'kot' },
        { en: 'dog', pl: 'pies' },
      ],
    },
  ],
};

describe('FillInBlanks', () => {
  it('renders difficulty picker initially', () => {
    render(
      <FillInBlanks unit={unit} onComplete={() => {}} onExit={() => {}} />,
    );
    expect(
      screen.getByRole('heading', { name: 'Choose difficulty' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('transitions to playing phase after selecting difficulty', async () => {
    const user = userEvent.setup();
    render(
      <FillInBlanks unit={unit} onComplete={() => {}} onExit={() => {}} />,
    );

    await user.click(screen.getByText('Easy'));

    expect(screen.getByText('Test Unit')).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument();
  });

  it('shows progress and next button during play', async () => {
    const user = userEvent.setup();
    render(
      <FillInBlanks unit={unit} onComplete={() => {}} onExit={() => {}} />,
    );

    await user.click(screen.getByText('Easy'));

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('next button is always enabled (user can skip)', async () => {
    const user = userEvent.setup();
    render(
      <FillInBlanks unit={unit} onComplete={() => {}} onExit={() => {}} />,
    );

    await user.click(screen.getByText('Easy'));

    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  it('advances to next word when next is clicked', async () => {
    const user = userEvent.setup();
    render(
      <FillInBlanks unit={unit} onComplete={() => {}} onExit={() => {}} />,
    );

    await user.click(screen.getByText('Easy'));
    expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText(/2 \/ 2/)).toBeInTheDocument();
  });

  it('shows results after finishing all words', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(
      <FillInBlanks unit={unit} onComplete={onComplete} onExit={() => {}} />,
    );

    await user.click(screen.getByText('Easy'));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Finish' }));

    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalled();
  });

  it('calls onExit from difficulty picker back button', async () => {
    const onExit = vi.fn();
    const user = userEvent.setup();
    render(<FillInBlanks unit={unit} onComplete={() => {}} onExit={onExit} />);

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(onExit).toHaveBeenCalled();
  });

  it('calls onExit from results back button', async () => {
    const onExit = vi.fn();
    const user = userEvent.setup();
    render(<FillInBlanks unit={unit} onComplete={() => {}} onExit={onExit} />);

    await user.click(screen.getByText('Easy'));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Finish' }));
    await user.click(screen.getByRole('button', { name: 'Back to Units' }));

    expect(onExit).toHaveBeenCalled();
  });

  it('uses words prop when provided', async () => {
    const user = userEvent.setup();
    const subset = [{ en: 'cat', pl: 'kot' }];
    render(
      <FillInBlanks
        unit={unit}
        words={subset}
        onComplete={() => {}}
        onExit={() => {}}
      />,
    );

    await user.click(screen.getByText('Easy'));

    expect(screen.getByText(/1 \/ 1/)).toBeInTheDocument();
  });
});
