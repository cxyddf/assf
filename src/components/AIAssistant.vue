<template>
  <div class="ai-assistant" :class="{ 'ai-assistant--open': isOpen }">
    <!-- 浮动按钮 -->
    <button 
      class="ai-assistant__toggle"
      @click="toggleAssistant"
      :class="{ 'ai-assistant__toggle--active': isOpen }"
    >
      <span class="ai-icon">🤖</span>
    </button>

    <!-- 聊天窗口 -->
    <div v-if="isOpen" class="ai-assistant__window">
      <!-- 头部 -->
      <div class="ai-assistant__header">
        <h3>诗词赏析AI助手</h3>
        <button @click="closeAssistant" class="ai-assistant__close">×</button>
      </div>

      <!-- 消息区域 -->
      <div class="ai-assistant__messages">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="message"
          :class="`message--${message.type}`"
        >
          <div class="message__content">
            {{ message.content }}
          </div>
          
          <!-- 异步任务状态显示 -->
          <div v-if="message.taskId" class="task-status">
            <div class="task-info">
              <span class="task-id">任务ID: {{ message.taskId }}</span>
              <span class="task-status-badge" :class="`status-${message.taskStatus}`">
                {{ getStatusText(message.taskStatus) }}
              </span>
            </div>
            <div v-if="message.taskStatus === 'processing'" class="task-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: (message.progress || 0) + '%' }"></div>
              </div>
              <span class="progress-text">{{ message.progress || 0 }}%</span>
            </div>
            <div v-if="message.estimatedCompletionTime" class="task-eta">
              预计完成: {{ formatTime(message.estimatedCompletionTime) }}
            </div>
          </div>
          
          <div v-if="message.rawResponse" class="raw-response">
            <div v-html="formatRawResponse(message.rawResponse)"></div>
          </div>
          
          <div v-if="message.showRetryOptions" class="retry-options">
            <h4>🔄 重试选项</h4>
            <div class="retry-buttons">
              <button @click="retryWithLongerTimeout" class="retry-btn retry-btn--long">
                延长等待时间重试
              </button>
              <button @click="retryWithDifferentPoetry" class="retry-btn retry-btn--different">
                尝试其他诗词
              </button>
              <button @click="showWorkflowStatus" class="retry-btn retry-btn--status">
                检查工作流状态
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="isLoading" class="loading">
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="ai-assistant__input">
        <textarea
          v-model="inputText"
          placeholder="请输入诗词内容或问题..."
          @keydown.enter="handleSend"
          rows="3"
          class="ai-assistant__textarea"
        ></textarea>
        <button 
          @click="handleSend" 
          :disabled="!inputText.trim() || isLoading"
          class="ai-assistant__send"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import type { AIMessage, PoetryAnalysisResult, AsyncTaskResponse, TaskStatusResponse } from '../types/ai-assistant'
import { n8nApiService } from '../services/n8n-api'

const isOpen = ref(false)
const isLoading = ref(false)
const inputText = ref('')
const messages = reactive<AIMessage[]>([])
const activeTasks = reactive<Map<string, NodeJS.Timeout>>(new Map())

const toggleAssistant = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && messages.length === 0) {
    addWelcomeMessage()
  }
}

const closeAssistant = () => {
  isOpen.value = false
}

const addWelcomeMessage = () => {
  const welcomeMessage: AIMessage = {
    id: Date.now().toString(),
    type: 'assistant',
    content: '您好！我是诗词赏析AI助手，可以帮您分析古典诗词的意境、翻译和艺术特色。请提供一首诗词内容。',
    timestamp: new Date()
  }
  messages.push(welcomeMessage)
}

const handleSend = async () => {
  if (!inputText.value.trim()) return

  // 添加用户消息
  const userMessage: AIMessage = {
    id: Date.now().toString(),
    type: 'user',
    content: inputText.value,
    timestamp: new Date()
  }
  messages.push(userMessage)

  const userInput = inputText.value
  inputText.value = ''
  isLoading.value = true

  try {
    // 直接调用同步分析，确保返回完整结果
    const analysisResult = await n8nApiService.analyzePoetry({
      poetry: userInput.trim(),
      options: {
        include_translation: true,
        include_historical_context: true,
        include_author_insights: true
      }
    })

    // 添加分析结果消息
    const resultMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `✅ 诗词分析完成：${userInput.split('\n')[0]}...`,
      timestamp: new Date(),
      rawResponse: analysisResult
    }
    messages.push(resultMessage)

  } catch (error) {
    console.error('诗词分析失败:', error)
    
    const errorMessage: AIMessage = {
      id: (Date.now() + 2).toString(),
      type: 'assistant',
      content: '抱歉，诗词分析失败，请稍后重试。',
      timestamp: new Date(),
      showRetryOptions: true
    }
    messages.push(errorMessage)
  } finally {
    isLoading.value = false
  }
}

/**
 * 开始轮询任务状态（保留函数，但不再使用）
 */
