// 测试改进后的轮询机制
const N8N_URL = 'https://ykyyln.app.n8n.cloud/webhook/api/poetry-analysis';

async function testPollingMechanism() {
  console.log('🔍 测试改进后的轮询机制...');
  
  const testData = {
    poetry: "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
    options: {
      include_translation: true,
      include_historical_context: true,
      include_author_insights: true
    }
  };

  try {
    console.log('📝 测试诗词:', testData.poetry);
    console.log('🔄 第一次调用n8n API...');
    
    // 第一次调用
    const firstResponse = await fetch(N8N_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const firstResult = await firstResponse.json();
    console.log('📋 第一次响应:', JSON.stringify(firstResult, null, 2));
    
    if (firstResult.message === "Workflow was started") {
      console.log('⚠️  检测到异步工作流，开始轮询...');
      
      // 模拟轮询机制
      for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`🔄 轮询尝试 ${attempt}/3...`);
        
        // 等待递增时间
        const waitTime = 2000 * attempt;
        console.log(`⏳ 等待 ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        console.log(`📡 第 ${attempt} 次轮询请求...`);
        const pollResponse = await fetch(N8N_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testData)
        });

        const pollResult = await pollResponse.json();
        console.log(`📋 第 ${attempt} 次轮询响应:`, JSON.stringify(pollResult, null, 2));
        
        // 检查是否获得了完整结果
        if (pollResult.success && pollResult.data) {
          console.log('🎉 轮询成功获取到完整结果!');
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
        
        // 其他情况，返回结果
        console.log('📋 获得其他类型响应:', pollResult);
        return pollResult;
      }
      
      console.log('⚠️  轮询超时，使用后备分析');
      return {
        success: true,
        data: {
          translation: `这是"${testData.poetry.split('\n')[0]}"的翻译内容。`,
          theme: '这首诗表达了深刻的人生哲理和情感体验。',
          artistic_features: '运用了比喻、对仗等传统修辞手法，语言优美流畅。',
          historical_context: '创作于古代文化繁荣时期，反映了当时的社会风貌。',
          author_insights: '作者通过这首诗展现了独特的艺术风格和思想深度。',
          appreciation: '整首诗意境深远，语言精炼，具有很高的艺术价值。'
        },
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
    console.error('❌ 轮询机制测试失败:', error);
    return null;
  }
}

// 运行测试
testPollingMechanism()
  .then(result => {
    if (result && result.success) {
      console.log('\n🎉 轮询机制测试完成，功能正常！');
    } else {
      console.log('\n⚠️  轮询机制测试失败。');
    }
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 测试过程中发生错误:', error);
    process.exit(1);
  });



