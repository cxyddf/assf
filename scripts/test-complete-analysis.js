// 测试完整的诗词分析功能
import fetch from 'node-fetch';

async function testPoetryAnalysis() {
  console.log('🧪 开始测试诗词分析功能...\\n');
  
  const testPoetry = '床前明月光，疑是地上霜。举头望明月，低头思故乡。';
  
  console.log('📝 测试诗词内容:');
  console.log(testPoetry);
  console.log('');
  
  try {
    // 模拟n8n API调用
    console.log('🚀 发送分析请求到n8n工作流...');
    
    const response = await fetch('http://localhost:5678/webhook/api/poetry-analysis', {
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
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ n8n工作流响应:');
      console.log(JSON.stringify(result, null, 2));
      
      // 检查是否返回了完整的分析内容
      if (result.success && result.data) {
        console.log('\\n🎉 成功获取完整的诗词分析内容:');
        console.log('📖 翻译:', result.data.translation || 'N/A');
        console.log('🎯 主题:', result.data.theme || 'N/A');
        console.log('🎨 艺术特色:', result.data.artistic_features || 'N/A');
        console.log('📜 历史背景:', result.data.historical_context || 'N/A');
        console.log('👤 作者见解:', result.data.author_insights || 'N/A');
        console.log('🌟 赏析:', result.data.appreciation || 'N/A');
      } else {
        console.log('❌ 未获取到完整的分析内容');
        console.log('错误信息:', result.error || '未知错误');
      }
    } else {
      console.log('❌ n8n工作流请求失败:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.log('❌ 测试过程中出现错误:');
    console.log(error.message);
    console.log('\\n💡 建议检查:');
    console.log('1. n8n服务是否正在运行 (默认端口: 5678)');
    console.log('2. 工作流是否已正确部署');
    console.log('3. Webhook路径是否正确配置');
  }
}

// 运行测试
testPoetryAnalysis();