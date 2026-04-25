# CLAUDE.md

This file provides guidance for Claude Code when working with this project.

## Project Overview

Word Learner is a React-based static web application for learning English-Polish vocabulary. Built with React 19, TypeScript, and Vite.

## Commands

```bash
# Install dependencies
yarn install

# Run in development mode (with hot reload)
yarn dev

# Run tests (watch mode)
yarn test

# Run tests once (CI mode)
yarn test:run

# Lint code
yarn lint

# Lint and auto-fix issues
yarn lint:fix

# Format code
yarn format

# Build for production
yarn build

# Preview production build locally
yarn preview

# Deploy to GitHub Pages
yarn deploy
```

## Project Structure

- `src/components/` - React components (UnitSelector, Flashcard, Quiz, etc.)
- `src/data/` - Word unit data files
- `src/types/` - TypeScript type definitions
- `src/modes/` - Game modes registry

## Tech Stack

- React 19 + TypeScript 5.9
- Vite 7 (build tool)
- Vitest + React Testing Library (testing)
- Biome (linting & formatting)
- GitHub Pages (deployment)

## Workflow

- Always create a feature branch and open a pull request for changes
- Do not commit directly to main
- Use conventional commits (e.g., `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`)
- Claude will not co-author commits.
- Cursor <cursoragent@cursor.com> will not co-author commits.
- Plan must incude automated tests.
- Make sure tests and linter are passing before telling user that implementation is done.

## Architecture

Screen flow: `UnitSelector → GroupSelector (if 2+ groups) → ModeSelector (if 2+ modes) → Game`

State machine in `App.tsx` with screens: `units | groups | modes | quiz`.

### Data Flow

```
src/data/<UnitName>/words.json
  → loader.ts (Vite glob auto-discovery)
  → challengeMapper.ts (Word/Verb → ChallengeItem)
  → Unit { id, title, type, challenges, challengeGroups, words, groups }
  → Components receive Unit + optional ChallengeItem[]
```

### Key Types (`src/types/index.ts`)

- `UnitType`: `'vocabulary' | 'irregular-verbs'`
- `ChallengeItem { prompt, answer }` — generic container used by all game modes
- `Unit` — carries both legacy `words/groups` (vocabulary only) and `challenges/challengeGroups` (all types)
- `GameModeProps { unit, challenges?, onComplete, onExit }` — contract for game mode components

### Key Modules

| Module | Path |
|--------|------|
| Types | `src/types/index.ts` |
| Mode registry | `src/modes/index.ts` |
| Data loader | `src/data/loader.ts` |
| Challenge mapper | `src/data/challengeMapper.ts` |
| Difficulty config | `src/data/configLoader.ts` |
| Blanking logic | `src/modes/fillInBlanks/blanking.ts` |

## How to Add a New Unit

1. Create `src/data/<FolderName>/words.json`
2. Vocabulary: `{ title, groups: [{ name, words: [{ en, pl }] }] }`
3. Irregular verbs: `{ title, type: "irregular-verbs", groups: [{ name, words: [{ base, pastSimple }] }] }`
4. Auto-discovered by Vite glob — no registration needed
5. Folder naming: `Unit{N}` for vocab, `IrregularVerbs` for verbs

## How to Add a New Game Mode

1. Create component in `src/modes/<name>/`
2. Accept `GameModeProps` interface
3. Use `challenges ?? unit.challenges` for challenge list
4. Register in `gameModes` array in `src/modes/index.ts`

## How to Add a New Unit Type

1. Add type to `UnitType` in `src/types/index.ts`
2. Add raw data interface (like `IrregularVerb`)
3. Add mapper function in `src/data/challengeMapper.ts`
4. Add difficulty config JSON + loader in `src/data/configLoader.ts`
5. Handle in `loader.ts` parseUnits
