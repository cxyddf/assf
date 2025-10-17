// 详细测试n8n工作流连接和响应
const N8N_URL = 'https://ykyyln.app.n8n.cloud/webhook/api/poetry-analysis';

async function detailedN8NTest() {
  console.log('🔍 详细测试n8n工作流连接...');
  console.log('📡 URL:', N8N_URL);
  
  const testData = {
    poetry: "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
    options: {
      include_translation: true,
      include_historical_context: true,
      include_author_insights: true
    }
  };

  try {
    console.log('📤 发送测试请求...');
    console.log('📝 测试诗词:', testData.poetry);
    console.log('⚙️ 请求选项:', testData.options);
    
    const startTime = Date.now();
    
    const response = await fetch(N8N_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log('📊 响应状态:', response.status);
    console.log('⏱️ 响应时间:', responseTime + 'ms');
    console.log('📊 响应头:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ 错误响应内容:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ n8n工作流响应成功!');
    console.log('📋 完整响应数据:', JSON.stringify(result, null, 2));
    
    // 检查响应格式是否符合预期
    if (result.success && result.data) {
      console.log('🎉 工作流返回了完整的分析数据!');
      console.log('📖 翻译:', result.data.translation);
      console.log('🎨 艺术特色:', result.data.artistic_features);
      console.log('📚 意境赏析:', result.data.appreciation);
    } else if (result.message === "Workflow was started") {
      console.log('⚠️  工作流已启动，但可能还在处理中...');
      console.log('💡 这可能是异步工作流，需要等待处理完成');
    } else {
      console.log('❓ 响应格式不符合预期:', result);
    }
    
    return true;
  } catch (error) {
    console.error('❌ n8n工作流连接失败:', error.message);
    console.error('🔍 错误详情:', error);
    return false;
  }
}

// 运行详细测试
detailedN8NTest()
  .then(success => {
    if (success) {
      console.log('\n🎉 n8n工作流详细测试完成！');
    } else {
      console.log('\n⚠️  n8n工作流详细测试失败。');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 测试过程中发生错误:', error);
    process.exit(1);
  });

