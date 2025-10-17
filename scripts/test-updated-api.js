// 测试更新后的n8n API服务
import { n8nApiService } from '../src/services/n8n-api.ts';

async function testUpdatedAPI() {
  console.log('🔍 测试更新后的n8n API服务...');
  
  const testPoetry = "床前明月光，疑是地上霜。举头望明月，低头思故乡。";
  
  try {
    console.log('📝 测试诗词:', testPoetry);
    console.log('🔄 调用更新后的n8n API服务...');
    
    const result = await n8nApiService.analyzePoetry({
      poetry: testPoetry,
      options: {
        include_translation: true,
        include_historical_context: true,
        include_author_insights: true
      }
    });
    
    console.log('✅ API服务调用完成!');
    console.log('📋 完整响应:', JSON.stringify(result, null, 2));
    
    if (result.success && result.data) {
      console.log('\n🎉 成功获取诗词分析结果!');
      console.log('📖 翻译:', result.data.translation);
      console.log('🎨 艺术特色:', result.data.artistic_features);
      console.log('📚 意境赏析:', result.data.appreciation);
      console.log('🏛️ 历史背景:', result.data.historical_context);
      console.log('👤 作者解读:', result.data.author_insights);
    } else {
      console.log('⚠️  未获取到预期的分析数据');
    }
    
    return true;
  } catch (error) {
    console.error('❌ API服务测试失败:', error);
    return false;
  }
}

// 运行测试
testUpdatedAPI()
  .then(success => {
    if (success) {
      console.log('\n🎉 更新后的API服务测试完成！');
    } else {
      console.log('\n⚠️  更新后的API服务测试失败。');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 测试过程中发生错误:', error);
    process.exit(1);
  });
