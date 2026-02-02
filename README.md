# Word Learner

A static web app to help kids learn English words (Polish ↔ English). Built with React and deployable on GitHub Pages.

**Live Demo:** https://antusus.github.io/word-learner/

## Tech Stack

- **Framework:** React 19
- **Build System:** Vite 7
- **Language:** TypeScript 5.9
- **Testing:** Vitest + React Testing Library
- **Styling:** CSS (vanilla, mobile-first responsive)
- **Data Storage:** localStorage for saving progress
- **Deployment:** GitHub Pages

## Requirements

- **Node.js:** 18.0.0 or higher (tested with Node 22)
- **Package Manager:** Yarn

## Installation

```bash
yarn install
```

## Commands

### Development

```bash
yarn dev        # Start development server with hot reload
```

### Testing

```bash
yarn test       # Run tests in watch mode
yarn test:run   # Run tests once
```

### Linting

```bash
yarn lint       # Run ESLint
```

### Build

```bash
yarn build      # TypeScript compile + Vite production build
yarn preview    # Preview production build locally
```

### Deploy

```bash
yarn deploy     # Build and deploy to GitHub Pages
```

This runs `yarn build` first (via `predeploy`) then publishes the `dist` folder to GitHub Pages using `gh-pages`.

## Project Structure

```
word-learner/
├── src/
│   ├── components/     # React components (UnitSelector, Flashcard, Quiz, etc.)
│   ├── hooks/          # Custom hooks (useProgress)
│   ├── modes/          # Game modes registry
│   ├── data/           # Word data (Unit1/, Unit2/, etc.)
│   ├── types/          # TypeScript type definitions
│   └── test/           # Test setup
├── public/             # Static assets
├── dist/               # Production build output
└── index.html          # Entry point
```

## Adding New Word Units

Create a new folder under `src/data/` with a `words.json` file:

```json
{
  "title": "Unit Name",
  "words": [
    { "en": "cat", "pl": "kot" },
    { "en": "dog", "pl": "pies" }
  ]
}
```
