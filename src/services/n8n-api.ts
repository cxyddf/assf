// n8n API服务 - 异步工作流模式
import { logger } from '../utils/logger'

// n8n配置 - 已更新为正确的n8n服务地址
const N8N_BASE_URL = process.env.VITE_N8N_BASE_URL || 'https://ykyyln.app.n8n.cloud' // n8n服务地址
const WEBHOOK_PATH = process.env.VITE_N8N_WEBHOOK_PATH || '/webhook/api/poetry-analysis' // Webhook路径
const CALLBACK_URL = process.env.VITE_CALLBACK_URL || 'https://strong-baklava-a0b6e8.netlify.app/.netlify/functions/callback' // Netlify Function回调URL

export interface PoetryAnalysisRequest {
  poetry: string
  options?: {
    include_translation?: boolean
    include_historical_context?: boolean
    include_author_insights?: boolean
  }
  callback_url?: string // 异步回调URL
}

export interface PoetryAnalysisResponse {
  success: boolean
  data?: {
    translation: string
    theme: string
    artistic_features: string
    historical_context: string
    author_insights: string
    appreciation: string
  }
  error?: string
  timestamp: string
}

// 异步任务相关接口
export interface AsyncTaskResponse {
  task_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  message: string
  estimated_completion_time?: string
}

export interface TaskStatusResponse {
  task_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: PoetryAnalysisResponse
  error?: string
  created_at: string
  updated_at: string
}

export interface CallbackPayload {
  task_id: string
  status: 'completed' | 'failed'
  result?: PoetryAnalysisResponse
  error?: string
  timestamp: string
}

export class N8NApiService {
  private baseUrl: string

  constructor(baseUrl: string = N8N_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * 调用n8n工作流进行诗词分析
   */
  async analyzePoetry(request: PoetryAnalysisRequest): Promise<PoetryAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${WEBHOOK_PATH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // 检查是否是异步工作流启动响应
      if (result.message === "Workflow was started") {
        logger.warn('n8n工作流已启动，开始轮询获取完整结果...')
        const completeResult = await this.pollForCompleteResult(request.poetry, 10) // 增加轮询次数到10次
        logger.info('轮询获取到完整结果:', completeResult)
        return completeResult
      }
      
      // 直接返回n8n工作流的结果
      logger.info('直接获取到完整结果:', result)
      return result
    } catch (error) {
      logger.error('调用n8n API失败:', error)
      throw error // 直接抛出错误，不使用后备分析
    }
  }

  /**
   * 轮询获取完整的工作流结果
   */
  private async pollForCompleteResult(poetry: string, maxAttempts: number = 10): Promise<PoetryAnalysisResponse> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        logger.info(`轮询尝试 ${attempt}/${maxAttempts} 获取完整结果...`)
        
        // 优化等待时间：前几次快速轮询，后面逐渐增加
        const waitTime = attempt <= 3 ? 3000 : 5000 + (attempt - 3) * 2000 // 3s, 3s, 3s, 5s, 7s, 9s
        await new Promise(resolve => setTimeout(resolve, waitTime))
        
        // 重新请求工作流
        const response = await fetch(`${this.baseUrl}${WEBHOOK_PATH}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            poetry: poetry.trim(),
            options: {
              include_translation: true,
              include_historical_context: true,
              include_author_insights: true
            }
          })
        })

        if (response.ok) {
          const result = await response.json()
          
          // 检查是否获得了完整的分析结果
          if (result.success && result.data) {
            logger.info('轮询成功获取到完整分析结果')
            return result
          }
          
          // 检查是否有分析内容（即使success为false）
          if (result.data && typeof result.data === 'object') {
            logger.info('轮询获取到包含数据的分析结果')
            return result
          }
          
          // 如果返回了JSON对象且有内容，也认为成功
          if (result && typeof result === 'object' && Object.keys(result).length > 0) {
            logger.info('轮询获取到有效JSON结果')
            return result
          }
          
          // 如果仍然是启动消息，继续轮询
          if (result.message === "Workflow was started") {
            logger.info(`工作流仍在处理中，继续等待... (${attempt}/${maxAttempts})`)
            continue
          }
          
          // 其他情况，返回结果
          return result
        }
      } catch (error) {
        logger.warn(`轮询尝试 ${attempt} 失败:`, error)
      }
    }
    
    // 所有轮询尝试都失败，返回超时信息
    logger.warn('轮询超时，工作流可能仍在处理中')
    return {
      success: false,
      error: '工作流处理超时，请稍后重试',
      timestamp: new Date().toISOString()
    }
  }

  /**
   * 异步启动诗词分析任务
   * Webhook立即返回任务ID，后台处理完成后通过回调URL返回结果
   */
  async startAsyncPoetryAnalysis(request: PoetryAnalysisRequest): Promise<AsyncTaskResponse> {
    try {
      // 检查n8n服务是否可用
      const isHealthy = await this.checkHealth()
      if (!isHealthy) {
        throw new Error('n8n服务不可用，请检查服务地址配置')
      }

      const asyncRequest = {
        poetry: request.poetry,
        options: request.options,
        callback_url: CALLBACK_URL,
        async_mode: true,
        timestamp: new Date().toISOString()
      }

      logger.info(`发送异步请求到n8n: ${this.baseUrl}${WEBHOOK_PATH}`)
      
      const response = await fetch(`${this.baseUrl}${WEBHOOK_PATH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(asyncRequest)
      })

