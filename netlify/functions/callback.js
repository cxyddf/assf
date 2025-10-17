// Netlify Function for handling n8n callbacks
// 简单的日志函数，避免复杂的模块依赖
const logger = {
  info: (message, ...args) => console.log('ℹ️', message, ...args),
  error: (message, ...args) => console.error('❌', message, ...args),
  warn: (message, ...args) => console.warn('⚠️', message, ...args)
}

exports.handler = async (event, context) => {
  // 只处理POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  try {
    // 解析请求体
    const body = JSON.parse(event.body)
    
    console.log('📨 Received n8n callback:', {
      task_id: body.task_id,
      status: body.status,
      timestamp: body.timestamp
    })

    // 验证必需字段
    if (!body.task_id || !body.status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: task_id, status' })
      }
    }

    // 处理不同类型的回调
    switch (body.status) {
      case 'completed':
        await handleCompletedCallback(body)
        break
      case 'failed':
        await handleFailedCallback(body)
        break
      default:
        console.warn('Unknown callback status:', body.status)
    }

    // 返回成功响应
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Callback processed successfully',
        task_id: body.task_id
      })
    }

  } catch (error) {
    console.error('❌ Error processing callback:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message 
      })
    }
  }
}

/**
 * 处理任务完成回调
 */
async function handleCompletedCallback(body) {
  console.log('✅ Task completed:', {
    task_id: body.task_id,
    result: body.result ? 'Result received' : 'No result'
  })
  
  // 这里可以添加业务逻辑：
  // 1. 存储结果到数据库
  // 2. 发送通知给用户
  // 3. 更新前端状态
  
  // 示例：记录到控制台
  if (body.result) {
    console.log('Analysis result:', JSON.stringify(body.result, null, 2))
  }
}

/**
 * 处理任务失败回调
 */
async function handleFailedCallback(body) {
  console.error('❌ Task failed:', {
    task_id: body.task_id,
    error: body.error || 'Unknown error'
  })
  
  // 这里可以添加错误处理逻辑：
  // 1. 记录错误日志
  // 2. 发送错误通知
  // 3. 触发重试机制
}

// CORS预检请求处理
exports.handler = async (event, context) => {
  // 处理OPTIONS请求（CORS预检）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    }
  }

  // 处理POST请求
  if (event.httpMethod === 'POST') {
    return await exports.handler(event, context)
  }

  // 其他方法返回405
  return {
    statusCode: 405,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ error: 'Method Not Allowed' })
  }
}