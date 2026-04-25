import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChallengeItem } from '../types';
import { Flashcard } from './Flashcard';

const mockChallenge: ChallengeItem = {
  prompt: 'kot',
  answer: 'cat',
};

describe('Flashcard', () => {
  it('renders prompt when not flipped', () => {
    render(
      <Flashcard
        challenge={mockChallenge}
        isFlipped={false}
        onFlip={() => {}}
      />,
    );
    expect(screen.getByText('kot')).toBeInTheDocument();
  });

  it('renders answer (visible when flipped)', () => {
    render(
      <Flashcard
        challenge={mockChallenge}
        isFlipped={true}
        onFlip={() => {}}
      />,
    );
    expect(screen.getByText('cat')).toBeInTheDocument();
  });

  it('calls onFlip when clicked', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    render(
      <Flashcard challenge={mockChallenge} isFlipped={false} onFlip={onFlip} />,
    );

    await user.click(screen.getByRole('button'));
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  it('calls onFlip when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    render(
      <Flashcard challenge={mockChallenge} isFlipped={false} onFlip={onFlip} />,
    );

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  it('calls onFlip when Space key is pressed', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    render(
      <Flashcard challenge={mockChallenge} isFlipped={false} onFlip={onFlip} />,
    );

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard(' ');
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  it('applies flipped class when isFlipped is true', () => {
    const { container } = render(
      <Flashcard
        challenge={mockChallenge}
        isFlipped={true}
        onFlip={() => {}}
      />,
    );
    expect(container.querySelector('.flashcard.flipped')).toBeInTheDocument();
  });

  it('does not have flipped class when isFlipped is false', () => {
    const { container } = render(
      <Flashcard
        challenge={mockChallenge}
        isFlipped={false}
        onFlip={() => {}}
      />,
    );
    expect(
      container.querySelector('.flashcard.flipped'),
    ).not.toBeInTheDocument();
  });
});
