import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'word-learner-progress';

interface Progress {
  completedUnits: string[];
}

function loadProgress(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.completedUnits)) {
        return { completedUnits: parsed.completedUnits };
      }
    }
  } catch {
    // Invalid data, return default
  }
  return { completedUnits: [] };
}

function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const markCompleted = useCallback((unitId: string) => {
    setProgress((prev) => {
      if (prev.completedUnits.includes(unitId)) {
        return prev;
      }
      return { completedUnits: [...prev.completedUnits, unitId] };
    });
  }, []);

  const isCompleted = useCallback(
    (unitId: string) => {
      return progress.completedUnits.includes(unitId);
    },
    [progress.completedUnits],
  );

  const resetProgress = useCallback(() => {
    setProgress({ completedUnits: [] });
  }, []);

  return {
    completedUnits: progress.completedUnits,
    markCompleted,
    isCompleted,
    resetProgress,
  };
}
