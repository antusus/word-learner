import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChallengeGroup } from '../types';
import { GroupSelector } from './GroupSelector';

const mockGroups: ChallengeGroup[] = [
  {
    name: 'Animals',
    items: [
      { prompt: 'kot', answer: 'cat' },
      { prompt: 'pies', answer: 'dog' },
    ],
  },
  {
    name: 'Colors',
    items: [
      { prompt: 'czerwony', answer: 'red' },
      { prompt: 'niebieski', answer: 'blue' },
      { prompt: 'zielony', answer: 'green' },
    ],
  },
  {
    name: 'Shapes',
    items: [{ prompt: 'koło', answer: 'circle' }],
  },
];

describe('GroupSelector', () => {
  it('renders all group names with word counts', () => {
    render(
      <GroupSelector
        unitTitle="Unit 5"
        unitType="vocabulary"
        groups={mockGroups}
        onStart={() => {}}
        onBack={() => {}}
      />,
    );

    expect(screen.getByText('Animals')).toBeInTheDocument();
    expect(screen.getByText('2 words')).toBeInTheDocument();

    expect(screen.getByText('Colors')).toBeInTheDocument();
    expect(screen.getByText('3 words')).toBeInTheDocument();

    expect(screen.getByText('Shapes')).toBeInTheDocument();
    expect(screen.getByText('1 word')).toBeInTheDocument();
  });

  it('has no groups selected initially and Start button is disabled', () => {
    render(
      <GroupSelector
        unitTitle="Unit 5"
        unitType="vocabulary"
        groups={mockGroups}
        onStart={() => {}}
        onBack={() => {}}
      />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    for (const checkbox of checkboxes) {
      expect(checkbox).not.toBeChecked();
    }

    expect(screen.getByRole('button', { name: 'Start' })).toBeDisabled();
  });

  it('selecting a group enables the Start button', async () => {
    const user = userEvent.setup();
    render(
      <GroupSelector
        unitTitle="Unit 5"
        unitType="vocabulary"
        groups={mockGroups}
        onStart={() => {}}
        onBack={() => {}}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: /Animals/ }));
    expect(screen.getByRole('button', { name: 'Start' })).not.toBeDisabled();
  });

  it('selecting multiple groups works', async () => {
    const user = userEvent.setup();
    render(
      <GroupSelector
        unitTitle="Unit 5"
        unitType="vocabulary"
        groups={mockGroups}
        onStart={() => {}}
        onBack={() => {}}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: /Animals/ }));
    await user.click(screen.getByRole('checkbox', { name: /Colors/ }));

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it('clicking Start calls onStart with the selected groups items', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(
      <GroupSelector
        unitTitle="Unit 5"
        unitType="vocabulary"
        groups={mockGroups}
        onStart={onStart}
        onBack={() => {}}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: /Animals/ }));
    await user.click(screen.getByRole('checkbox', { name: /Shapes/ }));
    await user.click(screen.getByRole('button', { name: 'Start' }));

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStart).toHaveBeenCalledWith([
      { prompt: 'kot', answer: 'cat' },
      { prompt: 'pies', answer: 'dog' },
      { prompt: 'koło', answer: 'circle' },
    ]);
  });

  it('clicking Back calls onBack', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(
      <GroupSelector
        unitTitle="Unit 5"
        unitType="vocabulary"
        groups={mockGroups}
        onStart={() => {}}
        onBack={onBack}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('shows "verbs" instead of "words" for irregular-verbs unit type', () => {
    const verbGroups: ChallengeGroup[] = [
      {
        name: 'Common verbs',
        items: [
          { prompt: 'go', answer: 'went' },
          { prompt: 'see', answer: 'saw' },
        ],
      },
      {
        name: 'Single verb',
        items: [{ prompt: 'be', answer: 'was' }],
      },
    ];
    render(
      <GroupSelector
        unitTitle="Irregular Verbs 1"
        unitType="irregular-verbs"
        groups={verbGroups}
        onStart={() => {}}
        onBack={() => {}}
      />,
    );

    expect(screen.getByText('2 verbs')).toBeInTheDocument();
    expect(screen.getByText('1 verb')).toBeInTheDocument();
  });
});
