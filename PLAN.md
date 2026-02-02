# English Words Learning App - Implementation Plan

## Project Info
- **Name**: word-learner
- **Repository**: git@github.com:antusus/word-learner.git
- **GitHub Pages URL**: https://antusus.github.io/word-learner/

## Overview
A static web app to help kids learn English words (Polish ↔ English), deployable on GitHub Pages.

## Tech Stack
- **Framework**: React 18
- **Build System**: Vite
- **Language**: TypeScript
- **Styling**: CSS (vanilla, mobile-first responsive design)
- **Data Storage**: localStorage for saving progress
- **Testing**: Vitest + React Testing Library
- **Deployment**: GitHub Pages (static build)

## Data Format

### JSON Structure
Each unit has a `words.json` file:
```json
{
  "title": "Unit 4 - Animals",
  "words": [
    { "en": "cat", "pl": "kot" },
    { "en": "dog", "pl": "pies" },
    { "en": "The cat is sleeping", "pl": "Kot śpi" }
  ]
}
```

### Directory Structure
```
src/data/
├── Unit1/
│   └── words.json
└── Unit2/
    └── words.json
```

## Project Structure
```
word-learner/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── App.test.tsx
│   ├── components/
│   │   ├── UnitSelector.tsx + .test.tsx
│   │   ├── ModeSelector.tsx + .test.tsx  # Shows if 2+ modes
│   │   ├── Flashcard.tsx + .test.tsx
│   │   └── Quiz.tsx + .test.tsx
│   ├── modes/
│   │   └── index.ts              # Game modes registry
│   ├── hooks/
│   │   └── useProgress.ts + .test.ts
│   ├── data/
│   │   ├── loader.ts + .test.ts
│   │   └── Unit1/words.json
│   ├── types/index.ts
│   └── test/setup.ts
└── public/
```

---

## Implementation Phases

### Phase 1: Project Setup & Test Infrastructure
**Goal:** Scaffold project with Vite, configure testing

**Deliverables:**
- Clone repo and initialize Vite React TypeScript project
- Vitest + React Testing Library configured
- Test setup file with jsdom
- Sample test passes
- GitHub Pages base path configured in vite.config.ts (`/word-learner/`)
- `PLAN.md` - Copy of this plan stored in project root

**Commands:**
```bash
git clone git@github.com:antusus/word-learner.git
cd word-learner
yarn create vite . -- --template react-ts
yarn install
yarn add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Verification:**
- `yarn dev` starts dev server
- `yarn test` runs and passes sample test

---

### Phase 2: Types, Data Loader & Unit Selector
**Goal:** Load word files and display list of units to choose from

**Deliverables:**
- `src/types/index.ts` - Word and Unit interfaces
- `src/data/loader.ts` - Uses `import.meta.glob` to discover and load units
- `src/data/loader.test.ts` - Unit tests for loader
- `src/data/Unit1/words.json` - Sample data (5-10 words)
- `src/data/Unit2/words.json` - Second sample unit
- `src/components/UnitSelector.tsx` - Displays list of available units
- `src/components/UnitSelector.test.tsx` - Component tests
- `src/App.tsx` - Shows UnitSelector as home screen

**Features:**
- App loads and discovers all units from data folder
- Home screen shows list of units with title and word count
- Clicking a unit logs selection (quiz not wired yet)

**Tests:**
- Loader: parses JSON, extracts unit name, returns sorted array
- UnitSelector: renders list, shows title/count, handles click

**Verification:**
- `yarn test` - all tests pass
- `yarn dev` - see list of units on home screen
- Add a new Unit3/words.json, rebuild, see it appear

---

### Phase 3: Flashcard Component
**Goal:** Build the flip card component with animation

**Deliverables:**
- `src/components/Flashcard.tsx` - Card component
- `src/components/Flashcard.test.tsx` - Component tests
- `src/components/Flashcard.css` - Flip animation styles

**Component Props:**
```ts
interface FlashcardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
}
```

**Tests:**
- Renders Polish word when not flipped
- Shows English word when flipped
- Calls onFlip when clicked
- Applies correct CSS class for flip state

**Verification:**
- `yarn test` - Flashcard tests pass
- Visual check: card flips with animation

---

### Phase 4: Quiz Component, Game Modes & App Navigation
**Goal:** Build quiz flow, game modes registry, and connect everything

**Deliverables:**
- `src/modes/index.ts` - Game modes registry
- `src/components/ModeSelector.tsx` - Mode picker (shows if 2+ modes)
- `src/components/ModeSelector.test.tsx` - Component tests
- `src/components/Quiz.tsx` - Quiz container (flashcard mode)
- `src/components/Quiz.test.tsx` - Component tests
- `src/components/Quiz.css` - Quiz layout styles
- Updated `src/App.tsx` - Full navigation between screens
- `src/App.test.tsx` - Integration tests

**Game Modes Registry:**
```ts
// src/modes/index.ts
interface GameMode {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<GameModeProps>;
}

