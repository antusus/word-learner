export interface Word {
  en: string
  pl: string
}

export interface WordsFile {
  title: string
  words: Word[]
}

export interface Unit {
  id: string
  title: string
  words: Word[]
}
