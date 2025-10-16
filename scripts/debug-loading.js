import { createClient } from '@supabase/supabase-js';

// Supabase配置
const supabaseUrl = 'https://suivywztcgbkradyymqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aXZ5d3p0Y2dia3JhZHl5bXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODE5NTYsImV4cCI6MjA3NTk1Nzk1Nn0.HqeDQrYqxNVAySPi0LidUiX8VH6tx9jU7_CaDG9ZLfM'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function debugLoading() {
  console.log('🔧 调试数据加载问题...\n')
  
  try {
    // 模拟前端数据加载过程
    console.log('1. 测试诗词表查询...')
    const { data: poetryData, error: poetryError } = await supabase
      .from('poetry')
      .select('*')
    
    if (poetryError) {
      console.log('❌ 诗词表查询错误:', poetryError)
    } else {
      console.log(`✅ 诗词表查询成功: ${poetryData.length} 条记录`)
      console.log('诗词ID示例:', poetryData.map(p => p.id).slice(0, 3))
    }

    console.log('\n2. 测试作者表查询...')
    const { data: authorsData, error: authorsError } = await supabase
      .from('authors')
      .select('*')
    
    if (authorsError) {
      console.log('❌ 作者表查询错误:', authorsError)
    } else {
      console.log(`✅ 作者表查询成功: ${authorsData.length} 条记录`)
      console.log('作者ID示例:', authorsData.map(a => a.id).slice(0, 3))
    }

    console.log('\n3. 检查数据结构匹配...')
    if (poetryData && poetryData.length > 0) {
      const samplePoem = poetryData[0]
      console.log('诗词数据结构:')
      console.log('  - id:', typeof samplePoem.id, samplePoem.id)
      console.log('  - title:', samplePoem.title)
      console.log('  - author:', samplePoem.author)
      console.log('  - dynasty:', samplePoem.dynasty)
      console.log('  - content:', samplePoem.content ? '有内容' : '无内容')
    }

    console.log('\n4. 检查前端可能的问题:')
    console.log('   - 诗词ID类型是否匹配 (数据库 vs 前端期望)')
    console.log('   - 诗词数据是否有content内容')
    console.log('   - 组件渲染条件是否正确')

    // 检查诗词内容是否为空
    if (poetryData) {
      const emptyContentPoems = poetryData.filter(poem => !poem.content || poem.content.trim() === '')
      console.log(`\n5. 内容检查: ${emptyContentPoems.length} 首诗词内容为空`)
      if (emptyContentPoems.length > 0) {
        console.log('⚠️ 发现内容为空的诗词:')
        emptyContentPoems.slice(0, 3).forEach(poem => {
          console.log(`   - ${poem.title} (ID: ${poem.id})`)
        })
      }
    }

  } catch (error) {
    console.error('❌ 调试失败:', error)
  }
}

debugLoading()