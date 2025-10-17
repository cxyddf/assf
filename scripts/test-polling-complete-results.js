// 测试轮询获取完整分析结果
const N8N_URL = 'https://ykyyln.app.n8n.cloud/webhook/api/poetry-analysis';

async function testPollingCompleteResults() {
  console.log('🔍 测试轮询获取完整分析结果...');
  
  const testPoetry = "天气晚来秋";
  
  try {
    console.log('📝 测试诗词:', testPoetry);
    console.log('🔄 第一次调用n8n工作流...');
    
    // 第一次调用
    const firstResponse = await fetch(N8N_URL, {
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

    const firstResult = await firstResponse.json();
    console.log('📋 第一次响应:', JSON.stringify(firstResult, null, 2));
    
    if (firstResult.message === "Workflow was started") {
      console.log('⚠️  检测到异步工作流，开始轮询获取完整结果...');
      
      // 模拟轮询机制
      for (let attempt = 1; attempt <= 5; attempt++) {
        console.log(`\n🔄 轮询尝试 ${attempt}/5...`);
        
        // 等待递增时间
        const waitTime = 3000 * attempt;
        console.log(`⏳ 等待 ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        console.log(`📡 第 ${attempt} 次轮询请求...`);
        const pollResponse = await fetch(N8N_URL, {
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

        const pollResult = await pollResponse.json();
        console.log(`📋 第 ${attempt} 次轮询响应:`, JSON.stringify(pollResult, null, 2));
        
        // 检查是否获得了完整的分析结果
        if (pollResult.success && pollResult.data) {
          console.log('🎉 轮询成功获取到完整分析结果!');
          console.log('📖 翻译:', pollResult.data.translation);
          console.log('🎨 艺术特色:', pollResult.data.artistic_features);
          console.log('📚 意境赏析:', pollResult.data.appreciation);
          return pollResult;
        }
        
        // 如果仍然是启动消息，继续轮询
        if (pollResult.message === "Workflow was started") {
          console.log('⏳ 工作流仍在处理中，继续等待...');
          continue;
        }
        
        // 如果返回了其他格式的结果，也认为成功
        if (pollResult && typeof pollResult === 'object' && !pollResult.message) {
          console.log('✅ 轮询获取到其他格式的完整结果');
          return pollResult;
        }
        
        // 其他情况，返回结果
        console.log('📋 获得其他类型响应:', pollResult);
        return pollResult;
      }
      
      console.log('⚠️  轮询超时，工作流可能仍在处理中');
      return {
        success: false,
        error: '工作流处理超时，请稍后重试',
        timestamp: new Date().toISOString()
      };
    } else if (firstResult.success && firstResult.data) {
      console.log('🎉 第一次调用就获得了完整结果!');
      return firstResult;
    } else {
      console.log('❓ 未知的响应格式:', firstResult);
      return firstResult;
    }
    
  } catch (error) {
    console.error('❌ 轮询测试失败:', error);
    return null;
  }
}

// 运行测试
testPollingCompleteResults()
  .then(result => {
    if (result && result.success) {
      console.log('\n🎉 轮询机制测试完成，成功获取完整分析结果！');
    } else if (result && result.error) {
      console.log('\n⚠️  轮询超时，工作流可能仍在处理中。');
    } else {
      console.log('\n❓ 获得了其他类型的响应。');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 测试过程中发生错误:', error);
    process.exit(1);
  });


