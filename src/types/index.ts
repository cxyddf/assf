export interface Poem {
  id: string
  title: string
  author: string
  dynasty: string
  content: string
  tags?: string[]
  annotation?: string
  appreciation?: string
  popularity?: number
  translation?: string
}

export interface Author {
  id: string
  name: string
  dynasty: string
  description: string
  poemCount: number
  works_count?: number
}

export interface SearchResult {
  poems: Poem[]
  authors: Author[]
  total: number
}