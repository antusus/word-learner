import { renderHook, act } from '@testing-library/react'
import { useProgress } from './useProgress'

const STORAGE_KEY = 'word-learner-progress'

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns empty completedUnits initially', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.completedUnits).toEqual([])
  })

  it('marks a unit as completed', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.markCompleted('Unit1')
    })

    expect(result.current.completedUnits).toContain('Unit1')
    expect(result.current.isCompleted('Unit1')).toBe(true)
  })

  it('does not duplicate completed units', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.markCompleted('Unit1')
      result.current.markCompleted('Unit1')
    })

    expect(result.current.completedUnits.filter((id) => id === 'Unit1')).toHaveLength(1)
  })

  it('persists progress to localStorage', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.markCompleted('Unit1')
    })

    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).toBeTruthy()
    expect(JSON.parse(stored!)).toEqual({ completedUnits: ['Unit1'] })
  })

  it('loads progress from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedUnits: ['Unit1', 'Unit2'] }))

    const { result } = renderHook(() => useProgress())

    expect(result.current.completedUnits).toEqual(['Unit1', 'Unit2'])
    expect(result.current.isCompleted('Unit1')).toBe(true)
    expect(result.current.isCompleted('Unit2')).toBe(true)
  })

  it('handles corrupted localStorage data', () => {
    localStorage.setItem(STORAGE_KEY, 'not valid json')

    const { result } = renderHook(() => useProgress())

    expect(result.current.completedUnits).toEqual([])
  })

  it('handles invalid data structure in localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedUnits: 'not an array' }))

    const { result } = renderHook(() => useProgress())

    expect(result.current.completedUnits).toEqual([])
  })

  it('resets progress', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.markCompleted('Unit1')
      result.current.markCompleted('Unit2')
    })

    expect(result.current.completedUnits).toHaveLength(2)

    act(() => {
      result.current.resetProgress()
    })

    expect(result.current.completedUnits).toEqual([])
  })

  it('isCompleted returns false for non-completed units', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.markCompleted('Unit1')
    })

    expect(result.current.isCompleted('Unit2')).toBe(false)
  })
})
