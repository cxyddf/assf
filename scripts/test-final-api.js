// 最终测试修复后的API响应
import fetch from 'node-fetch';

async function testFinalAPI() {
  console.log('🧪 最终测试n8n API响应...\n');
  
  const n8nUrl = 'https://ykyyln.app.n8n.cloud/webhook/api/poetry-analysis';
  const testPoetry = '床前明月光，疑是地上霜。举头望明月，低头思故乡。';
  
  try {
    console.log('📝 测试诗词内容:', testPoetry);
    console.log('🔄 发送请求...\n');
    
    const startTime = Date.now();
    
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
      })
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('⏱️ 请求耗时:', duration + 'ms');
    console.log('📊 响应状态:', response.status);
    
    const result = await response.json();
    
    // 检查响应结构
    console.log('📋 响应结构分析:');
    console.log('- success:', result.success);
    console.log('- timestamp:', result.timestamp);
    
    if (result.success) {
      console.log('✅ 成功获取完整分析结果！');
      
      if (result.data) {
        console.log('📖 分析结果内容预览:');
        Object.keys(result.data).forEach(key => {
          const value = result.data[key];
          if (typeof value === 'string') {
            console.log(`   • ${key}: ${value.substring(0, 100)}...`);
          } else {
            console.log(`   • ${key}:`, value);
          }
        });
      }
    } else {
      console.log('❌ 分析失败，错误信息:', result.data?.error || '未知错误');
      
      if (result.data?.raw_response) {
        console.log('🔍 原始响应内容:');
        console.log(JSON.stringify(result.data.raw_response, null, 2).substring(0, 500) + '...');
      }
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testFinalAPI().catch(console.error);