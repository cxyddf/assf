<template>
  <div class="home">
    <!-- 导航栏 -->
    <el-header class="header">
      <div class="nav-container">
        <h1 class="logo">古诗词欣赏</h1>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索诗词、作者..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>
    </el-header>

    <!-- 主要内容 -->
    <el-main class="main-content">
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
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePoetryStore } from '../stores/poetry'
import { Search, Refresh } from '@element-plus/icons-vue'
import PoetryCard from '../components/PoetryCard.vue'

const router = useRouter()
const poetryStore = usePoetryStore()
const searchKeyword = ref('')

const dailyPoem = computed(() => poetryStore.dailyPoem)
const popularPoems = computed(() => poetryStore.popularPoems)

const dynasties = ['唐', '宋', '其他']

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    poetryStore.setSearchKeyword(searchKeyword.value.trim())
    router.push('/search')
  }
}

const goToDetail = (id: number) => {
  router.push(`/detail/${id}`)
}

const goToDynastyList = (dynasty: string) => {
  router.push(`/list?dynasty=${dynasty}`)
}



const refreshPopularPoems = async () => {
  // 调用store的刷新方法
  poetryStore.refreshPopularPoems()
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

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e8e8e8;
  padding: 0 20px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.logo {
  color: var(--primary-color);
  font-size: 24px;
  font-weight: bold;
}

.search-input {
  width: 300px;
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

.ai-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ai-content h3 {
  color: var(--primary-color);
  margin-bottom: 10px;
}

.ai-text {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.ai-loading, .ai-error {
  margin-top: 20px;
}

.poem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
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
</style>