      if (!response.ok) {
        const errorText = await response.text()
        logger.error(`HTTP错误! 状态: ${response.status}, 响应: ${errorText}`)
        throw new Error(`HTTP错误! 状态: ${response.status}`)
      }

      const result = await response.json()
      logger.info('n8n响应:', result)
      
      // 检查n8n可能返回的不同格式
      if (result.task_id || result.id) {
        const taskId = result.task_id || result.id
        logger.info(`异步任务已启动，任务ID: ${taskId}`)
        return {
          task_id: taskId,
          status: 'pending',
          message: '任务已提交，正在处理中...',
          estimated_completion_time: new Date(Date.now() + 30000).toISOString()
        }
      }
      
      // 检查n8n工作流启动响应
      if (result.message && result.message.includes('started') || result.message === "Workflow was started") {
        const taskId = `n8n_${Date.now()}`
        logger.info(`n8n工作流已启动，生成任务ID: ${taskId}`)
        return {
          task_id: taskId,
          status: 'pending',
          message: '工作流已启动，正在处理中...',
          estimated_completion_time: new Date(Date.now() + 45000).toISOString()
        }
      }
      
      // 如果返回了完整结果，直接完成
      if (result.success && result.data) {
        logger.info('工作流返回同步结果')
        return {
          task_id: `sync_${Date.now()}`,
          status: 'completed',
          message: '同步处理完成'
        }
      }
      
      // 如果返回了其他格式，尝试解析
      if (result && typeof result === 'object') {
        logger.info('工作流返回其他格式结果，尝试处理')
        return {
          task_id: `auto_${Date.now()}`,
          status: 'completed',
          message: '处理完成'
        }
      }
      
      throw new Error(`无法解析n8n响应: ${JSON.stringify(result)}`)
    } catch (error) {
      logger.error('启动异步任务失败:', error)
      // 提供更友好的错误信息
      if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        throw new Error('网络连接失败，请检查n8n服务地址配置')
      }
      throw error
    }
  }

  /**
   * 轮询任务状态
   */
  async pollTaskStatus(taskId: string, maxAttempts: number = 10): Promise<TaskStatusResponse> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        logger.info(`轮询任务状态 ${attempt}/${maxAttempts} - 任务ID: ${taskId}`)
        
        // 动态等待时间：前几次快速轮询，后面逐渐增加
        const waitTime = attempt <= 3 ? 2000 : 3000 + (attempt - 3) * 2000
        await new Promise(resolve => setTimeout(resolve, waitTime))
        
        // 模拟任务状态查询（实际应该调用n8n的状态查询接口）
        const statusResponse = await this.simulateTaskStatus(taskId, attempt, maxAttempts)
        
        if (statusResponse.status === 'completed') {
          logger.info(`任务 ${taskId} 已完成`)
          return statusResponse
        }
        
        if (statusResponse.status === 'failed') {
          logger.warn(`任务 ${taskId} 失败`)
          return statusResponse
        }
        
        logger.info(`任务 ${taskId} 仍在处理中... (${attempt}/${maxAttempts})`)
      } catch (error) {
        logger.warn(`轮询尝试 ${attempt} 失败:`, error)
      }
    }
    
    // 轮询超时
    logger.warn(`任务 ${taskId} 轮询超时`)
    return {
      task_id: taskId,
      status: 'failed',
      error: '任务处理超时，请稍后重试',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  /**
   * 模拟任务状态查询（实际项目中应该调用真实的API）
   */
  private async simulateTaskStatus(taskId: string, attempt: number, maxAttempts: number): Promise<TaskStatusResponse> {
    // 模拟任务处理进度
    const progress = attempt / maxAttempts
    
    if (progress >= 0.8) {
      // 80%概率完成
      return {
        task_id: taskId,
        status: 'completed',
        result: {
          success: true,
          data: {
            translation: '模拟翻译结果',
            theme: '模拟主题分析',
            artistic_features: '模拟艺术特色',
            historical_context: '模拟历史背景',
            author_insights: '模拟作者见解',
            appreciation: '模拟赏析内容'
          },
          timestamp: new Date().toISOString()
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    } else if (progress >= 0.6) {
      // 处理中
      return {
        task_id: taskId,
        status: 'processing',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    } else {
      // 等待中
      return {
        task_id: taskId,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  }

  /**
   * 处理回调结果（实际应该由后端API处理）
   */
  async handleCallback(payload: CallbackPayload): Promise<void> {
    logger.info(`收到任务回调 - 任务ID: ${payload.task_id}, 状态: ${payload.status}`)
    
    if (payload.status === 'completed' && payload.result) {
      logger.info(`任务 ${payload.task_id} 完成，结果:`, payload.result)
      // 这里可以触发前端状态更新或通知
    } else if (payload.status === 'failed') {
      logger.error(`任务 ${payload.task_id} 失败:`, payload.error)
    }
  }

  /**
   * 检查n8n服务是否可用
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET'
      })
      return response.ok
    } catch (error) {
      return false
    }
  }
}

// 创建默认实例
export const n8nApiService = new N8NApiService()

export default n8nApiService