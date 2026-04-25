import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { StandaloneUnit, UnitBundle, UnitEntry } from '../types';
import { UnitSelector } from './UnitSelector';

const standalone1: StandaloneUnit = {
  kind: 'standalone',
  unit: {
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
  },
};

const bundle1: UnitBundle = {
  kind: 'bundle',
  id: 'unit-3',
  title: 'Unit 3',
  totalChallenges: 5,
  subUnits: [
    {
      id: 'Unit3',
      title: 'Vocabulary',
      type: 'vocabulary',
      words: [],
      groups: [],
      challenges: [
        { prompt: 'a', answer: 'b' },
        { prompt: 'c', answer: 'd' },
      ],
      challengeGroups: [],
    },
    {
      id: 'IrregularVerbs',
      title: 'Irregular Verbs',
      type: 'irregular-verbs',
      words: [],
      groups: [],
      challenges: [
        { prompt: 'go', answer: 'went' },
        { prompt: 'see', answer: 'saw' },
        { prompt: 'do', answer: 'did' },
      ],
      challengeGroups: [],
    },
  ],
};

const mockEntries: UnitEntry[] = [standalone1, bundle1];

describe('UnitSelector', () => {
  it('renders the heading', () => {
    render(<UnitSelector entries={mockEntries} onSelect={() => {}} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Word Learner' }),
    ).toBeInTheDocument();
  });

  it('renders standalone units', () => {
    render(<UnitSelector entries={mockEntries} onSelect={() => {}} />);
    expect(screen.getByText('Unit 1 - Animals')).toBeInTheDocument();
    expect(screen.getByText('2 words')).toBeInTheDocument();
  });

  it('renders bundles with section count', () => {
    render(<UnitSelector entries={mockEntries} onSelect={() => {}} />);
    expect(screen.getByText('Unit 3')).toBeInTheDocument();
    expect(screen.getByText('2 sections')).toBeInTheDocument();
  });

  it('calls onSelect with standalone entry when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<UnitSelector entries={mockEntries} onSelect={onSelect} />);

    await user.click(screen.getByText('Unit 1 - Animals'));
    expect(onSelect).toHaveBeenCalledWith(standalone1);
  });

  it('calls onSelect with bundle entry when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<UnitSelector entries={mockEntries} onSelect={onSelect} />);

    await user.click(screen.getByText('Unit 3'));
    expect(onSelect).toHaveBeenCalledWith(bundle1);
  });

  it('renders empty list when no entries provided', () => {
    render(<UnitSelector entries={[]} onSelect={() => {}} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
