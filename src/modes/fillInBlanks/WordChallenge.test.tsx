import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Word } from '../../types';
import type { CharSlot } from './blanking';
import { WordChallenge } from './WordChallenge';

const word: Word = { en: 'cat', pl: 'kot' };

// Blank the middle letter 'a'
const slots: CharSlot[] = [
  { char: 'c', isBlank: false, index: 0 },
  { char: 'a', isBlank: true, index: 1 },
  { char: 't', isBlank: false, index: 2 },
];

describe('WordChallenge', () => {
  it('hides the Polish translation initially', () => {
    render(
      <WordChallenge
        word={word}
        slots={slots}
        userInput={[]}
        onChange={() => {}}
      />,
    );
    expect(screen.queryByText('kot')).not.toBeInTheDocument();
    expect(screen.getByText('Show translation')).toBeInTheDocument();
  });

  it('reveals the Polish translation when hint button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <WordChallenge
        word={word}
        slots={slots}
        userInput={[]}
        onChange={() => {}}
      />,
    );

    await user.click(screen.getByText('Show translation'));
    expect(screen.getByText('kot')).toBeInTheDocument();
    expect(screen.queryByText('Show translation')).not.toBeInTheDocument();
  });

  it('renders revealed letters as text', () => {
    render(
      <WordChallenge
        word={word}
        slots={slots}
        userInput={[]}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('c')).toBeInTheDocument();
    expect(screen.getByText('t')).toBeInTheDocument();
  });

  it('renders an input for blank slots', () => {
    render(
      <WordChallenge
        word={word}
        slots={slots}
        userInput={[]}
        onChange={() => {}}
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Letter 2' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('maxLength', '1');
  });

  it('calls onChange when user types', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <WordChallenge
        word={word}
        slots={slots}
        userInput={[]}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Letter 2' });
    await user.click(input);
    await user.keyboard('a');

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall[1]).toBe('a');
  });

  it('disables inputs when submitted', () => {
    render(
      <WordChallenge
        word={word}
        slots={slots}
        userInput={[]}
        onChange={() => {}}
        submitted
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Letter 2' })).toBeDisabled();
  });

  it('auto-focuses the first blank on mount', () => {
    render(
      <WordChallenge
        word={word}
        slots={slots}
        userInput={[]}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Letter 2' })).toHaveFocus();
  });

  it('advances focus to next blank after typing', async () => {
    // Two blanks: index 0 and 2
    const twoBlankSlots: CharSlot[] = [
      { char: 'c', isBlank: true, index: 0 },
      { char: 'a', isBlank: false, index: 1 },
      { char: 't', isBlank: true, index: 2 },
    ];
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <WordChallenge
        word={word}
        slots={twoBlankSlots}
        userInput={[]}
        onChange={onChange}
      />,
    );

    const firstInput = screen.getByRole('textbox', { name: 'Letter 1' });
    const secondInput = screen.getByRole('textbox', { name: 'Letter 3' });

    await user.click(firstInput);
    await user.keyboard('c');

    expect(secondInput).toHaveFocus();
  });

  it('moves focus to previous blank on backspace when empty', async () => {
    const twoBlankSlots: CharSlot[] = [
      { char: 'c', isBlank: true, index: 0 },
      { char: 'a', isBlank: false, index: 1 },
      { char: 't', isBlank: true, index: 2 },
    ];
    const user = userEvent.setup();

    render(
      <WordChallenge
        word={word}
        slots={twoBlankSlots}
        userInput={[]}
        onChange={() => {}}
      />,
    );

    const firstInput = screen.getByRole('textbox', { name: 'Letter 1' });
    const secondInput = screen.getByRole('textbox', { name: 'Letter 3' });

    await user.click(secondInput);
    await user.keyboard('{Backspace}');

    expect(firstInput).toHaveFocus();
  });
});
