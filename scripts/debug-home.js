import { createClient } from '@supabase/supabase-js';

// Supabase配置
const supabaseUrl = 'https://suivywztcgbkradyymqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aXZ5d3p0Y2dia3JhZHl5bXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODE5NTYsImV4cCI6MjA3NTk1Nzk1Nn0.HqeDQrYqxNVAySPi0LidUiX8VH6tx9jU7_CaDG9ZLfM'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function debugHome() {
  console.log('🔧 调试首页显示问题...\n')
  
  try {
    // 1. 检查诗词数据
    console.log('1. 检查诗词数据...')
    const { data: poetryData, error: poetryError } = await supabase
      .from('poetry')
      .select('*')
      .order('popularity', { ascending: false })
      .limit(10)
    
    if (poetryError) {
      console.log('❌ 诗词数据查询失败:', poetryError)
    } else {
      console.log(`✅ 诗词数据: ${poetryData.length} 条记录`)
      console.log('热门诗词前5首:')
      poetryData.slice(0, 5).forEach((poem, index) => {
        console.log(`   ${index + 1}. ${poem.title} - ${poem.author} (热度: ${poem.popularity || 0})`)
      })
    }

    // 2. 检查今日推荐逻辑
    console.log('\n2. 检查今日推荐逻辑...')
    const today = new Date().getDate()
    console.log(`   今天是本月第 ${today} 天`)
    
    if (poetryData && poetryData.length > 0) {
      const dailyIndex = today % poetryData.length
      const dailyPoem = poetryData[dailyIndex]
      console.log(`   今日推荐索引: ${dailyIndex}`)
      console.log(`   今日推荐诗词: ${dailyPoem.title} - ${dailyPoem.author}`)
    }

    // 3. 检查数据结构
    console.log('\n3. 检查数据结构...')
    if (poetryData && poetryData.length > 0) {
      const samplePoem = poetryData[0]
      console.log('   诗词数据结构:')
      console.log('     - id:', samplePoem.id)
      console.log('     - title:', samplePoem.title)
      console.log('     - author:', samplePoem.author)
      console.log('     - dynasty:', samplePoem.dynasty)
      console.log('     - content:', samplePoem.content ? '有内容' : '无内容')
      console.log('     - popularity:', samplePoem.popularity || 0)
    }

    // 4. 检查可能的显示问题
    console.log('\n4. 可能的显示问题:')
    console.log('   - 诗词数据是否有popularity字段')
    console.log('   - 组件是否在数据加载完成后才渲染')
    console.log('   - 诗词内容是否为空导致显示问题')
    console.log('   - 组件条件渲染逻辑是否正确')

    // 5. 检查诗词内容是否为空
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

debugHome()