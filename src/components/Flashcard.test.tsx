import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Word } from '../types';
import { Flashcard } from './Flashcard';

const mockWord: Word = {
  en: 'cat',
  pl: 'kot',
};

describe('Flashcard', () => {
  it('renders Polish word when not flipped', () => {
    render(<Flashcard word={mockWord} isFlipped={false} onFlip={() => {}} />);
    expect(screen.getByText('kot')).toBeInTheDocument();
  });

  it('renders English word (visible when flipped)', () => {
    render(<Flashcard word={mockWord} isFlipped={true} onFlip={() => {}} />);
    expect(screen.getByText('cat')).toBeInTheDocument();
  });

  it('calls onFlip when clicked', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    render(<Flashcard word={mockWord} isFlipped={false} onFlip={onFlip} />);

    await user.click(screen.getByRole('button'));
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  it('calls onFlip when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    render(<Flashcard word={mockWord} isFlipped={false} onFlip={onFlip} />);

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  it('calls onFlip when Space key is pressed', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    render(<Flashcard word={mockWord} isFlipped={false} onFlip={onFlip} />);

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard(' ');
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  it('applies flipped class when isFlipped is true', () => {
    const { container } = render(
      <Flashcard word={mockWord} isFlipped={true} onFlip={() => {}} />,
    );
    expect(container.querySelector('.flashcard.flipped')).toBeInTheDocument();
  });

  it('does not have flipped class when isFlipped is false', () => {
    const { container } = render(
      <Flashcard word={mockWord} isFlipped={false} onFlip={() => {}} />,
    );
    expect(
      container.querySelector('.flashcard.flipped'),
    ).not.toBeInTheDocument();
  });
});
