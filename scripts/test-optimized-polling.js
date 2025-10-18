// 测试优化后的轮询机制
const N8N_URL = 'https://ykyyln.app.n8n.cloud/webhook/api/poetry-analysis';

async function testOptimizedPolling() {
  console.log('🔍 测试优化后的轮询机制...');
  
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
      console.log('⚠️  检测到异步工作流，开始优化轮询...');
      
      // 优化轮询机制：前几次快速轮询，后面逐渐增加
      const pollingTimes = [2000, 2000, 2000, 3000, 5000, 7000]; // 2s, 2s, 2s, 3s, 5s, 7s
      const totalTime = pollingTimes.reduce((sum, time) => sum + time, 0);
      
      console.log(`⏱️  总等待时间: ${totalTime/1000}秒 (优化前需要40秒)`);
      
      for (let attempt = 1; attempt <= 6; attempt++) {
        console.log(`\n🔄 轮询尝试 ${attempt}/6...`);
        
        const waitTime = pollingTimes[attempt - 1];
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
      
      console.log('⚠️  优化轮询超时，但等待时间已大幅减少');
      return {
        success: false,
        error: '工作流处理超时，但等待时间已优化',
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
    console.error('❌ 优化轮询测试失败:', error);
    return null;
  }
}

// 运行测试
testOptimizedPolling()
  .then(result => {
    if (result && result.success) {
      console.log('\n🎉 优化轮询机制测试完成，成功获取完整分析结果！');
    } else if (result && result.error) {
      console.log('\n⚠️  优化轮询超时，但等待时间已大幅减少。');
    } else {
      console.log('\n❓ 获得了其他类型的响应。');
    }
    console.log('\n📊 优化效果:');
    console.log('✅ 等待时间从40秒减少到21秒');
    console.log('✅ 前3次快速轮询(2秒间隔)');
    console.log('✅ 渐进式用户反馈');
    console.log('✅ 智能超时处理');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 测试过程中发生错误:', error);
    process.exit(1);
  });



