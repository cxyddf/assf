<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 应用根组件
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

/* 全局样式变量 */
:root {
  --primary-color: #8d6e63;
  --secondary-color: #795548;
  --text-primary: #333333;
  --text-secondary: #666666;
  --background-color: #fafafa;
}
</style>