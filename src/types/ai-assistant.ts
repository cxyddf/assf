// AI聊天助手类型定义
export interface AIConfig {
  name: string
  version: string
  description: string
  features: AIFeatures
  prompts: AIPrompts
  ui_config: UIConfig
  api_config: APIConfig
  limitations: Limitations
}

export interface AIFeatures {
  poetry_analysis: PoetryAnalysisFeature
  chat: ChatFeature
}

export interface PoetryAnalysisFeature {
  enabled: boolean
  description: string
  capabilities: string[]
}

export interface ChatFeature {
  enabled: boolean
  description: string
  capabilities: string[]
}

export interface AIPrompts {
  poetry_analysis: PoetryAnalysisPrompt
}

export interface PoetryAnalysisPrompt {
  system_prompt: string
  user_template: string
  response_structure: ResponseStructure
}

export interface ResponseStructure {
  translation: string
  theme: string
  artistic_features: string
  historical_context: string
  author_insights: string
  appreciation: string
}

export interface UIConfig {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  theme: 'classical' | 'modern' | 'minimal'
  animations: Animations
  colors: Colors
}

export interface Animations {
  open: string
  close: string
}

export interface Colors {
  primary: string
  secondary: string
  accent: string
}

export interface APIConfig {
  endpoint: string
  timeout: number
  retry_attempts: number
}

export interface Limitations {
  max_poetry_length: number
  max_response_length: number
  rate_limit: RateLimit
}

export interface RateLimit {
  requests_per_minute: number
  requests_per_hour: number
}

// AI聊天消息类型
export interface AIMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  poetryAnalysis?: PoetryAnalysisResult
  rawResponse?: any
  showRetryOptions?: boolean
  taskId?: string // 异步任务ID
  taskStatus?: 'pending' | 'processing' | 'completed' | 'failed' // 任务状态
  progress?: number // 进度百分比
  estimatedCompletionTime?: string // 预计完成时间
}

export interface PoetryAnalysisResult {
  translation: string
  theme: string
  artistic_features: string
  historical_context: string
  author_insights: string
  appreciation: string
}

// AI助手状态
export interface AIAssistantState {
  isOpen: boolean
  isLoading: boolean
  messages: AIMessage[]
  currentPoetry?: string
}

// API请求/响应类型
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
  data?: PoetryAnalysisResult
  error?: string
  timestamp?: string
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

// 任务状态类型
export interface TaskState {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  estimatedCompletionTime?: string
  lastUpdated: Date
  result?: PoetryAnalysisResponse
  error?: string
}