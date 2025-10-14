export interface Poem {
  id: number
  title: string
  author: string
  dynasty: string
  content: string
  tags?: string[]
  annotation?: string
  appreciation?: string
  popularity?: number
}

export interface Author {
  id: number
  name: string
  dynasty: string
  description: string
  poemCount: number
}

export interface SearchResult {
  poems: Poem[]
  authors: Author[]
  total: number
}