<template>
  <div class="list-page">
    <!-- 页面头部 -->
    <el-header class="page-header">
      <div class="header-content">
        <el-button :icon="ArrowLeft" @click="router.back()">返回</el-button>
        <h1 class="page-title">诗词列表</h1>
        <div class="filter-section">
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

      <div v-else class="poem-list">
        <PoetryCard
          v-for="poem in currentPagePoems"
          :key="poem.id"
          :poem="poem"
          @click="goToDetail(poem.id)"
        />
        
        <!-- 分页 -->
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredPoems.length"
          layout="prev, pager, next, total"
          @current-change="handlePageChange"
        />
      </div>
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

const handleDynastyChange = () => {
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const goToDetail = (id: number) => {
  router.push(`/detail/${id}`)
}

onMounted(async () => {
  loading.value = true
  await poetryStore.loadPoems()
  
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
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
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

.el-pagination {
  justify-content: center;
  margin-top: 30px;
}
</style>