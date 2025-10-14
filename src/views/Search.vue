<template>
  <div class="search-page">
    <!-- 搜索框 -->
    <el-header class="search-header">
      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="输入诗词标题、作者或内容..."
          size="large"
          @input="handleSearchInput"
          @keyup.enter="performSearch"
        >
          <template #prepend>
            <el-button :icon="Search" @click="performSearch" />
          </template>
          <template #append>
            <el-button :icon="Close" @click="clearSearch" v-if="searchKeyword" />
          </template>
        </el-input>
      </div>
    </el-header>

    <!-- 搜索结果 -->
    <el-main class="search-results">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="searchKeyword && searchResults.length === 0" class="empty-state">
        <el-empty description="未找到相关诗词" />
      </div>

      <div v-else-if="!searchKeyword" class="search-tips">
        <div class="tips-content">
          <h3>搜索提示</h3>
          <p>• 输入诗词标题进行搜索（如：静夜思）</p>
          <p>• 输入作者姓名进行搜索（如：李白）</p>
          <p>• 输入诗词内容关键词进行搜索（如：明月）</p>
        </div>
      </div>

      <div v-else class="results-container">
        <div class="results-header">
          <h3>搜索结果 ({{ searchResults.length }} 首)</h3>
        </div>
        
        <div class="results-list">
          <PoetryCard
            v-for="poem in searchResults"
            :key="poem.id"
            :poem="poem"
            @click="goToDetail(poem.id)"
          />
        </div>
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoetryStore } from '../stores/poetry'
import { Search, Close } from '@element-plus/icons-vue'
import { debounce } from '../utils/debounce'
import PoetryCard from '../components/PoetryCard.vue'

const router = useRouter()
const poetryStore = usePoetryStore()

const searchKeyword = ref('')
const loading = ref(false)

const searchResults = computed(() => poetryStore.filteredPoems)

const performSearch = () => {
  if (searchKeyword.value.trim()) {
    poetryStore.setSearchKeyword(searchKeyword.value.trim())
  }
}

const handleSearchInput = debounce(() => {
  performSearch()
}, 300)

const clearSearch = () => {
  searchKeyword.value = ''
  poetryStore.setSearchKeyword('')
}

const goToDetail = (id: number) => {
  router.push(`/detail/${id}`)
}

onMounted(async () => {
  await poetryStore.loadPoems()
  await poetryStore.loadAuthors()
  
  // 如果有初始搜索关键词
  if (poetryStore.searchKeyword) {
    searchKeyword.value = poetryStore.searchKeyword
  }
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.search-header {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  padding: 20px;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-results {
  max-width: 800px;
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

.search-tips {
  text-align: center;
  padding: 60px 0;
}

.tips-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}

.tips-content h3 {
  color: var(--text-primary);
  margin-bottom: 20px;
}

.tips-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 10px;
}

.results-header {
  margin-bottom: 20px;
}

.results-header h3 {
  color: var(--text-primary);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>