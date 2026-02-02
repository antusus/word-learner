import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders the unit selector on home screen', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Word Learner' })).toBeInTheDocument()
  })

  it('renders unit list', () => {
    render(<App />)
    expect(screen.getByText('Unit 1 - Animals')).toBeInTheDocument()
    expect(screen.getByText('Unit 2 - Colors')).toBeInTheDocument()
  })

  it('navigates to quiz when unit is selected (single mode)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Unit 1 - Animals'))

    // Should go directly to quiz since only 1 mode exists
    expect(screen.getByRole('heading', { level: 2, name: 'Unit 1 - Animals' })).toBeInTheDocument()
    expect(screen.getByText(/1 \//)).toBeInTheDocument()
  })

  it('navigates back to unit list from quiz', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Unit 1 - Animals'))
    await user.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Word Learner' })).toBeInTheDocument()
  })

  it('completes full quiz flow', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Select unit
    await user.click(screen.getByText('Unit 1 - Animals'))

    // Complete all cards
    const totalWords = 8 // Unit 1 has 8 words
    for (let i = 0; i < totalWords; i++) {
      const flashcard = screen.getByRole('button', { name: /click to reveal/i })
      await user.click(flashcard)
      const button = screen.getByRole('button', { name: i < totalWords - 1 ? /next/i : /finish/i })
      await user.click(button)
    }

    // Should show completion screen
    expect(screen.getByText('Well done!')).toBeInTheDocument()

    // Go back to units
    await user.click(screen.getByRole('button', { name: 'Back to Units' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Word Learner' })).toBeInTheDocument()
  })
})
