import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChallengeItem } from '../../types';
import type { CharSlot } from './blanking';
import { WordChallenge } from './WordChallenge';

const challenge: ChallengeItem = { prompt: 'kot', answer: 'cat' };

// Blank the middle letter 'a'
const slots: CharSlot[] = [
  { char: 'c', isBlank: false, index: 0 },
  { char: 'a', isBlank: true, index: 1 },
  { char: 't', isBlank: false, index: 2 },
];

describe('WordChallenge', () => {
  it('always shows the Polish translation', () => {
    render(
      <WordChallenge
        challenge={challenge}
        slots={slots}
        userInput={[]}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('kot')).toBeInTheDocument();
  });

  it('renders revealed letters as text', () => {
    render(
      <WordChallenge
        challenge={challenge}
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
        challenge={challenge}
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
        challenge={challenge}
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
        challenge={challenge}
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
        challenge={challenge}
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
        challenge={challenge}
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

  it('calls onSubmit when Enter is pressed', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <WordChallenge
        challenge={challenge}
        slots={slots}
        userInput={[]}
        onChange={() => {}}
        onSubmit={onSubmit}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Letter 2' });
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledOnce();
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
        challenge={challenge}
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

  it('renders one word group per word and no space slots', () => {
    const phrase = 'school time';
    const multiWordSlots: CharSlot[] = phrase.split('').map((char, index) => ({
      char,
      isBlank: false,
      index,
    }));

    const { container } = render(
      <WordChallenge
        challenge={{ prompt: 'czas szkolny', answer: phrase }}
        slots={multiWordSlots}
        userInput={[]}
        onChange={() => {}}
      />,
    );

    const groups = container.querySelectorAll('.fib-word-group');
    expect(groups).toHaveLength(2);
    expect(groups[0].children).toHaveLength(6);
    expect(groups[1].children).toHaveLength(4);
  });

  it('keeps absolute slot indices for blanks after a space', () => {
    const phrase = 'school time';
    const multiWordSlots: CharSlot[] = phrase.split('').map((char, index) => ({
      char,
      isBlank: index === 7,
      index,
    }));

    render(
      <WordChallenge
        challenge={{ prompt: 'czas szkolny', answer: phrase }}
        slots={multiWordSlots}
        userInput={[]}
        onChange={() => {}}
      />,
    );

    expect(screen.getByLabelText('Letter 8')).toBeInTheDocument();
  });
});