const startTaskPolling = async (taskId: string, userInput: string) => {
  // 此函数已不再使用，保留以防需要
  console.warn('startTaskPolling函数已弃用，使用同步分析模式')
}

/**
 * 根据任务状态计算进度
 */
const calculateProgress = (status: string): number => {
  switch (status) {
    case 'pending': return 10
    case 'processing': return 50
    case 'completed': return 100
    case 'failed': return 0
    default: return 0
  }
}

// 格式化原始响应
const formatRawResponse = (response: any): string => {
  if (typeof response === 'string') {
    return response
  }
  
  if (response && typeof response === 'object') {
    // 如果是JSON对象，格式化为可读的HTML
    let html = ''
    
    for (const [key, value] of Object.entries(response)) {
      if (value && typeof value === 'string' && value.length > 0) {
        html += `<div class="response-section">
          <h4>${key}</h4>
          <p>${value}</p>
        </div>`
      }
    }
    
    return html || JSON.stringify(response, null, 2)
  }
  
  return JSON.stringify(response, null, 2)
}

// 重试功能
const retryWithLongerTimeout = async () => {
  console.log('🔄 延长等待时间重试...')
  // 这里可以实现更长的轮询时间
}

const retryWithDifferentPoetry = () => {
  console.log('🔄 尝试其他诗词...')
  inputText.value = '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
}

const showWorkflowStatus = () => {
  console.log('🔍 检查工作流状态...')
  // 这里可以显示工作流状态信息
}

// 辅助函数
const getStatusText = (status: string | undefined): string => {
  switch (status) {
    case 'pending': return '等待中'
    case 'processing': return '处理中'
    case 'completed': return '已完成'
    case 'failed': return '失败'
    default: return '未知'
  }
}

const formatTime = (timeString: string): string => {
  try {
    const date = new Date(timeString)
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return timeString
  }
}

// 清理活动任务
const cleanupActiveTasks = () => {
  activeTasks.forEach((timeoutId, taskId) => {
    clearTimeout(timeoutId)
    activeTasks.delete(taskId)
  })
}

// 组件生命周期
onMounted(() => {
  console.log('AI助手组件已挂载')
})

onUnmounted(() => {
  console.log('AI助手组件已卸载，清理活动任务')
  cleanupActiveTasks()
})
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.ai-assistant__toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
  transition: all 0.3s ease;
}

.ai-assistant__toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(139, 69, 19, 0.4);
}

.ai-assistant__toggle--active {
  background: linear-gradient(135deg, #A0522D, #8B4513);
}

.ai-assistant__window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 400px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
}

.ai-assistant__header {
  padding: 16px;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  color: white;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-assistant__header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.ai-assistant__close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-assistant__messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8f9fa;
}

.message {
  margin-bottom: 16px;
}

.message__content {
  padding: 12px;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
}

.message--user .message__content {
  background: #8B4513;
  color: white;
  margin-left: auto;
}

.message--assistant .message__content {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
}

.poetry-analysis {
  margin-top: 8px;
  padding: 12px;
  background: #fff9f0;
  border-radius: 8px;
  border-left: 4px solid #D2B48C;
}

.analysis-section {
  margin-bottom: 12px;
}

.analysis-section h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #8B4513;
}

.analysis-section p {
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  color: #666;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.loading-dots span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8B4513;
  margin: 0 2px;
  animation: loading 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes loading {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}

.ai-assistant__input {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background: white;
  border-radius: 0 0 12px 12px;
}

.ai-assistant__textarea {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  resize: none;
  margin-bottom: 8px;
}

.ai-assistant__textarea:focus {
  outline: none;
  border-color: #8B4513;
}

.ai-assistant__send {
  width: 100%;
  padding: 10px;
  background: #8B4513;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.ai-assistant__send:hover:not(:disabled) {
  background: #A0522D;
}

.ai-assistant__send:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.raw-response {
  margin-top: 8px;
  padding: 12px;
  background: #fff9f0;
  border-radius: 8px;
  border-left: 4px solid #D2B48C;
  max-height: 400px;
  overflow-y: auto;
}

.response-section {
  margin-bottom: 16px;
}

.response-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #8B4513;
  font-weight: 600;
}

.response-section p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
}

.retry-options {
  margin-top: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.retry-options h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #8B4513;
  font-weight: 600;
}

.retry-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.retry-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #f0f0f0;
  border-color: #8B4513;
}

.retry-btn--long {
  border-color: #ffc107;
  color: #856404;
}

.retry-btn--different {
  border-color: #28a745;
  color: #155724;
}

.retry-btn--status {
  border-color: #17a2b8;
  color: #0c5460;
}

/* 异步任务状态样式 */
.task-status {
  margin-top: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #8B4513;
}

.task-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-id {
  font-size: 12px;
  color: #666;
  font-family: monospace;
}

.task-status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-processing {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.status-completed {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-failed {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8B4513, #A0522D);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 40px;
  text-align: right;
}

.task-eta {
  font-size: 11px;
  color: #999;
  text-align: right;
}
</style>