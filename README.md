# Word Learner

A static web app to help kids learn English words (Polish ↔ English). Built with React and deployable on GitHub Pages.

**Live Demo:** https://antusus.github.io/word-learner/

## Tech Stack

- **Framework:** React
- **Build System:** Vite
- **Language:** TypeScript
- **Testing:** Vitest + React Testing Library
- **Linting:** Biome
- **Styling:** CSS (vanilla, mobile-first responsive)
- **Data Storage:** localStorage for saving progress
- **Deployment:** GitHub Pages

## Requirements

- **Node.js:** 22
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

### Linting & Formatting

```bash
yarn lint       # Check for lint errors and formatting issues
yarn lint:fix   # Auto-fix lint errors and formatting
yarn format     # Format code
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

## Install on iPad + Reminders

1. Open `https://antusus.github.io/word-learner/` in Safari on your iPad.
2. Tap Share, then choose **Add to Home Screen**.
3. Name it (for example, `Word Learner`) and tap **Add**.

### Add recurring reminders

Two easy options:

- **Apple Reminders:** create a reminder like `Practice Word Learner`, set it to repeat daily or weekdays.
- **Apple Shortcuts:** create a personal automation (time of day) with action `Open URLs` and set URL to `https://antusus.github.io/word-learner/`.

This gives you app-like launching now, and works with the current GitHub Pages deployment.


## Install on Android

1. Open `https://antusus.github.io/word-learner/` in Chrome on your Android device.
2. Tap the browser menu (`⋮`) and choose **Install app** (or **Add to Home screen**).
3. Confirm the install prompt.

### Offline and storage notes (Android)

- Open the app once while online so required assets are cached.
- After that, the app should start from the home screen in standalone mode.
- Progress is stored in browser storage on the device.
- Clearing browser/site data may remove cached files and saved progress.

### Optional: recurring reminders on Android

- Use **Google Calendar** recurring events with notifications, or
- Use **Google Assistant / Reminders** for daily practice

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
