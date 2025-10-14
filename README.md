# 古诗词欣赏应用

一个基于Vue.js的古诗词欣赏Web应用，提供诗词浏览、搜索和详情查看功能。

## 功能特性

- 📚 每日推荐一首经典诗词
- 🔍 智能搜索功能（支持标题、作者、内容搜索）
- 🏛️ 按朝代分类浏览（唐、宋、其他）
- 📱 响应式设计，支持移动端
- ⚡ 快速加载，优化用户体验

## 技术栈

- Vue 3 + Composition API
- Vue Router
- Pinia (状态管理)
- Element Plus (UI组件库)
- TypeScript

## 项目结构

```
src/
├── components/           # 共享组件
│   ├── PoetryCard.vue   # 诗词卡片
│   ├── SearchBox.vue    # 搜索框
│   └── Loading.vue      # 加载组件
├── views/               # 页面组件
│   ├── Home.vue         # 首页
│   ├── List.vue         # 列表页
│   ├── Detail.vue       # 详情页
│   └── Search.vue       # 搜索页
├── stores/              # 状态管理
│   └── poetry.js        # 诗词相关状态
├── data/                # 本地数据
│   ├── poems.json
│   └── authors.json
├── utils/               # 工具函数
│   └── debounce.js      # 防抖函数
└── router/              # 路由配置
    └── index.js
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 页面功能

### 首页 (Home)
- 每日推荐诗词
- 热门诗词列表（前10首）
- 朝代分类快速入口

### 诗词列表页 (List)
- 分页展示诗词列表（每页20条）
- 按朝代筛选功能
- 基础诗词信息展示

### 搜索页 (Search)
- 关键词实时搜索
- 搜索建议（防抖优化）
- 搜索结果展示

### 详情页 (Detail)
- 完整诗词内容
- 作者信息
- 注释和赏析

## 数据说明

应用使用本地JSON文件模拟API数据，包含200-300首经典诗词作品，涵盖唐宋等主要朝代。

## 开发计划

- 第1周：项目搭建 + 基础功能开发
- 第2周：搜索功能 + 详情页 + 优化部署

## 后续迭代

- V1.1：用户收藏系统、更多筛选条件
- V1.2：评论系统、社交分享功能