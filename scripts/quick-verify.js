// 快速验证修改是否有效
import fetch from 'node-fetch';

async function quickVerify() {
  console.log('🔍 快速验证修改效果...\n');
  
  const n8nUrl = 'https://ykyyln.app.n8n.cloud/webhook/api/poetry-analysis';
  const testPoetry = '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。';
  
  try {
    console.log('📝 测试简短诗词:', testPoetry);
    console.log('🔄 发送快速请求...\n');
    
    // 设置超时时间
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时
    
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        poetry: testPoetry,
        options: {
          include_translation: true,
          include_historical_context: true,
          include_author_insights: true
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('📊 响应状态:', response.status);
    
    const result = await response.json();
    
    // 快速检查
    console.log('✅ 请求成功！');
    console.log('- success:', result.success);
    console.log('- 是否有data字段:', !!result.data);
    
    if (result.success && result.data) {
      console.log('🎯 修改有效：成功获取完整分析结果！');
      console.log('📖 分析内容包含:', Object.keys(result.data).join(', '));
    } else if (result.message && result.message.includes('started')) {
      console.log('⚠️ 仍然返回异步启动消息');
    } else {
      console.log('❓ 其他响应格式');
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('⏰ 请求超时，n8n工作流可能仍在处理中');
    } else {
      console.error('❌ 请求失败:', error.message);
    }
  }
}

// 运行验证
quickVerify().catch(console.error);