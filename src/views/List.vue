<template>
  <div class="list-page">
    <!-- 页面头部 -->
    <el-header class="page-header">
      <div class="header-content">
        <el-button 
          v-if="showBackButton" 
          :icon="ArrowLeft" 
          @click="router.back()"
        >
          返回
        </el-button>
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="filter-section" v-if="showFilters">
          <el-select v-model="selectedDynasty" placeholder="选择朝代" @change="handleDynastyChange">
            <el-option label="全部" value="" />
            <el-option label="唐代" value="唐" />
            <el-option label="宋代" value="宋" />
            <el-option label="其他" value="其他" />
          </el-select>
        </div>
      </div>
    </el-header>

    <!-- 诗词列表 -->
    <el-main class="page-content">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="filteredPoems.length === 0" class="empty-state">
        <el-empty description="暂无诗词数据" />
      </div>

      <div v-else-if="isEmpty" class="empty-state">
        <el-empty :description="`暂无${pageTitle}数据`" />
      </div>

      <div v-else class="content-list">
        <!-- 作者列表 -->
        <div v-if="pageType === 'authors'" class="authors-grid">
          <div 
            v-for="author in displayData" 
            :key="author.id"
            class="author-card"
            @click="goToAuthorDetail(author.name)"
          >
            <div class="author-avatar">{{ author.name.charAt(0) }}</div>
            <div class="author-info">
              <h3 class="author-name">{{ author.name }}</h3>
              <p class="author-dynasty">{{ author.dynasty }}</p>
              <p class="author-works">作品数: {{ author.poemCount }}</p>
            </div>
          </div>
        </div>

        <!-- 诗词/名句/古籍/收藏列表 -->
        <div v-else class="poem-list">
          <PoetryCard
            v-for="poem in displayData"
            :key="poem.id"
            :poem="poem"
            @click="goToDetail(poem.id)"
          />
        </div>
        
        <!-- 分页（仅诗词列表显示） -->
        <el-pagination
          v-if="pageType === 'poems'"
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredPoems.length"
          layout="prev, pager, next, total"
          @current-change="handlePageChange"
        />
      </div>
=======
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePoetryStore } from '../stores/poetry'
import { ArrowLeft } from '@element-plus/icons-vue'
import PoetryCard from '../components/PoetryCard.vue'

const router = useRouter()
const route = useRoute()
const poetryStore = usePoetryStore()

const loading = ref(false)
const selectedDynasty = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

// 判断是否显示返回按钮
// 从导航栏进入时不显示返回按钮，从详情页返回时显示
const showBackButton = ref(false)

// 监听路由变化
watch(() => route.path, (newPath, oldPath) => {
  // 如果是从详情页(/detail)进入列表页，显示返回按钮
  if (oldPath && oldPath.startsWith('/detail') && newPath.startsWith('/list')) {
    showBackButton.value = true
  } else {
    // 其他情况（从导航栏进入）不显示返回按钮
    showBackButton.value = false
  }
}, { immediate: true })

// 页面类型和标题
const pageType = computed(() => {
  const path = route.path
  if (path === '/authors') return 'authors'
  if (path === '/quotes') return 'quotes'
  if (path === '/classics') return 'classics'
  if (path === '/profile') return 'profile'
  return 'poems' // 默认诗词列表
})

const pageTitle = computed(() => {
  switch (pageType.value) {
    case 'authors': return '作者列表'
    case 'quotes': return '名句欣赏'
    case 'classics': return '古籍经典'
    case 'profile': return '我的收藏'
    default: return '诗词列表'
  }
})

const showFilters = computed(() => {
  return pageType.value === 'poems' || pageType.value === 'authors'
})

const filteredPoems = computed(() => {
  if (!selectedDynasty.value) {
    return poetryStore.poems
  }
  return poetryStore.poems.filter(poem => poem.dynasty === selectedDynasty.value)
})

const currentPagePoems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPoems.value.slice(start, end)
})

// 根据不同页面类型显示不同内容
const displayData = computed(() => {
  switch (pageType.value) {
    case 'authors':
      return poetryStore.authors
    case 'quotes':
      // 名句页面显示包含名句的诗词
      return poetryStore.poems.filter(poem => 
        poem.content.includes('。') || poem.content.includes('，')
      )
    case 'classics':
      // 古籍页面显示经典作品
      return poetryStore.poems.filter(poem => poem.popularity > 80)
    case 'profile':
      // 我的页面显示收藏（暂时显示所有诗词）
      return poetryStore.poems
    default:
      return currentPagePoems.value
  }
})

const isEmpty = computed(() => {
  return displayData.value.length === 0 && !loading.value
})

const handleDynastyChange = () => {
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const goToDetail = (id: string) => {
  router.push(`/detail/${id}`)
}

const goToAuthorDetail = (authorName: string) => {
  // 跳转到作者详情页面（暂时跳转到搜索页面）
  router.push(`/search?author=${authorName}`)
}

onMounted(async () => {
  loading.value = true
  await poetryStore.loadPoems()
  
  // 如果是作者页面，加载作者数据
  if (pageType.value === 'authors') {
    await poetryStore.loadAuthors()
  }
  
  // 处理URL参数
  if (route.query.dynasty) {
    selectedDynasty.value = route.query.dynasty as string
  }
  
  loading.value = false
})

watch(selectedDynasty, (newDynasty) => {
  router.replace({ query: { dynasty: newDynasty || undefined } })
})
</script>

<style scoped>
.list-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 20px;
  position: relative;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  position: relative;
}

.header-content .el-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.page-title {
  color: var(--text-primary);
  font-size: 20px;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.loading-container {
  max-width: 800px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.poem-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.authors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.author-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.author-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.author-info {
  flex: 1;
}

.author-name {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 5px 0;
}

.author-dynasty {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0 0 5px 0;
}

.author-works {
  color: var(--primary-color);
  font-size: 14px;
  margin: 0;
}

.el-pagination {
  justify-content: center;
  margin-top: 30px;
}
</style>