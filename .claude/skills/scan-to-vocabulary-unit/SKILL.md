---
name: scan-to-vocabulary-unit
description: Convert a scanned image of a vocabulary list into a words.json unit file. Use when the user provides a path to an image or scan and wants to extract English-Polish word pairs from it.
---

# Scan to Vocabulary Unit

Convert a scanned image of a vocabulary list into a structured `words.json` file for the Word Learner app.

## Input

The user provides a file path to an image (JPEG, PNG, etc.) containing a vocabulary list with English-Polish word pairs.

Read the image using your vision capabilities.

## Extraction

Parse the image and extract:

1. **Unit title/number** -- look at the top of the page for a heading like "Unit 6 - Food". Use it for the `title` field and derive the folder name (e.g., `Unit6`). If no title is visible, ask the user.
2. **Group headings** -- look for bold text, numbered sections, or category labels. Each heading becomes a group `name`.
3. **Word pairs** -- English on one side, Polish on the other. Each pair becomes `{ "en": "...", "pl": "..." }`.

### Polish diacritics

Pay close attention to Polish special characters: **a, c, e, l, n, o, s, z, z** (a with ogonek, c with accent, etc.). Common misreadings:

| Character | Often misread as |
|-----------|-----------------|
| a (ogonek) | a |
| c (accent) | c |
| e (ogonek) | e |
| l (stroke) | l |
| n (accent) | n |
| o (accent) | o |
| s (accent) | s |
| z (accent) | z |
| z (dot)    | z |

Double-check every Polish word for correct diacritics.

## Target JSON format

Based on types in `src/types/index.ts`:

```json
{
  "title": "Unit N - Topic Name",
  "groups": [
    {
      "name": "Group Name",
      "words": [
        { "en": "english word", "pl": "polish word" }
      ]
    }
  ]
}
```

Constraints:

- `title` -- string, required, user-facing label shown in the unit selector
- `groups` -- array, required, at least one group
- Each group: `name` (string) + `words` (array of `{ en, pl }` objects)

## Unit placement

1. **List existing units** -- check folders in `src/data/` to see what already exists.
2. **Determine target unit**:
   - If a title/number was extracted from the scan, check if that unit folder exists.
   - **Exists** -- merge into the existing `words.json`. Preserve all existing groups and words; append new groups or add words to matching groups.
   - **Does not exist** -- create a new folder `src/data/Unit{N}/`.
   - **No title found** -- ask the user for the unit name.
3. **Write `words.json`** in the target folder.

No registration is needed. Units are auto-discovered by Vite via `import.meta.glob('./*/words.json')` in `src/data/loader.ts`.

### Folder naming

- Pattern: `Unit{N}` -- e.g., `Unit5`, `Unit6`, `Unit12`
- PascalCase, no spaces, no hyphens
- Units are sorted with numeric-aware ordering (`Unit2` before `Unit10`)

## Verification

After writing the file:

1. Show the user a summary: number of groups, number of words per group, total word count.
2. Run `yarn build` to verify the app compiles.
3. Run `yarn test:run` to ensure tests pass.

## Example

Given an image with the heading "Unit 8 - Weather" containing two sections "Weather types" and "Weather adjectives":

```json
{
  "title": "Unit 8 - Weather",
  "groups": [
    {
      "name": "Weather types",
      "words": [
        { "en": "rain", "pl": "deszcz" },
        { "en": "snow", "pl": "snieg" },
        { "en": "storm", "pl": "burza" }
      ]
    },
    {
      "name": "Weather adjectives",
      "words": [
        { "en": "sunny", "pl": "sloneczny" },
        { "en": "cloudy", "pl": "pochmurny" }
      ]
    }
  ]
}
```
