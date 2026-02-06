import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DifficultyLevel } from '../../types';
import { DifficultyPicker } from './DifficultyPicker';

const difficulties: DifficultyLevel[] = [
  { id: 'easy', name: 'Easy', description: '20% hidden', blankPercentage: 0.2 },
  {
    id: 'hard',
    name: 'Hard',
    description: '75% hidden',
    blankPercentage: 0.75,
  },
];

describe('DifficultyPicker', () => {
  it('renders heading', () => {
    render(
      <DifficultyPicker difficulties={difficulties} onSelect={() => {}} />,
    );
    expect(
      screen.getByRole('heading', { name: 'Choose difficulty' }),
    ).toBeInTheDocument();
  });

  it('renders a button for each difficulty', () => {
    render(
      <DifficultyPicker difficulties={difficulties} onSelect={() => {}} />,
    );
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('shows descriptions', () => {
    render(
      <DifficultyPicker difficulties={difficulties} onSelect={() => {}} />,
    );
    expect(screen.getByText('20% hidden')).toBeInTheDocument();
    expect(screen.getByText('75% hidden')).toBeInTheDocument();
  });

  it('calls onSelect with the chosen difficulty', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <DifficultyPicker difficulties={difficulties} onSelect={onSelect} />,
    );

    await user.click(screen.getByText('Hard'));
    expect(onSelect).toHaveBeenCalledWith(difficulties[1]);
  });
});
