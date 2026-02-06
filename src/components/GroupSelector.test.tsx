import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { WordGroup } from '../types';
import { GroupSelector } from './GroupSelector';

const mockGroups: WordGroup[] = [
  {
    name: 'Animals',
    words: [
      { en: 'cat', pl: 'kot' },
      { en: 'dog', pl: 'pies' },
    ],
  },
  {
    name: 'Colors',
    words: [
      { en: 'red', pl: 'czerwony' },
      { en: 'blue', pl: 'niebieski' },
      { en: 'green', pl: 'zielony' },
    ],
  },
  {
    name: 'Shapes',
    words: [{ en: 'circle', pl: 'koło' }],
  },
];

describe('GroupSelector', () => {
  it('renders all group names with word counts', () => {
    render(
      <GroupSelector
        unitTitle="Unit 5"
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

  it('clicking Start calls onStart with the selected groups words', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(
      <GroupSelector
        unitTitle="Unit 5"
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
      { en: 'cat', pl: 'kot' },
      { en: 'dog', pl: 'pies' },
      { en: 'circle', pl: 'koło' },
    ]);
  });

  it('clicking Back calls onBack', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(
      <GroupSelector
        unitTitle="Unit 5"
        groups={mockGroups}
        onStart={() => {}}
        onBack={onBack}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
