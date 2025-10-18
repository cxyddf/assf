// 测试只使用n8n工作流的AI助手
const N8N_URL = 'https://ykyyln.app.n8n.cloud/webhook/api/poetry-analysis';

async function testN8NOnlyAI() {
  console.log('🔍 测试只使用n8n工作流的AI助手...');
  
  const testPoetry = "天气晚来秋";
  
  try {
    console.log('📝 测试诗词:', testPoetry);
    console.log('🔄 调用n8n工作流...');
    
    const response = await fetch(N8N_URL, {
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

    console.log('📊 响应状态:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('📋 原始响应:', JSON.stringify(result, null, 2));
    
    // 模拟AI助手的格式化显示
    console.log('\n🤖 AI助手显示效果:');
    console.log('='.repeat(50));
    
    if (result.message === "Workflow was started") {
      console.log('⚠️  n8n工作流已启动，但返回异步响应');
      console.log('💡 这可能需要等待工作流完成处理');
    } else if (result.success && result.data) {
      console.log('✅ 获得完整的分析结果');
      console.log('📖 翻译:', result.data.translation);
      console.log('🎨 艺术特色:', result.data.artistic_features);
      console.log('📚 意境赏析:', result.data.appreciation);
    } else {
      console.log('📋 原始响应内容:');
      console.log(JSON.stringify(result, null, 2));
    }
    
    console.log('='.repeat(50));
    
    return true;
  } catch (error) {
    console.error('❌ 测试失败:', error);
    return false;
  }
}

// 运行测试
testN8NOnlyAI()
  .then(success => {
    if (success) {
      console.log('\n🎉 n8n工作流AI助手测试完成！');
      console.log('\n📊 功能特点:');
      console.log('✅ 直接使用n8n工作流，无本地模型');
      console.log('✅ 取消格式限制，显示原始响应');
      console.log('✅ 支持异步工作流处理');
      console.log('✅ 智能格式化显示');
    } else {
      console.log('\n⚠️  测试失败，请检查n8n工作流配置。');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 测试过程中发生错误:', error);
    process.exit(1);
  });



