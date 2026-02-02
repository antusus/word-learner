import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { GameMode } from '../modes';
import { ModeSelector } from './ModeSelector';

const MockComponent = () => <div>Mock</div>;

const mockModes: GameMode[] = [
  {
    id: 'flashcard',
    name: 'Flip Cards',
    description: 'Show Polish, reveal English',
    component: MockComponent,
  },
  {
    id: 'fillblank',
    name: 'Fill in Blanks',
    description: 'Type the translation',
    component: MockComponent,
  },
];

describe('ModeSelector', () => {
  it('renders the heading', () => {
    render(
      <ModeSelector modes={mockModes} onSelect={() => {}} onBack={() => {}} />,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Choose a mode' }),
    ).toBeInTheDocument();
  });

  it('renders all modes', () => {
    render(
      <ModeSelector modes={mockModes} onSelect={() => {}} onBack={() => {}} />,
    );
    expect(screen.getByText('Flip Cards')).toBeInTheDocument();
    expect(screen.getByText('Fill in Blanks')).toBeInTheDocument();
  });

  it('shows description for each mode', () => {
    render(
      <ModeSelector modes={mockModes} onSelect={() => {}} onBack={() => {}} />,
    );
    expect(screen.getByText('Show Polish, reveal English')).toBeInTheDocument();
    expect(screen.getByText('Type the translation')).toBeInTheDocument();
  });

  it('calls onSelect with the mode when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ModeSelector modes={mockModes} onSelect={onSelect} onBack={() => {}} />,
    );

    await user.click(screen.getByText('Flip Cards'));
    expect(onSelect).toHaveBeenCalledWith(mockModes[0]);
  });

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(
      <ModeSelector modes={mockModes} onSelect={() => {}} onBack={onBack} />,
    );

    await user.click(screen.getByText('Back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
