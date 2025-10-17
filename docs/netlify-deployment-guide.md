# Netlify 部署指南

## 概述

本指南详细说明如何将诗词赏析AI助手部署到Netlify，并配置异步工作流回调功能。

## 部署步骤

### 1. 准备部署文件

确保项目包含以下文件：
- `netlify.toml` - Netlify配置文件
- `netlify/functions/callback.js` - 回调处理函数
- 完整的项目源代码

### 2. 构建项目

在部署前，确保项目可以正常构建：

```bash
# 安装依赖
npm install

# 构建项目
npm run build
```

### 3. 部署到Netlify

#### 方法一：通过Git仓库部署（推荐）

1. 将代码推送到GitHub/GitLab
2. 登录 [Netlify](https://netlify.com)
3. 点击 "New site from Git"
4. 选择您的代码仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. 点击 "Deploy site"

#### 方法二：手动拖拽部署

1. 运行 `npm run build` 生成dist目录
2. 将整个dist目录拖拽到Netlify部署界面

### 4. 配置环境变量

在Netlify控制台中设置环境变量：

```bash
# 必需的环境变量
NODE_VERSION=18

# n8n配置 - 已配置正确的n8n服务地址
VITE_N8N_BASE_URL=https://ykyyln.app.n8n.cloud
VITE_N8N_WEBHOOK_PATH=/webhook/api/poetry-analysis
VITE_CALLBACK_URL=https://strong-baklava-a0b6e8.netlify.app/.netlify/functions/callback
```

**重要：n8n服务地址配置说明**

当前异步任务失败的原因是n8n服务地址配置不正确。您需要：

1. **获取正确的n8n服务地址**：
   - 登录您的n8n实例
   - 找到诗词分析工作流
   - 复制工作流的Webhook URL

2. **配置正确的环境变量**：
   - 将 `VITE_N8N_BASE_URL` 设置为您的实际n8n域名
   - 将 `VITE_N8N_WEBHOOK_PATH` 设置为工作流的Webhook路径

**示例配置**：
如果您的Webhook URL是：`https://my-n8n.example.com/webhook/poetry-analysis`
- `VITE_N8N_BASE_URL=https://my-n8n.example.com`
- `VITE_N8N_WEBHOOK_PATH=/webhook/poetry-analysis`

### 5. 验证部署

部署完成后，访问您的Netlify域名：
```
https://strong-baklava-a0b6e8.netlify.app
```

## 回调URL配置

### 最终回调URL

部署后的回调URL为：
```
https://strong-baklava-a0b6e8.netlify.app/.netlify/functions/callback
```

### 在n8n工作流中配置

在n8n工作流中设置Webhook回调：

1. 添加Webhook节点
2. 设置HTTP方法为 POST
3. 设置URL为上述回调URL
4. 配置响应模式为异步

## 功能验证

### 1. 测试回调功能

使用以下curl命令测试回调功能：

```bash
curl -X POST https://strong-baklava-a0b6e8.netlify.app/.netlify/functions/callback \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "test-123",
    "status": "completed",
    "result": {"message": "测试成功"},
    "timestamp": "2024-01-01T12:00:00Z"
  }'
```

### 2. 检查Netlify Function日志

在Netlify控制台的 "Functions" 标签页查看日志：
- 成功回调会显示 "✅ Task completed"
- 错误会显示 "❌ Error processing callback"

## 故障排除

### 常见问题

#### 1. 构建失败
**症状**: 部署时构建失败
**解决方案**:
- 检查 `package.json` 中的构建脚本
- 确保所有依赖正确安装
- 查看构建日志中的具体错误信息

#### 2. 回调函数404错误
**症状**: n8n回调返回404
**解决方案**:
- 检查Netlify Function路径是否正确
- 验证 `netlify.toml` 配置
- 确保函数文件在正确位置

#### 3. CORS错误
**症状**: 前端无法调用API
**解决方案**:
- 检查Netlify的CORS配置
- 验证 `netlify.toml` 中的headers配置

#### 4. 函数超时
**症状**: 回调处理超时（默认10秒）
**解决方案**:
- 优化函数逻辑，减少处理时间
- 考虑使用异步处理或队列

### 日志查看

在Netlify控制台中查看日志：
1. 进入站点控制台
2. 点击 "Functions" 标签
3. 选择 "callback" 函数
4. 查看实时日志

## 性能优化

### 1. 函数优化

- 保持函数简洁，避免复杂计算
- 使用环境变量存储配置
- 实现适当的错误处理

### 2. 缓存策略

- 配置适当的缓存头
- 使用CDN缓存静态资源
- 考虑实现结果缓存

### 3. 监控和告警

- 设置Netlify的监控告警
- 监控函数执行时间和错误率
- 配置性能监控

## 安全考虑

### 1. 输入验证

- 验证所有输入数据
- 实现适当的错误处理
- 防止注入攻击

### 2. 访问控制

- 考虑添加API密钥验证
- 实现请求频率限制
- 配置适当的CORS策略

### 3. 数据保护

- 不要记录敏感信息
- 使用HTTPS传输数据
- 定期更新依赖

## 扩展功能

### 未来扩展方向

1. **数据库集成**
   - 添加Supabase或MongoDB集成
   - 存储任务状态和分析结果

2. **实时通知**
   - 集成WebSocket实时通知
   - 添加邮件/SMS通知

3. **用户认证**
   - 添加用户登录功能
   - 实现任务历史记录

## 支持资源

- [Netlify 官方文档](https://docs.netlify.com/)
- [Netlify Functions 文档](https://docs.netlify.com/functions/overview/)
- [项目GitHub仓库](您的仓库地址)

## 联系支持

如有部署问题，请联系开发团队或查阅项目文档。

---

*最后更新：2024年12月*