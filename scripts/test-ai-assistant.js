// 测试AI助手功能
import { n8nApiService } from '../src/services/n8n-api.js';

async function testAIAssistant() {
  console.log('🤖 测试AI助手功能...');
  
  const testPoetry = "床前明月光，疑是地上霜。举头望明月，低头思故乡。";
  
  try {
    console.log('📝 测试诗词:', testPoetry);
    console.log('🔄 调用n8n API进行诗词分析...');
    
    const result = await n8nApiService.analyzePoetry({
      poetry: testPoetry,
      options: {
        include_translation: true,
        include_historical_context: true,
        include_author_insights: true
      }
    });
    
    console.log('✅ AI助手分析完成!');
    console.log('📋 分析结果:', JSON.stringify(result, null, 2));
    
    if (result.success && result.data) {
      console.log('\n📖 翻译:', result.data.translation);
      console.log('🎨 艺术特色:', result.data.artistic_features);
      console.log('📚 意境赏析:', result.data.appreciation);
    }
    
    return true;
  } catch (error) {
    console.error('❌ AI助手测试失败:', error);
    return false;
  }
}

// 运行测试
testAIAssistant()
  .then(success => {
    if (success) {
      console.log('\n🎉 AI助手功能测试完成！');
    } else {
      console.log('\n⚠️  AI助手功能测试失败。');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 测试过程中发生错误:', error);
    process.exit(1);
  });


