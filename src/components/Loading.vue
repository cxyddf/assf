<template>
  <div class="loading-container">
    <div class="loading-spinner">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
    </div>
    <p class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

defineProps<{
  text?: string
}>()
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading-spinner {
  margin-bottom: 16px;
}

.loading-spinner .el-icon {
  font-size: 32px;
  color: var(--primary-color);
  animation: rotate 2s linear infinite;
}

.loading-text {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>