const gameModes: GameMode[] = [
  { id: 'flashcard', name: 'Flip Cards', description: 'Show Polish, reveal English', component: Quiz }
  // Future: { id: 'fillblank', name: 'Fill in Blanks', ... }
];
```

**Auto-detect Mode Selection:**
- If `gameModes.length === 1` → skip ModeSelector, go directly to game
- If `gameModes.length > 1` → show ModeSelector screen

**Quiz Component Props:**
```ts
interface QuizProps {
  unit: Unit;
  onComplete: () => void;
  onExit: () => void;
}
```

**Features:**
- Displays current flashcard
- "Next" button advances to next word
- Progress indicator (e.g., "3 / 10")
- Shuffles word order
- Shows completion screen at end
- Back button returns to unit list

**Tests:**
- Quiz: shows first word, advances on click, shows progress, completion
- ModeSelector: renders modes, handles selection, not shown if 1 mode
- App: navigates unit list → (mode selector if 2+) → quiz → back to list

**Verification:**
- `yarn test` - All tests pass
- Full flow works: select unit → quiz → complete → back to home
- With 1 mode: skips mode selector automatically

---

### Phase 5: Progress Tracking
**Goal:** Add localStorage persistence for completed units

**Deliverables:**
- `src/hooks/useProgress.ts` - Progress hook
- `src/hooks/useProgress.test.ts` - Hook tests
- Update UnitSelector to show completion status
- Update Quiz to save progress on completion

**Features:**
- Save which units are completed
- Show checkmark/indicator on completed units
- Progress persists across page refresh

**Tests:**
- Saves to localStorage
- Loads from localStorage
- Handles missing/corrupted data
- Updates UI when progress changes

**Verification:**
- `yarn test` - All tests pass
- Complete a unit, refresh page, see completion status preserved

---

### Phase 6: Responsive Styling & Deployment
**Goal:** Polish UI for mobile/tablet and deploy to GitHub Pages

**Deliverables:**
- Mobile-first responsive CSS
- Large touch targets (min 44px)
- Kid-friendly fonts and colors
- `gh-pages` package installed
- Deploy script in package.json

**Verification:**
- Test in browser mobile viewport (iPhone, iPad sizes)
- `yarn build` produces dist folder
- `yarn preview` serves production build
- Deploy to GitHub Pages works

---

## Summary of Phases

| Phase | Description | Approval Point |
|-------|-------------|----------------|
| 1 | Project Setup & Test Infrastructure | Project runs, tests work |
| 2 | Types, Data Loader & **Unit Selector** | Can see list of units |
| 3 | Flashcard Component | Card flips correctly |
| 4 | Quiz, **Game Modes** & Navigation | Full quiz flow + mode registry |
| 5 | Progress Tracking | Progress saves/loads |
| 6 | Styling & Deployment | Deployed to GitHub Pages |

---

## Future Enhancements (Not in V1)
- [ ] Fill-in-the-blanks mode
- [ ] Matching game mode
- [ ] PWA offline support
- [ ] Audio pronunciation
- [ ] Spaced repetition
- [ ] E2E tests with Playwright
