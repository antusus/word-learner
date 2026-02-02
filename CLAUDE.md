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
- `src/hooks/` - Custom hooks (useProgress for localStorage)
- `src/data/` - Word unit data files
- `src/types/` - TypeScript type definitions
- `src/modes/` - Game modes registry

## Tech Stack

- React 19 + TypeScript 5.9
- Vite 7 (build tool)
- Vitest + React Testing Library (testing)
- Biome (linting & formatting)
- GitHub Pages (deployment)
