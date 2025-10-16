<template>
  <el-card class="poetry-card" shadow="hover" @click="$emit('click')">
    <template #header>
      <div class="card-header">
        <h3 class="poem-title">{{ poem.title }}</h3>
        <div class="poem-meta">
          <span class="author">{{ poem.author }}</span>
          <el-tag size="small" type="info">{{ poem.dynasty }}</el-tag>
        </div>
      </div>
    </template>
    
    <div class="poem-content">
      <p class="content-preview">{{ getContentPreview(poem.content) }}</p>
    </div>
    
    <template #footer>
      <div class="card-footer">
        <div class="poem-tags">
          <el-tag
            v-for="tag in poem.tags?.slice(0, 2)"
            :key="tag"
            size="small"
            type="primary"
          >
            {{ tag }}
          </el-tag>
          <span v-if="(poem.tags?.length || 0) > 2" class="more-tags">
            +{{ (poem.tags?.length || 0) - 2 }}
          </span>
        </div>
        <div class="footer-right">
          <div class="popularity" v-if="poem.popularity">
            <el-icon><Star /></el-icon>
            <span>{{ poem.popularity }}</span>
          </div>
          <el-button 
            class="favorite-btn"
            :icon="isFavorite ? StarFilled : Star"
            :type="isFavorite ? 'primary' : 'default'"
            size="small"
            @click.stop="toggleFavorite"
            circle
          />
        </div>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { Star, StarFilled } from '@element-plus/icons-vue'
import { usePoetryStore } from '../stores/poetry'
import type { Poem } from '../types'

const props = defineProps<{
  poem: Poem
}>()

defineEmits<{
  click: []
}>()

const poetryStore = usePoetryStore()
const isFavorite = $computed(() => poetryStore.isFavorite(props.poem.id))

const toggleFavorite = () => {
  poetryStore.toggleFavorite(props.poem.id)
}

const getContentPreview = (content: string) => {
  // 取前两句作为预览
  const lines = content.split(/[。！？]/).filter(line => line.trim())
  return lines.slice(0, 2).join('，') + '...'
}
</script>

<style scoped>
.poetry-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  border-radius: 8px;
  animation: fadeInUp 0.6s ease-out;
}

.poetry-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.poem-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.4;
  flex: 1;
}

.poem-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  min-width: 80px;
}

.author {
  color: var(--text-secondary);
  font-size: 14px;
}

.poem-content {
  margin: 12px 0;
}

.content-preview {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  font-family: '楷体', 'KaiTi', serif;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.favorite-btn {
  width: 32px;
  height: 32px;
  padding: 0;
}

.poem-tags {
  display: flex;
  gap: 4px;
  align-items: center;
}

.more-tags {
  color: var(--text-secondary);
  font-size: 12px;
}

.popularity {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffa500;
  font-size: 14px;
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
</style>