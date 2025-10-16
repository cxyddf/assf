<template>
  <div class="detail-page">
    <!-- 页面头部 -->
    <el-header class="page-header">
      <div class="header-content">
        <el-button :icon="ArrowLeft" @click="router.back()">返回</el-button>
        <h1 class="page-title">诗词详情</h1>
      </div>
    </el-header>

    <!-- 诗词内容 -->
    <el-main class="page-content">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>

      <div v-else-if="!poem" class="empty-state">
        <el-empty description="诗词不存在" />
      </div>

      <div v-else class="poem-detail">
        <!-- 诗词基本信息 -->
        <div class="poem-header">
          <div class="title-section">
            <h1 class="poem-title">{{ poem.title }}</h1>
            <el-button 
              class="favorite-btn"
              :icon="isFavorite ? StarFilled : Star"
              :type="isFavorite ? 'primary' : 'default'"
              size="large"
              @click="toggleFavorite"
            >
              {{ isFavorite ? '已收藏' : '收藏' }}
            </el-button>
          </div>
          <div class="poem-meta">
            <span class="author">{{ poem.author }}</span>
            <span class="dynasty">{{ poem.dynasty }}</span>
          </div>
        </div>

        <!-- 诗词内容 -->
        <div class="poem-content">
          <pre class="content-text">{{ poem.content }}</pre>
        </div>

        <!-- 标签 -->
        <div v-if="poem.tags && poem.tags.length > 0" class="poem-tags">
          <el-tag
            v-for="tag in poem.tags"
            :key="tag"
            type="info"
            size="small"
          >
            {{ tag }}
          </el-tag>
        </div>

        <!-- 注释和赏析 -->
        <div class="poem-annotations">
          <el-collapse v-model="activeNames">
            <el-collapse-item v-if="poem.annotation" title="注释" name="annotation">
              <p>{{ poem.annotation }}</p>
            </el-collapse-item>
            <el-collapse-item title="诗词赏析" name="appreciation">
              <div class="appreciation-section">
                <div v-if="poem && poem.appreciation" class="appreciation-content">
                  <p>{{ poem.appreciation }}</p>
                </div>
                <div v-else class="no-appreciation">
                  <p>暂无赏析内容</p>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- 作者信息 -->
        <div v-if="author" class="author-info">
          <div class="author-header">
            <h3>作者简介</h3>
          </div>
          <div class="author-content">
            <p>{{ author.description }}</p>
            <div class="author-stats">
              <span>作品数量: {{ author.poemCount }}首</span>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePoetryStore } from '../stores/poetry'
import { ArrowLeft, Search, Star, StarFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const poetryStore = usePoetryStore()

const loading = ref(false)
const activeNames = ref(['annotation', 'appreciation'])

const poemId = computed(() => route.params.id as string)
const poem = computed(() => poetryStore.getPoemById(poemId.value))
const author = computed(() => {
  if (poem.value) {
    return poetryStore.getAuthorByName(poem.value.author)
  }
  return null
})

const isFavorite = computed(() => {
  if (poem.value) {
    return poetryStore.isFavorite(poem.value.id)
  }
  return false
})

const toggleFavorite = () => {
  if (poem.value) {
    poetryStore.toggleFavorite(poem.value.id)
  }
}

const generateAppreciation = () => {
  // 本地赏析功能 - 直接显示诗词自带的赏析内容
  // 功能已实现，直接显示诗词的赏析内容
}

const generateAuthorIntro = () => {
  // 本地作者介绍功能 - 直接显示作者信息
  // 功能已实现，直接显示作者信息
}

onMounted(async () => {
  loading.value = true
  
  // 如果诗词库为空，先加载本地数据
  if (poetryStore.poems.length === 0) {
    await poetryStore.loadPoems()
  }
  
  // 如果作者库为空，先加载作者数据
  if (poetryStore.authors.length === 0) {
    await poetryStore.loadAuthors()
  }
  
  loading.value = false
})
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e8e8e8;
  padding: 0 20px;
  position: relative;
}

.header-content {
  max-width: 800px;
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
}

.page-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.loading-container {
  max-width: 800px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.poem-detail {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.poem-header {
  text-align: center;
  margin-bottom: 40px;
}

.title-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.favorite-btn {
  margin-left: 20px;
}

.poem-title {
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.poem-meta {
  color: var(--text-secondary);
  font-size: 16px;
}

.author {
  margin-right: 20px;
}

.poem-content {
  text-align: center;
  margin-bottom: 30px;
}

.content-text {
  font-size: 18px;
  line-height: 2;
  color: var(--text-primary);
  white-space: pre-wrap;
  font-family: '楷体', 'KaiTi', serif;
}

.poem-tags {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 30px;
}

.poem-annotations {
  margin-bottom: 40px;
}

.author-info {
  border-top: 1px solid #e8e8e8;
  padding-top: 30px;
}

.author-info h3 {
  color: var(--text-primary);
  margin-bottom: 15px;
}

.author-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.author-info p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 15px;
}

.ai-section {
  padding: 10px 0;
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.ai-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.ai-loading, .ai-error {
  margin: 10px 0;
}

.ai-placeholder {
  color: var(--text-secondary);
  font-style: italic;
  text-align: center;
  padding: 20px;
}

.author-stats {
  color: var(--primary-color);
  font-weight: bold;
}
</style>