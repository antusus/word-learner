import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UnitSelector } from './UnitSelector'
import type { Unit } from '../types'

const mockUnits: Unit[] = [
  {
    id: 'Unit1',
    title: 'Unit 1 - Animals',
    words: [
      { en: 'cat', pl: 'kot' },
      { en: 'dog', pl: 'pies' },
    ],
  },
  {
    id: 'Unit2',
    title: 'Unit 2 - Colors',
    words: [
      { en: 'red', pl: 'czerwony' },
      { en: 'blue', pl: 'niebieski' },
      { en: 'green', pl: 'zielony' },
    ],
  },
]

describe('UnitSelector', () => {
  it('renders the heading', () => {
    render(<UnitSelector units={mockUnits} onSelect={() => {}} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Word Learner' })).toBeInTheDocument()
  })

  it('renders all units', () => {
    render(<UnitSelector units={mockUnits} onSelect={() => {}} />)
    expect(screen.getByText('Unit 1 - Animals')).toBeInTheDocument()
    expect(screen.getByText('Unit 2 - Colors')).toBeInTheDocument()
  })

  it('shows word count for each unit', () => {
    render(<UnitSelector units={mockUnits} onSelect={() => {}} />)
    expect(screen.getByText('2 words')).toBeInTheDocument()
    expect(screen.getByText('3 words')).toBeInTheDocument()
  })

  it('calls onSelect with the unit when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<UnitSelector units={mockUnits} onSelect={onSelect} />)

    await user.click(screen.getByText('Unit 1 - Animals'))
    expect(onSelect).toHaveBeenCalledWith(mockUnits[0])
  })

  it('renders empty list when no units provided', () => {
    render(<UnitSelector units={[]} onSelect={() => {}} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows checkmark for completed units', () => {
    render(<UnitSelector units={mockUnits} completedUnits={['Unit1']} onSelect={() => {}} />)
    expect(screen.getByLabelText('completed')).toBeInTheDocument()
  })

  it('applies completed class to completed units', () => {
    const { container } = render(
      <UnitSelector units={mockUnits} completedUnits={['Unit1']} onSelect={() => {}} />
    )
    const completedButtons = container.querySelectorAll('.unit-button.completed')
    expect(completedButtons).toHaveLength(1)
  })

  it('does not show checkmark for non-completed units', () => {
    render(<UnitSelector units={mockUnits} completedUnits={[]} onSelect={() => {}} />)
    expect(screen.queryByLabelText('completed')).not.toBeInTheDocument()
  })
})
