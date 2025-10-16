// 调试数据加载问题
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://suivywztcgbkradyymqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aXZ5d3p0Y2dia3JhZHl5bXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODE5NTYsImV4cCI6MjA3NTk1Nzk1Nn0.HqeDQrYqxNVAySPi0LidUiX8VH6tx9jU7_CaDG9ZLfM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDataLoading() {
  console.log('开始测试数据加载...')
  
  try {
    // 测试诗词数据
    console.log('测试诗词数据...')
    const { data: poems, error: poemsError } = await supabase
      .from('poetry')
      .select('*')
      .limit(5)
    
    if (poemsError) {
      console.error('诗词数据加载失败:', poemsError)
    } else {
      console.log('诗词数据加载成功:', poems?.length || 0, '条记录')
      console.log('前3条诗词:', poems?.slice(0, 3))
    }
    
    // 测试作者数据
    console.log('测试作者数据...')
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('*')
      .limit(5)
    
    if (authorsError) {
      console.error('作者数据加载失败:', authorsError)
    } else {
      console.log('作者数据加载成功:', authors?.length || 0, '条记录')
      console.log('前3位作者:', authors?.slice(0, 3))
    }
    
  } catch (error) {
    console.error('数据加载测试失败:', error)
  }
}

testDataLoading()
