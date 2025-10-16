<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    class="navigation-menu"
    @select="handleMenuSelect"
  >
    <el-menu-item index="/">
      <el-icon><Home /></el-icon>
      <span>推荐</span>
    </el-menu-item>
    
    <el-menu-item index="authors">
      <el-icon><User /></el-icon>
      <span>作者</span>
    </el-menu-item>
    
    <el-menu-item index="profile">
      <el-icon><UserFilled /></el-icon>
      <span>我的</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  House as Home,
  User,
  UserFilled
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const activeMenu = ref('/')

// 定义事件
const emit = defineEmits<{
  (e: 'categoryChange', category: string): void
}>()

// 监听路由变化，更新激活菜单
watch(
  () => route.path,
  (newPath) => {
    // 根据路径设置激活菜单
    if (newPath === '/') {
      activeMenu.value = '/'
    } else if (newPath.startsWith('/detail')) {
      // 详情页保持当前激活状态
    } else {
      // 其他页面默认激活推荐
      activeMenu.value = '/'
    }
  },
  { immediate: true }
)

const handleMenuSelect = (index: string) => {
  activeMenu.value = index
  
  if (index === '/') {
    // 推荐页面跳转到首页
    router.push('/')
  } else {
    // 作者和我的分类触发事件，不跳转页面
    emit('categoryChange', index)
  }
}
</script>

<style scoped>
.navigation-menu {
  border-bottom: none;
  background: transparent;
  display: flex;
  justify-content: center;
  width: 100%;
}

.navigation-menu .el-menu-item {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.navigation-menu .el-menu-item:hover {
  color: var(--primary-color);
  background: transparent;
  border-bottom-color: var(--primary-color);
}

.navigation-menu .el-menu-item.is-active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  background: transparent;
}

.navigation-menu .el-menu-item .el-icon {
  margin-right: 8px;
}
</style>