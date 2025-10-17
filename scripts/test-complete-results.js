// 测试完整结果返回功能 - CommonJS版本
const { n8nApiService } = require('../dist/services/n8n-api.js')

async function testCompleteResults() {
  console.log('🧪 开始测试完整结果返回功能...\n')
  
  const testPoetry = '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
  
  try {
    console.log('📝 测试诗词内容:', testPoetry)
    console.log('🔄 调用n8n API进行诗词分析...\n')
    
    const startTime = Date.now()
    const result = await n8nApiService.analyzePoetry({
      poetry: testPoetry,
      options: {
        include_translation: true,
        include_historical_context: true,
        include_author_insights: true
      }
    })
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    console.log('✅ 分析完成，耗时:', duration + 'ms')
    console.log('📊 返回结果结构:')
    console.log(JSON.stringify(result, null, 2))
    
    // 检查结果是否完整
    if (result.success) {
      console.log('\n🎯 测试通过：成功获取完整分析结果！')
      if (result.data) {
        console.log('📋 分析结果包含以下内容:')
        Object.keys(result.data).forEach(key => {
          console.log(`   • ${key}: ${result.data[key] ? '✅' : '❌'}`)
        })
      }
    } else {
      console.log('\n⚠️ 测试警告：分析失败，错误信息:', result.error)
    }
    
    // 检查是否是异步启动消息
    if (result.message && result.message.includes('started')) {
      console.log('\n❌ 测试失败：仍然返回异步启动消息，而不是完整结果')
      console.log('   需要进一步优化轮询逻辑')
    } else {
      console.log('\n✅ 测试通过：没有返回异步启动消息')
    }
    
  } catch (error) {
    console.error('❌ 测试失败：发生错误', error)
  }
}

// 运行测试
testCompleteResults().catch(console.error)