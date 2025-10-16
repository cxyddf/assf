import { supabaseService } from '../src/services/supabase'

// 数据库设置脚本
async function setupDatabase() {
  console.log('开始设置数据库表结构...')

  try {
    // 检查表是否存在
    console.log('检查现有表结构...')
    
    const tables = ['poetry', 'authors', 'user_favorites', 'search_history']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabaseService.fetchData(table, 'count')
        if (error) {
          console.log(`❌ ${table} 表不存在`)
        } else {
          console.log(`✅ ${table} 表已存在`)
        }
      } catch (err) {
        console.log(`❌ ${table} 表不存在，需要创建`)
      }
    }

    console.log('\n📋 数据库设置说明:')
    console.log('1. 登录 Supabase 控制台 (https://supabase.com/dashboard)')
    console.log('2. 选择您的项目: suivywztcgbkradyymqh')
    console.log('3. 进入 SQL Editor')
    console.log('4. 复制并执行 scripts/create-tables.sql 中的SQL语句')
    console.log('5. 表创建完成后，运行 npm run import-data 导入数据')
    
  } catch (error) {
    console.error('数据库设置检查失败:', error)
  }
}

// 运行设置
setupDatabase()