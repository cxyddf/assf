import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Poem, Author } from '../types'

export const usePoetryStore = defineStore('poetry', () => {
  // 状态
  const poems = ref<Poem[]>([])
  const authors = ref<Author[]>([])
  const loading = ref(false)
  const searchKeyword = ref('')

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
    // 返回初始热门诗词
    return getInitialPopularPoems(6)
  })

  const getInitialPopularPoems = (count: number) => {
    const initialPoems = [
      {
        id: 101,
        title: "山居秋暝",
        author: "王维",
        dynasty: "唐",
        content: "空山新雨后，天气晚来秋。明月松间照，清泉石上流。",
        tags: ["山水", "秋天"],
        annotation: "描绘山居秋夜的宁静景色",
        appreciation: "王维以细腻的笔触描绘出山居生活的宁静美好",
        popularity: 92
      },
      {
        id: 102,
        title: "登高",
        author: "杜甫",
        dynasty: "唐",
        content: "风急天高猿啸哀，渚清沙白鸟飞回。无边落木萧萧下，不尽长江滚滚来。",
        tags: ["登高", "秋天"],
        annotation: "表达诗人登高望远时的感慨",
        appreciation: "杜甫晚年作品，情感深沉，意境开阔",
        popularity: 95
      },
      {
        id: 103,
        title: "锦瑟",
        author: "李商隐",
        dynasty: "唐",
        content: "锦瑟无端五十弦，一弦一柱思华年。庄生晓梦迷蝴蝶，望帝春心托杜鹃。",
        tags: ["爱情", "回忆"],
        annotation: "借锦瑟抒发对逝去年华的追忆",
        appreciation: "李商隐的代表作，意象丰富，情感细腻",
        popularity: 93
      },
      {
        id: 104,
        title: "念奴娇·赤壁怀古",
        author: "苏轼",
        dynasty: "宋",
        content: "大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。",
        tags: ["怀古", "赤壁"],
        annotation: "借赤壁之战抒发历史感慨",
        appreciation: "苏轼豪放词的代表作，气势磅礴",
        popularity: 96
      },
      {
        id: 105,
        title: "虞美人",
        author: "李煜",
        dynasty: "五代",
        content: "春花秋月何时了？往事知多少。小楼昨夜又东风，故国不堪回首月明中。",
        tags: ["亡国", "愁绪"],
        annotation: "表达亡国之君的深切哀愁",
        appreciation: "李煜词作巅峰，情感真挚动人",
        popularity: 94
      },
      {
        id: 106,
        title: "青玉案·元夕",
        author: "辛弃疾",
        dynasty: "宋",
        content: "东风夜放花千树，更吹落、星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。",
        tags: ["元宵", "爱情"],
        annotation: "描绘元宵佳节的热闹景象",
        appreciation: "辛弃疾婉约词的代表，意境优美",
        popularity: 91
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

  // 方法
  const loadPoems = async () => {
    loading.value = true
    try {
      // 模拟API调用，实际使用本地JSON数据
      const response = await import('@/data/poems.json')
      poems.value = response.default
    } catch (error) {
      console.error('加载诗词数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  const loadAuthors = async () => {
    try {
      const response = await import('@/data/authors.json')
      authors.value = response.default
    } catch (error) {
      console.error('加载作者数据失败:', error)
    }
  }

  const setSearchKeyword = (keyword: string) => {
    searchKeyword.value = keyword
  }

  const getPoemById = (id: number) => {
    return poems.value.find(poem => poem.id === id)
  }

  const getAuthorByName = (name: string) => {
    return authors.value.find(author => author.name === name)
  }

  const getPoemsByDynasty = (dynasty: string) => {
    return poems.value.filter(poem => poem.dynasty === dynasty)
  }

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
    
    // 计算属性
    dailyPoem,
    popularPoems,
    filteredPoems,
    
    // 方法
    loadPoems,
    loadAuthors,
    setSearchKeyword,
    getPoemById,
    getAuthorByName,
    getPoemsByDynasty,
    
    // 刷新方法
    refreshPopularPoems
  }
})