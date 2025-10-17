# 异步工作流模式使用指南

## 概述

本系统已成功改造为异步工作流模式，实现了以下功能：

- **Webhook立即返回任务ID**：用户提交请求后立即获得任务ID
- **后台异步处理**：n8n工作流在后台处理任务
- **客户端轮询**：前端定期查询任务状态
- **回调支持**：支持n8n工作流完成后回调通知

## 架构设计

### 异步工作流流程

1. **用户提交请求** → 前端调用异步API
2. **立即返回任务ID** → 前端显示任务状态
3. **n8n后台处理** → 工作流执行分析任务
4. **轮询状态更新** → 前端定期查询进度
5. **回调通知** → n8n完成后回调服务器
6. **结果展示** → 前端显示最终分析结果

### 核心组件

- **前端组件** (`AIAssistant.vue`)：处理用户交互和状态显示
- **API服务** (`n8n-api.ts`)：管理异步任务和轮询
- **回调处理** (`callback.ts`)：接收n8n回调通知
- **类型定义** (`ai-assistant.ts`)：统一类型接口

## 配置说明

### 1. n8n工作流配置

在n8n中配置工作流支持异步模式：

```javascript
// Webhook触发器配置
{
  "method": "POST",
  "path": "/webhook/api/poetry-analysis",
  "responseMode": "responseNode"
}

// 异步响应配置
{
  "responseMode": "responseNode",
  "respondWith": "immediateResponse"
}
```

### 2. 回调URL配置

在n8n工作流中设置回调URL：

```
http://your-server.com/api/callback
```

### 3. 前端配置

修改 `src/services/n8n-api.ts` 中的配置：

```typescript
const CALLBACK_URL = 'http://localhost:5173/api/callback' // 根据实际部署修改
```

## 使用说明

### 基本使用流程

1. **用户输入诗词**：在AI助手输入框中输入诗词内容
2. **提交分析请求**：点击发送按钮
3. **立即获得任务ID**：系统显示任务ID和初始状态
4. **实时状态更新**：系统自动轮询任务状态
5. **查看分析结果**：任务完成后显示详细分析

### 状态显示说明

- **等待中** (`pending`)：任务已提交，等待处理
- **处理中** (`processing`)：工作流正在分析诗词
- **已完成** (`completed`)：分析完成，显示结果
- **失败** (`failed`)：分析失败，显示错误信息

### 进度指示

系统提供实时进度指示：
- 进度条显示当前处理进度
- 预计完成时间估算
- 实时状态更新

## API接口

### 启动异步任务

```typescript
POST /webhook/api/poetry-analysis
{
  "poetry": "诗词内容",
  "options": {
    "include_translation": true,
    "include_historical_context": true,
    "include_author_insights": true
  },
  "callback_url": "http://your-server.com/api/callback"
}
```

响应：
```typescript
{
  "task_id": "unique-task-id",
  "status": "pending",
  "message": "任务已提交",
  "estimated_completion_time": "2024-01-01T12:00:00Z"
}
```

### 查询任务状态

```typescript
GET /api/tasks/{taskId}/status
```

响应：
```typescript
{
  "task_id": "unique-task-id",
  "status": "processing",
  "progress": 50,
  "estimated_completion_time": "2024-01-01T12:00:00Z"
}
```

### 回调接口

```typescript
POST /api/callback
{
  "task_id": "unique-task-id",
  "status": "completed",
  "result": { /* 分析结果 */ },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 错误处理

### 常见错误及解决方案

1. **任务启动失败**
   - 检查n8n服务连接
   - 验证Webhook配置

2. **轮询超时**
   - 增加轮询次数或间隔
   - 检查网络连接

3. **回调接收失败**
   - 验证回调URL可访问性
   - 检查服务器配置

### 重试机制

系统提供多种重试选项：
- **延长等待时间**：增加轮询间隔
- **尝试其他诗词**：更换分析内容
- **检查工作流状态**：手动查询状态

## 部署说明

### 开发环境

1. 启动前端开发服务器
2. 确保n8n工作流正常运行
3. 配置正确的回调URL

### 生产环境

1. 部署前端到Web服务器
2. 配置n8n生产环境
3. 设置正确的域名和HTTPS
4. 配置回调端点安全认证

## 性能优化建议

### 前端优化

- 合理设置轮询间隔（建议3-5秒）
- 实现任务状态缓存
- 添加任务取消功能

### 后端优化

- 实现任务队列管理
- 添加任务超时机制
- 优化数据库查询

### n8n优化

- 配置工作流并发处理
- 添加错误重试机制
- 优化工作流执行效率

## 安全考虑

1. **任务ID安全**：使用不可预测的任务ID
2. **回调验证**：添加签名验证机制
3. **API限流**：防止恶意请求
4. **数据加密**：敏感数据传输加密

## 扩展功能

### 未来扩展方向

1. **批量处理**：支持多首诗词批量分析
2. **优先级队列**：支持不同优先级任务
3. **实时通知**：集成WebSocket实时通知
4. **历史记录**：保存分析历史记录
5. **导出功能**：支持结果导出

## 故障排除

### 常见问题

1. **任务状态不更新**
   - 检查轮询接口可用性
   - 验证任务ID正确性

2. **回调未触发**
   - 检查n8n工作流配置
   - 验证回调URL可访问性

3. **进度显示异常**
   - 检查进度计算逻辑
   - 验证状态更新机制

### 日志分析

系统提供详细日志记录：
- 任务启动日志
- 状态更新日志
- 错误处理日志
- 回调接收日志

## 技术支持

如有问题请联系开发团队或查阅相关文档。

---

*最后更新：2024年12月*