import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Unit, UnitBundle } from '../types';
import { SubUnitSelector } from './SubUnitSelector';

const vocabUnit: Unit = {
  id: 'unit1',
  title: 'Food & Drinks',
  type: 'vocabulary',
  words: [
    { en: 'apple', pl: 'jabłko' },
    { en: 'water', pl: 'woda' },
  ],
  groups: [
    {
      name: 'Food',
      words: [
        { en: 'apple', pl: 'jabłko' },
        { en: 'water', pl: 'woda' },
      ],
    },
  ],
  challenges: [
    { prompt: 'jabłko', answer: 'apple' },
    { prompt: 'woda', answer: 'water' },
  ],
  challengeGroups: [
    {
      name: 'Food',
      items: [
        { prompt: 'jabłko', answer: 'apple' },
        { prompt: 'woda', answer: 'water' },
      ],
    },
  ],
};

const verbUnit: Unit = {
  id: 'unit2',
  title: 'Common Verbs',
  type: 'irregular-verbs',
  words: [
    { en: 'go', pl: 'went' },
    { en: 'see', pl: 'saw' },
    { en: 'be', pl: 'was' },
  ],
  groups: [
    {
      name: 'Verbs',
      words: [
        { en: 'go', pl: 'went' },
        { en: 'see', pl: 'saw' },
        { en: 'be', pl: 'was' },
      ],
    },
  ],
  challenges: [
    { prompt: 'go', answer: 'went' },
    { prompt: 'see', answer: 'saw' },
    { prompt: 'be', answer: 'was' },
  ],
  challengeGroups: [
    {
      name: 'Verbs',
      items: [
        { prompt: 'go', answer: 'went' },
        { prompt: 'see', answer: 'saw' },
        { prompt: 'be', answer: 'was' },
      ],
    },
  ],
};

const mockBundle: UnitBundle = {
  kind: 'bundle',
  id: 'bundle1',
  title: 'Unit 5 - Mixed Practice',
  subUnits: [vocabUnit, verbUnit],
  totalChallenges: 5,
};

describe('SubUnitSelector', () => {
  it('renders the bundle title as heading', () => {
    render(
      <SubUnitSelector
        bundle={mockBundle}
        onSelect={() => {}}
        onBack={() => {}}
      />,
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Unit 5 - Mixed Practice',
      }),
    ).toBeInTheDocument();
  });

  it('renders instruction text', () => {
    render(
      <SubUnitSelector
        bundle={mockBundle}
        onSelect={() => {}}
        onBack={() => {}}
      />,
    );

    expect(
      screen.getByText('Select a section to practice:'),
    ).toBeInTheDocument();
  });

  it('renders all sub-unit titles', () => {
    render(
      <SubUnitSelector
        bundle={mockBundle}
        onSelect={() => {}}
        onBack={() => {}}
      />,
    );

    expect(screen.getByText('Food & Drinks')).toBeInTheDocument();
    expect(screen.getByText('Common Verbs')).toBeInTheDocument();
  });

  it('shows "words" for vocabulary and "verbs" for irregular-verbs', () => {
    render(
      <SubUnitSelector
        bundle={mockBundle}
        onSelect={() => {}}
        onBack={() => {}}
      />,
    );

    expect(screen.getByText('2 words')).toBeInTheDocument();
    expect(screen.getByText('3 verbs')).toBeInTheDocument();
  });

  it('calls onSelect with the correct unit when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SubUnitSelector
        bundle={mockBundle}
        onSelect={onSelect}
        onBack={() => {}}
      />,
    );

    await user.click(screen.getByText('Food & Drinks'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(vocabUnit);
  });

  it('calls onBack when Back button is clicked', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(
      <SubUnitSelector
        bundle={mockBundle}
        onSelect={() => {}}
        onBack={onBack}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
