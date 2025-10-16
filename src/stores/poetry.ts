import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Poem, Author } from '../types'
import { supabaseService } from '../services/supabase'
import { logger } from '../utils/logger'

export const usePoetryStore = defineStore('poetry', () => {
  // 状态
  const poems = ref<Poem[]>([])
  const authors = ref<Author[]>([])
  const loading = ref(false)
  const searchKeyword = ref('')
  const error = ref<string | null>(null)
  const favorites = ref<Set<string>>(new Set()) // 收藏的诗词ID集合

  // 计算属性
  const dailyPoem = computed(() => {
    if (poems.value.length === 0) return null
    // 根据日期选择每日推荐
    const today = new Date().getDate()
    return poems.value[today % poems.value.length]
  })

  // 添加刷新触发器
  const refreshTrigger = ref(0)
  
  const popularPoems = computed(() => {
    // 依赖refreshTrigger来触发重新计算
    refreshTrigger.value
    // 从实际诗词库中获取热门诗词
    if (poems.value.length === 0) return getInitialPopularPoems(6)
    
    // 按热度排序并取前6首
    return [...poems.value]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 6)
  })

  const getInitialPopularPoems = (count: number) => {
    // 后备数据，使用与数据库匹配的ID格式
    const initialPoems = [
      {
        id: "1",
        title: "静夜思",
        author: "李白",
        dynasty: "唐",
        content: "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
        tags: ["思乡", "月亮"],
        annotation: "表达游子思乡之情",
        appreciation: "李白代表作，语言简练，意境深远",
        popularity: 95
      },
      {
        id: "2",
        title: "春晓",
        author: "孟浩然",
        dynasty: "唐",
        content: "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。",
        tags: ["春天", "自然"],
        annotation: "描绘春日早晨的景色",
        appreciation: "语言清新自然，意境优美",
        popularity: 90
      },
      {
        id: "3",
        title: "登鹳雀楼",
        author: "王之涣",
        dynasty: "唐",
        content: "白日依山尽，黄河入海流。欲穷千里目，更上一层楼。",
        tags: ["登高", "哲理"],
        annotation: "登高望远，抒发豪情壮志",
        appreciation: "意境开阔，富有哲理",
        popularity: 92
      },
      {
        id: "4",
        title: "水调歌头",
        author: "苏轼",
        dynasty: "宋",
        content: "明月几时有？把酒问青天。不知天上宫阙，今夕是何年。",
        tags: ["中秋", "思念"],
        annotation: "中秋怀人之作",
        appreciation: "苏轼代表作，情感真挚，意境优美",
        popularity: 94
      },
      {
        id: "5",
        title: "声声慢",
        author: "李清照",
        dynasty: "宋",
        content: "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。",
        tags: ["愁绪", "婉约"],
        annotation: "表达深沉的愁苦之情",
        appreciation: "李清照婉约词的代表作",
        popularity: 91
      },
      {
        id: "6",
        title: "望庐山瀑布",
        author: "李白",
        dynasty: "唐",
        content: "日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。",
        tags: ["山水", "瀑布"],
        annotation: "描绘庐山瀑布的壮丽景色",
        appreciation: "想象奇特，气势磅礴",
        popularity: 93
      }
    ]
    return initialPoems.slice(0, Math.min(count, initialPoems.length))
  }

  // 获取随机诗词（本地随机选择）
  const getRandomPoems = (count: number) => {
    if (poems.value.length === 0) return getInitialPopularPoems(count)
    
    // 从本地诗词库中随机选择
    const shuffled = [...poems.value].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const filteredPoems = computed(() => {
    if (!searchKeyword.value) return poems.value
    
    const keyword = searchKeyword.value.toLowerCase()
    return poems.value.filter(poem => 
      poem.title.toLowerCase().includes(keyword) ||
      poem.author.toLowerCase().includes(keyword) ||
      poem.content.toLowerCase().includes(keyword)
    )
  })

  // 收藏相关计算属性
  const favoritePoems = computed(() => {
    return poems.value.filter(poem => favorites.value.has(poem.id))
  })

  const isFavorite = (poemId: string) => {
    return favorites.value.has(poemId)
  }

  // 方法
  const loadPoems = async () => {
    loading.value = true
    error.value = null
    try {
      // 从Supabase获取诗词数据
      console.log('开始从Supabase加载诗词数据...')
      const data = await supabaseService.fetchData('poetry')
      console.log('从Supabase获取到诗词数据:', data.length, '条')
      poems.value = data.map(item => ({
        id: item.id.toString(),
        title: item.title,
        author: item.author,
        dynasty: item.dynasty,
        content: item.content,
        translation: item.translation,
        tags: item.tags || [],
        annotation: item.annotation,
        appreciation: item.appreciation,
        popularity: item.popularity || 0
      }))
      console.log('诗词数据映射完成，poems.value.length:', poems.value.length)
    } catch (err) {
      error.value = '加载诗词数据失败'
      logger.error('加载诗词数据失败:', err)
      // 如果Supabase连接失败，使用本地数据作为后备
      try {
        const response = await import('../data/poems.json')
        poems.value = response.default.map(poem => ({
          ...poem,
          id: poem.id.toString()
        }))
      } catch (localError) {
        logger.error('本地数据加载也失败:', localError)
      }
    } finally {
      loading.value = false
    }
  }

  const loadAuthors = async () => {
    error.value = null
    try {
      // 从Supabase获取作者数据
      const data = await supabaseService.fetchData('authors')
      authors.value = data.map(item => ({
        id: item.id.toString(),
        name: item.name,
        dynasty: item.dynasty,
        description: item.description || '',
        poemCount: (item as any).works_count || 0
      }))
    } catch (err) {
      error.value = '加载作者数据失败'
      logger.error('加载作者数据失败:', err)
      // 如果Supabase连接失败，使用本地数据作为后备
      try {
        const response = await import('../data/authors.json')
        authors.value = response.default.map(author => ({
          id: author.id.toString(),
          name: author.name,
          dynasty: author.dynasty,
          description: author.description,
          poemCount: author.poemCount
        }))
      } catch (localError) {
        logger.error('本地数据加载也失败:', localError)
      }
    }
  }

  const setSearchKeyword = (keyword: string) => {
    searchKeyword.value = keyword
  }

  const getPoemById = (id: string) => {
    return poems.value.find(poem => poem.id === id)
  }

  const getAuthorByName = (name: string) => {
    return authors.value.find(author => author.name === name)
  }

  const getPoemsByDynasty = (dynasty: string) => {
    return poems.value.filter(poem => poem.dynasty === dynasty)
  }

  // 收藏相关方法 - 使用Supabase数据库
  const toggleFavorite = async (poemId: string) => {
    try {
      if (favorites.value.has(poemId)) {
        // 取消收藏
        await supabaseService.deleteData('user_favorites', { poem_id: poemId })
        favorites.value.delete(poemId)
      } else {
        // 添加收藏
        await supabaseService.insertData('user_favorites', { 
          poem_id: poemId,
          created_at: new Date().toISOString()
        })
        favorites.value.add(poemId)
      }
    } catch (error) {
      logger.error('收藏操作失败:', error)
      // 失败时回退到localStorage
      if (favorites.value.has(poemId)) {
        favorites.value.delete(poemId)
      } else {
        favorites.value.add(poemId)
      }
      localStorage.setItem('poetry-favorites', JSON.stringify(Array.from(favorites.value)))
    }
  }

  const loadFavorites = async () => {
    try {
      // 从Supabase加载收藏
      const data = await supabaseService.fetchData('user_favorites')
      const favoriteIds = data.map(item => item.poem_id)
      favorites.value = new Set(favoriteIds)
    } catch (error) {
      logger.error('从数据库加载收藏失败:', error)
      // 失败时回退到localStorage
      try {
        const saved = localStorage.getItem('poetry-favorites')
        if (saved) {
          favorites.value = new Set(JSON.parse(saved))
        }
      } catch (localError) {
        logger.error('从localStorage加载收藏失败:', localError)
      }
    }
  }

  // 初始化时加载收藏
  loadFavorites()

  // 刷新热门诗词 - 从本地诗词库随机选择
  const refreshPopularPoems = () => {
    refreshTrigger.value += 1
  }

  return {
    // 状态
    poems,
    authors,
    loading,
    searchKeyword,
    favorites,
    
    // 计算属性
    dailyPoem,
    popularPoems,
    filteredPoems,
    favoritePoems,
    isFavorite,
    
    // 方法
    loadPoems,
    loadAuthors,
    setSearchKeyword,
    getPoemById,
    getAuthorByName,
    getPoemsByDynasty,
    toggleFavorite,
    
    // 刷新方法
    refreshPopularPoems,
    
    // 错误状态
    error
  }
})