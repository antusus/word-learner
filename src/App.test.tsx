import { render, screen } from '@testing-library/react'
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
})
