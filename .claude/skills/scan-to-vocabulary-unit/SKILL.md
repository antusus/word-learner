---
name: scan-to-vocabulary-unit
description: Convert a scanned image of a vocabulary list or irregular verbs table into a words.json unit file. Use when the user provides a path to an image or scan and wants to extract English-Polish word pairs or irregular verb forms from it.
---

# Scan to Vocabulary Unit

Convert a scanned image of a vocabulary list or irregular verbs table into a structured `words.json` file for the Word Learner app.

## Input

The user provides a file path to an image (JPEG, PNG, etc.) containing a vocabulary list with English-Polish word pairs.

Read the image using your vision capabilities.

If the path is absolute, check if the file exists and use it for extraction.
If the path is relative, check if the file exists and do the extraction.
If only file name without extension is provided, check the `/Users/kberdychowski/Pictures` folder and look for the file with the name and some graphical extension like: `jpg` or `png`.
If several files, or file names are provide, repeat the process for each of the files.

## Content Type Detection

Before extraction, determine the content type:

- **Vocabulary** (default): English-Polish word pairs. Columns typically labeled "English"/"Polish" or similar. Words are nouns, adjectives, phrases, etc.
- **Irregular verbs**: Verb conjugation tables with columns like "base form" / "past simple" (or "infinitive" / "past tense"). Content is exclusively verbs with their past forms.

If unclear, ask the user.

## Extraction

Parse the image and extract:

1. **Unit title/number** -- look at the top of the page for a heading like "Unit 6 - Food" or "Irregular Verbs 1". Use it for the `title` field and derive the folder name (e.g., `Unit6` or `IrregularVerbs1`). If no title is visible, ask the user.
2. **Group headings** -- look for bold text, numbered sections, or category labels. Each heading becomes a group `name`.
3. **Word/verb entries**:
   - Vocabulary: English on one side, Polish on the other. Each pair becomes `{ "en": "...", "pl": "..." }`.
   - Irregular verbs: Base form and past simple form. Each pair becomes `{ "base": "...", "pastSimple": "..." }`.

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

### Vocabulary (default)

```json
{
  "title": "Vocabulary",
  "bundle": "Unit N",
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

### Irregular Verbs

```json
{
  "title": "Irregular Verbs",
  "type": "irregular-verbs",
  "bundle": "Unit N",
  "groups": [
    {
      "name": "Group Name",
      "words": [
        { "base": "go", "pastSimple": "went" }
      ]
    }
  ]
}
```

Constraints:

- `title` -- string, required, user-facing label shown in the sub-unit selector (e.g., "Vocabulary", "Irregular Verbs")
- `type` -- optional, `"irregular-verbs"` for verb units; omit for vocabulary (defaults to `"vocabulary"`)
- `bundle` -- optional, groups units under a parent entry in the unit selector (e.g., `"Unit 7"`). Units with the same `bundle` value appear as sub-sections of one entry. When a scan contains both vocabulary and irregular verbs from the same unit, use the same `bundle` value for both.
- `groups` -- array, required, at least one group
- Vocabulary groups: `name` (string) + `words` (array of `{ en, pl }` objects)
- Irregular verb groups: `name` (string) + `words` (array of `{ base, pastSimple }` objects)

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

- Vocabulary pattern: `Unit{N}` -- e.g., `Unit5`, `Unit6`, `Unit12`
- Irregular verbs pattern: `IrregularVerbs{N}` -- e.g., `IrregularVerbs1`, `IrregularVerbs2`
- PascalCase, no spaces, no hyphens
- Units are sorted with numeric-aware ordering (`Unit2` before `Unit10`)

## Verification

After writing the file:

1. Show the user a summary: number of groups, number of words per group, total word count.
2. Run `yarn build` to verify the app compiles.
3. Run `yarn test:run` to ensure tests pass.
4. Run `yarn lint:fix` to ensure proper format of the JSON file.

## Examples

### Vocabulary

Given an image with the heading "Unit 8 - Weather" containing two sections "Weather types" and "Weather adjectives":

```json
{
  "title": "Vocabulary",
  "bundle": "Unit 8",
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

### Irregular Verbs

Given an image with a verb conjugation table titled "Irregular Verbs 2":

```json
{
  "title": "Irregular Verbs",
  "type": "irregular-verbs",
  "bundle": "Unit 8",
  "groups": [
    {
      "name": "Communication verbs",
      "words": [
        { "base": "say", "pastSimple": "said" },
        { "base": "tell", "pastSimple": "told" },
        { "base": "speak", "pastSimple": "spoke" },
        { "base": "write", "pastSimple": "wrote" },
        { "base": "read", "pastSimple": "read" }
      ]
    }
  ]
}
```
