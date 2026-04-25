import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { StandaloneUnit, Unit, UnitBundle, UnitEntry } from '../types';
import { UnitSelector } from './UnitSelector';

const animalUnit: Unit = {
  id: 'Unit1',
  title: 'Unit 1 - Animals',
  type: 'vocabulary',
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
  challenges: [
    { prompt: 'kot', answer: 'cat' },
    { prompt: 'pies', answer: 'dog' },
  ],
  challengeGroups: [
    {
      name: 'Animals',
      items: [
        { prompt: 'kot', answer: 'cat' },
        { prompt: 'pies', answer: 'dog' },
      ],
    },
  ],
};

const colorUnit: Unit = {
  id: 'Unit2',
  title: 'Unit 2 - Colors',
  type: 'vocabulary',
  words: [
    { en: 'red', pl: 'czerwony' },
    { en: 'blue', pl: 'niebieski' },
    { en: 'green', pl: 'zielony' },
  ],
  groups: [
    {
      name: 'Colors',
      words: [
        { en: 'red', pl: 'czerwony' },
        { en: 'blue', pl: 'niebieski' },
        { en: 'green', pl: 'zielony' },
      ],
    },
  ],
  challenges: [
    { prompt: 'czerwony', answer: 'red' },
    { prompt: 'niebieski', answer: 'blue' },
    { prompt: 'zielony', answer: 'green' },
  ],
  challengeGroups: [
    {
      name: 'Colors',
      items: [
        { prompt: 'czerwony', answer: 'red' },
        { prompt: 'niebieski', answer: 'blue' },
        { prompt: 'zielony', answer: 'green' },
      ],
    },
  ],
};

const standaloneAnimal: StandaloneUnit = {
  kind: 'standalone',
  unit: animalUnit,
};
const standaloneColor: StandaloneUnit = { kind: 'standalone', unit: colorUnit };

const mockBundle: UnitBundle = {
  kind: 'bundle',
  id: 'unit-7',
  title: 'Unit 7',
  subUnits: [animalUnit, colorUnit],
  totalChallenges: 5,
};

const mockEntries: UnitEntry[] = [
  standaloneAnimal,
  standaloneColor,
  mockBundle,
];

describe('UnitSelector', () => {
  it('renders the heading', () => {
    render(<UnitSelector entries={mockEntries} onSelect={() => {}} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Word Learner' }),
    ).toBeInTheDocument();
  });

  it('renders all entries', () => {
    render(<UnitSelector entries={mockEntries} onSelect={() => {}} />);
    expect(screen.getByText('Unit 1 - Animals')).toBeInTheDocument();
    expect(screen.getByText('Unit 2 - Colors')).toBeInTheDocument();
    expect(screen.getByText('Unit 7')).toBeInTheDocument();
  });

  it('shows word count for standalone units', () => {
    render(<UnitSelector entries={mockEntries} onSelect={() => {}} />);
    expect(screen.getByText('2 words')).toBeInTheDocument();
    expect(screen.getByText('3 words')).toBeInTheDocument();
  });

  it('shows section count for bundles', () => {
    render(<UnitSelector entries={mockEntries} onSelect={() => {}} />);
    expect(screen.getByText('2 sections')).toBeInTheDocument();
  });

  it('calls onSelect with the standalone entry when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<UnitSelector entries={mockEntries} onSelect={onSelect} />);

    await user.click(screen.getByText('Unit 1 - Animals'));
    expect(onSelect).toHaveBeenCalledWith(standaloneAnimal);
  });

  it('calls onSelect with the bundle entry when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<UnitSelector entries={mockEntries} onSelect={onSelect} />);

    await user.click(screen.getByText('Unit 7'));
    expect(onSelect).toHaveBeenCalledWith(mockBundle);
  });

  it('renders empty list when no entries provided', () => {
    render(<UnitSelector entries={[]} onSelect={() => {}} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
