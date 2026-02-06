export interface Word {
  en: string;
  pl: string;
}

export interface WordGroup {
  name: string;
  words: Word[];
}

export interface WordsFile {
  title: string;
  groups: WordGroup[];
}

export interface Unit {
  id: string;
  title: string;
  words: Word[]; // flattened from all groups
  groups: WordGroup[]; // structured groups
}
