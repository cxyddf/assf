<template>
  <div id="app">
    <!-- 应用布局 -->
    <div class="app-layout">
      <!-- 顶部导航栏 -->
      <el-header class="app-header">
        <div class="header-content">
          <h1 class="app-logo">古诗词欣赏</h1>
          <Navigation @category-change="handleCategoryChange" />
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Navigation from './components/Navigation.vue'

const router = useRouter()

const handleCategoryChange = (category: string) => {
  // 在首页时，通过路由参数传递分类信息，不跳转页面
  if (router.currentRoute.value.path === '/') {
    // 更新URL参数，触发页面内容更新
    router.replace({ 
      path: '/',
      query: { category }
    })
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  min-height: 100vh;
  background-color: #fafafa;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e8e8e8;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  padding: 10px 20px;
}

.app-logo {
  color: var(--primary-color);
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.app-main {
  flex: 1;
  padding: 0;
}

/* 全局样式变量 */
:root {
  --primary-color: #8d6e63;
  --secondary-color: #795548;
  --text-primary: #333333;
  --text-secondary: #666666;
  --background-color: #fafafa;
}
</style>