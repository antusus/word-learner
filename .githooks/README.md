# Git Hooks

## Installation

Run once to install hooks:

```bash
git config core.hooksPath .githooks
```

## Hooks

- `pre-commit`: Validates yarn.lock contains only public registry URLs (registry.npmjs.org, registry.yarnpkg.com)
