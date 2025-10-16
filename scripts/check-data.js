import { createClient } from '@supabase/supabase-js';

// Supabase配置
const supabaseUrl = 'https://suivywztcgbkradyymqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aXZ5d3p0Y2dia3JhZHl5bXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODE5NTYsImV4cCI6MjA3NTk1Nzk1Nn0.HqeDQrYqxNVAySPi0LidUiX8VH6tx9jU7_CaDG9ZLfM'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkData() {
  console.log('🔍 检查Supabase数据状态...\n')
  
  try {
    // 检查诗词表数据
    console.log('📚 检查诗词表数据...')
    const { data: poetryData, error: poetryError } = await supabase
      .from('poetry')
      .select('*')
      .limit(5)
    
    if (poetryError) {
      console.log('❌ 诗词表查询失败:', poetryError.message)
    } else {
      console.log(`✅ 诗词表数据: ${poetryData.length} 条记录`)
      if (poetryData.length > 0) {
        console.log('📖 前5条诗词:')
        poetryData.forEach((poem, index) => {
          console.log(`   ${index + 1}. ${poem.title} - ${poem.author}`)
        })
      } else {
        console.log('⚠️ 诗词表为空，需要导入数据')
      }
    }

    // 检查作者表数据
    console.log('\n👤 检查作者表数据...')
    const { data: authorsData, error: authorsError } = await supabase
      .from('authors')
      .select('*')
      .limit(5)
    
    if (authorsError) {
      console.log('❌ 作者表查询失败:', authorsError.message)
    } else {
      console.log(`✅ 作者表数据: ${authorsData.length} 条记录`)
      if (authorsData.length > 0) {
        console.log('👥 前5位作者:')
        authorsData.forEach((author, index) => {
          console.log(`   ${index + 1}. ${author.name} - ${author.dynasty}`)
        })
      } else {
        console.log('⚠️ 作者表为空，需要导入数据')
      }
    }

    // 检查收藏表数据
    console.log('\n⭐ 检查收藏表数据...')
    const { data: favoritesData, error: favoritesError } = await supabase
      .from('user_favorites')
      .select('*')
      .limit(5)
    
    if (favoritesError) {
      console.log('❌ 收藏表查询失败:', favoritesError.message)
    } else {
      console.log(`✅ 收藏表数据: ${favoritesData.length} 条记录`)
    }

    // 检查搜索历史表数据
    console.log('\n🔍 检查搜索历史表数据...')
    const { data: searchHistoryData, error: searchHistoryError } = await supabase
      .from('search_history')
      .select('*')
      .limit(5)
    
    if (searchHistoryError) {
      console.log('❌ 搜索历史表查询失败:', searchHistoryError.message)
    } else {
      console.log(`✅ 搜索历史表数据: ${searchHistoryData.length} 条记录`)
    }

    console.log('\n📋 数据状态总结:')
    console.log(`诗词表: ${poetryData?.length || 0} 条记录`)
    console.log(`作者表: ${authorsData?.length || 0} 条记录`)
    console.log(`收藏表: ${favoritesData?.length || 0} 条记录`)
    console.log(`搜索历史表: ${searchHistoryData?.length || 0} 条记录`)

    if ((poetryData?.length || 0) === 0) {
      console.log('\n🚨 问题发现: 诗词表为空！')
      console.log('💡 解决方案: 需要导入诗词数据到Supabase数据库')
    }

  } catch (error) {
    console.error('❌ 检查数据失败:', error)
  }
}

checkData()