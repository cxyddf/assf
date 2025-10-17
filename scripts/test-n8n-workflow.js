// 测试n8n工作流连接
const N8N_URL = 'https://ykyyln.app.n8n.cloud/webhook/api/poetry-analysis';

async function testN8NWorkflow() {
  console.log('🔍 测试n8n工作流连接...');
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
    
    const response = await fetch(N8N_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 响应状态:', response.status);
    console.log('📊 响应头:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ 错误响应内容:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ n8n工作流连接成功!');
    console.log('📋 响应数据:', JSON.stringify(result, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ n8n工作流连接失败:', error.message);
    console.error('🔍 错误详情:', error);
    return false;
  }
}

// 运行测试
testN8NWorkflow()
  .then(success => {
    if (success) {
      console.log('\n🎉 n8n工作流连接测试完成，一切正常！');
    } else {
      console.log('\n⚠️  n8n工作流连接测试失败，请检查配置。');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 测试过程中发生错误:', error);
    process.exit(1);
  });

