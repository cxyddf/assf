// 简单API测试 - ES模块版本
import fetch from 'node-fetch';

async function testN8nAPI() {
  console.log('🧪 测试n8n API直接调用...\n');
  
  const n8nUrl = 'https://ykyyln.app.n8n.cloud/webhook/api/poetry-analysis';
  const testPoetry = '床前明月光，疑是地上霜。举头望明月，低头思故乡。';
  
  try {
    console.log('📝 测试诗词内容:', testPoetry);
    console.log('🌐 n8n URL:', n8nUrl);
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
    console.log('📋 响应内容:');
    console.log(JSON.stringify(result, null, 2));
    
    // 分析响应类型
    if (result.message === "Workflow was started") {
      console.log('\n⚠️ 检测到异步工作流启动响应');
      console.log('   需要轮询获取完整结果...');
      
      // 模拟轮询逻辑
      await simulatePolling(n8nUrl, testPoetry);
    } else if (result.success && result.data) {
      console.log('\n✅ 直接获取到完整分析结果！');
      console.log('📖 分析内容预览:');
      Object.keys(result.data).forEach(key => {
        const value = result.data[key];
        console.log(`   • ${key}: ${value.substring(0, 50)}...`);
      });
    } else if (result && typeof result === 'object') {
      console.log('\n📄 获取到其他格式的响应');
      console.log('   响应类型:', Object.keys(result).join(', '));
    } else {
      console.log('\n❓ 未知响应格式');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

async function simulatePolling(n8nUrl, poetry) {
  console.log('\n🔄 开始模拟轮询获取完整结果...');
  
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      console.log(`   轮询尝试 ${attempt}/5...`);
      
      // 等待一段时间
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const response = await fetch(n8nUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poetry: poetry,
          options: {
            include_translation: true,
            include_historical_context: true,
            include_author_insights: true
          }
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log('✅ 轮询成功获取完整结果！');
        console.log('📖 分析内容预览:');
        Object.keys(result.data).forEach(key => {
          const value = result.data[key];
          console.log(`   • ${key}: ${value.substring(0, 50)}...`);
        });
        return;
      }
      
      if (result.message === "Workflow was started") {
        console.log('   ⏳ 工作流仍在处理中...');
        continue;
      }
      
      // 其他响应格式
      console.log('   📄 获取到其他响应:', Object.keys(result).join(', '));
      
    } catch (error) {
      console.error('   轮询失败:', error);
    }
  }
  
  console.log('⏰ 轮询超时，工作流可能仍在处理中');
}

// 运行测试
testN8nAPI().catch(console.error);