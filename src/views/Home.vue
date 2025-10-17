<template>
  <div class="home">
    <!-- AI助手 -->
    <AIAssistant />
    
    <!-- 搜索栏 -->
    <div class="search-section">
      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索诗词、作者..."
          class="search-input"
          size="large"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 加载状态 -->
      <div v-if="poetryStore.loading" class="loading-container">
        <el-loading :loading="true" text="加载中...">
          <div style="height: 200px;"></div>
        </el-loading>
      </div>
      
      <!-- 推荐页面布局 -->
      <template v-else-if="currentCategory === 'recommend'">
        <!-- 每日推荐 -->
        <section class="daily-section">
          <div class="section-header">
            <h2 class="section-title">今日推荐</h2>
          </div>
          
          <PoetryCard 
            v-if="dailyPoem"
            :poem="dailyPoem"
            class="daily-poem"
            @click="goToDetail(dailyPoem.id)"
          />
          <div v-else class="empty-state">
            <el-empty description="暂无推荐诗词" />
          </div>
        </section>

        <!-- 热门诗词 -->
        <section class="popular-section">
          <div class="section-header">
            <h2 class="section-title">热门诗词</h2>
            <el-button 
              type="primary" 
              :icon="Refresh" 
              @click="refreshPopularPoems"
              size="small"
            >
              刷新热门
            </el-button>
          </div>
          <div class="poem-grid">
            <PoetryCard
              v-for="poem in popularPoems"
              :key="poem.id"
              :poem="poem"
              @click="goToDetail(poem.id)"
            />
          </div>
          <div v-if="popularPoems.length === 0" class="empty-state">
            <el-empty description="暂无热门诗词" />
            <div style="margin-top: 20px; color: #666; font-size: 14px;">
              <p>调试信息:</p>
              <p>诗词总数: {{ poetryStore.poems.length }}</p>
              <p>热门诗词数: {{ popularPoems.length }}</p>
              <p>加载状态: {{ poetryStore.loading ? '加载中' : '已完成' }}</p>
              <p>错误信息: {{ poetryStore.error || '无' }}</p>
            </div>
          </div>
        </section>

        <!-- 朝代分类 -->
        <section class="dynasty-section">
          <h2 class="section-title">按朝代浏览</h2>
          <div class="dynasty-buttons">
            <el-button 
              v-for="dynasty in dynasties" 
              :key="dynasty"
              type="primary"
              @click="goToDynastyList(dynasty)"
            >
              {{ dynasty }}
            </el-button>
          </div>
        </section>
      </template>

      <!-- 其他分类页面布局 -->
      <template v-else>
        <section class="category-section">
          <div class="section-header">
            <h2 class="section-title">{{ categoryTitle }}</h2>
          </div>
          
          <!-- 作者列表 -->
          <div v-if="currentCategory === 'authors'" class="authors-grid">
            <div 
              v-for="author in poetryStore.authors.slice(0, 20)" 
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
            <div v-if="poetryStore.authors.length === 0" class="empty-state">
              <el-empty description="暂无作者数据" />
              <div style="margin-top: 20px; color: #666; font-size: 14px;">
                <p>调试信息:</p>
                <p>作者总数: {{ poetryStore.authors.length }}</p>
                <p>显示数据数: {{ poetryStore.authors.length }}</p>
                <p>加载状态: {{ poetryStore.loading ? '加载中' : '已完成' }}</p>
                <p>错误信息: {{ poetryStore.error || '无' }}</p>
              </div>
            </div>
          </div>

          <!-- 诗词/名句/古籍/收藏列表 -->
          <div v-else class="poem-grid">
            <PoetryCard
              v-for="poem in displayData"
              :key="poem.id"
              :poem="poem"
              @click="goToDetail(poem.id)"
            />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePoetryStore } from '../stores/poetry'
import { Search, Refresh } from '@element-plus/icons-vue'
import PoetryCard from '../components/PoetryCard.vue'
import AIAssistant from '../components/AIAssistant.vue'

