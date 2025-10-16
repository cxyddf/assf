// Supabase相关类型定义
export interface Poetry {
  id: string
  title: string
  author: string
  dynasty: string
  content: string
  translation?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface Author {
  id: string
  name: string
  dynasty: string
  description?: string
  works_count?: number
  created_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  poetry_id: string
  created_at: string
}

export interface SearchHistory {
  id: string
  user_id: string
  keyword: string
  created_at: string
}

// 数据库表名枚举
export enum DatabaseTables {
  POETRY = 'poetry',
  AUTHORS = 'authors',
  USER_FAVORITES = 'user_favorites',
  SEARCH_HISTORY = 'search_history'
}