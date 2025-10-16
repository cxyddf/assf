import { createClient } from '@supabase/supabase-js';

// Supabase配置
const supabaseUrl = 'https://suivywztcgbkradyymqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aXZ5d3p0Y2dia3JhZHl5bXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODE5NTYsImV4cCI6MjA3NTk1Nzk1Nn0.HqeDQrYqxNVAySPi0LidUiX8VH6tx9jU7_CaDG9ZLfM'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function createTables() {
  console.log('🚀 开始创建收藏表和搜索历史表...\n')
  
  try {
    // 创建用户收藏表
    console.log('📚 创建用户收藏表...')
    const createFavoritesTable = `
      CREATE TABLE IF NOT EXISTS user_favorites (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        poem_id VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, poem_id)
      )
    `
    
    const { error: favError } = await supabase.rpc('exec_sql', { sql: createFavoritesTable })
    if (favError) {
      console.log('❌ 创建收藏表失败:', favError.message)
    } else {
      console.log('✅ 收藏表创建成功')
    }

    // 创建搜索历史表
    console.log('\n🔍 创建搜索历史表...')
    const createSearchTable = `
      CREATE TABLE IF NOT EXISTS search_history (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        keyword VARCHAR(255) NOT NULL,
        search_count INTEGER DEFAULT 1,
        last_searched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, keyword)
      )
    `
    
    const { error: searchError } = await supabase.rpc('exec_sql', { sql: createSearchTable })
    if (searchError) {
      console.log('❌ 创建搜索历史表失败:', searchError.message)
    } else {
      console.log('✅ 搜索历史表创建成功')
    }

    console.log('\n🎉 表创建完成！')
    console.log('\n📋 请在Supabase控制台执行以下操作：')
    console.log('1. 登录 https://suivywztcgbkradyymqh.supabase.co')
    console.log('2. 进入 SQL Editor')
    console.log('3. 复制并执行 scripts/create-tables.sql 中的完整SQL语句')
    console.log('4. 验证表结构和索引是否正确创建')

  } catch (error) {
    console.error('❌ 创建表失败:', error)
  }
}

createTables()