const router = useRouter()
const route = useRoute()
const poetryStore = usePoetryStore()
const searchKeyword = ref('')
const currentCategory = ref('recommend') // 当前分类：recommend, poems, quotes, authors, classics, profile

const dailyPoem = computed(() => poetryStore.dailyPoem)
const popularPoems = computed(() => poetryStore.popularPoems)

const dynasties = ['唐', '宋', '其他']

// 监听路由参数变化
watch(() => route.query.category, (newCategory) => {
  if (newCategory) {
    currentCategory.value = newCategory as string
  } else {
    currentCategory.value = 'recommend'
  }
}, { immediate: true })

// 根据当前分类获取显示数据
const displayData = computed(() => {
  switch (currentCategory.value) {
    case 'authors':
      return poetryStore.authors.slice(0, 20) // 显示前20位作者
    case 'profile':
      // 我的页面显示收藏的诗词
      return poetryStore.favoritePoems.slice(0, 20)
    default:
      return [] // 推荐页面保持原有布局
  }
})

const categoryTitle = computed(() => {
  switch (currentCategory.value) {
    case 'authors': return '作者列表'
    case 'profile': return '我的收藏'
    default: return '今日推荐'
  }
})

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    poetryStore.setSearchKeyword(searchKeyword.value.trim())
    router.push('/search')
  }
}

const goToDetail = (id: string) => {
  router.push(`/detail/${id}`)
}

const goToDynastyList = (dynasty: string) => {
  router.push(`/list?dynasty=${dynasty}`)
}

const refreshPopularPoems = async () => {
  poetryStore.refreshPopularPoems()
}

const goToAuthorDetail = (authorName: string) => {
  // 跳转到作者详情页面（暂时跳转到搜索页面）
  router.push(`/search?author=${authorName}`)
}

onMounted(async () => {
  await poetryStore.loadPoems()
  await poetryStore.loadAuthors()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.search-section {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px 0;
  border-bottom: 1px solid #e8e8e8;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.search-container {
  display: flex;
  justify-content: flex-end;
}

.search-input {
  width: 300px;
  max-width: 100%;
}

@media (max-width: 768px) {
  .search-input {
    width: 250px;
  }
}

@media (max-width: 480px) {
  .search-input {
    width: 200px;
  }
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.section-title {
  color: var(--text-primary);
  margin-bottom: 20px;
  font-size: 24px;
  border-left: 4px solid var(--primary-color);
  padding-left: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.daily-poem {
  max-width: 600px;
  margin: 0 auto 20px;
}

.poem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .poem-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .poem-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.dynasty-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.dynasty-buttons .el-button {
  min-width: 100px;
  padding: 12px 24px;
  font-size: 16px;
}

/* 分类页面样式 */
.category-section {
  margin-bottom: 40px;
}

.authors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .authors-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .authors-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.author-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease-out;
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

/* 动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 为诗词卡片添加动画 */
.poem-grid .poetry-card {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.poem-grid .poetry-card:nth-child(1) { animation-delay: 0.1s; }
.poem-grid .poetry-card:nth-child(2) { animation-delay: 0.2s; }
.poem-grid .poetry-card:nth-child(3) { animation-delay: 0.3s; }
.poem-grid .poetry-card:nth-child(4) { animation-delay: 0.4s; }
.poem-grid .poetry-card:nth-child(5) { animation-delay: 0.5s; }
.poem-grid .poetry-card:nth-child(6) { animation-delay: 0.6s; }

/* 为作者卡片添加动画 */
.authors-grid .author-card {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.authors-grid .author-card:nth-child(1) { animation-delay: 0.1s; }
.authors-grid .author-card:nth-child(2) { animation-delay: 0.2s; }
.authors-grid .author-card:nth-child(3) { animation-delay: 0.3s; }
.authors-grid .author-card:nth-child(4) { animation-delay: 0.4s; }
.authors-grid .author-card:nth-child(5) { animation-delay: 0.5s; }
.authors-grid .author-card:nth-child(6) { animation-delay: 0.6s; }
</style>